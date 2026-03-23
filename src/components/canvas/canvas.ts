
// 炫酷渐变色背景粒子线条折线连接canvas动画
export const canvas = (val) => {
  var requestAnimationFrame = window.requestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60)
  }

  var canvas = document.getElementById("canvas");
  // let canvas = val
  //let ctx = canvas.getContext();
  let maximumPossibleDistance
  let mousePositionX
  let mousePositionY
  let mouseElement
  let lines = 0
  let objects = []
  var initAnimation = function () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    maximumPossibleDistance = Math.round(Math.sqrt((canvas.width * canvas.width) + (canvas.height * canvas.height)))
    Math.floor(canvas.width / 2)
    Math.floor(canvas.height / 2)
    objects.length = 0
    clearCanvas()
    createParticles()
  }
  window.addEventListener('resize', function () { initAnimation() }, false)
  // 线条参数配置
  var options = {
    // 初始线条数量
    particlesNumber: 80,
    // 圆点大小
    initialSize: 3,
    moveLimit: 50,
    durationMin: 50,
    durationMax: 300,
    drawConnections: true,
    mouseInteractionDistance: 150,
    mouseGravity: true,
    drawMouseConnections: true,
    // 图标色彩
    red: 25,
    green: 200,
    blue: 255,
    opacity: 1,
    // 已连接线条
    connectionRed: 255,
    connectionGreen: 255,
    connectionBlue: 255,
    connectionOpacity: 0.2,
    // 鼠标移动线条
    mouseConnectionRed: 255,
    mouseConnectionGreen: 255,
    mouseConnectionBlue: 255,
    mouseConnectionOpacity: 0.2

  }
  var getRandomBetween = function (a, b) {
    return Math.floor(Math.random() * b) + a
  }
  var getDistance = function (element1, element2) {
    var difX = Math.round(Math.abs(element1.positionX - element2.positionX))
    var difY = Math.round(Math.abs(element1.positionY - element2.positionY))

    return Math.round(Math.sqrt((difX * difX) + (difY * difY)))
  }
  function Particle (positionX, positionY, size, red, green, blue, opacity) {
    this.positionX = positionX
    this.positionY = positionY
    this.size = size

    this.duration = getRandomBetween(options.durationMin, options.durationMax)
    this.limit = options.moveLimit
    this.timer = 0

    this.red = red
    this.green = green
    this.blue = blue
    this.opacity = opacity

    this.color = 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',+' + this.opacity + ')'
  }
  function MouseParticle (positionX, positionY, size, red, green, blue, opacity) {
    this.positionX = mousePositionX
    this.positionY = mousePositionY
    this.size = size

    this.red = red
    this.green = green
    this.blue = blue
    this.opacity = opacity

    this.color = 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',+' + this.opacity + ')'
  }
  Particle.prototype.animateTo = function (newX, newY) {
    var duration = this.duration

    var animatePosition = function (newPosition, currentPosition) {
      if (newPosition > currentPosition) {
        var step = (newPosition - currentPosition) / duration
        newPosition = currentPosition + step
      } else {
        step = (currentPosition - newPosition) / duration
        newPosition = currentPosition - step
      }

      return newPosition
    }

    this.positionX = animatePosition(newX, this.positionX)
    this.positionY = animatePosition(newY, this.positionY)

    // generate new vector

    if (this.timer === this.duration) {
      this.calculateVector()
      this.timer = 0
    } else {
      this.timer++
    }
  }
  Particle.prototype.updateColor = function () {
    this.color = 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',+' + this.opacity + ')'
  }
  Particle.prototype.calculateVector = function () {
    var distance
    var newPosition = {}
    var particle = this

    var getCoordinates = function () {
      newPosition.positionX = getRandomBetween(0, window.innerWidth)
      newPosition.positionY = getRandomBetween(0, window.innerHeight)

      distance = getDistance(particle, newPosition)
    }

    // eslint-disable-next-line no-unmodified-loop-condition
    while ((typeof distance === 'undefined') || (distance > this.limit)) {
      getCoordinates()
    }

    this.vectorX = newPosition.positionX
    this.vectorY = newPosition.positionY
  }
  Particle.prototype.testInteraction = function () {
    if (!options.drawConnections) return
    var closestElement
    var distanceToClosestElement = maximumPossibleDistance
    for (var x = 0; x < objects.length; x++) {
      var testedObject = objects[x]
      var distance = getDistance(this, testedObject)
      if ((distance < distanceToClosestElement) && (testedObject !== this)) {
        distanceToClosestElement = distance
        closestElement = testedObject
      }
    }
    if (closestElement) {
      canvas.beginPath()
      canvas.moveTo(this.positionX + this.size / 2, this.positionY + this.size / 2)
      canvas.lineTo(closestElement.positionX + closestElement.size * 0.5, closestElement.positionY + closestElement.size * 0.5)
      canvas.strokeStyle = 'rgba(' + options.connectionRed + ',' + options.connectionGreen + ',' + options.connectionBlue + ',' + options.connectionOpacity + ')'
      canvas.stroke()
      lines++
    }
  }
  MouseParticle.prototype.testInteraction = function () {
    if (options.mouseInteractionDistance === 0) return

    var closestElements = []
    // var distanceToClosestElement = maximumPossibleDistance;

    for (var x = 0; x < objects.length; x++) {
      var testedObject = objects[x]
      var distance = getDistance(this, testedObject)

      if ((distance < options.mouseInteractionDistance) && (testedObject !== this)) {
        closestElements.push(objects[x])
      }
    }

    for (var i = 0; i < closestElements.length; i++) {
      if (options.drawMouseConnections) {
        var element = closestElements[i]
        canvas.beginPath()
        canvas.moveTo(this.positionX, this.positionY)
        canvas.lineTo(element.positionX + element.size * 0.5, element.positionY + element.size * 0.5)
        canvas.strokeStyle = 'rgba(' + options.mouseConnectionRed + ',' + options.mouseConnectionGreen + ',' + options.mouseConnectionBlue + ',' + options.mouseConnectionOpacity + ')'
        canvas.stroke()
        lines++
      }
      if (options.mouseGravity) {
        closestElements[i].vectorX = this.positionX
        closestElements[i].vectorY = this.positionY
      }
    }
  }
  Particle.prototype.updateAnimation = function () {
    this.animateTo(this.vectorX, this.vectorY)
    this.testInteraction()
    canvas.fillStyle = this.color
    canvas.fillRect(this.positionX, this.positionY, this.size, this.size)
  }
  MouseParticle.prototype.updateAnimation = function () {
    this.positionX = mousePositionX
    this.positionY = mousePositionY
    this.testInteraction()
  }
  var createParticles = function () {
    // create mouse particle
    mouseElement = new MouseParticle(0, 0, options.initialSize, 255, 255, 255)
    for (var x = 0; x < options.particlesNumber; x++) {
      var randomX = Math.floor((Math.random() * window.innerWidth) + 1)
      var randomY = Math.floor((Math.random() * window.innerHeight) + 1)
      var particle = new Particle(randomX, randomY, options.initialSize, options.red, options.green, options.blue, options.opacity)
      particle.calculateVector()
      objects.push(particle)
    }
  }
  var updatePosition = function () {
    for (var x = 0; x < objects.length; x++) {
      objects[x].updateAnimation()
    }
    // handle mouse
    mouseElement.updateAnimation()
  }
  window.onmousemove = function (e) {
    mousePositionX = e.clientX
    mousePositionY = e.clientY
  }
  var clearCanvas = function () {
    canvas.clearRect(0, 0, window.innerWidth, window.innerHeight)
  }
  var lastCalledTime
  var fps
  var averageFps
  var averageFpsTemp = 0
  var averageFpsCounter = 0

  function requestFps () {
    if (!lastCalledTime) {
      lastCalledTime = Date.now()
      fps = 0
      return
    }
    var delta = (new Date().getTime() - lastCalledTime) / 1000
    lastCalledTime = Date.now()
    fps = Math.floor(1 / delta)

    averageFpsTemp = averageFpsTemp + fps
    averageFpsCounter++
    if (averageFpsCounter === 5) {
      averageFps = Math.floor(averageFpsTemp / 5)
      averageFpsCounter = 0
      averageFpsTemp = 0
    }
    if (!averageFps) {

    } else if (averageFps < 10) {

    }
  }
  var loop = function () {
    clearCanvas()
    updatePosition()
    canvas.fillStyle = '#fff'
    // ctx.fillText("FPS: " + fps + " lines: " + lines + " Average FPS: " + averageFps , 10, 20);
    lines = 0
    requestAnimationFrame(loop)
    requestFps()
  }
  initAnimation()
  loop()
  return lines
}

