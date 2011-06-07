r = require("./lib/utils/read-json")
path = require("path")
r(path.resolve("package.json"), function(er, j) {
  console.error(er ? er.stack || er.message : j)
})
