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

const particle = (
    position=[random(), random()],
    velocity=[0,0],
    accel=[0,0]
) => {
    return {accel, velocity, position}
}

const logEm = (a) =>
    a.map( ({position}) => `
x: ${position[0]}
y: ${position[1]}
-----------`).join('')

const random = (min=0, max=400) =>
    Math.random()*(max-min)+min

let particles = Array(2)
    .fill(true)
    .map(_ => particle())


// GIVE ME THE JUICE!
//
// update, now with more acceleration.
//
// velocity += accel_______
// velocity *= 1-friction _|---> part a
// position += velocity--------> part b

const update = (p, friction) => {
    let [[px,py], [vx,vy], [ax,ay]] =
        [p.position, p.velocity, p.accel]

    vx = (vx+ax) * (1-friction)
    vy = (vy+ay) * (1-friction)

    let position = [px + vx, py + vy],
        accel = [0,0],
        velocity = [vx,vy]

    return { ...p, position, accel, velocity }
}

// painting loop
const WORLD_FRICTION = .95

looper(t => {
    particles = particles.map(p =>
        update(p, WORLD_FRICTION))
})()

setInterval(t => {
    reset()
    log(new Date)
    log(logEm(particles))
}, 0)

// applying a force to each particle

const scale = ([x,y],n) =>
    [n * x, n * y]

const add = (...vx) =>
    vx.reduce((a, v) =>
        [a[0] + v[0], a[1] + v[1]],
        [0,0])

// force = m*a
const applyForce = (p, m, a) => {
    let {accel} = p
    accel = add(scale(a,m), accel)
    return { ...p, accel }
}

setInterval(() => {
    particles = particles.map(p =>
        applyForce(
            p,
            1,
            [random(-50,50),random(-50,50)]
        ))
}, 1000)