import { useState, useEffect } from 'react'
import { calculateMd, renderMd } from 'tiny-parser'
import Markdown from 'components/markdown'

const Home = () => {
  const [code, setCode] = useState('')
  const [result, setResult] = useState('')
  const [resources, setResources] = useState({
    a: '',
    b: '',
    c: '',
    d: [5, 3, 2, 1, 4],
  })

  const handleChange = (e) => {
    setCode(e.target.value)
    const res = calculateMd(e.target.value, resources, setResources, false, e.target.value)
  //   // const res = await renderMd(e.target.value, resources, setResources)
    setResult(res)
  }

  useEffect(() => {
    // renderMd(code, resources, setResources).then(res => {
    //   setResult(res)
    // })
    // setCode(e.target.value)
    // const res = calculateMd(e.target.value, resources, setResources)
    // const res = await renderMd(e.target.value, resources, setResources)
    // setResult(res)
    const res = calculateMd(code, resources, setResources, false, code)
    setResult(res)
  }, [resources])

  return (
    <div>
      <div>
        {JSON.stringify(resources)}
      </div>
      <label htmlFor="a" style={{ display: 'block', marginTop: '1em' }}>A:</label>
      <input type="text" id="a" name="a" value={resources.a} onChange={e => setResources({ ...resources, a: e.target.value })} style={{ display: 'block', marginTop: '0.5em' }} />
      <label htmlFor="b" style={{ display: 'block', marginTop: '1em' }}>B:</label>
      <input type="text" id="b" name="b" value={resources.b} onChange={e => setResources({ ...resources, b: e.target.value })} style={{ display: 'block', marginTop: '0.5em' }} />
      <label htmlFor="c" style={{ display: 'block', marginTop: '1em' }}>C:</label>
      <input type="text" id="c" name="c" value={resources.c} onChange={e => setResources({ ...resources, c: e.target.value })} style={{ display: 'block', marginTop: '0.5em' }} />
      <label htmlFor="cell" style={{ display: 'block', marginTop: '1em' }}>Markdown:</label>
      <textarea rows="4" cols="50" type="text" id="cell" name="cell" value={code} onChange={handleChange} style={{ display: 'block', marginTop: '0.5em' }} />
      {/* <span style={{ display: 'block', marginTop: '1em' }}>Result:</span> */}
      {/* <span style={{ display: 'block', marginTop: '0.5em' }}>{result}</span> */}
      <Markdown resources={resources} setResources={setResources}>{result}</Markdown>
      {/* <div style={{ display: 'block', marginTop: '0.5em' }}>{result}</div> */}
    </div>
  )
}

export default Home
