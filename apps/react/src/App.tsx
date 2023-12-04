import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.scss'
import useUsers from './queries/users'

function App() {
  const [count, setCount] = useState(0)

  const usersQuery = useUsers({ with_posts: true })
  const usersQuery2 = useUsers({
    id_asc: true,
    name_desc: true,
    id_eq: 12345,
    id_gt: 123,
    or: [
      { id_gt: 1000 },
      { and: [{ id_eq: 123 }, { id_inArray: [1, 23, 34] }] },
    ],
    with_posts: {
      or: [
        { id_gt: 1000 },
        { and: [{ id_eq: 123 }, { id_inArray: [1, 23, 34] }] },
      ],
    },
    limit: 20,
    offset: 40,
  })

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel={'noreferrer'}>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
