import { useState, useRef, useEffect } from 'react'
import { getQuickJS } from 'quickjs-emscripten'
import Game, {
  createImageData,
  getMousePosition,
} from 'core/game3'
import CodeEditor from 'components/code-editor'
import { handleExecute } from 'core/code-execution'

const game = new Game()

const CodeBox = () => {
  const [state, setState] = useState({})
  const [filename, setFilename] = useState('')
  const [resources, setResources] = useState({})
  const [QuickJS, setQuickJS] = useState(null)
  const [code, setCode] = useState('')
  const [canvasData, setCanvasData] = useState(null)
  const canvasRef = useRef()

  // const setStateAtPath = (path, value) => {
  //   let newState = {
  //     ...state,
  //   }

  //   let current = newState
  //   for (let i = 0; i < path.length - 1; i++) {
  //     const key = path[i]
  //     if (!current[key]) {
  //       current[key] = {}
  //     }
  //     current = current[key]
  //   }

  //   current[path[path.length - 1]] = value
  //   setState(newState)

  //   return newState
  // }

  // const getStateAtPath = (path) => {
  //   let current = state
  //   for (let i = 0; i < path.length; i++) {
  //     const key = path[i]
  //     if (!current[key]) {
  //       return null
  //     }
  //     current = current[key]
  //   }

  //   return current
  // }

  const handleChange = (e) => {
    setCode(e)
  }

  const handleRun = (e) => {
    if (!canvasRef.current) {
      return
    }

    const event = {
      type: 'execute',
    }

    handleExecute(event, canvasData, QuickJS, code, game, setState, state)
  }

  useEffect(() => {
    getQuickJS().then((QuickJS) => {
      setQuickJS(QuickJS)
    })
  }, [])

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      const canvasData = createImageData(context, 640, 480)
      setCanvasData(canvasData)

      game.init(canvasRef.current, canvasData)

      return () => {
        game.shutdown()
      }
    }
  }, [canvasRef])

  const handleEvent = (e) => {
    if (!canvasRef.current) {
      return
    }
    const { x, y } = getMousePosition(e, canvasRef.current)
    const event = {
      type: e.type,
      x,
      y,
    }

    handleExecute(event, canvasData, QuickJS, code, game, setState, state)
  }

  const handleKeyEvent = (e) => {
    if (!canvasRef.current) {
      return
    }
    const event = {
      type: e.type,
      key: e.key,
    }

    handleExecute(event, canvasData, QuickJS, code, game, setState, state)
  }

  const handleFilenameChange = (e) => {
    setFilename(e.target.value)
    setCode(resources[e.target.value] || '')
  }

  const handleSave = (e) => {
    setResources({
      ...resources,
      [filename]: code,
    })
  }

  return (
    <div>
      <p>
        {Object.keys(resources).map(resource => (
          <button
            key={resource}
            onClick={() => {
              setFilename(resource)
              setCode(resources[resource])
            }}
          >
            {resource}
          </button>
        ))}
      </p>
      <p>
        {JSON.stringify(state)}
      </p>
      <label htmlFor="file" style={{ display: 'block', marginTop: '1em' }}>
        File Name
      </label>
      <input
        type="text"
        id="file"
        name="file"
        value={filename}
        onChange={handleFilenameChange}
        style={{ display: 'block', marginTop: '0.5em' }}
      />
      <CodeEditor
        value={code}
        onChange={handleChange}
      />
      <div style={{ display: 'block', marginTop: '1em' }}>
        <button onClick={handleSave}>
          Save
        </button>
        <button onClick={handleRun} style={{ marginLeft: '0.5em' }}>
          Execute
        </button>
      </div>
      <canvas
        id="game"
        ref={canvasRef}
        border="1px"
        width={640}
        height={480}
        // width={255}
        // height={255}
        style={{
          imageRendering: 'pixelated',
          marginTop: '1em',
          borderRadius: 4,
        }}
        tabIndex={1}
        onMouseMove={(e) => handleEvent(e)}
        onMouseDown={(e) => handleEvent(e)}
        onMouseUp={(e) => handleEvent(e)}
        onMouseOut={(e) => handleEvent(e)}
        onClick={(e) => handleEvent(e)}
        onMouseEnter={(e) => handleEvent(e)}
        onMouseLeave={(e) => handleEvent(e)}
        onKeyDown={(e) => handleKeyEvent(e)}
        onKeyUp={(e) => handleKeyEvent(e)}
      >
        Canvas not supported by your browser.
      </canvas>
    </div>
  )
}

export default CodeBox
