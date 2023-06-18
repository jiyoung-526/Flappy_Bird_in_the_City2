let high = 300;

class Bird {
    constructor() {
      this.r = height/4.3; //Size of bird
      this.x = 200;
      this.y = height - high;
      this.vy = 0;
      this.gravity = 0.07;
    }
  
    fly() {
      this.vy = -3;
    }
  
    fall() {
      this.y += this.gravity;
    }
  
    move() {
      this.y += this.vy;
      this.vy += this.gravity;
      this.y = constrain(this.y, 0, height - (high-130));
      //계속 떨어지지 않게, 최소값과 최대값 사이에 제한(n, min, max)
    }
  
    hits(wall) {
      let x1 = this.x + this.r * 0.5;
      let y1 = this.y + this.r * 0.5;
      let x2 = wall.x + wall.r * 0.5;
      let y2 = wall.y + wall.r * 0.5;
      return collideCircleCircle(x1, y1, this.r-10, x2, y2, wall.r);
    }
  
    show() {
      //image(bImg, this.x, this.y, this.r+20, this.r);
      frame += 1;
      if(frame>8) frame = 0;
      image(bimgs[frame], this.x, this.y, this.r+20, this.r);
    }
  }