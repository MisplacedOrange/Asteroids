const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Player {
  constructor({ position, velocity }) {
    this.position = position // {x, y}
    this.velocity = velocity
    this.rotation = 0
  }

  draw() {
    context.save()

    context.translate(this.position.x, this.position.y)
    context.rotate(this.rotation)
    context.translate(-this.position.x, -this.position.y)

    context.beginPath()
    context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false)
    context.fillStyle = 'white'
    context.fill()
    context.closePath()

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

  getVertices() {
    const cos = Math.cos(this.rotation)
    const sin = Math.sin(this.rotation)

    return [
      {
        x: this.position.x + cos * 30 - sin * 0,
        y: this.position.y + sin * 30 + cos * 0,
      },
      {
        x: this.position.x + cos * -10 - sin * 10,
        y: this.position.y + sin * -10 + cos * 10,
      },
      {
        x: this.position.x + cos * -10 - sin * -10,
        y: this.position.y + sin * -10 + cos * -10,
      },
    ]
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 5
  }

  draw() {
    context.beginPath()
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    context.closePath()
    context.fillStyle = 'white'
    context.fill()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Asteroid {
  constructor({ position, velocity, radius }) {
    this.position = position
    this.velocity = velocity
    this.radius = radius
  }

  draw() {
    context.beginPath()
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    context.closePath()
    context.strokeStyle = 'white'
    context.stroke()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

const player = new Player({
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  velocity: { x: 0, y: 0 },
})

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

const SPEED = 3
const ROTATIONAL_SPEED = 0.05
const FRICTION = 0.97
const PROJECTILE_SPEED = 3

const projectiles = []
const asteroids = []

const intervalId = window.setInterval(() => {
  const index = Math.floor(Math.random() * 4)
  let x, y
  let vx, vy
  let radius = 50 * Math.random() + 10

  switch (index) {
    case 0: // left side of the screen
      x = 0 - radius
      y = Math.random() * canvas.height
      vx = 1
      vy = 0
      break
    case 1: // bottom side of the screen
      x = Math.random() * canvas.width
      y = canvas.height + radius
      vx = 0
      vy = -1
      break
    case 2: // right side of the screen
      x = canvas.width + radius
      y = Math.random() * canvas.height
      vx = -1
      vy = 0
      break
    case 3: // top side of the screen
      x = Math.random() * canvas.width
      y = 0 - radius
      vx = 0
      vy = 1
      break
  }

  asteroids.push(
    new Asteroid({
      position: {
        x: x,
        y: y,
      },
      velocity: {
        x: vx,
        y: vy,
      },
      radius,
    })
  )

  console.log(asteroids)
}, 3000)

function circleCollision(circle1, circle2) {
  const xDifference = circle2.position.x - circle1.position.x
  const yDifference = circle2.position.y - circle1.position.y

  const distance = Math.sqrt(
    xDifference * xDifference + yDifference * yDifference
  )

  if (distance <= circle1.radius + circle2.radius) {
    return true
  }

  return false
}

function circleTriangleCollision(circle, triangle) {
  // Check if the circle is colliding with any of the triangle's edges
  for (let i = 0; i < 3; i++) {
    let start = triangle[i]
    let end = triangle[(i + 1) % 3]

    let dx = end.x - start.x
    let dy = end.y - start.y
    let length = Math.sqrt(dx * dx + dy * dy)

    let dot =
      ((circle.position.x - start.x) * dx +
        (circle.position.y - start.y) * dy) /
      Math.pow(length, 2)

    let closestX = start.x + dot * dx
    let closestY = start.y + dot * dy

    if (!isPointOnLineSegment(closestX, closestY, start, end)) {
      closestX = closestX < start.x ? start.x : end.x
      closestY = closestY < start.y ? start.y : end.y
    }

    dx = closestX - circle.position.x
    dy = closestY - circle.position.y

    let distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= circle.radius) {
      return true
    }
  }

  // No collision
  return false
}

function isPointOnLineSegment(x, y, start, end) {
  return (
    x >= Math.min(start.x, end.x) &&
    x <= Math.max(start.x, end.x) &&
    y >= Math.min(start.y, end.y) &&
    y <= Math.max(start.y, end.y)
  )
}

let gameover = false

function displayGameOver() {
  context.fillStyle = 'red';
  context.font = '50px Arial';
  context.textAlign = 'center';
  context.fillText('GAME OVER, YOU LOSE', canvas.width / 2, canvas.height / 2);
}

function animate() {
  if (gameover) {
    displayGameOver();
    return; 
  }

  const animationId = window.requestAnimationFrame(animate);
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
    projectile.update();

    // Garbage collection for projectiles
    if (
      projectile.position.x + projectile.radius < 0 ||
      projectile.position.x - projectile.radius > canvas.width ||
      projectile.position.y - projectile.radius > canvas.height ||
      projectile.position.y + projectile.radius < 0
    ) {
      projectiles.splice(i, 1);
    }
  }

  // Asteroid management
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];
    asteroid.update();

    if (circleTriangleCollision(asteroid, player.getVertices())) {
      console.log('GAME OVER');
      gameover = true; 
      window.cancelAnimationFrame(animationId);
      clearInterval(intervalId);
      displayGameOver();
      return; 
    }

    // Garbage collection for asteroids
    if (
      asteroid.position.x + asteroid.radius < 0 ||
      asteroid.position.x - asteroid.radius > canvas.width ||
      asteroid.position.y - asteroid.radius > canvas.height ||
      asteroid.position.y + asteroid.radius < 0
    ) {
      asteroids.splice(i, 1);
    }

    // Projectiles
    for (let j = projectiles.length - 1; j >= 0; j--) {
      const projectile = projectiles[j];

      if (circleCollision(asteroid, projectile)) {
        asteroids.splice(i, 1);
        projectiles.splice(j, 1);
      }
    }
  }

  if (keys.w.pressed) {
    player.velocity.x = Math.cos(player.rotation) * SPEED;
    player.velocity.y = Math.sin(player.rotation) * SPEED;
  } else {
    player.velocity.x *= FRICTION;
    player.velocity.y *= FRICTION;
  }

  if (keys.d.pressed) player.rotation += ROTATIONAL_SPEED;
  else if (keys.a.pressed) player.rotation -= ROTATIONAL_SPEED;
}

animate();

window.addEventListener('keydown', (event) => {
  if (gameover) return; // Prevent input after game over

  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = true;
      break;
    case 'KeyA':
      keys.a.pressed = true;
      break;
    case 'KeyD':
      keys.d.pressed = true;
      break;
    case 'Space':
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + Math.cos(player.rotation) * 30,
            y: player.position.y + Math.sin(player.rotation) * 30,
          },
          velocity: {
            x: Math.cos(player.rotation) * PROJECTILE_SPEED,
            y: Math.sin(player.rotation) * PROJECTILE_SPEED,
          },
        })
      );
      break;
  }
});

window.addEventListener('keyup', (event) => {
  if (gameover) return; // Prevent input after game over

  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = false;
      break;
    case 'KeyA':
      keys.a.pressed = false;
      break;
    case 'KeyD':
      keys.d.pressed = false;
      break;
  }
});
