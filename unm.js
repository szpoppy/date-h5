let fs = require("fs")
let text = fs.readFileSync("./dist/index.js", "utf8") || ""
if(text) {
    let outer = text.replace(/^\s*\/\/\s*\[UMD:(\w+)\]\s*/, function(str, name) {
        return `if(!exports){}`
    })
}


(function(global, factory) {
    // UMD 加载方案
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory(exports)
        return
    }
    if (typeof global.define === "function" && global.define.amd) {
        global.define(factory)
        return
    }
    global.dateFn = factory()
})(window, function() {

})