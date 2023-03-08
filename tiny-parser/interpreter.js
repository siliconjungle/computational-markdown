import { useEffect } from 'react'

const functions = {
  SUM: args => {
    return args.flat().reduce((acc, arg) => acc + arg, 0)
  },
  MEDIAN: args => {
    const sorted = args.flat().sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)
    return sorted[middle]
  },
  MEAN: args => {
    const sum = args.flat().reduce((acc, arg) => acc + arg, 0)
    return sum / args.length
  },
  COUNT: args => args.flat().length,
  MAX: args => Math.max(...args.flat()),
  MIN: args => Math.min(...args.flat()),
  ABS: args => Math.abs(args.flat()[0]),
  NOW: () => new Date(),
  // I don't think I like this implementation of divide.
  DIVIDE: args => args.flat().reduce((acc, arg) => acc / arg),
  MULT: args => args.flat().reduce((acc, arg) => acc * arg),
  // RESOURCE: (url, path) => {
    // const apples = 50

    // add a dummy wait to simulate a network request
    // return new Promise(resolve => setTimeout(() => resolve(apples), 250))
  // },
  RESOURCE: ([name], resources) => {
    const keys = name.split('.')

    let currentResource = resources

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]

      if (currentResource[key] === undefined) {
        throw new Error(`Resource ${key} not found.`)
      }

      currentResource = currentResource[key]
    }

    return currentResource
  },
  // Needs to contain the full source.
  // Does a regex test on the source.
  TEST([expression], _, _2, _3, source) {
    const regex = new RegExp(expression, 'gm')
    return regex.test(source)
  },
  MATCH([expression], _, _2, _3, source) {
    const regex = new RegExp(expression, 'gm')
    const matches = source.match(regex)
    return matches?.length > 0 ? matches.join(', ') : 'UNDEFINED'
  },
  // SHORTCUT: ([name], _, _2, inner) => {
  //   if (!inner) {
  //     return `{=SHORTCUT('${name}')}`
  //   }
    
  //   return (
  //     <kbd
  //       style={{
  //         fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  //         backgroundColor: '#f7fafc',
  //         borderStyle: 'solid',
  //         borderRadius: '0.25rem',
  //         borderWidth: '1px 1px 3px',
  //         borderColor: '#a0aec0',
  //         fontSize: '0.8em',
  //         fontWeight: 'bold',
  //         lineHeight: '1.5',
  //         paddingInline: '0.4em',
  //         whiteSpace: 'nowrap',
  //         color: '#2d3748',
  //       }}
  //     >
  //       {name}
  //     </kbd>
  //   )
  // },
  // HEADING: ([level, text], _, _2, inner) => {
  //   if (!inner) {
  //     return `{=HEADING(${level}, '${text}')}`
  //   }

  //   switch (level) {
  //     case 1:
  //       return <h1>{text}</h1>
  //     case 2:
  //       return <h2>{text}</h2>
  //     case 3:
  //       return <h3>{text}</h3>
  //     case 4:
  //       return <h4>{text}</h4>
  //     case 5:
  //       return <h5>{text}</h5>
  //     case 6:
  //       return <h6>{text}</h6>
  //     default:
  //       throw new Error(`Invalid heading level: ${level}`)
  //   }
  // },
  // MARK: ([text], _, _2, inner) => {
  //   if (!inner) {
  //     return `{=MARK('${text}')}`
  //   }

  //   return (
  //     <mark
  //       style={{
  //         // muted yellow.
  //         backgroundColor: '#fff59d',
  //       }}
  //     >
  //       {text}
  //     </mark>
  //   )
  // },
  // SUB: ([text], _, _2, inner) => {
  //   if (!inner) {
  //     return `{=SUB('${text}')}`
  //   }

  //   return (
  //     <sub>
  //       {text}
  //     </sub>
  //   )
  // },
  // SUP: ([text], _, _2, inner) => {
  //   if (!inner) {
  //     return `{=SUP('${text}')}`
  //   }

  //   return (
  //     <sup>
  //       {text}
  //     </sup>
  //   )
  // },
  // DEL: ([text], _, _2, inner) => {
  //   if (!inner) {
  //     return `{=DEL('${text}')}`
  //   }

  //   return (
  //     <del
  //       style={{
  //         textDecoration: 'line-through',
  //         backgroundColor: '#fbb',
  //         color: '#555',
  //       }}
  //     >
  //       {text}
  //     </del>
  //   )
  // },
  // INS: ([text], _, _2, inner) => {
  //   if (!inner) {
  //     return `{=INS('${text}')}`
  //   }

  //   return (
  //     <ins
  //       style={{
  //         textDecoration: 'none',
  //         backgroundColor: '#d4fcbc',
  //       }}
  //     >
  //       {text}
  //     </ins>
  //   )
  // },
  // TAG: ([text], _, _2, inner) => {
  //   if (!inner) {
  //     return `{=TAG('${text}')}`
  //   }

  //   return (
  //     <span
  //       style={{
  //         backgroundColor: '#e2e8f0',
  //         borderRadius: '0.25rem',
  //         fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  //         // backgroundColor: '#f7fafc',
  //         fontSize: '0.8em',
  //         fontWeight: 'bold',
  //         lineHeight: '1.5',
  //         paddingInline: '0.4em',
  //         whiteSpace: 'nowrap',
  //       }}
  //     >
  //       {text}
  //     </span>
  //   )
  // },
  // SLIDER: ([label, resource, min, max], resources, setResources, inner) => {
  //   if (!inner) {
  //     return `{=SLIDER('${label}', '${resource}', ${min}, ${max})}`
  //   }

  //   useEffect(() => {
  //     if (resources[resource] === undefined) {
  //       console.log(typeof parseInt(min))
  //       setResources({ ...resources, [resource]: parseInt(min) })
  //     }
  //   }, [resource])    

  //   return (
  //     <span key={`${label}+${resource}+${min}+${max}`}>
  //       <label htmlFor="myRange" style={{ display: 'block' }}>{label}</label>
  //       <input
  //         type="range"
  //         min={min}
  //         max={max}
  //         value={resources[resource] || min}
  //         id="myRange"
  //         style={{
  //           display: 'block',
  //           marginTop: '0.5em',
  //         }}
  //         onChange={e => {
  //           e.preventDefault()
  //           setResources({ ...resources, [resource]: parseInt(e.target.value) })
  //         }}
  //       />
  //     </span>
  //   )

  //   // return null
  // }
  // RESOURCE: async (url, path) => {
  //   try {
  //     const response = await fetch(url)
  //     const data = await response.json()

  //     if (path === '') {
  //       if (data === undefined) {
  //         throw new Error(`Error fetching ${url}`)
  //       }

  //       if (typeof data !== 'number') {
  //         throw new Error(`Error fetching ${url}`)
  //       }

  //       return data
  //     } else {
  //       const keys = path.split('.')
  //       let field = data
  //       while (keys.length > 0) {
  //         field = field[keys.shift()]

  //         if (field === undefined) {
  //           throw new Error(`Error fetching ${url}`)
  //         }
  //       }

  //       if (typeof field !== 'number') {
  //         throw new Error(`Error fetching ${url}`)
  //       }

  //       return field
  //     }
  //   } catch (error) {
  //     throw new Error(`Error fetching ${url}`)
  //   }
  // }
}

export const interpret = (ast, resources, setResources, inner = false, source) => {
  if (ast.type === 'call' && ast.func.type === 'func') {
    const args = ast.args.map(arg => interpret(arg, resources, setResources, inner, source))
    const func = functions[ast.func.value]
    if (func) {
      // return functions[ast.func.value](await Promise.all(args), resources, setResources)
      return func(args, resources, setResources, inner, source)
    }

    throw new Error(`Unknown function ${ast.func.value}`)
  } else if (ast.type === 'num') {
    return ast.value
  } else if (ast.type === 'str') {
    return ast.value
  } else if (ast.type === 'value') {
    return ast.value
  } else {
    throw new Error('Unknown type')
  }
}
