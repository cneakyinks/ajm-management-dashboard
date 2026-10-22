import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { seedPlan } from './seed'
import type { Committee, EventMeta, ListKey, Plan, Row } from './types'

// Bump this whenever the Plan shape changes incompatibly (new required
// fields, renamed lists) so stale saved plans don't load with holes in them.
const STORAGE_KEY = 'ajm-fest-plan-v2'

export function uid(prefix = 'row'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

function loadPlan(): Plan {
  const seed = seedPlan()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed
    const saved = JSON.parse(raw) as Partial<Plan>
    // Merge so a plan saved by an older version still opens with every list present.
    return { ...seed, ...saved, event: { ...seed.event, ...(saved.event ?? {}) } }
  } catch {
    return seed
  }
}

type PlanContextValue = {
  plan: Plan
  editing: boolean
  setEditing: (editing: boolean) => void
  /** Mutate a cloned draft of the whole plan. */
  update: (mutate: (draft: Plan) => void) => void
  setEvent: <K extends keyof EventMeta>(key: K, value: EventMeta[K]) => void
  updateRow: <K extends ListKey>(list: K, id: string, patch: Partial<Plan[K][number]>) => void
  addRow: <K extends ListKey>(list: K, row: Plan[K][number]) => void
  removeRow: (list: ListKey, id: string) => void
  moveRow: (list: ListKey, id: string, direction: -1 | 1) => void
  /** Drop a row at an absolute index — used for drag-to-reorder. */
  moveRowTo: (list: ListKey, id: string, toIndex: number) => void
  addCommittee: () => void
  removeCommittee: (id: string) => void
  reset: () => void
  committeeName: (id: string) => string
  memberName: (id: string) => string
}

const PlanContext = createContext<PlanContextValue | null>(null)

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Plan>(loadPlan)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
    } catch {
      // Storage can be unavailable (private window, blocked site data); edits
      // still work for this session.
    }
  }, [plan])

  const update = useCallback((mutate: (draft: Plan) => void) => {
    setPlan((previous) => {
      const draft = structuredClone(previous)
      mutate(draft)
      return draft
    })
  }, [])

  const value = useMemo<PlanContextValue>(() => {
    const listOf = (draft: Plan, list: ListKey) => draft[list] as Row[]

    return {
      plan,
      editing,
      setEditing,
      update,
      setEvent: (key, value) => update((draft) => { draft.event[key] = value }),
      updateRow: (list, id, patch) => update((draft) => {
        const row = listOf(draft, list).find((item) => item.id === id)
        if (row) Object.assign(row, patch)
      }),
      addRow: (list, row) => update((draft) => { listOf(draft, list).push(row as Row) }),
      removeRow: (list, id) => update((draft) => {
        const rows = listOf(draft, list)
        const index = rows.findIndex((item) => item.id === id)
        if (index >= 0) rows.splice(index, 1)
      }),
      moveRow: (list, id, direction) => update((draft) => {
        const rows = listOf(draft, list)
        const index = rows.findIndex((item) => item.id === id)
        const target = index + direction
        if (index < 0 || target < 0 || target >= rows.length) return
        const [row] = rows.splice(index, 1)
        rows.splice(target, 0, row)
      }),
      moveRowTo: (list, id, toIndex) => update((draft) => {
        const rows = listOf(draft, list)
        const fromIndex = rows.findIndex((item) => item.id === id)
        if (fromIndex < 0) return
        const clamped = Math.max(0, Math.min(toIndex, rows.length - 1))
        if (clamped === fromIndex) return
        const [row] = rows.splice(fromIndex, 1)
        rows.splice(clamped, 0, row)
      }),
      addCommittee: () => update((draft) => {
        const committee: Committee = { id: uid('cm'), name: 'New workstream', short: 'NEW', focus: 'What this team owns.', allocation: 0 }
        draft.committees.push(committee)
      }),
      removeCommittee: (id) => update((draft) => {
        draft.committees = draft.committees.filter((committee) => committee.id !== id)
        // Keep dependent rows: they fall back to unassigned rather than vanish.
        for (const member of draft.members) if (member.committeeId === id) member.committeeId = ''
        for (const expense of draft.expenses) if (expense.committeeId === id) expense.committeeId = ''
        for (const task of draft.tasks) if (task.committeeId === id) task.committeeId = ''
      }),
      reset: () => setPlan(seedPlan()),
      committeeName: (id) => plan.committees.find((committee) => committee.id === id)?.name ?? 'Unassigned',
      memberName: (id) => plan.members.find((member) => member.id === id)?.name ?? 'Unassigned',
    }
  }, [plan, editing, update])

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}

export function usePlan(): PlanContextValue {
  const context = useContext(PlanContext)
  if (!context) throw new Error('usePlan must be used inside <PlanProvider>')
  return context
}

/** Totals derived from the current plan — never stored, always recomputed. */
export function useTotals() {
  const { plan } = usePlan()
  return useMemo(() => {
    const incomeTotal = plan.income.reduce((sum, line) => sum + line.amount, 0)
    const expenseTotal = plan.expenses.reduce((sum, line) => sum + line.amount, 0)
    const allocationTotal = plan.committees.reduce((sum, committee) => sum + committee.allocation, 0)
    const spendByCommittee: Record<string, number> = {}
    for (const line of plan.expenses) {
      spendByCommittee[line.committeeId] = (spendByCommittee[line.committeeId] ?? 0) + line.amount
    }
    const unassignedSpend = spendByCommittee[''] ?? 0
    return {
      incomeTotal,
      expenseTotal,
      allocationTotal,
      balance: incomeTotal - expenseTotal,
      spendByCommittee,
      unassignedSpend,
    }
  }, [plan])
}

const PROGRESS_WEIGHT: Record<string, number> = {
  Confirmed: 1,
  'In progress': 0.5,
  'Needs decision': 0.25,
  Planned: 0.15,
  Unassigned: 0,
}

/** Progress per workstream, derived from the status of its actions. */
export function useCommitteeProgress() {
  const { plan } = usePlan()
  return useMemo(() => {
    return plan.committees.map((committee) => {
      const tasks = plan.tasks.filter((task) => task.committeeId === committee.id)
      const done = tasks.reduce((sum, task) => sum + (PROGRESS_WEIGHT[task.status] ?? 0), 0)
      const percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100)
      return { committee, percent, taskCount: tasks.length }
    })
  }, [plan])
}

export function money(amount: number): string {
  return `$${Math.round(amount).toLocaleString()}`
}

export function signedMoney(amount: number): string {
  return `${amount < 0 ? '-' : '+'}$${Math.abs(Math.round(amount)).toLocaleString()}`
}

/** "Sat 21 Nov" from an ISO date, falling back to the raw string. */
export function formatShortEventDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

/** "21 November 2026" from an ISO date, falling back to the raw string. */
export function formatEventDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function daysUntil(iso: string): number | null {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((date.getTime() - today.getTime()) / 86_400_000)
}
