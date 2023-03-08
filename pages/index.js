import { useState, useEffect } from 'react'
import { calculateMd, renderMd } from 'tiny-parser'
import Markdown from 'components/markdown'

// This is really just dedicated to accessing STATE & calling methods.
const Home = () => {
  const [code, setCode] = useState('')
  const [result, setResult] = useState('')
  const [resources, setResources] = useState({
    username: '',
    avatar: '',
    bio: '',
    scores: [500, 35, 274, 1204, 250],
    shape: {
      position: {
        x: 50,
        y: 100,
      },
      size: {
        w: 64,
        h: 64,
      },
    },
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
      <label htmlFor="username" style={{ display: 'block', marginTop: '1em' }}>Username:</label>
      <input type="text" id="username" name="username" value={resources.username} onChange={e => setResources({ ...resources, username: e.target.value })} style={{ display: 'block', marginTop: '0.5em' }} />
      <label htmlFor="avatar" style={{ display: 'block', marginTop: '1em' }}>Avatar:</label>
      <input type="text" id="avatar" name="avatar" value={resources.avatar} onChange={e => setResources({ ...resources, avatar: e.target.value })} style={{ display: 'block', marginTop: '0.5em' }} />
      <label htmlFor="bio" style={{ display: 'block', marginTop: '1em' }}>Bio:</label>
      <textarea rows="4" cols="50" id="bio" name="bio" value={resources.bio} onChange={e => setResources({ ...resources, bio: e.target.value })} style={{ display: 'block', marginTop: '0.5em' }} />
      <label htmlFor="md" style={{ display: 'block', marginTop: '1em' }}>Markdown:</label>
      <textarea rows="4" cols="50" type="text" id="md" name="md" value={code} onChange={handleChange} style={{ display: 'block', marginTop: '0.5em' }} />
      {/* <span style={{ display: 'block', marginTop: '1em' }}>Result:</span> */}
      {/* <span style={{ display: 'block', marginTop: '0.5em' }}>{result}</span> */}
      <Markdown resources={resources} setResources={setResources}>{result}</Markdown>
      {/* <div style={{ display: 'block', marginTop: '0.5em' }}>{result}</div> */}
    </div>
  )
}

export default Home
