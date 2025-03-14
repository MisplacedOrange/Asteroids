const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight


class Player {
    constructor({position, velocity}) {
        this.position = position // {x, y}
        this.velocity = velocity
        this.rotation = 0
    }

    draw() {
        context.save()

        context.translate(this.position.x, this.position.y)
        context.rotate(this.rotation)
        context.translate(-this.position.x, -this.position.y)
        
        context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false)
        context.fillStyle = 'white'
        context.fill()

        // context.fillStyle = 'red'
        // context.fillRect(this.position.x, this.postition.y, 100, 100)
        context.beginPath()
        context.moveTo(this.position.x + 30, this.position.y)
        context.lineTo(this.position.x - 10, this.position.y - 10)
        context.lineTo(this.position.x - 10, this.position.y + 10)
        context.closePath()

        context.strokeStyle = 'white'
        context.stroke()
        context.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
const player = new Player({
    position:{x: canvas.width / 2, y: canvas.height / 2},
    velocity: { x: 0, y: 0},
})
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

const SPEED = 3
const ROTATIONAL_SPEED = 0.05
const FRICTION = 0.97

function animate() {
    window.requestAnimationFrame(animate)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)

    player.update()

    if (keys.w.pressed) {
        player.velocity.x = Math.cos(player.rotation) * 3
        player.velocity.y = Math.sin(player.rotation) * 3
    } else if (!keys.w.pressed) {
        player.velocity.x *= FRICTION
        player.velocity.y *= FRICTION
    }

    if (keys.d.pressed) player.rotation += ROTATIONAL_SPEED
        else if (keys.a.pressed) player.rotation -= ROTATIONAL_SPEED
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
            keys.w.pressed = true
            break
        case 'KeyA':
            keys.a.pressed = true
            break
        case 'KeyD':
            keys.d.pressed = true
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
            keys.w.pressed = false
            break
        case 'KeyA':
            keys.a.pressed = false
            break
        case 'KeyD':
            keys.d.pressed = false
            break
    }
})
