const functions = {
  SUM: args => args.reduce((acc, arg) => acc + arg, 0),
  MEDIAN: args => {
    const sorted = args.sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)
    return sorted[middle]
  },
  MEAN: args => {
    const sum = args.reduce((acc, arg) => acc + arg, 0)
    return sum / args.length
  },
  COUNT: args => args.length,
  MAX: args => Math.max(...args),
  MIN: args => Math.min(...args),
  ABS: args => Math.abs(args[0]),
  NOW: () => new Date(),
  // I don't think I like this implementation of divide.
  DIVIDE: args => args.reduce((acc, arg) => acc / arg),
  MULT: args => args.reduce((acc, arg) => acc * arg),
  // RESOURCE: (url, path) => {
    // const apples = 50

    // add a dummy wait to simulate a network request
    // return new Promise(resolve => setTimeout(() => resolve(apples), 250))
  // },
  RESOURCE: ([name], resources) => {
    return resources[name]
  },
  SLIDER: ([label, resource, min, max], resources, setResources) => {
    if (resources[resource] === undefined) {
      console.log(typeof parseInt(min))
      setResources({ ...resources, [resource]: parseInt(min) })
    }

    return (
      <div>
        <label htmlFor="myRange" style={{ display: 'block' }}>{label}</label>
        <input
          type="range"
          min={min}
          max={max}
          value={resources[resource] || min}
          id="myRange"
          style={{
            display: 'block',
            marginTop: '0.5em',
          }}
          onChange={e => {
            console.log(typeof parseInt(e.target.value))
            setResources({ ...resources, [resource]: parseInt(e.target.value) })
          }}
        />
      </div>
    )
  }
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

export const interpret = async (ast, resources, setResources) => {
  if (ast.type === 'call' && ast.func.type === 'func') {
    const args = ast.args.map(arg => interpret(arg, resources, setResources))
    const func = functions[ast.func.value]
    if (func) {
      return functions[ast.func.value](await Promise.all(args), resources, setResources)
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
