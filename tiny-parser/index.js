import InputStream from './input-stream'
import Tokenizer from './tokenizer'
import Parser from './parser'
import { interpret } from './interpreter'
import mdTokenizer from './md-tokenizer'
import React from 'react'

export const calculateResult = (code, resources, setResources, inner = false, source = '') => {
  // new Promise((resolve, reject) => {
    try {
      if (code === '') {
        // resolve('')
        return ''
      }

      const inputStream = new InputStream(code)
      const tokenizer = new Tokenizer(inputStream)
    
      const tokens = tokenizer.read()
    
      const parser = new Parser(tokens)
    
      const ast = parser.parse()

      const result = interpret(ast, resources, setResources, inner, source) // .then(result => {
        // resolve(result)
      // }).catch(e => {
        // resolve('ERROR')
      // })
      return result
    } catch (e) {
      console.log('_ERROR_', e)
      // resolve('ERROR')
      return 'ERROR'
    }
  // })
}

// It needs to do this ignoring the inputs.
// It then needs a special pass that renders markdown and inputs.
export const calculateMd = (md, resources, setResources, inner = false, source = '') => {
  console.log('_MD_', md)
  // new Promise(async (resolve, reject) => {
    try {
      if (md === '') {
        // resolve('')
        return ''
      }

      const inputStream = new InputStream(md)
      const tokenizer = new mdTokenizer(inputStream)

      const tokens = tokenizer.read()

      // console.log('_TOKENS_', tokens)

      let result = ''

      for (let i = 0; i < tokens.length; ++i) {
        if (tokens[i].type === 'md') {
          // Insert the markdown as a span child of the body
          result += tokens[i].value
        } else if (tokens[i].type === 'code') {
          // Insert the code result as a span child of the body
          // OR insert the code as a React component and render it
          // const value = await calculateResult(tokens[i].value, resources, setResources)
          const value = calculateResult(tokens[i].value, resources, setResources, inner, source)

          result += value
        }
      }

      // resolve(result)
      return result
    } catch (e) {
      console.log('_ERROR_', e)
      // resolve('ERROR')
      return 'ERROR'
    }
  // })
}

// There are two phases.
// The first phase is to do computations and get the result.
// The second phase is to render the markdown and any inputs.
// The current implementation is wrong as it splits on markdown.
export const renderMd = (md, resources, setResources, inner = false, source = '') => {
  // new Promise(async (resolve, reject) => {
    try {
      if (md === '') {
        // resolve('')
        return ''
      }

      // console.log('_MD_', md)

      const inputStream = new InputStream(md)
      const tokenizer = new mdTokenizer(inputStream)

      const tokens = tokenizer.read()

      // console.log('_TOKENS_', tokens)

      // First clear the children of the parent
      // parent.innerHTML = ''
      // let result = ''
      let result = []

      for (let i = 0; i < tokens.length; ++i) {
        if (tokens[i].type === 'md') {
          const md = <span key={i}>{tokens[i].value}</span>
          result.push(md)
        } else if (tokens[i].type === 'code') {
          // Insert the code result as a span child of the body
          // OR insert the code as a React component and render it
          const value = calculateResult(tokens[i].value, resources, setResources, inner, source)

          if (typeof value === 'string') {
            const md = <span key={i}>{value}</span>
            result.push(md)
          } else {
            result.push(value)
          }
        }
      }

      // resolve(result)
      return result
    } catch (e) {
      console.log('_E_', e)
      // resolve('ERROR')
      return 'ERROR'
    }
  // })
}
