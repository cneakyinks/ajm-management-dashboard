import { useState, type ReactNode } from 'react'
import { PlanProvider, formatEventDate, usePlan } from './store'
import { tabs, type TabId } from './tabs'
import { Icon } from './ui'
import { PinDialog, isAdminUnlocked } from './admin'
import { Overview } from './pages/Overview'
import { TimelinePage } from './pages/TimelinePage'
import { BudgetPage } from './pages/BudgetPage'
import { LogisticsPage } from './pages/LogisticsPage'
import { PublicityPage } from './pages/PublicityPage'
import { ProgrammePage } from './pages/ProgrammePage'
import { BoothsPage } from './pages/BoothsPage'
import { TeamPage } from './pages/TeamPage'

function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [confirmReset, setConfirmReset] = useState(false)
  const [askPin, setAskPin] = useState(false)
  const { plan, editing, setEditing, reset } = usePlan()

  const pages: Record<TabId, ReactNode> = {
    overview: <Overview setTab={setActiveTab} />,
    calendar: <TimelinePage />,
    budget: <BudgetPage />,
    logistics: <LogisticsPage />,
    publicity: <PublicityPage />,
    programme: <ProgrammePage />,
    booths: <BoothsPage />,
    team: <TeamPage />,
  }

  return (
    <div className={`app-shell ${editing ? 'is-editing' : ''}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">{plan.event.initials}</div>
          <div><strong>{plan.event.name}</strong><span>{plan.event.short}</span></div>
        </div>
        <nav aria-label="Dashboard modules">
          {tabs.map((tab) => (
            <button key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <Icon name={tab.icon} /><span>{tab.label}</span>{activeTab === tab.id && <Icon name="arrow" size={15} />}
            </button>
          ))}
        </nav>
        <div className="sidebar-event">
          <span className="event-label">Event day</span>
          <strong>{formatEventDate(plan.event.date)}</strong>
          <span>{plan.event.start}–{plan.event.end}</span>
          <div className="sidebar-line" />
          <span className="planning-label"><span /> {editing ? 'Editing the plan' : 'Planning in progress'}</span>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">{plan.event.initials}</span><strong>{plan.event.short}</strong></div>
          <div className="topbar-event"><span>{plan.event.name}</span><strong>Planning dashboard</strong></div>
          <div className="topbar-actions">
            {editing && (
              confirmReset ? (
                <span className="confirm-reset">
                  Discard all edits?
                  <button className="btn btn-danger" onClick={() => { reset(); setConfirmReset(false) }}>Reset</button>
                  <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
                </span>
              ) : (
                <button className="btn btn-ghost" onClick={() => setConfirmReset(true)}><Icon name="undo" size={15} />Reset plan</button>
              )
            )}
            <button className={`btn ${editing ? 'btn-solid' : 'btn-ghost'}`} onClick={() => {
              setConfirmReset(false)
              if (editing) setEditing(false)
              else if (isAdminUnlocked()) setEditing(true)
              else setAskPin(true)
            }}>
              <Icon name={editing ? 'eye' : 'edit'} size={15} />{editing ? 'Done editing' : 'Edit plan'}
            </button>
          </div>
        </header>
        <div className="mobile-tabs">
          {tabs.map((tab) => (
            <button key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>
              <Icon name={tab.icon} size={17} /><span>{tab.label}</span>
            </button>
          ))}
        </div>
        <main className="content">{pages[activeTab]}</main>
        {askPin && <PinDialog onUnlock={() => { setAskPin(false); setEditing(true) }} onCancel={() => setAskPin(false)} />}
        <footer>
          <span>{plan.event.name} · Planning dashboard</span>
          <span>{editing ? 'Editing · changes save to this browser' : 'Saved in this browser'}</span>
        </footer>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <PlanProvider>
      <Dashboard />
    </PlanProvider>
  )
}
