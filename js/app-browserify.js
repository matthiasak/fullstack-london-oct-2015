// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

// the following line, if uncommented, will enable browserify to push
// a changed file to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// if (module.hot) module.hot.accept()

let fetch = require('./fetcher')

import {React, Component, DOM} from 'react-resolver'

// other stuff that we don't really use in our own code
var Pace = require("../bower_components/PACE/pace.js")

// require your own libraries, too!
// var Router = require('./app.js')

window.addEventListener('load', app)

function app() {
    // start app
    // new Router()
}

// DOM.render(<p>test</p>, document.querySelector('.container'))