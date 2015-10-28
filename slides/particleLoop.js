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

// ------------ new stuff

const update = (p) => {
    let [[px,py], [vx,vy]] =
            [p.position, p.velocity],
        position = [px+vx, py+vy]

    return { ...p, position }
}

function update_physics() {
    requestAnimationFrame(update_physics)
    particles = particles.map(p => update(p))
}
update_physics()

setInterval(t => {
    reset()
    logEm(particles)
    log(new Date)
},0)
