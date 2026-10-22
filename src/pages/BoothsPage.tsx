import { AddButton, OwnerField, Para, RowActions, StatusField, Text } from '../fields'
import { uid, usePlan } from '../store'
import { Card, Icon, PageTitle } from '../ui'

export function BoothsPage() {
  const { plan, addRow, updateRow } = usePlan()
  const openDecisions = plan.booths.filter((booth) => booth.status === 'Needs decision')

  return (
    <>
      <PageTitle title="Booths & activities" subtitle="Interactive experiences, creative partners, equipment needs, and open booth decisions." />
      <div className="booth-grid">
        {plan.booths.map((booth, index) => (
          <Card className={`booth-card ${booth.status === 'Needs decision' ? 'booth-highlight' : ''}`} key={booth.id}>
            <div className="booth-card-top">
              <div className={`booth-art booth-art-${(index % 3) + 1}`}><Icon name={index % 3 === 1 ? 'spark' : 'booths'} size={28} /></div>
              <RowActions list="booths" id={booth.id} reorder label="booth" />
            </div>
            <StatusField value={booth.status} onChange={(value) => updateRow('booths', booth.id, { status: value })} />
            <div className="card-title"><Text value={booth.title} onChange={(value) => updateRow('booths', booth.id, { title: value })} placeholder="Booth" ariaLabel="Booth" /></div>
            <p><Para value={booth.detail} onChange={(value) => updateRow('booths', booth.id, { detail: value })} ariaLabel="Booth detail" /></p>
            <div className="booth-footer">
              <span className="booth-owner">Owner · <OwnerField value={booth.ownerId} onChange={(value) => updateRow('booths', booth.id, { ownerId: value })} /></span>
              <strong><Text value={booth.meta} onChange={(value) => updateRow('booths', booth.id, { meta: value })} placeholder="Cost" ariaLabel="Booth cost" /></strong>
            </div>
          </Card>
        ))}
      </div>
      <div className="table-footer-actions">
        <AddButton label="Add booth or activity" onClick={() => addRow('booths', { id: uid('booth'), title: 'New booth', detail: '', ownerId: '', meta: 'TBC', status: 'Planned' })} />
      </div>
      {openDecisions.length > 0 && (
        <Card className="callout-card booth-callout">
          <div className="callout-icon"><Icon name="clock" /></div>
          <div>
            <strong>{openDecisions.length} booth decision{openDecisions.length === 1 ? '' : 's'} still open</strong>
            <p>{openDecisions.map((booth) => booth.title).join(' · ')}</p>
          </div>
          <span className="status status-needs-decision">Needs decision</span>
        </Card>
      )}
    </>
  )
}
