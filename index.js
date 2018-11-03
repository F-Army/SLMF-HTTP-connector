
let running = false

let internalConfiguration = {
    url : null,
    port : 80,
    maxSmlfMessages : 1024,
    accumulationPeriod : 1000,
    maxRetries : 3,
    maxAccumulatedMessages : 1024
}

exports.isRunning = () => running

exports.start = () => running = true

exports.stop = () => running = false

exports.setConfiguration = (config) => {
    internalConfiguration.url = config.url
    internalConfiguration.port = config.port
    internalConfiguration.maxSmlfMessages = config.maxSmlfMessages
    internalConfiguration.accumulationPeriod = config.accumulationPeriod
    internalConfiguration.maxRetries = config.maxRetries
    internalConfiguration.maxAccumulatedMessages = config.maxAccumulatedMessages
}

exports.getConfiguration = () => internalConfiguration

