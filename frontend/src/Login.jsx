import React, { useState } from 'react'
import { apiFetch } from './lib/api'

export default function Login({ apiBase = '', onLogin }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { status, body } = await apiFetch(`${apiBase}/auth/login`, {
        method: 'POST',
        body: { username, password },
      })

      if (status === 200 && body && body.token) {
        onLogin(body.token)
      } else {
        setError(body && body.error ? body.error : `Login failed with status ${status}`)
      }
    } catch (err) {
      setError(err.message || 'Unable to login right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-visual">
          <div className="visual-badge">ACME</div>
          <h1>Compensation Command Center</h1>
          <p>Manage people, pay, and insights from one intelligent workspace.</p>
          <ul>
            <li>10k employee directory</li>
            <li>Salary history tracking</li>
            <li>Quick department insights</li>
          </ul>
        </div>

        <form className="login-form" onSubmit={submit}>
          <div className="form-header">
            <p className="eyebrow">SIGN IN</p>
            <h2>Welcome back</h2>
          </div>

          <label>
            <span>Username</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
          </label>

          <label>
            <span>Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              type="password"
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
