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

logEm(particles)
