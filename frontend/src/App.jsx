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
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(()=>{
    if (view !== 'employees') return
    apiFetch(`${API_BASE}/employees?page=${page}&limit=${limit}`, { token })
      .then(r=> r.body)
      .then(d=> {
        setEmps(d ? d.items || [] : [])
        setTotal(d ? d.total || 0 : 0)
      })
      .catch(()=>{})
  },[view, token, page, limit])

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
            <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}>
              <input placeholder="Search name or job" value={search} onChange={e=>setSearch(e.target.value)} />
              <div style={{marginLeft:'auto'}}>
                <button onClick={()=> setPage(Math.max(1,page-1))} disabled={page<=1}>Prev</button>
                <span style={{margin:'0 8px'}}>Page {page} — {Math.min(total, page*limit)} / {total.toLocaleString()}</span>
                <button onClick={()=> setPage(page+1)} disabled={page*limit >= total}>Next</button>
              </div>
            </div>
            <ul>
              {emps.filter(e => !search || (e.fullName || '').toLowerCase().includes(search.toLowerCase()) || (e.jobTitle||'').toLowerCase().includes(search.toLowerCase()))
                .map(e=> (
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
