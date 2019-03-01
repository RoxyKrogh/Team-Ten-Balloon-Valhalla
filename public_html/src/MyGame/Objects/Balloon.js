/* File: Balloon.js 
 *
 * Creates and initializes a Balloon object
 * overrides the update function of GameObject to define
 * simple sprite animation behavior behavior
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, TextureRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var kBalloonWidth = 3.0;
var kBalloonHeight = 3.0;

function Balloon(spriteTexture, atX, atY) {
        
    var w = kBalloonWidth;
    var h = kBalloonHeight;
    
    this.mUpVec = [0, 1];
    
    this.mBalloon = new SpriteRenderable(spriteTexture);
    this.mBalloon.setColor([1,1,1,0.5]);
    this.mBalloon.getXform().setPosition(atX, atY);
    this.mBalloon.getXform().setSize(w, h);
    this.mBalloon.setElementPixelPositions(548, 795, 450, 704);

    GameObject.call(this, this.mBalloon);
    
    var r = new RigidCircle(this.getXform(), 0.35*Math.sqrt(w*w + h*h)); 
    var vx = (Math.random() - 0.5);
    var vy = (Math.random() - 0.5);
    var speed = 20 + Math.random() * 10;
    r.setVelocity(vx * speed, vy * speed);
    this.setRigidBody(r);
    r.setRestitution(3.0);
    r.setFriction(.6);
    r.setMass(0.03);
    //this.toggleDrawRenderable();
    //this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Balloon, GameObject);

Balloon.prototype.setUpVector = function(vector) {
    this.mUpVec = vector;
};

Balloon.prototype.update = function (aCamera) {
    var v = [0,0];
    vec2.scale(v, this.mUpVec, 5.0);
    this.getRigidBody().mAcceleration = v;
    var p = [0,0];
    vec2.add(p, v, this.getXform().getPosition());
    this.rotateObjPointTo(p, 0.1);
    GameObject.prototype.update.call(this);
};