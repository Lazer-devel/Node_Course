import { useRef } from 'react'

function QueryInput({ setOutput }) {
  const qeuryRef = useRef(null)

  const sendQueryHandle = async () => {
    let response
    try {
      response = await fetch('/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: qeuryRef.current.value }),
      })
    } catch (err) {
      console.log(err)
      return setOutput(err.message)
    }
    const result = await response.json()
    setOutput(result)
  }
  return (
    <div className="query__input-wrapper">
      <textarea className="query__input-content" ref={qeuryRef} />
      <div className="query__input-control">
        <button className="query__input-send-btn" onClick={sendQueryHandle}>
          Run
        </button>
      </div>
    </div>
  )
}

export default QueryInput
