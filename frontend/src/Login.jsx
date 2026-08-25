import React, { useState } from 'react'
import { apiFetch } from './lib/api'

export default function Login({ apiBase = '', onLogin }){
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState(null)

  async function submit(e){
    e.preventDefault()
    setError(null)
    const { status, body } = await apiFetch(`${apiBase}/auth/login`, { method: 'POST', body: { username, password } })
    if (status === 200 && body && body.token) {
      onLogin(body.token)
    } else {
      setError(body && body.error ? body.error : `status ${status}`)
    }
  }

  return (
    <form onSubmit={submit} style={{display:'inline-block',marginLeft:12}}>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
      <button type="submit">Login</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  )
}
