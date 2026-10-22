import { AddButton, Choice, CommitteeField, Money, OwnerField, Para, RowActions, StatusField, Text } from '../fields'
import { money, uid, usePlan, useTotals } from '../store'
import { Card, CardHeading, Icon, Metric, PageTitle } from '../ui'

export function TeamPage() {
  const { plan, editing, addRow, addCommittee, removeCommittee, updateRow } = usePlan()
  const { spendByCommittee } = useTotals()

  const unassignedTasks = plan.tasks.filter((task) => !task.ownerId || !plan.members.some((member) => member.id === task.ownerId))
  const openTasks = plan.tasks.filter((task) => task.status !== 'Confirmed')
  const unplacedMembers = plan.members.filter((member) => !member.committeeId || !plan.committees.some((committee) => committee.id === member.committeeId))

  const committeeOptions = [
    { value: '', label: 'Unassigned' },
    ...plan.committees.map((committee) => ({ value: committee.id, label: committee.name })),
  ]

  return (
    <>
      <PageTitle title="Team & tasks" subtitle="The workstreams for this event, who sits on each, and the shared action register." />

      <div className="team-summary">
        <Metric icon="team" label="Workstreams" value={String(plan.committees.length)} note={`${plan.members.length} people allocated`} />
        <Metric icon="clock" label="Open actions" value={String(openTasks.length)} note={`Across ${new Set(openTasks.map((task) => task.committeeId)).size} workstreams`} />
        <Metric icon="alert" label="Unassigned actions" value={String(unassignedTasks.length)} note="Owner confirmation needed" tone={unassignedTasks.length > 0 ? 'metric-orange' : ''} />
      </div>

      <Card className="committee-card-wrap">
        <CardHeading eyebrow="Structure" title="Workstreams" action={<span className="inferred-note">Shared by budget, people, and actions</span>} />
        <div className="committee-grid">
          {plan.committees.map((committee) => {
            const people = plan.members.filter((member) => member.committeeId === committee.id)
            const spent = spendByCommittee[committee.id] ?? 0
            return (
              <div className="committee-tile" key={committee.id}>
                <div className="committee-tile-top">
                  <span className="avatar"><Text value={committee.short} onChange={(value) => updateRow('committees', committee.id, { short: value.toUpperCase().slice(0, 3) })} placeholder="ID" ariaLabel="Workstream code" className="field-tiny" /></span>
                  {editing && (
                    <button className="icon-btn icon-btn-danger" title="Remove workstream" aria-label={`Remove ${committee.name}`} onClick={() => removeCommittee(committee.id)}>
                      <Icon name="trash" size={14} />
                    </button>
                  )}
                </div>
                <div className="card-title"><Text value={committee.name} onChange={(value) => updateRow('committees', committee.id, { name: value })} placeholder="Workstream name" ariaLabel="Workstream name" /></div>
                <p><Para value={committee.focus} onChange={(value) => updateRow('committees', committee.id, { focus: value })} ariaLabel="Workstream focus" /></p>
                <div className="committee-stats">
                  <span>Budget <strong><Money value={committee.allocation} onChange={(value) => updateRow('committees', committee.id, { allocation: value })} ariaLabel="Workstream allocation" /></strong></span>
                  <span>Committed <strong>{money(spent)}</strong></span>
                </div>
                <div className="committee-people">
                  {people.length === 0 ? <span className="empty-value">No one allocated yet</span> : people.map((member) => <span className="chip" key={member.id}>{member.name}</span>)}
                </div>
              </div>
            )
          })}
        </div>
        {editing && (
          <div className="table-footer-actions">
            <button className="add-btn" onClick={addCommittee}><Icon name="plus" size={14} />Add workstream</button>
            <span className="inferred-note">Removing a workstream keeps its costs, people, and actions — they fall back to unassigned.</span>
          </div>
        )}
      </Card>

      <Card className="table-card">
        <CardHeading
          eyebrow="People"
          title="Team allocation"
          action={<span className="inferred-note">{unplacedMembers.length > 0 ? `${unplacedMembers.length} not yet allocated` : 'Everyone allocated'}</span>}
        />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role / focus</th>
                <th className="col-category">Workstream</th>
                {editing && <th className="align-right col-actions">—</th>}
              </tr>
            </thead>
            <tbody>
              {plan.members.map((member) => (
                <tr key={member.id}>
                  <td className="performer-name">
                    <span className="avatar">{(member.name || '?').slice(0, 2).toUpperCase()}</span>
                    <strong><Text value={member.name} onChange={(value) => updateRow('members', member.id, { name: value })} placeholder="Name" ariaLabel="Member name" /></strong>
                  </td>
                  <td><Text value={member.role} onChange={(value) => updateRow('members', member.id, { role: value })} placeholder="Role" ariaLabel="Member role" /></td>
                  <td>
                    <Choice
                      value={member.committeeId}
                      onChange={(value) => updateRow('members', member.id, { committeeId: value })}
                      options={committeeOptions}
                      ariaLabel="Member workstream"
                      display={member.committeeId ? <span className="category-tag">{committeeOptions.find((option) => option.value === member.committeeId)?.label ?? 'Unassigned'}</span> : <span className="category-tag category-tag-open">Unassigned</span>}
                    />
                  </td>
                  {editing && <td className="align-right"><RowActions list="members" id={member.id} label="member" /></td>}
                </tr>
              ))}
              {plan.members.length === 0 && (
                <tr><td colSpan={editing ? 4 : 3}><span className="empty-value">No people added yet.</span></td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer-actions">
          <AddButton label="Add person" onClick={() => addRow('members', { id: uid('mbr'), name: '', role: '', committeeId: '' })} />
        </div>
      </Card>

      <Card className="table-card">
        <CardHeading eyebrow="Action register" title="Delegation & milestones" action={<span className="inferred-note">Owners come from the people above</span>} />
        <div className="table-wrap">
          <table className="task-table">
            <thead>
              <tr>
                <th>Action</th>
                <th className="col-category">Workstream</th>
                <th>Owner</th>
                <th>Due</th>
                <th>Status</th>
                {editing && <th className="align-right col-actions">—</th>}
              </tr>
            </thead>
            <tbody>
              {plan.tasks.map((task) => (
                <tr key={task.id}>
                  <td className="task-name">
                    <span className={`task-check ${task.status === 'In progress' ? 'task-active' : ''} ${task.status === 'Confirmed' ? 'task-done' : ''}`} />
                    <Text value={task.task} onChange={(value) => updateRow('tasks', task.id, { task: value })} placeholder="Action" ariaLabel="Action" />
                  </td>
                  <td><CommitteeField value={task.committeeId} onChange={(value) => updateRow('tasks', task.id, { committeeId: value })} /></td>
                  <td><OwnerField value={task.ownerId} onChange={(value) => updateRow('tasks', task.id, { ownerId: value })} /></td>
                  <td className="date-cell"><Text value={task.due} onChange={(value) => updateRow('tasks', task.id, { due: value })} placeholder="Due" ariaLabel="Due" /></td>
                  <td><StatusField value={task.status} onChange={(value) => updateRow('tasks', task.id, { status: value })} /></td>
                  {editing && <td className="align-right"><RowActions list="tasks" id={task.id} reorder label="action" /></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer-actions">
          <AddButton label="Add action" onClick={() => addRow('tasks', { id: uid('task'), task: '', committeeId: '', ownerId: '', due: '', status: 'Planned' })} />
        </div>
      </Card>
    </>
  )
}
