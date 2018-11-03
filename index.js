
let running = false

exports.isRunning = () => running

exports.start = () => running = true

exports.stop = () => running = false
