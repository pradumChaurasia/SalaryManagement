import React, { useEffect, useState } from 'react'

export default function Insights({ apiBase = '', token='' }){
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    setLoading(true)
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined
    fetch(`${apiBase}/insights/compensation/by-department`, { headers })
      .then(r=> r.json())
      .then(d=> { setRows(d || []); setLoading(false) })
      .catch(e=> { setError(e.message || String(e)); setLoading(false) })
  },[])

  if (loading) return <div>Loading insights…</div>
  if (error) return <div style={{color:'red'}}>Error: {error}</div>

  return (
    <div>
      <div style={{marginBottom:8}}>Departments: {rows.length.toLocaleString()}</div>
      <table style={{borderCollapse:'collapse',width:'100%'}}>
      <thead>
        <tr>
          <th style={{textAlign:'left',borderBottom:'1px solid #ddd',padding:8}}>Department</th>
          <th style={{textAlign:'right',borderBottom:'1px solid #ddd',padding:8}}>Count</th>
          <th style={{textAlign:'right',borderBottom:'1px solid #ddd',padding:8}}>Avg Annual</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.department}>
            <td style={{padding:8,borderBottom:'1px solid #f0f0f0'}}>{r.department}</td>
            <td style={{padding:8,textAlign:'right',borderBottom:'1px solid #f0f0f0'}}>{Number(r.count).toLocaleString()}</td>
            <td style={{padding:8,textAlign:'right',borderBottom:'1px solid #f0f0f0'}}>{Number(r.avgAnnual).toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:2})}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )
}
