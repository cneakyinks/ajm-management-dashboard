import { AddButton, Para, RowActions, StatusField, Text } from '../fields'
import { uid, usePlan } from '../store'
import { Card, Icon, PageTitle } from '../ui'

export function TimelinePage() {
  const { plan, editing, addRow, updateRow } = usePlan()
  const milestones = plan.timeline

  return (
    <>
      <PageTitle title="Timeline" subtitle="Every planning milestone from today to event day. Add, reorder, retitle, or re-date any step." />
      <Card className="timeline-card">
        <div className="timeline">
          {milestones.map((item, index) => (
            <div className="timeline-item" key={item.id}>
              <div className="timeline-rail">
                <span className={`timeline-node ${index === 0 ? 'active' : ''}`}>{index === milestones.length - 1 && <Icon name="spark" size={14} />}</span>
                {index < milestones.length - 1 && <span className="timeline-line" />}
              </div>
              <div className="timeline-date">
                <Text value={item.date} onChange={(value) => updateRow('timeline', item.id, { date: value })} placeholder="When" ariaLabel="Milestone date" />
              </div>
              <div className="timeline-copy">
                <div className="timeline-title-row">
                  <strong><Text value={item.title} onChange={(value) => updateRow('timeline', item.id, { title: value })} placeholder="Milestone" ariaLabel="Milestone title" /></strong>
                  <span className="timeline-controls">
                    <StatusField value={item.status} onChange={(value) => updateRow('timeline', item.id, { status: value })} />
                    <RowActions list="timeline" id={item.id} reorder label="milestone" />
                  </span>
                </div>
                <p><Para value={item.detail} onChange={(value) => updateRow('timeline', item.id, { detail: value })} ariaLabel="Milestone detail" /></p>
              </div>
            </div>
          ))}
        </div>
        {editing && (
          <div className="table-footer-actions">
            <AddButton
              label="Add milestone"
              onClick={() => addRow('timeline', { id: uid('tl'), date: '', title: 'New milestone', detail: '', status: 'Planned' })}
            />
          </div>
        )}
      </Card>
    </>
  )
}
