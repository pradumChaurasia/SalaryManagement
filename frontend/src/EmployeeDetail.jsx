import React, { useEffect, useState } from 'react'
import { apiFetch } from './lib/api'

export default function EmployeeDetail({ employee, apiBase = '', token = '', onClose }) {
  const [comps, setComps] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    annualBase: '',
    currency: 'USD',
    effectiveFrom: new Date().toISOString().slice(0, 10),
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!employee) return

    setLoading(true)
    apiFetch(`${apiBase}/compensations?employeeId=${employee.id}&limit=100`, { token })
      .then((res) => {
        setComps(res.body ? res.body.items || [] : [])
        setLoading(false)
      })
      .catch((err) => {
        setError(String(err))
        setLoading(false)
      })
  }, [employee, token, apiBase])

  async function submit(e) {
    e.preventDefault()
    setError(null)

    const payload = {
      employeeId: employee.id,
      annualBase: Number(form.annualBase),
      currency: form.currency,
      effectiveFrom: form.effectiveFrom,
    }

    const res = await apiFetch(`${apiBase}/compensations`, { method: 'POST', body: payload, token })

    if (res.status === 201) {
      setComps((prev) => [res.body, ...prev])
      setForm({ annualBase: '', currency: 'USD', effectiveFrom: new Date().toISOString().slice(0, 10) })
    } else {
      setError(res.body && res.body.error ? res.body.error : `status ${res.status}`)
    }
  }

  if (!employee) return null

  return (
    <div className="detail-card">
      <div className="detail-header">
        <div>
          <p className="eyebrow">PROFILE</p>
          <h3>
            {employee.fullName} <span>• {employee.employeeCode}</span>
          </h3>
        </div>

        <button type="button" className="ghost-btn" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="detail-meta">
        <span>{employee.department}</span>
        <span>{employee.jobTitle}</span>
        <span>{employee.country}</span>
      </div>

      <div className="detail-grid">
        <section className="mini-panel">
          <h4>Compensation history</h4>
          {loading ? (
            <div className="empty-state small">Loading…</div>
          ) : (
            <ul className="history-list">
              {comps.map((c) => (
                <li key={c.id}>
                  <span>{c.effectiveFrom ? new Date(c.effectiveFrom).toLocaleDateString() : '—'}</span>
                  <strong>
                    {Number(c.annualBase).toLocaleString()} {c.currency}
                  </strong>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mini-panel">
          <h4>Add salary record</h4>
          <form className="salary-form" onSubmit={submit}>
            <label>
              <span>Annual base</span>
              <input
                value={form.annualBase}
                onChange={(e) => setForm({ ...form, annualBase: e.target.value })}
                placeholder="75000"
              />
            </label>

            <label>
              <span>Currency</span>
              <input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                placeholder="USD"
              />
            </label>

            <label>
              <span>Effective from</span>
              <input
                type="date"
                value={form.effectiveFrom}
                onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })}
              />
            </label>

            <button type="submit" className="primary-btn compact">Add record</button>
          </form>

          {error && <div className="form-error">{error}</div>}
        </section>
      </div>
    </div>
  )
}
