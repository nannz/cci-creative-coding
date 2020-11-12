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
        this.lineWidth = Math.random()*10;
    }
    display(){
        //size is changing based on a sin value
        this.r = this.baseR*(1+Math.abs(Math.sin(frameCount*this.val)));
        context.save();
        context.translate(this.centreX,this.centreY);
        context.rotate(frameCount*0.01);// Date.getMilliseconds()
        context.beginPath();
        context.strokeStyle = 'hsl('+this.hue+', 90%, 70%)';
        for (var i = 0; i < this.segments; i++) {
            var xJW = Math.sin(this.spacing * i * (this.centreX/50)) * Math.cos(this.spacing * i * ( this.centreY/50)) * this.r - this.r;
            var yJW = Math.sin(this.spacing * i* (this.centreX/50)) * Math.sin(this.spacing * i * ( this.centreY/50)) * this.r - this.r;

            context.lineTo(xJW+this.r,yJW+this.r);
        }
        context.lineWidth = this.lineWidth;
        context.stroke(); //draw the outline
        context.closePath();
        context.restore();
    }

    displayCircles(){
        this.r = this.baseR*(1+Math.abs(Math.sin(frameCount*this.val)));
        context.save();
        context.translate(this.centreX,this.centreY);
        context.rotate(frameCount*0.01);// Date.getMilliseconds()
        //draw circles
        for (var i = 0; i < segments; i++) {

            var xJW = Math.sin(this.spacing * i * (this.centreX/50)) * Math.cos(this.spacing * i * ( this.centreY/50)) * this.r - this.r;
            var yJW = Math.sin(this.spacing * i* (this.centreX/50)) * Math.sin(this.spacing * i * ( this.centreY/50)) * this.r - this.r;
            context.beginPath();
            context.arc(xJW, yJW, 5, 0, Math.PI * 2, true); // Outer circle
            //context.lineTo(xJW+this.r,yJW+this.r);
            context.fillStyle = 'hsl('+this.hue+', 90%, 70%)';
            context.fill();
            context.closePath();

        }
        context.restore();

    }
}
