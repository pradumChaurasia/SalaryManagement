import React, { useEffect, useState } from 'react'

export default function App(){
  const [emps, setEmps] = useState([])

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(()=>{
    fetch(`${API_BASE}/employees?limit=20`)
      .then(r=>r.json())
      .then(d=> setEmps(d.items || []))
      .catch(()=>{})
  },[])

  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h1>Employees</h1>
      <ul>
        {emps.map(e=> (
          <li key={e.id}>{e.fullName} — {e.jobTitle}</li>
        ))}
      </ul>
    </div>
  )
}
