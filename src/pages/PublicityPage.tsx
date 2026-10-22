import { AddButton, Para, RowActions, StatusField, Text } from '../fields'
import { money, uid, usePlan, useTotals } from '../store'
import { Card, Icon, PageTitle } from '../ui'

export function PublicityPage() {
  const { plan, addRow, updateRow } = usePlan()
  const { spendByCommittee } = useTotals()

  // The publicity workstream owns the campaign budget; fall back to the first
  // workstream whose name mentions publicity if the ids have been edited.
  const committee = plan.committees.find((item) => item.id === 'publicity')
    ?? plan.committees.find((item) => /public/i.test(item.name))
  const campaignBudget = committee ? spendByCommittee[committee.id] ?? 0 : 0

  return (
    <>
      <PageTitle title="Publicity" subtitle={`Campaign milestones and content needed to build momentum toward ${plan.event.name}.`} />
      <div className="publicity-layout">
        <Card className="campaign-card">
          <span className="eyebrow">Campaign budget</span>
          <div className="campaign-value">{money(campaignBudget)}</div>
          <p>{committee ? `Committed under ${committee.name}. Edit the lines on the Budget page.` : 'No publicity workstream found — add one on Team & tasks.'}</p>
          <div className="campaign-art"><Icon name="publicity" size={58} /></div>
        </Card>
        <div className="campaign-steps">
          {plan.publicity.map((item, index) => (
            <Card className="campaign-step" key={item.id}>
              <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="campaign-step-copy">
                <div className="feature-top">
                  <div className="card-title"><Text value={item.title} onChange={(value) => updateRow('publicity', item.id, { title: value })} placeholder="Campaign step" ariaLabel="Campaign step" /></div>
                  <span className="timeline-controls">
                    <StatusField value={item.status} onChange={(value) => updateRow('publicity', item.id, { status: value })} />
                    <RowActions list="publicity" id={item.id} reorder label="campaign step" />
                  </span>
                </div>
                <p><Para value={item.detail} onChange={(value) => updateRow('publicity', item.id, { detail: value })} ariaLabel="Campaign detail" /></p>
                <span className="date-label"><Icon name="calendar" size={14} /><Text value={item.date} onChange={(value) => updateRow('publicity', item.id, { date: value })} placeholder="When" ariaLabel="Campaign date" /></span>
              </div>
            </Card>
          ))}
          <AddButton label="Add campaign step" onClick={() => addRow('publicity', { id: uid('pub'), title: 'New step', detail: '', date: '', status: 'Planned' })} />
        </div>
      </div>
    </>
  )
}
