import React, { useEffect, useState } from 'react'
import { apiFetch } from './lib/api'

export default function EmployeeDetail({ employee, apiBase = '', token='', onClose }){
  const [comps, setComps] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ annualBase: '', currency: 'USD', effectiveFrom: new Date().toISOString() })
  const [error, setError] = useState(null)

  useEffect(()=>{
    if (!employee) return
    setLoading(true)
    apiFetch(`${apiBase}/compensations?employeeId=${employee.id}&limit=100`, { token })
      .then(r => { setComps(r.body ? r.body.items || [] : []); setLoading(false) })
      .catch(e => { setError(String(e)); setLoading(false) })
  },[employee, token])

  async function submit(e){
    e.preventDefault(); setError(null)
    const payload = { employeeId: employee.id, annualBase: Number(form.annualBase), currency: form.currency, effectiveFrom: form.effectiveFrom }
    const res = await apiFetch(`${apiBase}/compensations`, { method: 'POST', body: payload, token })
    if (res.status === 201) {
      setComps(prev => [res.body, ...prev])
      setForm({ annualBase: '', currency: 'USD', effectiveFrom: new Date().toISOString() })
    } else {
      setError(res.body && res.body.error ? res.body.error : `status ${res.status}`)
    }
  }

  if (!employee) return null

  return (
    <div style={{border:'1px solid #ddd',padding:12,marginTop:12}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3 style={{margin:0}}>{employee.fullName} — {employee.employeeCode}</h3>
        <div><button onClick={onClose}>Close</button></div>
      </div>

      <section style={{marginTop:12}}>
        <h4>Compensation history</h4>
        {loading ? <div>Loading…</div> : (
          <ul>
            {comps.map(c => (
              <li key={c.id}>{c.effectiveFrom ? new Date(c.effectiveFrom).toLocaleDateString() : ''} — {Number(c.annualBase).toLocaleString()} {c.currency}</li>
            ))}
          </ul>
        )}
      </section>

      <section style={{marginTop:12}}>
        <h4>Add compensation</h4>
        <form onSubmit={submit}>
          <input placeholder="annual base" value={form.annualBase} onChange={e=>setForm({...form, annualBase: e.target.value})} />
          <input placeholder="currency" value={form.currency} onChange={e=>setForm({...form, currency: e.target.value})} />
          <input placeholder="effectiveFrom" value={form.effectiveFrom} onChange={e=>setForm({...form, effectiveFrom: e.target.value})} />
          <button type="submit">Add</button>
        </form>
        {error && <div style={{color:'red'}}>{error}</div>}
      </section>
    </div>
  )
}
