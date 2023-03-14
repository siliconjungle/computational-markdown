import EventEmitter from 'events'

const shouldSet = ([seq, agentId], [seq2, agentId2]) =>
  seq2 > seq || (seq === seq2 && agentId > agentId2)

class Kernal extends EventEmitter {
  documents = {}
  versions = {}
  latestSeq = -1

  getDocument(id) {
    return this.documents[id]
  }

  applyOps (ops, isLocal = true) {
    // ops: [
    //   {
    //     version: [seq, agentId],
    //     id: ‘test’,
    //     fields: [0, 1, 2],
    //     values: [5, 10, ‘hello’],
    //   },
    // ]

    const filteredOps = []

    for (const op of ops) {
      const { version, id, fields, values } = op
      this.versions[id] ??= []
      this.documents[id] ??= []

      const currentOp = { version, id, fields: [], values: [] }

      for (let i = 0; i < fields.length; i++) {
        const currentVersion = this.versions[id][fields[i]]
        if (currentVersion === undefined || shouldSet(currentVersion, version)) {
          this.versions[id][fields[i]] = version
          this.documents[id][fields[i]] = values[i]

          currentOp.fields.push(fields[i])
          currentOp.values.push(values[i])
          // filteredOps.push(op)
        }
      }

      if (currentOp.fields.length > 0) {
        filteredOps.push(currentOp)
      }

      this.latestSeq = Math.max(this.latestSeq, version[0])
    }

    if (filteredOps.length > 0 && !isLocal) {
      this.emit('ops', filteredOps)
    }
    return filteredOps
  }

  // const versions = {
  //   id: [[0, '123abc'], [0, '123abc'], [0, '123abc']],
  // }
  // const documents = {
  //   id: [5, 10, 'hello'],
  // }
  getSnapshotOps() {
    const ops = []

    // Per document, get all of the fields that belong to a version.
    for (const id in this.documents) {
      const versions = {}

      for (let i = 0; i < this.versions[id].length; i++) {
        const version = this.versions[id][i]
        const [seq, agentId] = version
        if (version !== undefined) {
          versions[agentId] ??= {}
          versions[agentId][seq] ??= []
          versions[agentId][seq].push(i)
        }
      }

      // For each version, create an op.
      for (const agentId in versions) {
        for (const seq in versions[agentId]) {
          const fields = versions[agentId][seq]
          const values = fields.map((field) => this.documents[id][field])
          ops.push({
            version: [parseInt(seq), agentId],
            id,
            fields,
            values,
          })
        }
      }
    }

    return ops
  }
}

export default Kernal
