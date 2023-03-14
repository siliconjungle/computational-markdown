// import { nanoid } from 'nanoid'
// import Kernal from './networking/kernal'
// import Client from './networking/client'
// import { createMessage } from './networking/messages'

export const createImageData = (ctx, width, height) => {
  const imgData = ctx.createImageData(width, height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = 0
    imgData.data[i + 1] = 0
    imgData.data[i + 2] = 0
    imgData.data[i + 3] = 255
  }

  return imgData
}

// This is for networking.
// export const getIndexFromXY = (x, y, width, height) => {
//   if (x < 0 || x >= width || y < 0 || y >= height) {
//     return -1
//   }

//   return (Math.floor(x) + Math.floor(y) * width)
// }

export const getMousePosition = (e, canvas) => {
  const rect = canvas.getBoundingClientRect()
  const x = (e.clientX - rect.left) / canvas.scrollWidth * canvas.width
  const y = (e.clientY - rect.top) / canvas.scrollHeight * canvas.height

  return { x, y }
}

// this.canvas.addEventListener('mousemove', e => {
//   const { x, y } = handleMouseMove(e, this.canvas)
// }, false)

// this.canvas.addEventListener('mousedown', e => {
//   const { x, y } = handleMouseDown(e, this.canvas)
// }, false)

// mouseclick
// mousedown
// mouseout
// mouseup

class Game {
  constructor() {
    this.lastTime = (new Date()).getTime()
    this.currentTime = 0
    this.dt = 0
    this.running = false

    this.init = this.init.bind(this)
    this.shutdown = this.shutdown.bind(this)
    this.update = this.update.bind(this)
    this.render = this.render.bind(this)
  }

  async init (canvas, canvasData) {
    if (this.running === true) {
      return
    }

    this.running = true

    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.context.imageSmoothingEnabled = false

    this.canvasData = canvasData

    // this.agentId = nanoid()

    // const client = new Client()
    // client.init()

    // this.client = client

    // this.kernal = new Kernal()

    // client.on('open', () => {
    //   const snapshotOps = this.kernal.getSnapshotOps()
    //   if (snapshotOps.length > 0) {
    //     client.addMessage(createMessage.patch(snapshotOps))
    //   }
    // })

    // client.on('message', message => {
    //   if (message.type === 'patch') {
    //     this.kernal.applyOps(message.ops, false)
    //   }
    // })

    // this.kernal.on('ops', this.receiveOps)

    this.lastTime = (new Date()).getTime()
    this.currentTime = 0
    this.dt = 0

    this.running = true
    window.requestAnimationFrame(this.update)
  }

  shutdown = () => {
    this.running = false
    this.kernal.off('ops', this.receiveOps)
    this.client?.shutdown()
  }

  update = () => {
    this.currentTime = (new Date()).getTime()
    this.dt = (this.currentTime - this.lastTime) / 1000

    this.render()

    this.lastTime = this.currentTime

    if (this.running) {
      window.requestAnimationFrame(this.update)
    }
  }

  // sendIndex = (x, y, color) => {
  //   if (this.canvas === undefined) {
  //     return
  //   }

  //   const index = getIndexFromXY(x, y, this.canvas.width, this.canvas.height)

  //   const ops = []

  //   ops.push({
  //     version: [this.kernal.latestSeq, this.agentId],
  //     id: 'pixels',
  //     fields: [index],
  //     values: [color],
  //   })

  //   const patch = createMessage.patch(ops)
  //   this.client.addMessage(patch)
  // }

  setPixel = (imgData, x, y, color /* , send = true */) => {
    if (x < 0 || x >= imgData.width || y < 0 || y >= imgData.height) {
      return
    }
    const index = (Math.floor(x) + Math.floor(y) * imgData.width) * 4
  
    imgData.data[index] = color.r
    imgData.data[index + 1] = color.g
    imgData.data[index + 2] = color.b
    imgData.data[index + 3] = color.a

    // if (send) {
    //   this.sendIndex(x, y, color)
    // }
  }
  
  getPixel = (imgData, x, y) => {
    if (x < 0 || x >= imgData.width || y < 0 || y >= imgData.height) {
      return
    }
    const index = (Math.floor(x) + Math.floor(y) * imgData.width) * 4
  
    return [
      imgData.data[index],
      imgData.data[index + 1],
      imgData.data[index + 2],
      imgData.data[index + 3],
    ]
  }

  // receiveOps = (filteredOps) => {
  //   for (const op of filteredOps) {
  //     if (op.id === 'pixels') {
  //       // Loop through the fields and values.
  //       for (let i = 0; i < op.fields.length; i++) {
  //         const index = op.fields[i]
  //         const color = op.values[i]

  //         const x = index % this.canvas.width
  //         const y = Math.floor(index / this.canvas.width)

  //         this.setPixel(this.canvasData, x, y, color, false)
  //       }
  //     }
  //   }
  // }

  render = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.context.putImageData(this.canvasData, 0, 0)
  }
}

export default Game
