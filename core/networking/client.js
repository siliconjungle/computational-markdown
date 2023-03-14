import EventEmitter from 'events'
import { encode, decode } from 'messagepack'
import { heartbeat } from './utils'
import { RoundTrips, MessageSizes } from './messages'

const isBrowser = typeof window !== 'undefined'

const RECONNECT_TIMEOUT = 10000
const PONG_TIMEOUT = 10000
const SEND_RATE = 33.333

const SERVER_URL = 'ws://localhost:8080'

const encodeFields = (fields) => {
	const ranges = []

	// Lets run length encode the fields
	for (let j = 0; j < fields.length; j++) {
		// The fields structure is [field, field2, field3, ...]
		// The run-length encoding scheme is as follows:
		// [[field, amount], [field2, amount2], [field3, amount3], ...]
		// Each field is an index. If a field is 1 larger than the previous field, the amount is increased by 1.

		const field = fields[j]
		let amount = 1

		while (j < fields.length && fields[j + 1] === field + amount) {
			amount++
			j++
		}

		ranges.push([field, amount])
	}

	return ranges
}

const decodeFields = (ranges) => {
	const fields = []

	for (let j = 0; j < ranges.length; j++) {
		const [field, amount] = ranges[j]

		for (let k = 0; k < amount; k++) {
			fields.push(field + k)
		}
	}

	return fields
}

const encodeValues = (values) => {
	const ranges = []

	// Lets run length encode the values
	for (let j = 0; j < values.length; j++) {
		// The values structure is [value, value2, value3, ...]
		// The run-length encoding scheme is as follows:
		// [[value, amount], [value2, amount2], [value3, amount3], ...]

		const value = values[j]
		let amount = 1

		while (j < values.length && values[j + 1] === value) {
			amount++
			j++
		}

		ranges.push([value, amount])
	}

	return ranges
}

const decodeValues = (ranges) => {
	const values = []

	for (let j = 0; j < ranges.length; j++) {
		const [value, amount] = ranges[j]

		for (let k = 0; k < amount; k++) {
			values.push(value)
		}
	}

	return values
}

const runlengthEncode = (message) => {
	const ops = message.ops

	for (let i = 0; i < ops.length; i++) {
		const op = ops[i]

		op.fields = encodeFields(op.fields)
		op.values = encodeValues(op.values)
	}

	return message
}

const runlengthDecode = (message) => {
	const ops = message.ops

	for (let i = 0; i < ops.length; i++) {
		const op = ops[i]

		op.fields = decodeFields(op.fields)
		op.values = decodeValues(op.values)
	}

	return message
}

class Client extends EventEmitter {
	latestSeq = -1
	latestServerSeq = -1
	latestAck = -1
	running = false
	roundTrips = new RoundTrips()
	localMessageSizes = new MessageSizes()
	serverMessageSizes = new MessageSizes()

	constructor() {
		super()
    this.messages = []
		this.connection = null
	}

	init() {
		this.connection = isBrowser ? this.createConnection() : null
	}

	shutdown() {
		this.stop()
		if (this.connection?.readyState === WebSocket.OPEN) {
			this.connection?.close()
		}
	}

	start() {
    if (this.running === false) {
      this.running = true

			this.lastPong = Date.now()

      heartbeat(() => {
				this.detectDisconnect()
        this.sendMessages()
        return this.running
      }, SEND_RATE)
    }
  }

  stop() {
    this.running = false
  }

	detectDisconnect() {
		if (this.connection?.readyState === WebSocket.OPEN) {
			if (this.lastPong + PONG_TIMEOUT < Date.now()) {
				console.log('_SERVER_DISCONNECTED_')
				this.connection = this.createConnection()
			}
		}
	}

	handleMessage = (event) => {
		const messageList = decode(event.data)
		this.serverMessageSizes.addMessageSize(event.data.byteLength)

		if (messageList.seq !== -1) {
			// this.roundTrips.setReceivedTime(messageList.seq, Date.now() - messageList.delay)
			this.roundTrips.setReceivedTime(messageList.seq, performance.now() - messageList.delay)
		}

		this.latestServerSeq = messageList.serverSeq
		this.latestAck = messageList.seq
		const messages = messageList.messages

		this.lastPong = Date.now()

		for (const message of messages) {
			if (message.type === 'patch') {
				const decodedMessage = runlengthDecode(message)
				this.emit('message', decodedMessage)
			} else {
				this.emit('message', message)
			}
		}
	}

	handleOpen = (event) => {
		console.log('_OPEN_')
		this.emit('open', event)
		this.start()
	}

	handleClose = (event) => {
		console.log('_CLOSE_')
		this.stop()
		setTimeout(() => {
			this.connection = this.createConnection()
		}, RECONNECT_TIMEOUT)
	}

	handleError = (event) => {
		console.log('_ERROR_')
		this.stop()
		setTimeout(() => {
			this.connection = this.createConnection()
		}, RECONNECT_TIMEOUT)
	}

	createConnection = () => {
		this.latestSeq = -1
		this.latestServerSeq = -1
		this.latestAck = -1
		this.roundTrips.resetTimes()
		this.localMessageSizes.resetSizes()
		this.serverMessageSizes.resetSizes()
		const connection = new WebSocket(SERVER_URL)
		connection.binaryType = 'arraybuffer'
		connection.addEventListener('message', this.handleMessage)
		connection.addEventListener('open', this.handleOpen)
		connection.addEventListener('close', this.handleClose)
		connection.addEventListener('error', this.handleError)
		this.messages = []
		return connection
	}

	addMessage(message) {
		if (message.type === 'patch') {
			const encodedMessage = runlengthEncode(JSON.parse(JSON.stringify(message)))
			// this.messages.push(message)
			this.messages.push(encodedMessage)
		} else {
			this.messages.push(message)
		}
	}

	sendMessages() {
		const connection = this.connection
		if (connection?.readyState === WebSocket.OPEN) {
			this.latestSeq++
			const messageList = {
				seq: this.latestSeq,
				serverSeq: this.latestServerSeq,
				messages: this.messages,
			}
			// this.roundTrips.setSendTime(this.latestSeq, Date.now())
			this.roundTrips.setSendTime(this.latestSeq, performance.now())
			const data = encode(messageList)
			this.localMessageSizes.addMessageSize(data.byteLength)
			connection.send(data)
		}
		this.messages = []
	}
}

export default Client
