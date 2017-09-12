var CODES = require("http").STATUS_CODES
exports = module.exports = require("./codes.json")
for (var code in CODES) if (!(code in exports)) exports[code] = CODES[code]
