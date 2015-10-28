const vertex = `
attribute vec3 positionAttr;
attribute vec4 colorAttr;
varying vec4 vColor;

void main(void) {
    gl_Position = vec4(positionAttr, 1.0);
    vColor = colorAttr;
}
`

const fragment = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec4 vColor;

void main(void) {
    gl_FragColor = vec4(distance(mouse, gl_PointCoord.xy) * vColor.xyz, 0.0);
}
`

const looper = fn => {
    let cb = (time) => {
        requestAnimationFrame(cb)
        let diff = ~~(time - (cb.time || 0)),
            seconds_passed = diff/1000
        fn(seconds_passed)
        cb.time = time
    }
    return cb
}

let canvas = document.createElement('canvas'),
    gl = canvas.getContext('webgl')

document.body.appendChild(canvas)

const setSize = () => {
    canvas.width = document.body.offsetWidth
    canvas.height = document.body.offsetHeight
}
setSize()
window.onresize = setSize

////

let mouse = [0,0]

window.addEventListener('mousemove',
    ({clientX, clientY}) => mouse = [clientX,clientY])

////

let st = Date.now()
let program = (() => {
    let vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vertex)
    gl.compileShader(vertexShader)
    log(gl.getShaderInfoLog(vertexShader))

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, fragment)
    gl.compileShader(fragmentShader)
    log(gl.getShaderInfoLog(fragmentShader))

    let p = gl.createProgram()
    gl.attachShader(p, vertexShader)
    gl.attachShader(p, fragmentShader)
    gl.linkProgram(p)
    gl.useProgram(p)

    // make colorAttr and positionAttr (from shaders) accessible in JS
    p.positionAttr = gl.getAttribLocation(p, "positionAttr");
    gl.enableVertexAttribArray(p.positionAttr)
    p.colorAttr = gl.getAttribLocation(p, "colorAttr")
    gl.enableVertexAttribArray(p.colorAttr)

    return p
})()

let buffer = null
looper(() => {
    buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    // Interleave vertex positions and colors
    var vertexData = [
        // Vertex 1 position
        0.0, 0.8, 0.0,
        // Vertex 1 Color
        1.0, 0.0, 0.0, 1.0,
        // Vertex 2 position
        -0.8, -0.8, 0.0,
        // Vertex 2 color
        0.0, 1.0, 0.0, 1.0,
        // Vertex 3 position
        0.8, -.8, 0.0,
        // Vertex 3 color
        0.0, 0.0, 1.0, 1.0
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW)

    // There are 7 floating-point values per vertex
    var stride = 7 * Float32Array.BYTES_PER_ELEMENT;

    // Set up position stream
    gl.vertexAttribPointer(program.positionAttr,
        3, gl.FLOAT, false, stride, 0)

    // Set up color stream
    gl.vertexAttribPointer(program.colorAttr,
        4, gl.FLOAT, false, stride,
        3 * Float32Array.BYTES_PER_ELEMENT)
})()

looper(t => {
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform2fv(
        gl.getUniformLocation(program, 'resolution'),
        new Float32Array([canvas.width, canvas.height]))

    gl.uniform1f(
        gl.getUniformLocation(program, 'time'),
        (Date.now() - st) / 1000)

    gl.uniform2fv(
        gl.getUniformLocation(program, 'mouse'),
        new Float32Array(mouse))

    gl.drawArrays(gl.TRIANGLES, 0, 3)
})()

