import './App.css'
import { useState } from 'react'
import { Resolver } from 'did-resolver'
import { getResolver } from 'web-did-resolver'

const webDidResolver = getResolver()
const didResolver = new Resolver(webDidResolver)
function App() {
  const [did, setDid] = useState('did:web:identity.foundation')
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
