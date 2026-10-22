import { useState, type ChangeEvent } from 'react'
import { usePlan } from '../store'
import { BrandMark, Card, CardHeading, Icon, PageTitle } from '../ui'

const LOGO_SIZE = 128

/** Downscale an uploaded image to a small square PNG so it fits in browser storage. */
function readLogo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const url = URL.createObjectURL(file)
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = LOGO_SIZE
      const side = Math.min(image.width, image.height)
      canvas.getContext('2d')!.drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, LOGO_SIZE, LOGO_SIZE)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/png'))
    }
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Unreadable image')) }
    image.src = url
  })
}

export function SettingsPage({ requestEdit }: { requestEdit: () => void }) {
  const { plan, editing, setEvent } = usePlan()
  const [logoError, setLogoError] = useState(false)
  const { event } = plan

  async function onLogo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setEvent('logo', await readLogo(file))
      setLogoError(false)
    } catch {
      setLogoError(true)
    }
  }

  return (
    <>
      <PageTitle title="Settings" subtitle="Dashboard name, logo, and the event details used across every page." />

      {!editing && (
        <Card className="callout-card settings-locked">
          <div className="callout-icon"><Icon name="lock" /></div>
          <div><strong>Settings are locked</strong><p>Enter the admin PIN to change these details.</p></div>
          <button className="btn btn-solid" onClick={requestEdit}><Icon name="edit" size={15} />Unlock to edit</button>
        </Card>
      )}

      <fieldset className="settings-fieldset" disabled={!editing}>
        <Card className="event-editor">
          <CardHeading eyebrow="Dashboard" title="Name & icon" />
          <div className="settings-brand">
            <BrandMark initials={event.initials} logo={event.logo} />
            <div className="settings-brand-actions">
              <label className="btn btn-ghost">
                <Icon name="upload" size={15} />{event.logo ? 'Replace logo' : 'Upload logo'}
                <input type="file" accept="image/*" className="sr-only" onChange={onLogo} />
              </label>
              {event.logo && <button className="btn btn-ghost" onClick={() => setEvent('logo', '')}><Icon name="trash" size={15} />Remove</button>}
              <span className="inferred-note">{logoError ? 'That file couldn’t be read as an image.' : 'Square images work best. Also used as the browser tab icon.'}</span>
            </div>
          </div>
          <div className="event-fields">
            <label>Dashboard name<input className="field" value={event.appTitle} onChange={(e) => setEvent('appTitle', e.target.value)} /></label>
            <label>Initials (shown when there’s no logo)<input className="field" value={event.initials} onChange={(e) => setEvent('initials', e.target.value.slice(0, 3))} /></label>
          </div>
        </Card>

        <Card className="event-editor">
          <CardHeading eyebrow="Event details" title="This event" action={<span className="inferred-note">Used across every page</span>} />
          <div className="event-fields">
            <label>Event name<input className="field" value={event.name} onChange={(e) => setEvent('name', e.target.value)} /></label>
            <label>Short name<input className="field" value={event.short} onChange={(e) => setEvent('short', e.target.value)} /></label>
            <label>Date<input className="field" type="date" value={event.date} onChange={(e) => setEvent('date', e.target.value)} /></label>
            <label>Start<input className="field" value={event.start} onChange={(e) => setEvent('start', e.target.value)} /></label>
            <label>End<input className="field" value={event.end} onChange={(e) => setEvent('end', e.target.value)} /></label>
            <label>Schedule status<input className="field" value={event.scheduleStatus} onChange={(e) => setEvent('scheduleStatus', e.target.value)} /></label>
            <label className="event-field-wide">Tagline<input className="field" value={event.tagline} onChange={(e) => setEvent('tagline', e.target.value)} /></label>
          </div>
        </Card>
      </fieldset>
    </>
  )
}
