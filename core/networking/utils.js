export const fromPositionToIndex = ({ x, y, z }, height, depth) =>
  x * (height * depth) + y * depth + z

// int index = x | y << 4 | z << 8;
// int x = index & 0xf;
// int y = (index >> 4) & 0xf;
// int z = (index >> 8) & 0xf;

// 0 empty, 1 solid

export const fromIndexToPosition = (index, height, depth) => {
  const x = Math.floor(index / (height * depth))
  const y = Math.floor((index % (height * depth)) / depth)
  const z = index % depth

  return { x, y, z }
}

export const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const throttle = (fn, delay = 1000) => {
  let shouldWait = false
  let waitingArgs
  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false
    } else {
      fn(...waitingArgs)
      waitingArgs = null
      setTimeout(timeoutFunc, delay)
    }
  }

  return (...args) => {
    if (shouldWait) {
      waitingArgs = args
      return
    }

    fn(...args)
    shouldWait = true
    setTimeout(timeoutFunc, delay)
  }
}

export const perf = (fn, name) => {
  const start = performance.now()
  fn()
  const end = performance.now()
  const ms = end - start
  console.log(`${name || 'Function call'}: ${ms}ms`)
}

export const heartbeat = (fn, delay = 1000) => {
  const running = fn()
  if (running === true) {
    setTimeout(() => {
      heartbeat(fn, delay)
    }, delay)
  }
}

export const randomHeartbeat = (fn, min = 5, max = 500) => {
  const running = fn()
  if (running === true) {
    setTimeout(() => {
      randomHeartbeat(fn, min, max)
    }, getRandomInt(min, max))
  }
}

export const distance = (vec1, vec2) => {
  // Calculate the difference between the x, y, and z coordinates of the two vectors
  const dx = vec1.x - vec2.x
  const dy = vec1.y - vec2.y
  const dz = vec1.z - vec2.z

  // Use the Pythagorean theorem to calculate the distance between the two vectors
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
