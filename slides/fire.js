const random = (min=0, max=400) =>
    Math.random()*(max-min)+min

const vector = (x=random(),y=random()) => [x,y]

const degToRad = deg => deg * Math.PI / 180

const radToDeg = rad => rad*180 / Math.PI

const add = (...vx) =>
    vx.reduce((a, v) =>
        [a[0] + v[0], a[1] + v[1]], [0,0])

const sub = (...vx) =>
    vx.reduce((a, v) =>
        [a[0] - v[0], a[1] - v[1]])

const scale = ([x,y],n) =>
    [n * x, n * y]

const dot = ([x1,y1],[x2,y2]) =>
    x1*x2 + y1*y2

const rotate = ([x,y],deg) => {
    let r = degToRad(deg),
        [cos, sin] = [Math.cos(r), Math.sin(r)]
    return [cos*x - sin*y, sin*x + cos*y]
}

const normalize = v => scale(v,1/(mag(v) || 1))

const mag = ([x,y]) => Math.sqrt(x*x + y*y)

const dist = ([x1,y1], [x2,y2]) =>
    Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2))

const heading = (v) => {
    let angle = angleBetween(v,[0,-1*mag(v)])
    return v[0] < 0 ? 360-angle : angle
}

const angleBetween = (v1,v2) =>
    radToDeg(Math.acos( dot(v1,v2) / (mag(v1)*mag(v2)) ))

const particle = (
    position=vector(),
    velocity=vector(),
    accel=vector()
) => {
    return {accel, velocity, position}
}

// velocity += accel_______
// velocity *= 1-friction _|---> part a
// position += velocity--------> part b
const update = (p, friction) => {
    let [[px,py], [vx,vy], [ax,ay]] = [p.position, p.velocity, p.accel]
    vx = (vx+ax) * (1-friction)
    vy = (vy+ay) * (1-friction)
    let position = [px + vx, py + vy],
        accel = [0,0],
        velocity = [vx,vy]
    return { ...p, position, accel, velocity }
}

// f(particle, number, vector) -> vector
const applyForce = (p, m, a) => {
    let {accel} = p
    accel = add(accel, scale(a,m))
    return { ...p, accel }
}

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

/**
 * LET THE REVOLUTION BEGIN
 *
 * GIMME THE JUITH!
 */

let canvas = document.createElement('canvas'),
    c = canvas.getContext('2d')

document.body.appendChild(canvas)

const setSize = () => {
    canvas.width = document.body.offsetWidth
    canvas.height = document.body.offsetHeight
}
setSize()
window.onresize = setSize

// define particles

const flame = (size=random(40,80)) => {
    return {
        ...particle(mouse, [0,0], [0,0]),
        size
    }
}

let flames = []

// the mouse

let mouse = [canvas.width/2,canvas.height]

window.addEventListener('mousemove',
    ({clientX, clientY}) =>
        mouse = [clientX, clientY])

/**
 * PHYSICS UPDATES
 */

const WORLD_FRICTION = 0.1
looper(time => {
    flames = flames.map(p =>
        update(p, WORLD_FRICTION))
})()

// wind
looper(time => {
    flames = flames.map(p =>
        applyForce(p, time*p.size, [random(-2,2),-1]))
})()

// kill if off screen or too small
looper(time => {
    flames = flames.filter(({position, size}) =>
        (position[1] > -1*size) &&
        (size>1))
})()

// add a flame
looper(time => {
    flames.push(flame())
})()

// reduce size
looper(time => {
    flames = flames.map(p => {
        let {size} = p
        size*=.99
        return {...p, size}
    })
})()

/**
 * DRAW UPDATES
 */

const color = (size) => {
    const sMin = 10,
          sMax = 80,
          min = 0x0000ff,
          max = 0xee0000

    let diff = sMax - Math.max(size - sMin, sMin)
    return ~~(diff/(sMax - sMin)*(max-min))
}

const removeGreen = (num) => {
    let rgb = num.toString(16)
    return `${rgb.slice(0,2)}00${rgb.slice(4)}`
}


// draw every 16ms
looper(t => {
    c.clearRect(0,0,canvas.width,canvas.height)
    // draw anchors
    flames.forEach(({position, size}) => {
        c.fillStyle = '#'+removeGreen(color(size))
        let [x,y] = position
        c.beginPath()
        c.arc(x, y, size/2, 0, 2*Math.PI)
        c.fill()
        c.closePath()
    })
})()