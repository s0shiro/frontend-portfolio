import { Outlet, Link } from '@tanstack/react-router'

function App() {
  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </div>
      <hr />
      <Outlet />
    </>
  )
}

export default App
