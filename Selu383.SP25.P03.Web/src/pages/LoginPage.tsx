import { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin() {
    fetch('/api/authentication/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: username, password }),
      credentials: 'include', 
    })
      .then(r => {
        if (!r.ok) throw new Error('Login failed')
        return r.json()
      })
      .then(data => {
        console.log('Logged in as', data)
      })
      .catch(err => console.error(err))
  }

  return (
    <div>
      <h1>Sign In</h1>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
