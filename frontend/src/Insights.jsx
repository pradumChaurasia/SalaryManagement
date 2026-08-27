import React, { useEffect, useState } from 'react'

export default function Insights({ apiBase = '', token = '' }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined

    fetch(`${apiBase}/insights/compensation/by-department`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setRows(data || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || String(err))
        setLoading(false)
      })
  }, [apiBase, token])

  if (loading) return <div className="empty-state">Loading insights…</div>
  if (error) return <div className="form-error">Error: {error}</div>

  const maxCount = Math.max(...rows.map((r) => Number(r.count) || 0), 1)

  return (
    <div className="insights-layout">
      <div className="panel-header compact">
        <div>
          <p className="eyebrow">ANALYTICS</p>
          <h3>Department pay mix</h3>
        </div>
      </div>

      <div className="insight-list">
        {rows.map((row) => {
          const count = Number(row.count) || 0
          const width = `${(count / maxCount) * 100}%`

          return (
            <div key={row.department} className="insight-row">
              <div className="insight-row-head">
                <span>{row.department}</span>
                <strong>{count.toLocaleString()}</strong>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width }} />
              </div>
              <div className="insight-row-foot">
                <span>Avg</span>
                <strong>
                  {Number(row.avgAnnual || 0).toLocaleString(undefined, {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
