class Wall {

    constructor() {
      //let num = random(200, 350);
      this.r = height;//num; //Size of Wall
      this.x = width;
      this.y = 0; //height - this.r;
    }
  
    move() {
      this.x -= 40;
    }
  
    show() {
      image(tImg, this.x, this.y, this.r/4, this.r);
    }
  
  }