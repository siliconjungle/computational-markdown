class MdTokenizer {
  constructor(input) {
    this.tokens = []
    this.input = input
  }

  read() {
    while (!this.input.eof()) {
      const char = this.input.peek()

      if (char === '{') {
        this.input.next()
        // Reads until the next }
        this.readCode()
      } else {
        // Reads until the next {
        this.readMarkdown()
      }
    }

    return this.tokens
  }

  readMarkdown() {
    const markdown = this.readWhile((char) => {
      return char !== '{'
    })

    if (markdown !== '') {
      this.tokens.push({
        type: 'md',
        value: markdown,
      })
    }

    return this.tokens
  }

  readCode() {
    const code = this.readWhile((char) => {
      return char !== '}'
    })

    if (this.input.eof() || this.input.peek() !== '}') {
      throw new Error('Expected }')
    }

    this.input.next()

    if (code !== '') {
      this.tokens.push({
        type: 'code',
        value: code,
      })
    }

    return this.tokens
  }

  readWhile(predicate) {
    let str = ''
    let i = 0
    while (!this.input.eof() && predicate(this.input.peek(), i)) {
      str += this.input.next()
      ++i
    }
    return str
  }
}

export default MdTokenizer
