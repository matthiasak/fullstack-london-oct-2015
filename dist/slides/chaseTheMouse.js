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
 * NEW STUFF
 */

const logEm = (a) =>
    a.map( p => {
          log(`x: ${p.position[0]}`)
          log(`y: ${p.position[1]}`)
          log(`mass: ${p.mass}`) // <-- report the mass
          log(`velocity: ${mag(p.velocity).toFixed(2)}`) // <-- ... and velocity
          log(`heading: ${heading(p.velocity)}`)
          log(`-----------`)
    })

const box = (mass=random(1,50)) => {
    return {...particle(), mass }
}

let particles = Array(1)
    .fill(true)
    .map(_ => box())

/**
 * PHYSICS UPDATES
 */

// the regular loop

const WORLD_FRICTION = .95

looper(() => {
    particles = particles.map(p => update(p, WORLD_FRICTION))
})()

// the mouse

let mouse = [0,0],
    mouse_step = 0,
    corners = [[0,0], [400,0], [400,400], [0,400]]

// every 5 seconds, the mouse goes to a new corner
setInterval(() => {
    mouse_step = mouse_step === corners.length-1 ? 0 : mouse_step+1
    mouse = corners[mouse_step]
}, 5000)

// chase the mouse by continually applying/adjusting force to each particle
looper(() => {
    particles = particles.map(p => {
        // find directional difference b/w mouse and this particle
        let dir = sub(mouse, p.position)
        // normalize it (make the unit length 1)
        dir = normalize(dir)
        // apply movement to the particle in the direction of the mouse
        return applyForce(p, p.mass, dir) //<-- use the mass
    })
})()

/**
 * DRAW UPDATES
 */

// not a "functional" function :P
setInterval((t) => {
    reset()
    logEm(particles)
    log({mouse})
    log('-----------')
    log(new Date)
},0)