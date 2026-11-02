import { formatEventDate } from './store'
import type { EventMeta, ScheduleItem } from './types'

function fileBase(event: EventMeta): string {
  const name = (event.short || event.name || 'programme').trim().replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '')
  return `${name || 'programme'}-schedule`
}

function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function csvCell(value: string): string {
  // Leading formula characters are neutralised so spreadsheets don't execute them.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

/** Downloads the running order as a CSV that opens in Excel, Numbers or Google Sheets. */
export function exportScheduleCsv(event: EventMeta, schedule: ScheduleItem[]) {
  const rows = [
    ['#', 'Time', 'Programme', 'Detail', 'Highlight'],
    ...schedule.map((item, index) => [String(index + 1), item.time, item.title, item.detail, item.highlight ? 'Yes' : '']),
  ]
  // BOM so Excel reads the file as UTF-8.
  const csv = '﻿' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n')
  download(`${fileBase(event)}.csv`, csv, 'text/csv;charset=utf-8')
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
}

/** Opens the print dialog with a clean, one-page running order (choose "Save as PDF" to export). */
export function printSchedule(event: EventMeta, schedule: ScheduleItem[]) {
  const rows = schedule
    .map(
      (item) => `
      <tr class="${item.highlight ? 'hl' : ''}">
        <td class="time">${escapeHtml(item.time || '—')}</td>
        <td><strong>${escapeHtml(item.title || 'Untitled')}</strong>${item.detail ? `<p>${escapeHtml(item.detail).replace(/\n/g, '<br>')}</p>` : ''}</td>
      </tr>`,
    )
    .join('')

  const meta = [
    `${event.scheduleStatus || 'Tentative'} schedule`,
    formatEventDate(event.date),
    event.start && event.end ? `${event.start}–${event.end}` : '',
    event.scheduleLead ? `Lead: ${event.scheduleLead}` : '',
  ].filter(Boolean)

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(fileBase(event))}</title>
<style>
  @page { size: A4; margin: 16mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #17211c; }
  h1 { margin: 0 0 4px; font-size: 20px; }
  .meta { margin: 0 0 18px; color: #5d6b63; font-size: 12px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { text-align: left; padding: 6px 8px; border-bottom: 2px solid #17211c; font-size: 10px; text-transform: uppercase; letter-spacing: .06em; }
  td { padding: 8px; border-bottom: 1px solid #dfe5e1; vertical-align: top; }
  tr { break-inside: avoid; }
  td.time { width: 90px; white-space: nowrap; font-variant-numeric: tabular-nums; font-weight: 600; }
  td p { margin: 3px 0 0; color: #5d6b63; line-height: 1.45; }
  tr.hl td { background: #eef7e8; }
  tr.hl strong::before { content: "★ "; color: #2f7d4f; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style></head><body>
  <h1>${escapeHtml(event.name || 'Programme')} — Programme Schedule</h1>
  <p class="meta">${meta.map(escapeHtml).join(' · ')}</p>
  <table><thead><tr><th>Time</th><th>Programme</th></tr></thead><tbody>${rows || '<tr><td colspan="2">No slots yet.</td></tr>'}</tbody></table>
</body></html>`

  const frame = document.createElement('iframe')
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;'
  document.body.appendChild(frame)
  const doc = frame.contentDocument!
  doc.open()
  doc.write(html)
  doc.close()
  const win = frame.contentWindow!
  win.onafterprint = () => frame.remove()
  setTimeout(() => {
    win.focus()
    win.print()
    // Fallback cleanup for browsers that don't fire afterprint on iframes.
    setTimeout(() => frame.isConnected && frame.remove(), 60_000)
  }, 50)
}
