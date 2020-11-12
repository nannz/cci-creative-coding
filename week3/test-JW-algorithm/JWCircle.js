class JWCircle{
    constructor(x,y,r,spacing) {
        this.centreX = x;//mouseX
        this.centreY = y;//mouseY
        this.spacing =spacing;
        this.hue = Math.floor(Math.random()*255);
        this.r = Math.random()*r;
    }
    display(){
        context.save();
        context.translate(this.centreX,this.centreY);
        context.beginPath();
        for (var i = 0; i < segments; i++) {
            context.strokeStyle = 'hsl('+this.hue+', 90%, 70%)';//"#FF0000"; //set the line colour to black
            var xJW = Math.sin(this.spacing * i * (this.centreX/50)) * Math.cos(this.spacing * i * ( this.centreY/50)) * this.r - this.r;
            var yJW = Math.sin(this.spacing * i* (this.centreX/50)) * Math.sin(this.spacing * i * ( this.centreY/50)) * this.r - this.r;

            context.lineTo(xJW+this.r,yJW+this.r);
        }
        context.stroke(); //draw the outline
        context.closePath();
        context.restore();
    }
}
