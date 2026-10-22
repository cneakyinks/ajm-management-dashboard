import type { ReactNode } from 'react'
import type { Status } from './types'

export type IconName =
  | 'overview'
  | 'calendar'
  | 'budget'
  | 'logistics'
  | 'publicity'
  | 'programme'
  | 'booths'
  | 'team'
  | 'arrow'
  | 'clock'
  | 'check'
  | 'alert'
  | 'wallet'
  | 'spark'
  | 'map'
  | 'edit'
  | 'plus'
  | 'trash'
  | 'undo'
  | 'up'
  | 'down'
  | 'eye'
  | 'grip'

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    calendar: <><path d="M7 3v3M17 3v3M4 9h16"/><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 13h3M14 13h2M8 17h2M13 17h3"/></>,
    budget: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M16 12h5M7 9h5M7 15h3"/></>,
    logistics: <><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
    publicity: <><path d="m4 13 2 7h3l-1-7M5 13h4l8 4V5L9 9H5a2 2 0 0 0 0 4Z"/><path d="M20 9v4"/></>,
    programme: <><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></>,
    booths: <><path d="M3 10h18M5 10v10h14V10M4 10l2-6h12l2 6"/><path d="M9 14h6v6"/></>,
    team: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20a6 6 0 0 1 12 0M14 15a5 5 0 0 1 7 5"/></>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    alert: <><path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v4M12 17h.01"/></>,
    wallet: <><path d="M3 6h16a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2V6Z"/><path d="M3 7V5a2 2 0 0 1 2-2h12v3M16 11h5v4h-5a2 2 0 1 1 0-4Z"/></>,
    spark: <><path d="m12 3 1.4 4.1L17 9l-3.6 1.9L12 15l-1.4-4.1L7 9l3.6-1.9L12 3Z"/><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14ZM19 3l.6 1.4L21 5l-1.4.6L19 7l-.6-1.4L17 5l1.4-.6L19 3Z"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/></>,
    edit: <><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z"/><path d="m14 6 4 4"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13M9 7V4h6v3"/></>,
    undo: <><path d="M4 9h11a5 5 0 0 1 0 10h-5"/><path d="m8 5-4 4 4 4"/></>,
    up: <path d="m6 15 6-6 6 6"/>,
    down: <path d="m6 9 6 6 6-6"/>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.6"/></>,
    grip: <><circle cx="9" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1.3" fill="currentColor" stroke="none"/></>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

export function StatusChip({ status }: { status: Status }) {
  return <span className={`status status-${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>
}

export function Metric({ icon, label, value, note, tone = '' }: { icon: IconName; label: string; value: ReactNode; note: ReactNode; tone?: string }) {
  return (
    <Card className={`metric ${tone}`}>
      <div className="metric-top">
        <span className="metric-icon"><Icon name={icon} /></span>
        <span className="metric-label">{label}</span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-note">{note}</div>
    </Card>
  )
}

export function PageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="page-title">
      <div className="page-heading">{title}</div>
      <p>{subtitle}</p>
    </div>
  )
}

export function CardHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="card-heading-row">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <div className="card-title">{title}</div>
      </div>
      {action}
    </div>
  )
}
