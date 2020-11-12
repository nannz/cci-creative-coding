"use strict";
class JWCircle{
    constructor(x,y,r) {
        this.centreX = x;//mouseX
        this.centreY = y;//mouseY
        this.segments = Math.floor(Math.random()*1000);
        this.spacing =TWO_PI / this.segments;
        this.hue = Math.floor(Math.random()*255);
        this.baseR = Math.random()*r;
        this.r = this.baseR;
        this.val = Math.random()*0.02;
    }
    display(){
        //size is changing based on a sin value
        this.r = this.baseR*(1+Math.abs(Math.sin(frameCount*this.val)));
        context.save();
        context.translate(this.centreX,this.centreY);
        context.rotate(frameCount*0.01);// Date.getMilliseconds()
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
