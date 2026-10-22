import { Text } from '../fields'
import { daysUntil, formatEventDate, money, signedMoney, useCommitteeProgress, usePlan, useTotals } from '../store'
import { Card, CardHeading, Icon, Metric } from '../ui'
import type { TabId } from '../tabs'

export function Overview({ setTab }: { setTab: (tab: TabId) => void }) {
  const { plan, editing, setEvent } = usePlan()
  const { incomeTotal, expenseTotal, balance } = useTotals()
  const progress = useCommitteeProgress()

  const days = daysUntil(plan.event.date)
  const confirmedActs = plan.programme.filter((performer) => performer.status === 'Confirmed').length
  const decisions = [...plan.tasks, ...plan.booths].filter((item) => item.status === 'Needs decision')
  const priorities = [...plan.tasks]
    .filter((task) => task.status === 'Needs decision' || task.status === 'In progress')
    .concat(plan.tasks.filter((task) => task.status === 'Planned'))
    .slice(0, 4)
  const nextMilestone = plan.timeline.find((item) => item.status !== 'Confirmed') ?? plan.timeline[0]

  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">Planning workspace</span>
          <div className="hero-title">Good morning.<br /><span>Here’s the festival pulse.</span></div>
          <p><Text value={plan.event.tagline} onChange={(value) => setEvent('tagline', value)} placeholder="One line about this event" ariaLabel="Event tagline" /></p>
        </div>
        <div className="hero-mark" aria-hidden="true"><Icon name="spark" size={34} /></div>
      </section>

      <div className="metrics-grid">
        <Metric
          icon="clock"
          label="Time to event"
          value={formatEventDate(plan.event.date)}
          note={days === null ? `${plan.event.start}–${plan.event.end}` : days >= 0 ? `${days} days to go · ${plan.event.start}–${plan.event.end}` : `${Math.abs(days)} days ago`}
        />
        <Metric
          icon="wallet"
          label="Budget position"
          value={signedMoney(balance)}
          note={`${money(incomeTotal)} income · ${money(expenseTotal)} planned`}
          tone={balance < 0 ? 'metric-orange' : 'metric-green'}
        />
        <Metric icon="check" label="Confirmed acts" value={String(confirmedActs)} note={`${plan.programme.length} on the roster`} />
        <Metric
          icon="alert"
          label="Decisions needed"
          value={String(decisions.length)}
          note={decisions.length === 0 ? 'Nothing blocked' : decisions.slice(0, 2).map((item) => ('task' in item ? item.task : item.title)).join(' · ')}
          tone={decisions.length > 0 ? 'metric-orange' : ''}
        />
      </div>

      <div className="overview-grid">
        <Card className="priority-card">
          <CardHeading
            eyebrow="Focus now"
            title="Priority decisions"
            action={<button className="text-action" onClick={() => setTab('team')}>View all <Icon name="arrow" size={15} /></button>}
          />
          <div className="priority-list">
            {priorities.length === 0 && <div className="priority-item"><span /><div className="priority-copy"><strong>No open actions</strong><span>Add actions on Team & tasks.</span></div><div /></div>}
            {priorities.map((task) => (
              <div className="priority-item" key={task.id}>
                <span className={`priority-dot dot-${task.status === 'Needs decision' ? 'orange' : 'blue'}`} />
                <div className="priority-copy">
                  <strong>{task.task || 'Untitled action'}</strong>
                  <span>{plan.committees.find((committee) => committee.id === task.committeeId)?.short ?? 'Unassigned'} · {plan.members.find((member) => member.id === task.ownerId)?.name ?? 'Unassigned'}</span>
                </div>
                <div className="priority-due">{task.due || 'TBC'}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="next-card">
          <span className="eyebrow">Next milestone</span>
          <div className="date-tile">
            <span>NEXT</span>
            <strong>{nextMilestone?.date || '—'}</strong>
          </div>
          <div className="card-title">{nextMilestone?.title || 'Add a milestone'}</div>
          <p>{nextMilestone?.detail || 'The timeline is empty — add the first planning milestone.'}</p>
          <button className="secondary-action" onClick={() => setTab('calendar')}>Open timeline <Icon name="arrow" size={16} /></button>
        </Card>
      </div>

      <Card className="progress-card">
        <CardHeading
          eyebrow="Workstream health"
          title="Planning progress"
          action={<span className="inferred-note">Derived from action status</span>}
        />
        <div className="progress-grid">
          {progress.map(({ committee, percent, taskCount }) => (
            <div className="progress-item" key={committee.id}>
              <div className="progress-label"><strong>{committee.short}</strong><span>{percent}%</span></div>
              <div className="progress-track"><span style={{ '--progress': `${percent}%` } as React.CSSProperties} /></div>
              <small>{taskCount === 0 ? 'No actions yet' : `${taskCount} action${taskCount === 1 ? '' : 's'}`}</small>
            </div>
          ))}
        </div>
        {editing && <div className="table-footer-actions"><span className="inferred-note">Percentages follow the status of each workstream’s actions — edit them on Team & tasks.</span></div>}
      </Card>
    </>
  )
}
