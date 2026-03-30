import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="glow-circle"></div>
      <div>
        <h1>Project Nova</h1>
        <div className="card">
          <p style={{ fontSize: '1.25rem', color: '#f1f5f9', marginBottom: '2.5rem', fontWeight: 300, lineHeight: 1.6 }}>
            A high-performance modern web experience crafted with React, Vite, and TypeScript.
          </p>
          <button onClick={() => setCount((count) => count + 1)}>
            Initialize Sequence {count > 0 ? `| ${count}` : ''}
          </button>
          <p style={{ marginTop: '2.5rem', color: '#94a3b8', fontSize: '0.95rem' }}>
            Modify <code>src/App.tsx</code> to structure your dynamic content.
          </p>
        </div>
        <p className="read-the-docs">
          Engineered for aesthetics and efficiency
        </p>
      </div>
    </>
  )
}

export default App
