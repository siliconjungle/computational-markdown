// If starts with =, then it's a formula
// Otherwise it's a value
class Tokenizer {
  constructor(input) {
    this.tokens = []
    this.input = input
  }

  read() {
    if (this.input.eof()) {
      return this.tokens
    }

    const char = this.input.peek()

    if (char === '=') {
      this.input.next()
      return this.readFormula()
    } else {
      return this.readValue()
    }
  }

  readFormula() {
    while (!this.input.eof()) {
      const token = this.readNext()
      if (token) {
        this.tokens.push(token)
      }
    }

    return this.tokens
  }

  readValue() {
    const token = {
      type: 'value',
      value: this.input.input,
    }

    this.tokens.push(token)

    return this.tokens
  }

  isWhitespace(char) {
    return ' \t\n'.indexOf(char) >= 0
  }

  isDigit(char) {
    return char === '-' || /[0-9]/i.test(char)
  }

  isPunc(char) {
    return '(),-'.indexOf(char) >= 0
  }

  isUpperString(char) {
    return /[A-Z]/.test(char)
  }

  readNumber() {
    let hasDot = false

    let number = this.readWhile((char, i) => {
      if (i === 0) {
        if (char === '-') return true
        if (char === '.') {
          this.input.croak(`Expected a number before '.'`)
          return false
        }
      }

      if (char === '.') {
        if (hasDot) {
          this.input.croak(`Expected a number after '.'`)
          return false
        }
        hasDot = true
        return true
      }

      if (char === '-') {
        this.input.croak(`Expected '-' at the beginning of the number`)
        return false
      }

      return this.isDigit(char)
    })

    if (number === '-') {
      this.input.croak(`Expected a number after '-'`)
    }

    return { type: 'num', value: parseFloat(number) }
  }

  readFunc() {
    let str = this.readWhile(this.isUpperString)
    return {
      type: 'func',
      value: str,
    }
  }

  readString() {
    this.input.next()
    let str = ''
    while (this.input.peek() !== `'`) {
      if (this.input.eof()) {
        this.input.croak(`String not closed`)
        return null
      }
      str += this.input.next()
    }

    this.input.next()

    return {
      type: 'str',
      value: str,
    }
  }

  readNext() {
    this.readWhile(this.isWhitespace)
    if (this.input.eof()) {
      return null
    }

    let char = this.input.peek()

    if (this.isDigit(char)) {
      return this.readNumber()
    }

    if (this.isPunc(char)) {
      this.input.next()
      return {
        type: 'punc',
        value: char,
      }
    }

    if (this.isUpperString(char)) {
      return this.readFunc()
    }

    if (char === `'`) {
      return this.readString()
    }

    this.input.croak(`Can't handle character: ${char}`)
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

export default Tokenizer
