let state = {}

export const setGameState = (key, value) => {
  state[key] = value
}

export const getGameState = (key) => {
  return state[key]
}

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

  setState(key, value) {
    this.state[key] = value
  }

  setPublished(published) {
    this.published = published
  }

  async init(canvas) {
    if (this.running === true) {
      return
    }

    this.running = true

    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.context.imageSmoothingEnabled = false

    this.lastTime = (new Date()).getTime()
    this.currentTime = 0
    this.dt = 0

    this.running = true
    window.requestAnimationFrame(this.update)
  }

  shutdown() {
    this.running = false
  }

  update() {
    this.currentTime = (new Date()).getTime()
    this.dt = (this.currentTime - this.lastTime) / 1000

    this.render()

    this.lastTime = this.currentTime

    if (this.running) {
      window.requestAnimationFrame(this.update)
    }
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.fillStyle = 'black'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.context.fillStyle = 'red'
    const entities = getGameState('entities') ?? []
    for (let i = 0; i < entities.length; ++i) {
      const entity = entities[i]
      this.context.fillRect(entity.x, entity.y, entity.w, entity.h)
    }
  }
}

export default Game
