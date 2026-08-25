import React, { useEffect, useState } from 'react'
import Insights from './Insights'
import EmployeeDetail from './EmployeeDetail'
import Login from './Login'
import { apiFetch } from './lib/api'

export default function App(){
  const [view, setView] = useState('employees')
  const [emps, setEmps] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [selected, setSelected] = useState(null)

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(()=>{
    if (view !== 'employees') return
    apiFetch(`${API_BASE}/employees?limit=20`, { token })
      .then(r=> r.body)
      .then(d=> setEmps(d ? d.items || [] : []))
      .catch(()=>{})
  },[view, token])

  function handleLogin(t){
    setToken(t)
    localStorage.setItem('token', t)
  }

  function logout(){
    setToken('')
    localStorage.removeItem('token')
  }

  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <header style={{display:'flex',gap:12,alignItems:'center'}}>
        <h1 style={{margin:0}}>ACME Salary</h1>
        <nav style={{marginLeft:20}}>
          <button onClick={() => setView('employees')}>Employees</button>
          <button onClick={() => setView('insights')}>Insights</button>
        </nav>
        <div style={{marginLeft:'auto'}}>
          {token ? (
            <>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Login apiBase={API_BASE} onLogin={handleLogin} />
          )}
        </div>
      </header>

      <main style={{marginTop:20}}>
        {view === 'employees' && (
          <div>
            <h2>Employees</h2>
            <ul>
              {emps.map(e=> (
                <li key={e.id} style={{cursor:'pointer'}} onClick={()=>setSelected(e)}>{e.fullName} — {e.jobTitle}</li>
              ))}
            </ul>
            {selected && <EmployeeDetail employee={selected} apiBase={API_BASE} token={token} onClose={()=>setSelected(null)} />}
          </div>
        )}

        {view === 'insights' && (
          <div>
            <h2>Insights</h2>
            <Insights apiBase={API_BASE} token={token} />
          </div>
        )}
      </main>
    </div>
  )
}
