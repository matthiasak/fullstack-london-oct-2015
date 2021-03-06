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
const update = (p, time, friction) => {
    let [[px,py], [vx,vy], [ax,ay]] =
        [p.position, p.velocity, p.accel]

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

const orb = (mass, [px,py]) => {
    return {...particle([px,py], [0,0], [0,0]), mass}
}

let orbs = []

// the mouse
window.addEventListener('mousedown',
    ({clientX, clientY}) =>
        orbs.push(orb(random(10,40), [clientX,clientY])))

/**
 * PHYSICS UPDATES
 */

const WORLD_FRICTION = 0.1
looper((time) => {
    orbs = orbs.map(p =>
        update(p, time, WORLD_FRICTION))
    // time as mutiplier?
    // --> changes "px per frame"
    // --> velocity to "px per second"
})()

looper((time) => {
    orbs = orbs.map(p =>
        applyForce(p, time, [0,32.174]))
    // 32.174ft/sec^2
    //
    // time as mutiplier?
    // --> changes "px per frame"
    // --> velocity to "px per second"
})()

looper(() => {

    // with walls
    //
    // OMG THIS IS SO UGLY
    orbs = orbs.map(p => {
        if(p.position[1] + .5*p.mass >= canvas.height){
            p = {
                ...p,
                position: [p.position[0], canvas.height - .5*p.mass],
                accel:[0,0],
                velocity: [p.velocity[0], p.velocity[1]*-.75]
            }
        }
        if(p.position[0] - .5*p.mass <= 0){
            p = {
                ...p,
                position: [.5*p.mass, p.position[1]],
                accel:[0,p.accel[1]],
                velocity: [p.velocity[0]*-.75, p.velocity[1]] }
        }
        if(p.position[0] + .5*p.mass >= canvas.width){
            p = {
                ...p,
                position: [canvas.width - .5*p.mass, p.position[1]],
                accel:[0,p.accel[1]],
                velocity: [p.velocity[0]*-.75, p.velocity[1]] }
        }
        return p
    })
})()

looper(() => {
    // with each other
    orbs = orbs.map(p => {
        //any collisions?
        orbs.forEach(p2 => {
            // ignore comparing to self
            if(p2===p) return

            let distance = mag(sub(p2.position, p.position))

            if(distance < (p2.mass+p.mass)/2){
                // direction away from collision
                let diff = normalize(sub(p.position, p2.position))
                // I like to move it, move it
                p.velocity = diff
            }
        })

        return p
    })
})()

/**
 * DRAW UPDATES
 */

// draw every 16ms
looper((t) => {
    // draw black box
    c.fillStyle = '#000'
    c.fillRect(0,0,canvas.width,canvas.height)

    // draw orbs
    c.fillStyle = 'red'
    orbs.forEach(({position, mass}) => {
        let [x,y] = position
        c.beginPath()
        c.arc(x, y, mass/2, 0, 2*Math.PI)
        c.fill()
    })
})()