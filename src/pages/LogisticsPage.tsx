import { AddButton, Para, RowActions, StatusField, Text } from '../fields'
import { uid, usePlan } from '../store'
import { Card, Icon, PageTitle } from '../ui'

const icons = ['map', 'programme', 'publicity', 'logistics'] as const

export function LogisticsPage() {
  const { plan, addRow, updateRow } = usePlan()

  return (
    <>
      <PageTitle title="Logistics" subtitle="Venue setup, technical production, safety, and event-day operations." />
      <div className="feature-grid">
        {plan.logistics.map((item, index) => (
          <Card className="feature-card" key={item.id}>
            <div className="feature-card-top">
              <div className={`feature-icon feature-${(index % 4) + 1}`}><Icon name={icons[index % icons.length]} /></div>
              <RowActions list="logistics" id={item.id} reorder label="logistics item" />
            </div>
            <div className="feature-top">
              <div className="card-title"><Text value={item.title} onChange={(value) => updateRow('logistics', item.id, { title: value })} placeholder="Area" ariaLabel="Logistics area" /></div>
              <StatusField value={item.status} onChange={(value) => updateRow('logistics', item.id, { status: value })} />
            </div>
            <p><Para value={item.detail} onChange={(value) => updateRow('logistics', item.id, { detail: value })} ariaLabel="Logistics detail" /></p>
            <div className="feature-meta"><Text value={item.meta} onChange={(value) => updateRow('logistics', item.id, { meta: value })} placeholder="Budget note" ariaLabel="Logistics budget note" /></div>
          </Card>
        ))}
      </div>
      <div className="table-footer-actions">
        <AddButton label="Add logistics area" onClick={() => addRow('logistics', { id: uid('log'), title: 'New area', detail: '', meta: '', status: 'Planned' })} />
      </div>
      <Card className="callout-card">
        <div className="callout-icon"><Icon name="alert" /></div>
        <div><strong>Open logistics checks</strong><p>Confirm optional generator and air cooler, vendor technical requirements, registration flow, and crowd management plan.</p></div>
      </Card>
    </>
  )
}
