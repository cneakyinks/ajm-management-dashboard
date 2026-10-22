import type { Plan } from './types'

/**
 * Starting plan for Arts & Music Fest 2026. Everything here is a starting
 * point only — every figure, date, committee, and person is editable in the
 * app and the edited plan is stored in the browser.
 */
export function seedPlan(): Plan {
  return {
    event: {
      appTitle: 'myEPG: AMJ2026',
      logo: '',
      name: 'Arts & Music Fest 2026',
      short: 'Fest 2026',
      initials: 'AM',
      date: '2026-11-21',
      start: '6:30pm',
      end: '9:30pm',
      tagline: 'A clear view of what’s confirmed, what needs attention, and what comes next.',
      scheduleLead: '',
      scheduleStatus: 'Tentative',
    },

    committees: [
      { id: 'programming', name: 'Programming', short: 'PRG', focus: 'Performers, running order, auditions, stage flow.', allocation: 5500 },
      { id: 'publicity', name: 'Pre-Event Publicity, Ticket Sales/RSVP & F&B', short: 'PUB', focus: 'Campaign, ticketing and RSVP, plus food & beverage.', allocation: 600 },
      { id: 'media', name: 'Event & Media Coverage (Photo & Reel Op)', short: 'MED', focus: 'Event-day photo and reel capture, shot list, post-event content.', allocation: 0 },
      { id: 'logistics', name: 'Volunteer Mobilisation & Logistics', short: 'LOG', focus: 'Volunteers, setup, AV, transport, site and teardown.', allocation: 8300 },
      { id: 'registration', name: 'Registration, Guests & Crowd Mgmt', short: 'REG', focus: 'Registration flow, guest handling, crowd and safety plan.', allocation: 500 },
    ],

    members: [
      { id: 'yn', name: 'YN', role: 'Projection interaction station', committeeId: 'programming' },
    ],

    income: [
      { id: 'inc-tickets', source: 'Ticket sales ($3 × 400)', note: 'Pre-sale and door', amount: 1200 },
      { id: 'inc-cacc', source: 'CACC grant', note: 'Confirmed funding', amount: 1000 },
      { id: 'inc-dmov', source: 'DMOV', note: 'Main funding line', amount: 12800 },
    ],

    expenses: [
      { id: 'exp-tentage', committeeId: 'logistics', item: 'Tentage, stage, tables & chairs', amount: 3000 },
      { id: 'exp-backdrop', committeeId: 'logistics', item: 'Stage backdrop', amount: 500 },
      { id: 'exp-av', committeeId: 'logistics', item: 'AV equipment', amount: 4000 },
      { id: 'exp-transport', committeeId: 'logistics', item: 'Transport for bulky items', amount: 200 },
      { id: 'exp-cleaning', committeeId: 'logistics', item: 'Bins and cleaning', amount: 600 },
      { id: 'exp-zaxis', committeeId: 'programming', item: 'Zaxis', amount: 1300 },
      { id: 'exp-kirsten', committeeId: 'programming', item: 'Kirsten (5-piece band)', amount: 1500 },
      { id: 'exp-jason', committeeId: 'programming', item: 'Jason Yuu', amount: 800 },
      { id: 'exp-emcee', committeeId: 'programming', item: 'Emcee', amount: 1200 },
      { id: 'exp-shine', committeeId: 'programming', item: 'Shine Arts Creative Studio', amount: 700 },
      { id: 'exp-promo', committeeId: 'publicity', item: 'Event promotion', amount: 600 },
      { id: 'exp-ambulance', committeeId: 'registration', item: 'Ambulance', amount: 500 },
    ],

    timeline: [
      { id: 'tl-1', date: 'Now – 30 Oct', title: 'Close critical decisions', detail: 'Push auditions, settle booth and activity options, and clarify NEA and F&B.', status: 'In progress' },
      { id: 'tl-2', date: '30 Oct', title: 'Auditions close', detail: 'Final call for open-audition registrations.', status: 'Planned' },
      { id: 'tl-3', date: '31 Oct', title: 'Publicity launch', detail: 'Release the main poster, banner, and event publicity materials.', status: 'Planned' },
      { id: 'tl-4', date: 'Early Nov', title: 'Confirm the experience', detail: 'Select audition acts and confirm the full programme, booths, and vendors.', status: 'Planned' },
      { id: 'tl-5', date: 'Early – mid Nov', title: 'Build momentum', detail: 'Publish performer and activity features while completing operational planning.', status: 'Planned' },
      { id: 'tl-6', date: 'Mid Nov', title: 'Lock the event plan', detail: 'Finalise programme, manpower, registration, crowd plan, logistics, and media shot list.', status: 'Planned' },
      { id: 'tl-7', date: 'Final week', title: 'Final checks', detail: 'Confirm vendors and performers, brief volunteers, push publicity, and check the site.', status: 'Planned' },
      { id: 'tl-8', date: '21 Nov', title: 'Arts & Music Fest 2026', detail: 'Event day · 6:30pm–9:30pm', status: 'Confirmed' },
    ],

    tasks: [
      { id: 'task-fnb', task: 'Confirm F&B approach and budget', committeeId: 'publicity', ownerId: '', due: '30 Oct', status: 'Needs decision' },
      { id: 'task-projection', task: 'Confirm projection interaction station idea', committeeId: 'programming', ownerId: 'yn', due: '30 Oct', status: 'In progress' },
      { id: 'task-auditions', task: 'Close open auditions and select acts', committeeId: 'programming', ownerId: '', due: 'Early Nov', status: 'In progress' },
      { id: 'task-publicity', task: 'Launch main publicity materials', committeeId: 'publicity', ownerId: '', due: '31 Oct', status: 'Planned' },
      { id: 'task-vendor', task: 'Confirm vendor and booth package', committeeId: 'programming', ownerId: '', due: 'Early Nov', status: 'Needs decision' },
      { id: 'task-runorder', task: 'Finalise programme and running order', committeeId: 'programming', ownerId: '', due: 'Mid Nov', status: 'Planned' },
      { id: 'task-brief', task: 'Complete volunteer and site briefing', committeeId: 'logistics', ownerId: '', due: 'Final week', status: 'Planned' },
      { id: 'task-shotlist', task: 'Agree photo and reel shot list', committeeId: 'media', ownerId: '', due: 'Mid Nov', status: 'Planned' },
      { id: 'task-crowd', task: 'Build registration and crowd flow plan', committeeId: 'registration', ownerId: '', due: 'Mid Nov', status: 'Planned' },
    ],

    logistics: [
      { id: 'log-setup', title: 'Event setup', detail: 'Tentage, 4.8 × 3.6m stage, 15 tables, 60 chairs, optional generator and air cooler.', meta: '$3,000 budgeted', status: 'In progress' },
      { id: 'log-av', title: 'Audio visual', detail: 'Stage lights, speakers, sound monitor, technical riders, and crew requirements.', meta: '$4,000 budgeted', status: 'In progress' },
      { id: 'log-stage', title: 'Stage identity', detail: '4 × 4m backdrop and final artwork production.', meta: '$500 budgeted', status: 'Planned' },
      { id: 'log-safety', title: 'Safety & operations', detail: 'Ambulance, bins and cleaning, registration, crowd plan, and equipment checks.', meta: '$1,100 budgeted', status: 'Planned' },
    ],

    publicity: [
      { id: 'pub-auditions', title: 'Audition push', detail: 'Urgent reminder and promotion across available channels.', date: 'Before 30 Oct', status: 'In progress' },
      { id: 'pub-launch', title: 'Main launch', detail: 'Main event poster, banner, and ticket call-to-action.', date: '31 Oct · tentative', status: 'Planned' },
      { id: 'pub-content', title: 'Content plan', detail: 'Performer introductions, audition acts, workshops, local creatives, and ticket promotion.', date: 'Early – mid Nov', status: 'Planned' },
      { id: 'pub-final', title: 'Final push', detail: 'Event reminders, practical information, and last ticket call.', date: 'Final week', status: 'Planned' },
    ],

    programme: [
      { id: 'prf-zaxis', name: 'Zaxis', time: '', type: 'Live music', fee: '$1,300', status: 'Confirmed' },
      { id: 'prf-kirsten', name: 'Kirsten', time: '', type: '5-piece band', fee: '$1,500', status: 'Confirmed' },
      { id: 'prf-jason', name: 'Jason Yuu', time: '', type: 'Live music', fee: '$800', status: 'Confirmed' },
      { id: 'prf-emcee', name: 'Emcee', time: '6:30pm', type: 'Event host', fee: '$1,200', status: 'In progress' },
      { id: 'prf-open', name: 'Open audition acts', time: '', type: 'Community performers', fee: 'TBC', status: 'In progress' },
    ],

    // The minute-by-minute event-day running order. Matches each performer
    // and booth to a slot — assign the remaining TBC times to line this up
    // exactly with the performer roster above.
    schedule: [
      { id: 'sch-setup', time: '5:00pm', title: 'Venue & Vendor Setup', detail: 'Final stage & AV checks (bump-in from Thu/Fri). Art booths & YN/CC showcase display.', highlight: false },
      { id: 'sch-doors', time: '6:00pm', title: 'Doors Open – Registration & Guest Arrival', detail: 'Check-in (platform TBC). Guests explore art exhibits & YN/CC booths across both areas.', highlight: false },
      { id: 'sch-welcome', time: '6:30pm', title: 'Emcee Welcome & Programme Launch', detail: 'Host formally opens the event.', highlight: false },
      { id: 'sch-opening', time: '6:35pm', title: 'Opening Act: Organising Committee + CACC Interest Group (TBC)', detail: '', highlight: false },
      { id: 'sch-adviser', time: '6:50pm', title: 'Adviser’s Speech', detail: 'Guest-of-honour address (Adviser arrives 6:30pm).', highlight: false },
      { id: 'sch-talent-1', time: '7:00pm', title: 'First Talent Performance', detail: '', highlight: true },
      { id: 'sch-talent-2', time: '7:10pm', title: 'Second Talent Performance', detail: '', highlight: false },
      { id: 'sch-school-1', time: '7:25pm', title: 'School Performance', detail: '', highlight: false },
      { id: 'sch-reminder', time: '7:40pm', title: 'Emcee Reminder + Explore the Booths', detail: '', highlight: false },
      { id: 'sch-school-2', time: '7:50pm', title: 'School Performance', detail: '', highlight: false },
      { id: 'sch-band', time: '8:05pm', title: 'Band Performance (Live band set) / DJ Set (TBC)', detail: '', highlight: true },
      { id: 'sch-dancer', time: '8:25pm', title: 'Dancer Performance (TBC)', detail: '', highlight: false },
      { id: 'sch-closer', time: '8:45pm', title: 'Crowd-Puller / Closing Performance (TBC)', detail: '', highlight: false },
      { id: 'sch-closing', time: '9:00pm', title: 'Closing Segment', detail: 'MC wraps the night, and thanks partners and everyone for coming.', highlight: false },
      { id: 'sch-teardown', time: '9:45pm', title: 'Dispersal & Teardown', detail: '', highlight: false },
    ],

    booths: [
      { id: 'booth-shine', title: 'Shine Arts Creative Studio', detail: 'Art booths and free painting; 50% advance of $350 required to book.', ownerId: '', meta: '$700', status: 'In progress' },
      { id: 'booth-projection', title: 'Projection interaction station', detail: 'Additional delegated booth. Interaction concept to be confirmed by 30 October.', ownerId: 'yn', meta: '$1,400 equipment', status: 'Needs decision' },
      { id: 'booth-extra', title: 'Additional activity options', detail: 'Review the proposed vendor package and confirm the remaining booth mix.', ownerId: '', meta: 'TBC', status: 'Needs decision' },
    ],
  }
}
