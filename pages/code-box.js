import { useState, useRef, useEffect } from 'react'
import Game from 'core/game'

const game = new Game()

const CodeBox = () => {
  const [code, setCode] = useState('')
  const canvasRef = useRef()

  const handleChange = (e) => {
    setCode(e.target.value)
  }

  const handleExecute = (e) => {
    game.setPublished(code)
  }

  useEffect(() => {
    if (canvasRef.current) {
      game.init(canvasRef.current)

      return () => {
        game.shutdown()
      }
    }
  }, [canvasRef])

  return (
    <div>
      <label htmlFor="code" style={{ display: 'block', marginTop: '1em' }}>Update loop:</label>
      <textarea
        rows="4"
        cols="50"
        id="code"
        name="code"
        value={code}
        onChange={handleChange}
        style={{ display: 'block', marginTop: '0.5em' }}
      />
      <button onClick={handleExecute} style={{ display: 'block', marginTop: '1em' }}>
        Execute
      </button>
      <canvas
        id="game"
        ref={canvasRef}
        border="1px"
        width={640}
        height={480}
        style={{
          imageRendering: 'pixelated',
          marginTop: '1em',
          borderRadius: 4,
        }}
        tabIndex={1}
      >
        Canvas not supported by your browser.
      </canvas>
    </div>
  )
}

export default CodeBox
