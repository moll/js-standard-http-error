var O = require("oolong")
var HttpError = require("..")
var isVersion = require("semver").satisfies.bind(null, process.version)
var describeNodeV012 = isVersion(">= 0.12 < 0.13") ? describe : xdescribe
var describeNodeV4 = isVersion(">= 4 < 5") ? describe : xdescribe

function RemoteError(code, msg) { HttpError.apply(this, arguments) }

RemoteError.prototype = Object.create(HttpError.prototype, {
  constructor: {value: RemoteError, configurable: true, writeable: true}
})

describe("HttpError", function() {
  describe("new", function() {
    it("must be an instance of HttpError", function() {
      new HttpError(400).must.be.an.instanceof(HttpError)
    })

    it("must set code", function() {
      new HttpError(404).code.must.equal(404)
    })

    it("must throw TypeError given undefined code", function() {
      !function() { new HttpError(undefined) }.must.throw(TypeError, /HTTP/)
    })

    it("must throw TypeError given null code", function() {
      !function() { new HttpError(null) }.must.throw(TypeError, /HTTP/)
    })

    it("must set code from constant name", function() {
      new HttpError("NOT_FOUND").code.must.equal(404)
    })

    it("must throw TypeError given unknown constant", function() {
      !function() { new HttpError("DUNNO") }.must.throw(TypeError, /HTTP/)
    })

    it("must set message from code", function() {
      new HttpError(404).message.must.equal("Not Found")
    })

    it("must set message from code given null", function() {
      new HttpError(404, null).message.must.equal("Not Found")
    })

    it("must set message from constant name", function() {
      new HttpError("NOT_FOUND").message.must.equal("Not Found")
    })

    it("must set message if given", function() {
      new HttpError(404, "Dunno").message.must.equal("Dunno")
    })

    it("must set name to HttpError", function() {
      new HttpError(400).name.must.equal("HttpError")
    })

    it("must set name to constructor's name", function() {
      new RemoteError(400).name.must.equal("RemoteError")
    })

    it("must set code, message and properties", function() {
      var err = new RemoteError(404, "Dunno", {url: "/dunno"})
      err.code.must.equal(404)
      err.message.must.equal("Dunno")
      err.url.must.equal("/dunno")
    })

    it("must set code and properties", function() {
      var err = new RemoteError(404, {url: "/dunno"})
      err.code.must.equal(404)
      err.message.must.equal("Not Found")
      err.url.must.equal("/dunno")
    })

    it("must set code and properties given null message", function() {
      var err = new RemoteError(404, null, {url: "/dunno"})
      err.code.must.equal(404)
      err.message.must.equal("Not Found")
      err.url.must.equal("/dunno")
    })

    it("must set stack", function() {
      var stack = new HttpError(400).stack.split(/\n\s*/)
      stack[0].must.equal("HttpError: Bad Request")
      stack[1].must.include("index_test.js")
    })

    it("must set stack from constructor", function() {
      var stack = new RemoteError(400).stack.split(/\n\s*/)
      stack[0].must.equal("RemoteError: Bad Request")
      stack[1].must.include("index_test.js")
      stack[2].must.not.include("index_test.js")
    })
  })

  describe(".prototype.statusCode", function() {
    it("must be an alias to code", function() {
      var err = new HttpError(404)
      err.statusCode.must.equal(404)
      err.statusCode = 500
      err.code.must.equal(500)
    })

    it("must be non-enumerable", function() {
      new HttpError(412).must.have.nonenumerable("statusCode")
    })
  })

  describe(".prototype.statusMessage", function() {
    it("must be an alias to message", function() {
      var err = new HttpError(412, "Bad CSRF Token")
      err.statusMessage.must.equal("Bad CSRF Token")
      err.statusMessage = "Awful CSRF Token"
      err.message.must.equal("Awful CSRF Token")
    })

    it("must be non-enumerable", function() {
      new HttpError(412).must.have.nonenumerable("statusMessage")
    })
  })

  describe(".prototype.status", function() {
    it("must be an alias to code", function() {
      new HttpError(404).status.must.equal(404)
    })

    it("must be non-enumerable", function() {
      new HttpError(404).must.have.nonenumerable("status")
    })

    it("must be overwritable", function() {
      var err = new HttpError(404)
      err.status = "OK"
      err.code.must.equal(404)

      err.status.must.equal("OK")
      var desc = Object.getOwnPropertyDescriptor(err, "status")
      desc.configurable.must.be.true()
      desc.writable.must.be.true()
      desc.enumerable.must.be.true()
    })
  })

  describe(".prototype.toString", function() {
    it("must return code and message", function() {
      new HttpError(404, "Dunno").toString().must.equal("HttpError: 404 Dunno")
    })

    it("must use set name", function() {
      var err = new HttpError(404, "Dunno")
      err.name = "OtherError"
      err.toString().must.equal("OtherError: 404 Dunno")
    })
  })

  describe("HTTP status codes", function() {
    it("must have NOT_FOUND equal 404", function() {
      HttpError.must.have.property("NOT_FOUND", 404)
    })

    it("must have INTERNAL_SERVER_ERROR equal 500", function() {
      HttpError.must.have.property("INTERNAL_SERVER_ERROR", 500)
    })

    describeNodeV012("when on Node v0.12", function() {
      var STATUS_NAMES = require("http-codes")

      // Fail safes:
      STATUS_NAMES.must.have.property("NOT_FOUND", 404)
      STATUS_NAMES.must.have.property("INTERNAL_SERVER_ERROR", 500)

      O.each(STATUS_NAMES, function(code, name) {
        it("must have " + name + " equal " + code, function() {
          HttpError[name].must.equal(code)
        })
      })
    })

    describeNodeV4("when on Node v4", function() {
      O.each({
        MOVED_TEMPORARILY: 302, // => FOUND
        REQUEST_TIME_OUT: 408, // => REQUEST_TIMEOUT
        REQUEST_ENTITY_TOO_LARGE: 413, // => PAYLOAD_TOO_LARGE
        REQUEST_URI_TOO_LARGE: 414, // => URI_TOO_LONG
        REQUESTED_RANGE_NOT_SATISFIABLE: 416, // => RANGE_NOT_SATISFIABLE
        GATEWAY_TIME_OUT: 504 // => GATEWAY_TIMEOUT
      }, function(code, name) {
        it("must have " + name + " equal " + code, function() {
          HttpError[name].must.equal(code)
        })
      })

      O.each({
        302: "Moved Temporarily",
        408: "Request Time-out",
        413: "Request Entity Too Large",
        414: "Request-URI Too Large",
        416: "Requested Range Not Satisfiable",
        504: "Gateway Time-out"
      }, function(name, code) {
        it("must have " + name + " equal " + code, function() {
          new HttpError(Number(code)).message.must.equal(name)
        })
      })
    })
  })
})
