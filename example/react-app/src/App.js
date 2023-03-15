import './App.css'
import { useState } from 'react'
import { Resolver } from 'did-resolver'
import { getResolver } from 'peer-did-resolver'

const webDidResolver = getResolver()
const didResolver = new Resolver(webDidResolver)
function App() {
  const [did, setDid] = useState('did:peer:2.Ez6LSpSrLxbAhg2SHwKk7kwpsH7DM7QjFS5iK6qP87eViohud.Vz6MkqRYqQiSgvZQdnBytw86Qbs2ZWUkGv22od935YF4s8M7V.SeyJ0IjoiZG0iLCJzIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9lbmRwb2ludDEiLCJyIjpbImRpZDpleGFtcGxlOnNvbWVtZWRpYXRvciNzb21la2V5MSJdLCJhIjpbImRpZGNvbW0vdjIiLCJkaWRjb21tL2FpcDI7ZW52PXJmYzU4NyJdfQ')
  const [resolved, setResolved] = useState()
  return (
    <div className="App">
      <label>DID:</label>
      <input
        type="text"
        value={did}
        onChange={(event) => {
          setDid(event.target.value)
        }}
      />
      <button
        className="App-button"
        type="submit"
        onClick={() => {
          didResolver
            .resolve(did)
            .then((res) => {
              console.log('resolved data', res)
              setResolved(true)
            })
            .catch((err) => {
              console.error('failed to resolve', err)
              setResolved(false)
            })
        }}
      >
        resolve
      </button>
      <p>
        {resolved === true && `resolved ${did}`}
        {resolved === false && `failed to resolve ${did}`}
      </p>
    </div>
  )
}

export default App
