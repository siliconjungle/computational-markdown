import React from 'react'
import ReactMarkdown from 'react-markdown'
import { renderMd } from 'tiny-parser'

const components = (resources, setResources) => ({
  p: ({ node, children, ...props }) => {
    // console.log('_NODE_', node)
    // console.log('_PROPS_', props)
    // console.log('_CHILDREN_', props.children)
    const c = children.map((child, i) => {
      if (node.children[i].type === 'text') {
        return renderMd(child, resources, setResources, true)
      } else {
        return child
      }
    })

    return (
      <p {...props}>
        {c.map((child, i) => (
          <span key={i}>{child}</span>
        ))}
      </p>
    )
  },
})

const Markdown = ({ children = '', resources = {}, setResources = () => {} }) => {
  return (
    <ReactMarkdown
      components={components(resources, setResources)}
    >
      {children}
    </ReactMarkdown>
  )
}

export default Markdown
