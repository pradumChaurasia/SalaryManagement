export async function apiFetch(path, { method = 'GET', body, token, headers = {}, ...rest } = {}) {
  const opts = { method, headers: { ...headers }, ...rest };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(path, opts);
  const text = await res.text();
  try { return { status: res.status, body: text ? JSON.parse(text) : null }; } catch (e) { return { status: res.status, body: text }; }
}
