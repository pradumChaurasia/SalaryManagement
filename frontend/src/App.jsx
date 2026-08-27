import React, { useEffect, useMemo, useState } from 'react'
import Insights from './Insights'
import EmployeeDetail from './EmployeeDetail'
import Login from './Login'
import { useTheme } from './ThemeContext'
import { apiFetch } from './lib/api'

const sortOptions = [
  { label: 'Name', value: 'fullName' },
  { label: 'Department', value: 'department' },
  { label: 'Job title', value: 'jobTitle' },
  { label: 'Country', value: 'country' },
]

export default function App() {
  const [view, setView] = useState('employees')
  const [emps, setEmps] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('fullName')
  const [sortDir, setSortDir] = useState('asc')
  const { theme, toggleTheme } = useTheme()

  const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

  useEffect(() => {
    if (!token || view !== 'employees') return

    const q = encodeURIComponent(search || '')
    apiFetch(`${API_BASE}/employees?page=${page}&limit=${limit}&q=${q}`, { token })
      .then((r) => r.body)
      .then((d) => {
        setEmps(d ? d.items || [] : [])
        setTotal(d ? d.total || 0 : 0)
      })
      .catch(() => {
        setEmps([])
        setTotal(0)
      })
  }, [view, token, page, limit, search, API_BASE])

  function handleLogin(t) {
    setToken(t)
    localStorage.setItem('token', t)
  }

  function logout() {
    setToken('')
    localStorage.removeItem('token')
    setSelected(null)
    setView('employees')
  }

  const sortedEmployees = useMemo(() => {
    const next = [...emps]
    next.sort((a, b) => {
      const left = (a[sortBy] || '').toString().toLowerCase()
      const right = (b[sortBy] || '').toString().toLowerCase()
      if (left < right) return sortDir === 'asc' ? -1 : 1
      if (left > right) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return next
  }, [emps, sortBy, sortDir])

  const filteredEmployees = useMemo(() => {
    const value = search.trim().toLowerCase()
    if (!value) return sortedEmployees

    return sortedEmployees.filter((employee) => {
      const haystack = [
        employee.fullName,
        employee.jobTitle,
        employee.department,
        employee.country,
        employee.employeeCode,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(value)
    })
  }, [sortedEmployees, search])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const stats = [
    { label: 'Total employees', value: total ? total.toLocaleString() : '—', tone: 'primary' },
    { label: 'Visible rows', value: filteredEmployees.length.toLocaleString(), tone: 'green' },
    { label: 'Current page', value: `${page}/${totalPages}`, tone: 'amber' },
    { label: 'Search', value: search ? 'Filtered' : 'All', tone: 'purple' },
  ]

  if (!token) {
    return <Login apiBase={API_BASE} onLogin={handleLogin} />
  }

  return (
    <div className="app-shell">
      <div className="dashboard-shell">
        <aside className="sidebar">
          <div className="brand-wrap">
            <div className="brand-mark">A</div>
            <div>
              <p className="eyebrow">HR OPERATIONS</p>
              <h2>ACME</h2>
            </div>
          </div>

          <nav className="nav">
            <button
              type="button"
              className={view === 'employees' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setView('employees')}
            >
              Employees
            </button>
            <button
              type="button"
              className={view === 'insights' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setView('insights')}
            >
              Insights
            </button>
          </nav>

          <div className="sidebar-card">
            <p className="eyebrow">TEAM</p>
            <h3>HR Manager</h3>
            <p>Compensation overview and salary actions at a glance.</p>
          </div>
        </aside>

        <main className="main-panel">
          <header className="topbar">
            <div>
              <p className="eyebrow">Dashboard</p>
              <h1>Salary overview</h1>
            </div>

            <div className="user-badge">
              <span className="user-dot" />
              <span>HR Team</span>
              <button type="button" className="theme-toggle" onClick={toggleTheme}>
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button type="button" className="logout-btn" onClick={logout}>Logout</button>
            </div>
          </header>

          <section className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className={`stat-card ${stat.tone}`}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </section>

          {view === 'employees' ? (
            <section className="panel employees-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Directory</p>
                  <h3>Employee records</h3>
                </div>

                <div className="search-box">
                  <span>⌕</span>
                  <input
                    type="text"
                    value={search}
                    placeholder="Search employee, title or department"
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                  />
                </div>
              </div>

              <div className="toolbar">
                <div className="toolbar-left">
                  <span className="pill">{total.toLocaleString()} total</span>
                  <label className="sort-control">
                    <span>Sort by</span>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="sort-btn"
                    onClick={() => setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'))}
                  >
                    {sortDir === 'asc' ? 'Asc ↑' : 'Desc ↓'}
                  </button>
                </div>

                <div className="pager">
                  <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                    Previous
                  </button>
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>
                    Next
                  </button>
                </div>
              </div>

              <div className="employee-list">
                {filteredEmployees.length ? (
                  filteredEmployees.map((employee) => (
                    <button
                      key={employee.id}
                      type="button"
                      className={selected && selected.id === employee.id ? 'employee-item selected' : 'employee-item'}
                      onClick={() => setSelected(employee)}
                    >
                      <div className="employee-avatar">
                        {employee.fullName
                          .split(' ')
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join('')
                          .toUpperCase() || 'E'}
                      </div>

                      <div className="employee-meta">
                        <strong>{employee.fullName}</strong>
                        <span>{employee.jobTitle}</span>
                        <small>
                          {employee.country} • {employee.department}
                        </small>
                      </div>

                      <span className="status-badge">{employee.status || 'active'}</span>
                    </button>
                  ))
                ) : (
                  <div className="empty-state">No employees match the current filters.</div>
                )}
              </div>

              {selected && (
                <EmployeeDetail
                  employee={selected}
                  apiBase={API_BASE}
                  token={token}
                  onClose={() => setSelected(null)}
                />
              )}
            </section>
          ) : (
            <section className="panel insights-panel">
              <Insights apiBase={API_BASE} token={token} />
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

