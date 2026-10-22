import type { IconName } from './ui'

export type TabId =
  | 'overview'
  | 'calendar'
  | 'budget'
  | 'logistics'
  | 'publicity'
  | 'programme'
  | 'booths'
  | 'team'
  | 'settings'

export const tabs: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Overview', icon: 'overview' },
  { id: 'calendar', label: 'Timeline', icon: 'calendar' },
  { id: 'budget', label: 'Budget', icon: 'budget' },
  { id: 'logistics', label: 'Logistics', icon: 'logistics' },
  { id: 'publicity', label: 'Publicity', icon: 'publicity' },
  { id: 'programme', label: 'Programme', icon: 'programme' },
  { id: 'booths', label: 'Booths', icon: 'booths' },
  { id: 'team', label: 'Team & tasks', icon: 'team' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]
