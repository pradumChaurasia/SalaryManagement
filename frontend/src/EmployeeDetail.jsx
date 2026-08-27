import React, { useEffect, useState } from 'react'
import { apiFetch } from './lib/api'

export default function EmployeeDetail({ employee, apiBase = '', token = '', onClose }) {
  const [localEmployee, setLocalEmployee] = useState(employee)
  const [comps, setComps] = useState([])
  const [loading, setLoading] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [form, setForm] = useState({
    annualBase: '',
    currency: 'USD',
    effectiveFrom: new Date().toISOString().slice(0, 10),
  })
  const [editForm, setEditForm] = useState({
    fullName: employee?.fullName || '',
    email: employee?.email || '',
    department: employee?.department || '',
    jobTitle: employee?.jobTitle || '',
    country: employee?.country || '',
    status: employee?.status || 'active',
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!employee) return

    setLocalEmployee(employee)
    setEditForm({
      fullName: employee.fullName || '',
      email: employee.email || '',
      department: employee.department || '',
      jobTitle: employee.jobTitle || '',
      country: employee.country || '',
      status: employee.status || 'active',
    })

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

    const annualBase = Number(form.annualBase)
    const hasValidAnnualBase = Number.isFinite(annualBase) && annualBase > 0
    const hasValidDate = !!form.effectiveFrom && !Number.isNaN(new Date(`${form.effectiveFrom}T12:00:00Z`).getTime())

    if (!hasValidAnnualBase || !hasValidDate) {
      setError('Please enter a valid annual base and effective date before saving.')
      return
    }

    const payload = {
      employeeId: localEmployee.id,
      annualBase,
      currency: form.currency,
      effectiveFrom: new Date(`${form.effectiveFrom}T12:00:00Z`).toISOString(),
    }

    const res = await apiFetch(`${apiBase}/compensations`, { method: 'POST', body: payload, token })

    if (res.status === 201) {
      setComps((prev) => [res.body, ...prev])
      setForm({ annualBase: '', currency: 'USD', effectiveFrom: new Date().toISOString().slice(0, 10) })
    } else {
      setError(res.body && res.body.error ? res.body.error : `status ${res.status}`)
    }
  }

  async function saveEmployee(e) {
    e.preventDefault()
    setError(null)

    const res = await apiFetch(`${apiBase}/employees/${localEmployee.id}`, {
      method: 'PUT',
      body: editForm,
      token,
    })

    if (res.status === 200) {
      setLocalEmployee(res.body)
      setIsEditOpen(false)
    } else {
      setError(res.body && res.body.error ? res.body.error : `status ${res.status}`)
    }
  }

  if (!localEmployee) return null

  return (
    <>
      <div className="detail-drawer-backdrop" onClick={onClose} />
      <div className="detail-drawer" role="dialog" aria-modal="true">
        <div className="detail-header">
          <div>
            <p className="eyebrow">PROFILE</p>
            <h3>
              {localEmployee.fullName} <span>• {localEmployee.employeeCode}</span>
            </h3>
          </div>

          <div className="detail-actions">
            <button type="button" className="ghost-btn" onClick={() => setIsEditOpen(true)}>
              Edit profile
            </button>
            <button type="button" className="ghost-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div className="detail-meta">
          <span>{localEmployee.department}</span>
          <span>{localEmployee.jobTitle}</span>
          <span>{localEmployee.country}</span>
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

      {isEditOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit employee</h3>
              <button type="button" className="ghost-btn" onClick={() => setIsEditOpen(false)}>Close</button>
            </div>

            <form className="edit-form" onSubmit={saveEmployee}>
              <label>
                <span>Full name</span>
                <input value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} />
              </label>

              <label>
                <span>Email</span>
                <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              </label>

              <label>
                <span>Department</span>
                <input value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} />
              </label>

              <label>
                <span>Job title</span>
                <input value={editForm.jobTitle} onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })} />
              </label>

              <label>
                <span>Country</span>
                <input value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} />
              </label>

              <label>
                <span>Status</span>
                <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" className="ghost-btn" onClick={() => setIsEditOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn compact">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
