var O = require("oolong")
var CODES_JSON = require("../codes.json")
var STATUS_CODES = require("http").STATUS_CODES

describe("codes.json", function() {
  // Test for superset rather than equivalence because future Node versions
  // might _add_ status codes. I presume they won't remove any though.
  O.each(STATUS_CODES, function(name, code) {
    it("must have " + code + " equal " + name, function() {
      CODES_JSON[code].must.equal(name)
    })
  })
})
