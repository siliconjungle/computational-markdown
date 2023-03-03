import React from 'react'
import ReactMarkdown from 'react-markdown'

const components = {}

const Markdown = ({ children = '' }) => {
  return (
    <ReactMarkdown
      components={components}
    >
      {children}
    </ReactMarkdown>
  )
}

export default Markdown
