import { useEffect, useState, type ReactNode } from 'react'
import { money, usePlan } from './store'
import { STATUSES, type ListKey, type Status } from './types'
import { Icon } from './ui'

/** Renders children only while the plan is in edit mode. */
export function EditOnly({ children }: { children: ReactNode }) {
  const { editing } = usePlan()
  return editing ? <>{children}</> : null
}

type TextProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  ariaLabel?: string
}

export function Text({ value, onChange, placeholder = '—', className = '', ariaLabel }: TextProps) {
  const { editing } = usePlan()
  if (!editing) return <>{value || <span className="empty-value">{placeholder}</span>}</>
  return (
    <input
      className={`field ${className}`}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export function Para({ value, onChange, placeholder = 'Add detail…', ariaLabel }: TextProps) {
  const { editing } = usePlan()
  if (!editing) return <>{value || <span className="empty-value">{placeholder}</span>}</>
  return (
    <textarea
      className="field field-area"
      rows={2}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

/**
 * Money input. Keeps the half-typed string locally so totals update on every
 * keystroke without the caret jumping while a value is being cleared.
 */
export function Money({ value, onChange, ariaLabel, className = '' }: { value: number; onChange: (value: number) => void; ariaLabel?: string; className?: string }) {
  const { editing } = usePlan()
  const [draft, setDraft] = useState<string | null>(null)

  if (!editing) return <>{money(value)}</>

  return (
    <span className={`money-field ${className}`}>
      <span className="money-prefix">$</span>
      <input
        className="field field-number"
        inputMode="decimal"
        value={draft ?? String(value)}
        aria-label={ariaLabel}
        onChange={(event) => {
          const next = event.target.value
          setDraft(next)
          const parsed = Number(next)
          if (next.trim() !== '' && !Number.isNaN(parsed)) onChange(parsed)
          if (next.trim() === '') onChange(0)
        }}
        onBlur={() => setDraft(null)}
      />
    </span>
  )
}

export function Choice<T extends string>({
  value,
  onChange,
  options,
  display,
  ariaLabel,
  className = '',
}: {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
  display?: ReactNode
  ariaLabel?: string
  className?: string
}) {
  const { editing } = usePlan()
  const current = options.find((option) => option.value === value)
  if (!editing) return <>{display ?? current?.label ?? <span className="empty-value">Unassigned</span>}</>
  return (
    <select className={`field field-select ${className}`} value={value} aria-label={ariaLabel} onChange={(event) => onChange(event.target.value as T)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  )
}

export function StatusField({ value, onChange }: { value: Status; onChange: (value: Status) => void }) {
  const { editing } = usePlan()
  if (!editing) return <span className={`status status-${value.toLowerCase().replaceAll(' ', '-')}`}>{value}</span>
  return (
    <select className={`field field-select status-select status status-${value.toLowerCase().replaceAll(' ', '-')}`} value={value} aria-label="Status" onChange={(event) => onChange(event.target.value as Status)}>
      {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
    </select>
  )
}

/** Workstream picker — the single list that budget, people, and actions share. */
export function CommitteeField({ value, onChange, display }: { value: string; onChange: (value: string) => void; display?: ReactNode }) {
  const { plan, committeeName } = usePlan()
  const options = [{ value: '', label: 'Unassigned' }, ...plan.committees.map((committee) => ({ value: committee.id, label: committee.name }))]
  return (
    <Choice
      value={value}
      onChange={onChange}
      options={options}
      ariaLabel="Workstream"
      display={display ?? (value ? <span className="category-tag">{committeeName(value)}</span> : <span className="category-tag category-tag-open">Unassigned</span>)}
    />
  )
}

export function OwnerField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { plan, memberName } = usePlan()
  const options = [{ value: '', label: 'Unassigned' }, ...plan.members.map((member) => ({ value: member.id, label: member.name }))]
  const assigned = Boolean(value && plan.members.some((member) => member.id === value))
  return (
    <Choice
      value={assigned ? value : ''}
      onChange={onChange}
      options={options}
      ariaLabel="Owner"
      display={
        <span className={`owner ${assigned ? 'owner-known' : ''}`}>
          {assigned ? memberName(value).slice(0, 2).toUpperCase() : '—'}
          <span>{assigned ? memberName(value) : 'Unassigned'}</span>
        </span>
      }
    />
  )
}

export function RowActions({ list, id, reorder = false, label = 'row' }: { list: ListKey; id: string; reorder?: boolean; label?: string }) {
  const { editing, removeRow, moveRow } = usePlan()
  if (!editing) return null
  return (
    <span className="row-actions">
      {reorder && (
        <>
          <button className="icon-btn" title="Move up" aria-label={`Move ${label} up`} onClick={() => moveRow(list, id, -1)}><Icon name="up" size={14} /></button>
          <button className="icon-btn" title="Move down" aria-label={`Move ${label} down`} onClick={() => moveRow(list, id, 1)}><Icon name="down" size={14} /></button>
        </>
      )}
      <button className="icon-btn icon-btn-danger" title="Remove" aria-label={`Remove ${label}`} onClick={() => removeRow(list, id)}><Icon name="trash" size={14} /></button>
    </span>
  )
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  const { editing } = usePlan()
  if (!editing) return null
  return (
    <button className="add-btn" onClick={onClick}>
      <Icon name="plus" size={14} />{label}
    </button>
  )
}

/**
 * Drag-to-reorder for one list. Rows get a grip handle; dragging one over
 * another drops it into that row's position. Falls back to nothing outside
 * edit mode — the grip only renders while editing.
 */
export function useDragReorder(list: ListKey) {
  const { editing, moveRowTo } = usePlan()
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  // Safety net: a drag that ends outside any row (dropped off-screen,
  // cancelled with Escape, or the OS-level drag session is interrupted)
  // might not deliver onDrop/onDragEnd to the row itself. Clearing on the
  // window's own dragend/drop keeps a row from staying dimmed forever.
  useEffect(() => {
    if (!draggedId) return
    const clear = () => { setDraggedId(null); setOverId(null) }
    window.addEventListener('dragend', clear)
    window.addEventListener('drop', clear)
    return () => {
      window.removeEventListener('dragend', clear)
      window.removeEventListener('drop', clear)
    }
  }, [draggedId])

  function rowProps(id: string, index: number) {
    if (!editing) return {}
    return {
      className: [draggedId === id ? 'is-dragging' : '', overId === id && draggedId && draggedId !== id ? 'is-drag-over' : ''].filter(Boolean).join(' ') || undefined,
      onDragOver: (event: React.DragEvent) => {
        event.preventDefault()
        if (draggedId && draggedId !== id) setOverId(id)
      },
      onDrop: (event: React.DragEvent) => {
        event.preventDefault()
        if (draggedId) moveRowTo(list, draggedId, index)
        setDraggedId(null)
        setOverId(null)
      },
      onDragEnd: () => {
        setDraggedId(null)
        setOverId(null)
      },
      'data-drag-id': id,
    }
  }

  function handleProps(id: string) {
    if (!editing) return {}
    return {
      draggable: true,
      onDragStart: (event: React.DragEvent) => {
        event.dataTransfer.effectAllowed = 'move'
        setDraggedId(id)
      },
    }
  }

  return { rowProps, handleProps }
}

export function DragHandle(props: Record<string, unknown>) {
  const { editing } = usePlan()
  if (!editing) return null
  return (
    <span className="drag-handle" title="Drag to reorder" aria-hidden="true" {...props}>
      <Icon name="grip" size={15} />
    </span>
  )
}
