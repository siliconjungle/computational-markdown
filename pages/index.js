import { useState, useEffect } from 'react'
import { calculateMd, renderMd } from 'tiny-parser'
// import Markdown from 'components/markdown'

const Home = () => {
  const [code, setCode] = useState()
  const [result, setResult] = useState()
  const [resources, setResources] = useState({})

  const handleChange = async (e) => {
    setCode(e.target.value)
    // const res = await calculateMd(e.target.value)
    const res = await renderMd(e.target.value, resources, setResources)
    setResult(res)
  }

  useEffect(() => {
    renderMd(code, resources, setResources).then(res => {
      setResult(res)
    })
  }, [resources])

  return (
    <div>
      <label htmlFor="cell" style={{ display: 'block' }}>Markdown:</label>
      <textarea rows="4" cols="50" type="text" id="cell" name="cell" value={code} onChange={handleChange} style={{ display: 'block', marginTop: '0.5em' }} />
      <span style={{ display: 'block', marginTop: '1em' }}>Result:</span>
      {/* <span style={{ display: 'block', marginTop: '0.5em' }}>{result}</span> */}
      {/* <Markdown>{result}</Markdown> */}
      <div style={{ display: 'block', marginTop: '0.5em' }}>{result}</div>
    </div>
  )
}

export default Home
