class Parser {
  constructor(tokens) {
    this.tokens = tokens
  }

  eof() {
    return this.tokens.length === 0
  }

  isValue() {
    return this.tokens[0].type === 'value'
  }

  isNum() {
    return this.tokens[0].type === 'num'
  }

  isStr() {
    return this.tokens[0].type === 'str'
  }

  isFunc() {
    return this.tokens[0].type === 'func'
  }

  isOpenParen() {
    return this.tokens[0].type === 'punc' && this.tokens[0].value === '('
  }

  isCloseParen() {
    return this.tokens[0].type === 'punc' && this.tokens[0].value === ')'
  }

  isComma() {
    return this.tokens[0].type === 'punc' && this.tokens[0].value === ','
  }

  isArg() {
    return this.isFunc() || this.isNum() || this.isStr()
  }

  parseFunction() {
    const token = this.tokens.shift()

    const args = []

    if (!this.isOpenParen()) {
      throw new Error('Expected an opening parenthesis')
    }
    
    this.tokens.shift()
    let index = 0

    while (!this.isCloseParen()) {
      if (this.eof()) {
        throw new Error('Expected a closing parenthesis')
      }

      if (index % 2 === 0) {
        if (!this.isArg()) {
          throw new Error('Expected an argument')
        }

        args.push(this.parseArg())
      } else {
        if (!this.isComma()) {
          throw new Error('Expected a comma')
        }

        this.tokens.shift()
      }

      index++
    }

    if (index % 2 === 0 && index > 0) {
      throw new Error('Expected an argument')
    }

    this.tokens.shift()

    return {
      type: 'call',
      func: token,
      args,
    }
  }

  parseValue() {
    const token = this.tokens.shift()

    return {
      type: 'value',
      value: token.value,
    }
  }

  parseNum() {
    const token = this.tokens.shift()

    return {
      type: 'num',
      value: token.value,
    }
  }

  parseStr() {
    const token = this.tokens.shift()

    return {
      type: 'str',
      value: token.value,
    }
  }

  parseArg() {
    if (this.isFunc()) {
      return this.parseFunction()
    } else if (this.isNum()) {
      return this.parseNum()
    } else if (this.isStr()) {
      return this.parseStr()
    }

    throw new Error('Unexpected token')
  }

  parse() {
    if (this.eof()) {
      return null
    }

    if (this.isValue()) {
      return this.parseValue()
    }

    if (this.isNum()) {
      return this.parseNum()
    }

    if (this.isFunc()) {
      return this.parseFunction()
    }

    throw new Error('Unexpected token')
  }
}

export default Parser
