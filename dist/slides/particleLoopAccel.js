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
    a.map( ({position}) => {
          log(`x: ${position[0]}`)
          log(`y: ${position[1]}`)
          log(`-----------`)
    })

const random = (min=0, max=400) =>
    Math.random()*(max-min)+min

let particles = Array(1)
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

// loops

const WORLD_FRICTION = .95

looper(t => {
    particles = particles.map(p => update(p, WORLD_FRICTION))
})()

// looper(t => {
//     particles = particles.map(p => {
//         return {...p, accel:[1,1]}
//     })
// })()

setInterval(t => {
    reset()
    logEm(particles)
},0)
