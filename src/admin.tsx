import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Icon } from './ui'

/**
 * SHA-256 of the admin PIN. Only the hash ships in the bundle; to change the
 * PIN, run `printf <pin> | shasum -a 256` and paste the result here.
 */
const ADMIN_PIN_HASH = 'f5095cd644fbe157a3ebc71d3e3212530f58e6d8a88c400c811314f217278c59'
const SESSION_KEY = 'ajm-admin-unlocked'

async function sha256(text: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

export function isAdminUnlocked() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === ADMIN_PIN_HASH
  } catch {
    return false
  }
}

function rememberUnlock() {
  try {
    sessionStorage.setItem(SESSION_KEY, ADMIN_PIN_HASH)
  } catch {
    // Storage blocked — the unlock just lasts until reload.
  }
}

export function PinDialog({ onUnlock, onCancel }: { onUnlock: () => void; onCancel: () => void }) {
  const [pin, setPin] = useState('')
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => inputRef.current?.focus(), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  async function submit(e: FormEvent) {
    e.preventDefault()
    if ((await sha256(pin)) === ADMIN_PIN_HASH) {
      rememberUnlock()
      onUnlock()
    } else {
      setError(true)
      setPin('')
      inputRef.current?.focus()
    }
  }

  return (
    <div className="pin-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <form className="pin-dialog" role="dialog" aria-modal="true" aria-labelledby="pin-title" onSubmit={submit}>
        <span className="metric-icon"><Icon name="lock" /></span>
        <h2 id="pin-title">Admin PIN</h2>
        <p>Enter the admin PIN to edit the plan.</p>
        <div className="pin-input">
          <input
            ref={inputRef}
            className="field"
            type={visible ? 'text' : 'password'}
            inputMode="numeric"
            autoComplete="off"
            aria-label="Admin PIN"
            aria-invalid={error}
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false) }}
          />
          <button type="button" className="pin-toggle" aria-label={visible ? 'Hide PIN' : 'Show PIN'} aria-pressed={visible} onClick={() => setVisible(!visible)}>
            <Icon name={visible ? 'eyeOff' : 'eye'} size={16} />
          </button>
        </div>
        {error && <span className="pin-error" role="alert">Incorrect PIN. Try again.</span>}
        <div className="pin-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-solid" disabled={!pin}>Unlock</button>
        </div>
      </form>
    </div>
  )
}
