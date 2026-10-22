export type Status = 'Confirmed' | 'In progress' | 'Needs decision' | 'Planned' | 'Unassigned'

export const STATUSES: Status[] = ['Confirmed', 'In progress', 'Needs decision', 'Planned', 'Unassigned']

/** A workstream for this event: owns a budget allocation, people, and actions. */
export type Committee = {
  id: string
  name: string
  short: string
  focus: string
  allocation: number
}

export type Member = {
  id: string
  name: string
  role: string
  committeeId: string
}

export type IncomeLine = { id: string; source: string; note: string; amount: number }
export type ExpenseLine = { id: string; committeeId: string; item: string; amount: number }
export type Milestone = { id: string; date: string; title: string; detail: string; status: Status }
export type Task = { id: string; task: string; committeeId: string; ownerId: string; due: string; status: Status }
export type LogisticsItem = { id: string; title: string; detail: string; meta: string; status: Status }
export type PublicityItem = { id: string; title: string; detail: string; date: string; status: Status }
export type Performer = { id: string; name: string; time: string; type: string; fee: string; status: Status }
export type Booth = { id: string; title: string; detail: string; ownerId: string; meta: string; status: Status }

/** A single slot in the event-day running order — the minute-by-minute schedule. */
export type ScheduleItem = { id: string; time: string; title: string; detail: string; highlight: boolean }

export type EventMeta = {
  name: string
  short: string
  initials: string
  date: string
  start: string
  end: string
  tagline: string
  scheduleLead: string
  scheduleStatus: string
}

export type Plan = {
  event: EventMeta
  committees: Committee[]
  members: Member[]
  income: IncomeLine[]
  expenses: ExpenseLine[]
  timeline: Milestone[]
  tasks: Task[]
  logistics: LogisticsItem[]
  publicity: PublicityItem[]
  programme: Performer[]
  schedule: ScheduleItem[]
  booths: Booth[]
}

/** Every key of the plan that holds an editable list of rows. */
export type ListKey = Exclude<keyof Plan, 'event'>

export type Row = { id: string }

export const UNASSIGNED = ''
