var CODES = require("http").STATUS_CODES
exports = module.exports = require("./codes.json")
for (var code in CODES) code in exports || (exports[code] = CODES[code])
