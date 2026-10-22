import { AddButton, CommitteeField, Money, RowActions, Text } from '../fields'
import { money, signedMoney, uid, usePlan, useTotals } from '../store'
import { Card, CardHeading, Icon, Metric, PageTitle } from '../ui'

export function BudgetPage() {
  const { plan, editing, addRow, updateRow, update } = usePlan()
  const { incomeTotal, expenseTotal, allocationTotal, balance, spendByCommittee, unassignedSpend } = useTotals()
  const contingency = incomeTotal === 0 ? 0 : (balance / incomeTotal) * 100
  const maxBar = Math.max(1, ...plan.committees.map((committee) => Math.max(committee.allocation, spendByCommittee[committee.id] ?? 0)))

  return (
    <>
      <PageTitle title="Budget" subtitle="Income, allocation per workstream, and every cost line — all editable, with totals recalculated as you type." />

      <div className="metrics-grid budget-metrics">
        <Metric icon="wallet" label="Total income" value={money(incomeTotal)} note={`${plan.income.length} funding lines`} />
        <Metric icon="budget" label="Total expenditure" value={money(expenseTotal)} note={`${plan.expenses.length} cost lines`} />
        <Metric
          icon={balance < 0 ? 'alert' : 'check'}
          label="Current balance"
          value={signedMoney(balance)}
          note={`${contingency.toFixed(1)}% contingency`}
          tone={balance < 0 ? 'metric-orange' : 'metric-green'}
        />
      </div>

      <div className="budget-grid">
        <Card>
          <CardHeading eyebrow="Funding" title="Income" action={<strong className="table-total">{money(incomeTotal)}</strong>} />
          <div className="data-list">
            {plan.income.map((line) => (
              <div className="data-row editable-row" key={line.id}>
                <span className="data-row-main">
                  <Text value={line.source} onChange={(value) => updateRow('income', line.id, { source: value })} placeholder="Funding source" ariaLabel="Income source" />
                  {(editing || line.note) && <small className="data-row-note"><Text value={line.note} onChange={(value) => updateRow('income', line.id, { note: value })} placeholder="Note" ariaLabel="Income note" /></small>}
                </span>
                <span className="data-row-end">
                  <strong><Money value={line.amount} onChange={(value) => updateRow('income', line.id, { amount: value })} ariaLabel="Income amount" /></strong>
                  <RowActions list="income" id={line.id} label="income line" />
                </span>
              </div>
            ))}
          </div>
          <AddButton label="Add income line" onClick={() => addRow('income', { id: uid('inc'), source: '', note: '', amount: 0 })} />
        </Card>

        <Card>
          <CardHeading
            eyebrow="Allocation"
            title="Budget per workstream"
            action={<span className="inferred-note">{money(allocationTotal)} allocated</span>}
          />
          <div className="category-bars">
            {plan.committees.map((committee, index) => {
              const spent = spendByCommittee[committee.id] ?? 0
              const left = committee.allocation - spent
              return (
                <div className="category-row" key={committee.id}>
                  <div className="progress-label">
                    <strong>{committee.name}</strong>
                    <span className="allocation-cell">
                      <Money value={committee.allocation} onChange={(value) => updateRow('committees', committee.id, { allocation: value })} ariaLabel={`${committee.name} allocation`} />
                    </span>
                  </div>
                  <div className="progress-track dual-track">
                    <span className={`bar-${(index % 5) + 1}`} style={{ '--progress': `${(committee.allocation / maxBar) * 100}%` } as React.CSSProperties} />
                    <i className="spend-marker" style={{ '--progress': `${(spent / maxBar) * 100}%` } as React.CSSProperties} />
                  </div>
                  <small className={left < 0 ? 'variance-over' : 'variance-ok'}>
                    {money(spent)} committed · {left < 0 ? `${money(-left)} over allocation` : `${money(left)} left`}
                  </small>
                </div>
              )
            })}
            {unassignedSpend > 0 && (
              <div className="category-row">
                <div className="progress-label"><strong>Unassigned cost lines</strong><span>{money(unassignedSpend)}</span></div>
                <small className="variance-over">Give these lines a workstream so they land in the right budget.</small>
              </div>
            )}
          </div>
          <div className="allocation-footer">
            <span>Allocated {money(allocationTotal)}</span>
            <span className={allocationTotal === expenseTotal ? 'variance-ok' : 'variance-over'}>
              {allocationTotal === expenseTotal ? 'Matches committed spend' : `${signedMoney(allocationTotal - expenseTotal)} vs committed`}
            </span>
          </div>
        </Card>
      </div>

      <Card className="table-card">
        <CardHeading
          eyebrow="Cost plan"
          title="Expenditure details"
          action={<span className="inferred-note">Every line can move between workstreams</span>}
        />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th className="col-category">Workstream</th>
                <th>Item</th>
                <th className="align-right">Amount</th>
                {editing && <th className="align-right col-actions">—</th>}
              </tr>
            </thead>
            <tbody>
              {plan.expenses.map((line) => (
                <tr key={line.id}>
                  <td><CommitteeField value={line.committeeId} onChange={(value) => updateRow('expenses', line.id, { committeeId: value })} /></td>
                  <td><Text value={line.item} onChange={(value) => updateRow('expenses', line.id, { item: value })} placeholder="Cost item" ariaLabel="Cost item" /></td>
                  <td className="align-right amount"><Money value={line.amount} onChange={(value) => updateRow('expenses', line.id, { amount: value })} ariaLabel="Cost amount" /></td>
                  {editing && <td className="align-right"><RowActions list="expenses" id={line.id} label="cost line" /></td>}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Total planned expenditure</td>
                <td className="align-right">{money(expenseTotal)}</td>
                {editing && <td />}
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="table-footer-actions">
          <AddButton label="Add cost line" onClick={() => addRow('expenses', { id: uid('exp'), committeeId: '', item: '', amount: 0 })} />
          <AddButton
            label="Match allocations to committed spend"
            onClick={() => update((draft) => {
              for (const committee of draft.committees) {
                committee.allocation = draft.expenses
                  .filter((line) => line.committeeId === committee.id)
                  .reduce((sum, line) => sum + line.amount, 0)
              }
            })}
          />
        </div>
      </Card>

      {balance < 0 && (
        <Card className="callout-card callout-warning">
          <div className="callout-icon"><Icon name="alert" /></div>
          <div>
            <strong>Planned spend is {money(-balance)} above income</strong>
            <p>Raise a funding line, trim a cost line, or move spend between workstreams to bring the plan back into balance.</p>
          </div>
        </Card>
      )}
    </>
  )
}
