import { shouldInterruptAfterDeadline } from 'quickjs-emscripten'

export const handleExecute = (e, canvasData, QuickJS, code, game, setState, _state) => {
  if (!QuickJS) return
  try {
    const vm = QuickJS.newContext()

    const setPixelHandle = vm.newFunction('set', (...args) => {
      const nativeArgs = args.map(vm.dump)
      const [x, y, color] = nativeArgs
      game.setPixel(canvasData, x, y, color)
    })

    const getPixelHandle = vm.newFunction('get', (...args) => {
      const nativeArgs = args.map(vm.dump)
      const [x, y] = nativeArgs
      const colorObj = vm.newObject()
      const color = game.getPixel(canvasData, x, y)
      const [r, g, b, a] = color
      vm.setProp(colorObj, 'r', vm.newNumber(r))
      vm.setProp(colorObj, 'g', vm.newNumber(g))
      vm.setProp(colorObj, 'b', vm.newNumber(b))
      vm.setProp(colorObj, 'a', vm.newNumber(a))

      return colorObj
    })

    let stateChanged = false
    let state = _state

    console.log('_STATE_', state)

    const getStateAtPathLocal = (path) => {
      let current = state
      for (let i = 0; i < path.length; i++) {
        const key = path[i]
        if (!current[key]) {
          return null
        }
        current = current[key]
      }
  
      return current
    }

    const setStateAtPathLocal = (path, value) => {
      if (path.length === 0) {
        throw new Error('Cannot set state at path []')
      }

      if (stateChanged === false) {
        stateChanged = true
        state = JSON.parse(JSON.stringify(state))
      }
    
      let current = state
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i]
        if (!current[key]) {
          current[key] = {}
        }
        current = current[key]
      }

      if (path.length === 0) {
        state = value
      } else {
        current[path[path.length - 1]] = value
      }
  
      return state
    }

    const setStateHandle = vm.newFunction('setState', (...args) => {
      const nativeArgs = args.map(vm.dump)
      const [path, value] = nativeArgs
      setStateAtPathLocal(path, value)
    })

    const getStateHandle = vm.newFunction('getState', (...args) => {
      const nativeArgs = args.map(vm.dump)
      const [path] = nativeArgs
      const value = getStateAtPathLocal(path)
      return vm.newString(JSON.stringify(value))
    })

    const logHandle = vm.newFunction('log', (...args) => {
      const nativeArgs = args.map(vm.dump)
      console.log('QuickJS:', ...nativeArgs)
    })

    const consoleHandle = vm.newObject()
    vm.setProp(consoleHandle, 'log', logHandle)
    vm.setProp(vm.global, 'console', consoleHandle)
    consoleHandle.dispose()
    logHandle.dispose()

    const pixelHandle = vm.newObject()
    vm.setProp(pixelHandle, 'set', setPixelHandle)
    vm.setProp(pixelHandle, 'get', getPixelHandle)
    vm.setProp(vm.global, 'pixel', pixelHandle)
    pixelHandle.dispose()
    setPixelHandle.dispose()
    getPixelHandle.dispose()

    const stateHandle = vm.newObject()
    vm.setProp(stateHandle, 'set', setStateHandle)
    vm.setProp(stateHandle, 'get', getStateHandle)
    vm.setProp(vm.global, 'state', stateHandle)
    stateHandle.dispose()
    setStateHandle.dispose()
    getStateHandle.dispose()

    const eventHandle = vm.newObject()
    const typeHandle = vm.newString(e.type)
    vm.setProp(eventHandle, 'type', typeHandle)

    const validEvents = [
      'mousemove',
      'mousedown',
      'mouseup',
      'mouseout',
      'click',
      'mouseenter',
      'mouseleave',
    ]

    if (validEvents.includes(e.type)) {
      const xHandle = vm.newNumber(e.x)
      const yHandle = vm.newNumber(e.y)
      vm.setProp(eventHandle, 'x', xHandle)
      vm.setProp(eventHandle, 'y', yHandle)
      xHandle.dispose()
      yHandle.dispose()
    }

    const validKeyEvents = [
      'keydown',
      'keyup',
    ]

    if (validKeyEvents.includes(e.type)) {
      const keyHandle = vm.newString(e.key)
      vm.setProp(eventHandle, 'key', keyHandle)
      keyHandle.dispose()
    }

    vm.setProp(vm.global, 'event', eventHandle)
    eventHandle.dispose()
    typeHandle.dispose()

    const result = vm.evalCode(code, {
      shouldInterrupt: shouldInterruptAfterDeadline(Date.now() + 1000),
      memoryLimitBytes: 1024 * 1024,
    })

    if (result.error) {
      console.log('Execution failed:', vm.dump(result.error))
      result.error.dispose()
    } else {
      // console.log('Success:', vm.dump(result.value))
      result.value.dispose()
    }
    vm.dispose()

    if (stateChanged) {
      setState(state)
    }
  } catch (e) {
    console.log('_ERROR_', e)
  }
}
