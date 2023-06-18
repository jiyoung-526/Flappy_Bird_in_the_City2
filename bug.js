class bug {

    constructor() {
      let num = random(20, 45);
      this.r = num; //Size of bug
      this.x = width-100;
      this.y = this.r + random(height-150);//height - this.r;
    }
  
    move() {
      let ran = random(-2, 2);
      this.x -= 3.5;
      this.y -= ran;
    }
  
    show() {
      image(bugImg, this.x, this.y, this.r, this.r);
    }
  
  }