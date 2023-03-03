class InputStream {
  constructor (input) {
    this.input = input
    this.pos = 0
  }

  next () {
    const char = this.input.charAt(this.pos)
    this.pos++
    return char
  }

  peek () {
    return this.input.charAt(this.pos)
  }

  eof () {
    return this.peek() === ''
  }

  croak (msg) {
    throw new Error(`${msg} (${this.pos})`)
  }
}

export default InputStream
