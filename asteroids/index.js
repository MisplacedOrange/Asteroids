const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

context.fillStyle = 'black'
context.fillRect(0, 0, canvas.width, canvas.height)

class Player {
    constructor({position, velocity}) {
        this.postition = position // {x, y}
        this.velocity = velocity
    }

    draw() {
        context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false)
        context.fillStyle = 'red'
        context.fill()

        // context.fillStyle = 'red'
        // context.fillRect(this.position.x, this.postition.y, 100, 100)
        context.moveTo(this.position.x + 30, this.position.y)
        context.lineTo(this.position.x - 10, this.position.y - 10)
        context.lineTo(this.position.x - 10, this.position.y + 10)
        context.closePath()

        context.strokeStyle = 'white'
        context.stroke()

    }
}

const player = new Player({
    position:{x: canvas.width / 2, y: canvas.height / 2},
    velocity: { x: 0, y: 0},
})

player.draw

console.log(player)
