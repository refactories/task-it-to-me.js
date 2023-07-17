const Stream = require('stream')

const setupOutputStream = () => {
  const outputStream = new Stream.Writable()

  outputStream.output = ''

  outputStream._write = function (chunk, _enc, next) {
    outputStream.output += chunk.toString()
    next()
  }

  return outputStream
}

const setupInputStream = () => {
  const inputStream = new Stream.Readable()
  inputStream.resume = function () { /* no-op */ }

  return inputStream
}

class TestStreams {
  constructor () {
    this.inputStream = setupInputStream()
    this.outputStream = setupOutputStream()
  }

  output () {
    return this.outputStream.output
  }

  plainOutput () {
    /* eslint-disable no-control-regex */
    return this.output().replace(/\x1b[[0-9;]+m/g, '')
    /* eslint-enable no-control-regex */
  }

  mockInput (commands) {
    commands.forEach((command) => {
      process.nextTick(() => {
        this.inputStream.emit('data', command)
      })
    })
  }
}

module.exports = TestStreams
