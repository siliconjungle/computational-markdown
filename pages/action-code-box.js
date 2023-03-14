import { useState, useRef, useEffect } from 'react'
import Game, { setGameState } from 'core/game2'
import { getQuickJS, shouldInterruptAfterDeadline } from 'quickjs-emscripten'

const isValidKey = (key) => {
  // Check if key is a string
  if (typeof key !== 'string') {
    return false
  }

  // Check if key is a reserved property of Object.prototype
  if (Object.prototype.hasOwnProperty(key)) {
    return false
  }

  // Check if key starts with "__" or "$$"
  if (key.startsWith('__') || key.startsWith('$$')) {
    return false
  }

  // Check if key contains any invalid characters
  if (!/^[a-zA-Z0-9_$]+$/.test(key)) {
    return false
  }

  // Key is valid
  return true
}

const game = new Game()

const CodeBox = () => {
  const [QuickJS, setQuickJS] = useState(null)
  const [code, setCode] = useState('')
  const [resources, setResources] = useState({})
  const canvasRef = useRef()

  const setState = (key, value) => {
    if (!isValidKey(key)) {
      throw new Error(`Invalid key: ${key}`)
    }

    setResources({ ...resources, [key]: value })
    setGameState(key, value)
  }

  const handleChange = (e) => {
    setCode(e.target.value)
  }

  const handleExecute = (e) => {
    if (!QuickJS) return
    try {
      const vm = QuickJS.newContext()

      const setHandle = vm.newFunction('set', (...args) => {
        const nativeArgs = args.map(vm.dump)
        setState(...nativeArgs)
      })

      const getHandle = vm.newFunction('get', (...args) => {
        const nativeArgs = args.map(vm.dump)
        const key = nativeArgs[0]
        if (!isValidKey(key)) {
          throw new Error(`Invalid key: ${key}`)
        }

        return vm.newNumber(resources[key])
      })

      const stateHandle = vm.newObject()
      vm.setProp(stateHandle, 'set', setHandle)
      vm.setProp(stateHandle, 'get', getHandle)
      vm.setProp(vm.global, 'state', stateHandle)
      stateHandle.dispose()
      setHandle.dispose()
      getHandle.dispose()

      const result = vm.evalCode(code, {
        shouldInterrupt: shouldInterruptAfterDeadline(Date.now() + 1000),
        memoryLimitBytes: 1024 * 1024,
      })

      if (result.error) {
        console.log('Execution failed:', vm.dump(result.error))
        result.error.dispose()
      } else {
        console.log('Success:', vm.dump(result.value))
        result.value.dispose()
      }
      vm.dispose()
    } catch (e) {
      console.log('_ERROR_', e)
    }
  }

  useEffect(() => {
    getQuickJS().then((QuickJS) => {
      setQuickJS(QuickJS)
    })
  }, [])

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
      <p>{JSON.stringify(resources)}</p>
      <label htmlFor="code" style={{ display: 'block', marginTop: '1em' }}>Action:</label>
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
