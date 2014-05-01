var _ = require("lodash")
var STATUS_NAMES = require("http-codes")
var HttpError = require("..")

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

    it("must set code from constant name", function() {
      new HttpError("NOT_FOUND").code.must.equal(404)
    })

    it("must throw TypeError given undefined code", function() {
      !function() { new HttpError(undefined) }.must.throw(TypeError, /HTTP/)
    })

    it("must throw TypeError given null code", function() {
      !function() { new HttpError(null) }.must.throw(TypeError, /HTTP/)
    })

    it("must throw TypeError given unknown constant", function() {
      !function() { new HttpError("DUNNO") }.must.throw(TypeError, /HTTP/)
    })

    it("must set message from code", function() {
      new HttpError(404).message.must.equal("Not Found")
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

    it("must set stack", function() {
      var stack = new HttpError(400).stack.split(/\n\s*/)
      stack[0].must.equal("HttpError: Bad Request")
      stack[1].must.include("http_error_test.js")
    })

    it("must set stack from constructor", function() {
      var stack = new RemoteError(400).stack.split(/\n\s*/)
      stack[0].must.equal("RemoteError: Bad Request")
      stack[1].must.include("http_error_test.js")
      stack[2].must.not.include("http_error_test.js")
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
    // Fail safes:
    STATUS_NAMES.must.have.property("NOT_FOUND", 404)
    STATUS_NAMES.must.have.property("INTERNAL_SERVER_ERROR", 500)

    _.each(STATUS_NAMES, function(code, constant) {
      it("must have " + constant + " equal " + code, function() {
        HttpError[constant].must.equal(code)
      })
    })
  })
})
