class Circle {
  constructor (width, height, x, y) {
    this.position = null
    this.width = width
    this.height = height
    this.x = x
    this.y = y
  }

  create (p, position) {
    this.position = position

    p.fill(249, 66, 58)
    p.stroke(255)
    p.strokeWeight(2)

    for (let o = 0; o < 5; o++) {
      p.push()
      p.translate(-1 * (this.width -(this.x + (o * 30))), this.position,(-1 * this.y))
      p.cylinder(30, 10)
      p.pop()
    }
  }
}


class Circle2 {
  constructor (p, width, height) {
    this.position = null
    this.width = width
    this.height = height
    this.p = p
  }

  draw (position) {
    this.p.fill(249, 66, 58)
    this.p.stroke(255)
    this.p.strokeWeight(2)

    const width = 40
    const height = 3

    for (let o = 0; o < 8; o++) {
      this.p.push()
      this.p.translate(o*(width/3), position - (o*height/2), 0)
      this.p.cylinder(width, height)
      this.p.pop()
    }
  }
}

export {Circle, Circle2}
