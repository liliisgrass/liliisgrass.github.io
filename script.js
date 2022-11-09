// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

window.addEventListener("resize", () =>{
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
})

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function hasCommonElements(array1, array2){
    for (item1 of array1){
        for (item2 of array2){
            if (item1 === item2){
                return true;
            }
        }
    }
    return false;
}

function random(minmax, exclude = []) {
    const range = [];
    for (let i = minmax[0]; i <= minmax[1]; i++){
        range.push(i);
    }
    let i = 0;
    while (i < exclude.length){
        for (const number of range){
            if (number === exclude[i]){
                range.splice(range.indexOf(number), 1);
            }
        }
        i++;
    }
        const num = Math.floor(Math.random() * (range.length));
        return range[num];
}

// function to generate random color

function randomRGB() {
  return `rgb(${random([0, 255])},${random([0, 255])},${random([0, 255])})`;
}

class Ball{
    constructor (x, y, xVel, yVel, color, size){
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.color = color;
        this.size = size;
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
    update(){
        if ((this.x + this.size) >= width){
            this.xVel = -(this.xVel);
        }
        if ((this.x + this.size) <= 0){
            this.xVel = -(this.xVel);
        }
        if ((this.y + this.size) >= height) {
            this.yVel = -(this.yVel);
        }
        
        if ((this.y - this.size) <= 0) {
            this.yVel = -(this.yVel);
        }
        
        this.x += this.xVel;
        this.y += this.yVel;
        
    }
    collisionDetect(){
        for (const ball of balls){
            if (this !== ball) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.pow((Math.pow(dx, 2) + Math.pow(dy, 2)), 0.5);

            if (distance < this.size + ball.size){
                this.xVel = (ball.yVel);
                ball.xVel = (this.yVel);
                ball.yVel = (this.xVel);
                this.yVel = (ball.xVel);
                }
            }
        }
    }
}

const balls = [];

while (balls.length < 10){
    const size = random([10, 20]);
    const ball = new Ball(
        random([0 + size, width - size]),
        random([0 + size, height - size]),
        random([-7, 7]),
        random([-7, 7]),
        randomRGB(),
        size
    );

    balls.push(ball)
}

function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);
  
    for (const ball of balls) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  
    requestAnimationFrame(loop);
  }

  loop();
  