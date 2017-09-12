## 2.0.1 (Sep 12, 2017)
- Removes a trailing comma for old Internet Explorer compatibility.

## 2.0.0 (Oct 4, 2015)
- Updates HTTP status codes and constants from Node v4:

  Code  | Old Name                          | New Name
  ------|-----------------------------------|---------
  `302` | `MOVED_TEMPORARILY`               | `FOUND`
  `408` | `REQUEST_TIME_OUT`                | `REQUEST_TIMEOUT`
  `413` | `REQUEST_ENTITY_TOO_LARGE`        | `PAYLOAD_TOO_LARGE`
  `414` | `REQUEST_URI_TOO_LARGE`           | `URI_TOO_LONG`
  `416` | `REQUESTED_RANGE_NOT_SATISFIABLE` | `RANGE_NOT_SATISFIABLE`
  `504` | `GATEWAY_TIME_OUT`                | `GATEWAY_TIMEOUT`

## 1.2.0 (Oct 4, 2015)
- Restores status code names and constants to pre Node v4 times (Node v0.12) for
  backwards compatibility.  Will release StandardHttpError.js v2 briefly with
  Node v4's names and constants.

- Adds new status codes and constants from Node v4:

  Code  | Name
  ------|-----
  `208` | `ALREADY_REPORTED`
  `226` | `IM_USED`
  `421` | `MISDIRECTED_REQUEST`
  `508` | `LOOP_DETECTED`

- Makes `StandardHttpError` inherit from `StandardError` so you could more
  easily differentiate between bugs (usually thrown as `TypeError`,
  `SyntaxError` et al.) from user-facing errors that you've intentionally
  thrown. If all of your custom errors inherit from `StandardError`
  ([StandardError.js](https://github.com/moll/js-standard-error)), this will
  come in handy.

  ```javascript
  var StandardError = require("standard-error")
  var HttpError = require("standard-http-error")

  function magic(n) {
    if (isNaN(n)) throw new TypeError("Bug! Should never be NaN!")
    if (n <= 0) throw new HttpError(422, "Think positively!")
    // ...
  }

  try { magic(42) }
  catch (ex) {
    if (ex instanceof StandardError) console.error("Uh-oh: " + ex.message)
    else throw ex
  }
  ```

  Make sure your dependencies have been deduped (see `npm dedupe`) to ensure
  a single `StandardError` instance (needed for `instanceof` to work) across
  your whole app.

## 1.1.1 (Jun 4, 2015)
- Sets HttpError's name as a property on its prototype for when the code gets
  minified and the constructor name is changed.

## 1.1.0 (May 21, 2015)
- Adds support for use in the browser by adding a cached copy of status codes.  
  For example, use StandardHttpError.js with
  [Browserify](https://github.com/substack/node-browserify).

## 1.0.1 (Feb 23, 2015)
- Fixes subclassing example in README.

## 1.0.0 (Feb 22, 2015)
- Keep calm and invent a standard.
