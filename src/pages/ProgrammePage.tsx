import { AddButton, DragHandle, EditOnly, Para, RowActions, StatusField, Text, useDragReorder } from '../fields'
import { formatShortEventDate, uid, usePlan } from '../store'
import { Card, CardHeading, Icon, PageTitle } from '../ui'

export function ProgrammePage() {
  const { plan, editing, addRow, updateRow, setEvent } = usePlan()
  const nextDecision = plan.tasks.find((task) => task.status === 'Needs decision' && task.committeeId === 'programming')
  const { rowProps, handleProps } = useDragReorder('schedule')

  return (
    <>
      <PageTitle title="Programme & performers" subtitle="Confirmed talent, open programme slots, and the minute-by-minute running order." />
      <div className="programme-summary">
        <Card className="programme-hero">
          <div className="programme-art"><Icon name="programme" size={50} /></div>
          <div>
            <span className="eyebrow">Event programme</span>
            <div className="programme-time">{plan.event.start}–{plan.event.end}</div>
            <p>{plan.programme.length} entries on the roster · {plan.schedule.length} slots in the running order</p>
          </div>
        </Card>
        <Card className="decision-card">
          <span className="eyebrow">Next programme decision</span>
          <div className="card-title">{nextDecision?.task ?? 'No open programme decision'}</div>
          <p>Confirm performance duration, technical requirements, and a balanced running order.</p>
          <span className="date-label"><Icon name="calendar" size={14} />{nextDecision?.due ?? 'TBC'}</span>
        </Card>
      </div>

      <Card className="table-card">
        <CardHeading eyebrow="Talent" title="Performer roster" action={<span className="inferred-note">Fees also belong on the Budget page</span>} />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Performer</th>
                <th>Time</th>
                <th>Format</th>
                <th>Fee</th>
                <th>Status</th>
                {editing && <th className="align-right col-actions">—</th>}
              </tr>
            </thead>
            <tbody>
              {plan.programme.map((item) => (
                <tr key={item.id}>
                  <td className="performer-name">
                    <span className="avatar">{(item.name || '?').charAt(0).toUpperCase()}</span>
                    <strong><Text value={item.name} onChange={(value) => updateRow('programme', item.id, { name: value })} placeholder="Performer" ariaLabel="Performer" /></strong>
                  </td>
                  <td className="date-cell"><Text value={item.time} onChange={(value) => updateRow('programme', item.id, { time: value })} placeholder="TBC" ariaLabel="Performance time" /></td>
                  <td><Text value={item.type} onChange={(value) => updateRow('programme', item.id, { type: value })} placeholder="Format" ariaLabel="Format" /></td>
                  <td className="amount"><Text value={item.fee} onChange={(value) => updateRow('programme', item.id, { fee: value })} placeholder="TBC" ariaLabel="Fee" /></td>
                  <td><StatusField value={item.status} onChange={(value) => updateRow('programme', item.id, { status: value })} /></td>
                  {editing && <td className="align-right"><RowActions list="programme" id={item.id} reorder label="performer" /></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer-actions">
          <AddButton label="Add performer" onClick={() => addRow('programme', { id: uid('prf'), name: '', time: '', type: '', fee: 'TBC', status: 'Planned' })} />
        </div>
      </Card>

      <Card className="table-card schedule-card">
        <CardHeading
          eyebrow={`${plan.event.scheduleStatus || 'Tentative'}: ${formatShortEventDate(plan.event.date)}`}
          title="Programme Schedule"
          action={
            <span className="schedule-lead">
              Lead:{' '}
              <Text
                value={plan.event.scheduleLead}
                onChange={(value) => setEvent('scheduleLead', value)}
                placeholder="Add lead"
                ariaLabel="Schedule lead"
                className="field-inline"
              />
            </span>
          }
        />
        <EditOnly>
          <p className="schedule-hint">Drag the grip handle to reorder a slot, or use the arrows. The green dot marks a highlighted moment.</p>
        </EditOnly>
        <div className="table-wrap">
          <table className="schedule-table">
            <thead>
              <tr>
                {editing && <th className="col-grip">—</th>}
                <th className="col-time">Time</th>
                <th>Programme</th>
                {editing && <th className="align-right col-actions">—</th>}
              </tr>
            </thead>
            <tbody>
              {plan.schedule.map((item, index) => (
                <tr key={item.id} {...rowProps(item.id, index)}>
                  {editing && <td className="col-grip"><DragHandle {...handleProps(item.id)} /></td>}
                  <td className="date-cell schedule-time-cell">
                    <button
                      className={`highlight-dot ${item.highlight ? 'is-on' : ''}`}
                      title={item.highlight ? 'Highlighted — click to unmark' : 'Mark as highlighted'}
                      aria-pressed={item.highlight}
                      aria-label="Toggle highlight"
                      onClick={() => editing && updateRow('schedule', item.id, { highlight: !item.highlight })}
                      disabled={!editing}
                    />
                    <Text value={item.time} onChange={(value) => updateRow('schedule', item.id, { time: value })} placeholder="Time" ariaLabel="Slot time" className="field-time" />
                  </td>
                  <td className="schedule-programme-cell">
                    <strong className={item.highlight ? 'schedule-highlighted' : ''}>
                      <Text value={item.title} onChange={(value) => updateRow('schedule', item.id, { title: value })} placeholder="Programme item" ariaLabel="Programme item" />
                    </strong>
                    {(editing || item.detail) && (
                      <Para value={item.detail} onChange={(value) => updateRow('schedule', item.id, { detail: value })} placeholder="Add detail…" ariaLabel="Slot detail" />
                    )}
                  </td>
                  {editing && <td className="align-right"><RowActions list="schedule" id={item.id} reorder label="schedule slot" /></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer-actions">
          <AddButton label="Add schedule slot" onClick={() => addRow('schedule', { id: uid('sch'), time: '', title: '', detail: '', highlight: false })} />
        </div>
      </Card>
    </>
  )
}
