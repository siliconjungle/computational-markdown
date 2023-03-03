import InputStream from './input-stream'
import Tokenizer from './tokenizer'
import Parser from './parser'
import { interpret } from './interpreter'
import mdTokenizer from './md-tokenizer'
import React from 'react'

export const calculateResult = async (code, resources, setResources) =>
  new Promise((resolve, reject) => {
    try {
      if (code === '') {
        resolve('')
      }

      const inputStream = new InputStream(code)
      const tokenizer = new Tokenizer(inputStream)
    
      const tokens = tokenizer.read()
    
      const parser = new Parser(tokens)
    
      const ast = parser.parse()

      interpret(ast, resources, setResources).then(result => {
        resolve(result)
      }).catch(e => {
        resolve('ERROR')
      })
    } catch (e) {
      resolve('ERROR')
    }
  })

export const calculateMd = async (md) =>
  new Promise(async (resolve, reject) => {
    try {
      if (md === '') {
        resolve('')
      }

      const inputStream = new InputStream(md)
      const tokenizer = new mdTokenizer(inputStream)

      const tokens = tokenizer.read()

      console.log('_TOKENS_', tokens)

      let result = ''

      for (let i = 0; i < tokens.length; ++i) {
        if (tokens[i].type === 'md') {
          // Insert the markdown as a span child of the body
          result += tokens[i].value
        } else if (tokens[i].type === 'code') {
          // Insert the code result as a span child of the body
          // OR insert the code as a React component and render it
          const value = await calculateResult(tokens[i].value)
          result += value
        }
      }

      resolve(result)
    } catch (e) {

      console.log('_E_', e)
      resolve('ERROR')
    }
  })

export const renderMd = async (md, resources, setResources) =>
  new Promise(async (resolve, reject) => {
    try {
      if (md === '') {
        resolve('')
      }

      const inputStream = new InputStream(md)
      const tokenizer = new mdTokenizer(inputStream)

      const tokens = tokenizer.read()

      console.log('_TOKENS_', tokens)

      // First clear the children of the parent
      // parent.innerHTML = ''
      // let result = ''
      let result = []

      for (let i = 0; i < tokens.length; ++i) {
        if (tokens[i].type === 'md') {
          const md = <span>{tokens[i].value}</span>
          result.push(md)
        } else if (tokens[i].type === 'code') {
          // Insert the code result as a span child of the body
          // OR insert the code as a React component and render it
          const value = await calculateResult(tokens[i].value, resources, setResources)

          if (typeof value === 'string') {
            const md = <span>{value}</span>
            result.push(md)
          } else {
            result.push(value)
          }
        }
      }

      resolve(result)
    } catch (e) {
      console.log('_E_', e)
      resolve('ERROR')
    }
  })
