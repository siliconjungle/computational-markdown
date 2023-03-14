import React from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { githubDark } from '@uiw/codemirror-theme-github'

const CodeEditor = ({ value, onChange }) => {
  return (
    <CodeMirror
      value={value ?? ''}
      height="200px"
      theme={githubDark}
      extensions={[javascript({ jsx: true })]}
      onChange={onChange}
      style={{ display: 'block', marginTop: '1em' }}
    />
  )
}

export default CodeEditor
