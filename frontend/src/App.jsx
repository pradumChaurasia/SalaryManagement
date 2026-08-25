import React, { useEffect, useState } from 'react'
import Insights from './Insights'

export default function App(){
  const [view, setView] = useState('employees')
  const [emps, setEmps] = useState([])

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(()=>{
    if (view !== 'employees') return
    fetch(`${API_BASE}/employees?limit=20`)
      .then(r=>r.json())
      .then(d=> setEmps(d.items || []))
      .catch(()=>{})
  },[view])

  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <header style={{display:'flex',gap:12,alignItems:'center'}}>
        <h1 style={{margin:0}}>ACME Salary</h1>
        <nav style={{marginLeft:20}}>
          <button onClick={() => setView('employees')}>Employees</button>
          <button onClick={() => setView('insights')}>Insights</button>
        </nav>
      </header>

      <main style={{marginTop:20}}>
        {view === 'employees' && (
          <div>
            <h2>Employees</h2>
            <ul>
              {emps.map(e=> (
                <li key={e.id}>{e.fullName} — {e.jobTitle}</li>
              ))}
            </ul>
          </div>
        )}

        {view === 'insights' && (
          <div>
            <h2>Insights</h2>
            <Insights apiBase={API_BASE} />
          </div>
        )}
      </main>
    </div>
  )
}
