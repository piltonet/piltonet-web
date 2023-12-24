const constants = require('./constants')
const SDK = require(`./${process.env.VUE_APP_DEFAULT_SDK}`)

module.exports = {
    constants,
    SDK
}
