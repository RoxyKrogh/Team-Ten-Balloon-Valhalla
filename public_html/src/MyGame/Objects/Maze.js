/* File: Maze.js 
 *
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
 FontRenderable, SpriteRenderable, LineRenderable,
 GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";
function Maze(texture, hazardTex, x, y, w, h, res, frct, p) {
    
    this.mMazeTexture = new TextureRenderable(texture);
    this.mMazeTexture.getXform().setPosition(x, y);
    this.mMazeTexture.getXform().setSize(w, h);

    this.mShapes = new GameObjectSet();
    this.mHazards = new GameObjectSet();
    this.mPset = new ParticleGameObjectSet();
    this.createBounds(hazardTex, x, y, w, h, res, frct);
    this.rep = p;
    this.pos = [x, y];
}

Maze.prototype.draw = function (aCamera) {
    this.mShapes.draw(aCamera);
    this.mHazards.draw(aCamera);
    this.mMazeTexture.draw(aCamera);
    if (this.rep === true) {
        this.mPset.draw(aCamera);
    }
};

Maze.prototype.update = function () {
    this.mShapes.update();
    this.mHazards.update();
    if (this.rep === true) {
        this.mPset.update();
        this.particleCollision();
    }
    gEngine.Physics.processCollision(this.mShapes, []);
};

Maze.prototype.testHazards = function (gameobj, wcCoord) {
    var i;
    for (i = 0; i < this.mHazards.mSet.length; i++) {
        if (gameobj.getBBox().intersectsBound(this.mHazards.mSet[i].getBBox()) && gameobj.pixelTouches(this.mHazards.mSet[i], wcCoord))
            return true;
    }
    return false;
};

Maze.prototype.createBounds = function (hazardTex, x, y, w, h, res, frct, art) {

    var tx = x - w/2;
    var ty = y + h/2;
    var sx = w / this.mMazeTexture.mTexWidth;
    var sy = h / this.mMazeTexture.mTexHeight;

    // create maze walls (resolution = 32x32)
    var ps = this.mMazeTexture.mTexWidth / 32;
    function wallAtPixels(maze, x1, y1, x2, y2) {
        maze.blockAt(tx + (x1 * ps * sx), ty - (y1 * ps * sy),
                tx + (x2 * ps * sx), ty - (y2 * ps * sy),
                res, frct, art);
    }
    function spikeAtPixel(maze, x, y, direction) {
        var spike = new Spike(hazardTex,
                              tx + ((x + 0.5) * ps * sx), 
                              ty - ((y + 0.5) * ps * sy), 
                              direction);
        maze.mHazards.addToSet(spike);
    }
    
    wallAtPixels(this, 0,   1,  14, 4);
    wallAtPixels(this, 17,  1,  32, 4);
    wallAtPixels(this, 0,   4,  3,  32);
    wallAtPixels(this, 6,   4,  8,  14);
    wallAtPixels(this, 10,  7,  15, 14);
    wallAtPixels(this, 13,  14, 15, 19);
    wallAtPixels(this, 13,  19, 18, 28);
    wallAtPixels(this, 7,   26, 13, 31);
    wallAtPixels(this, 13,  28, 25, 31);
    wallAtPixels(this, 4,   31, 28, 32);
    wallAtPixels(this, 3,   23, 4,  32);
    wallAtPixels(this, 7,   23, 10, 26);
    wallAtPixels(this, 3,   17, 10, 20);
    wallAtPixels(this, 28,  4,  32, 32);
    wallAtPixels(this, 24,  4,  28, 12);
    wallAtPixels(this, 18,  7,  21, 17);
    wallAtPixels(this, 21,  15, 25, 17);
    wallAtPixels(this, 24,  17, 25, 21);
    wallAtPixels(this, 20,  19, 21, 26);
    wallAtPixels(this, 21,  24, 28, 26);
    wallAtPixels(this, 15,  7,  18, 9);
    
    spikeAtPixel(this, 3, 20, -1);
    spikeAtPixel(this, 3, 21, -1);
    spikeAtPixel(this, 3, 22, -1);
    
    spikeAtPixel(this, 10, 6, 0);
    spikeAtPixel(this, 20, 6, 0);
};

Maze.prototype.lightOn = function () {
    for (var i = 0; i < 4; i++) {
        this.mShapes.getObjectAt(i).getRenderable().setColor([1, 1, 1, .6]);
    }
};

Maze.prototype.lightOff = function () {
    for (var i = 0; i < 4; i++) {
        this.mShapes.getObjectAt(i).getRenderable().setColor([1, 1, 1, 0]);
    }
};

Maze.prototype.blockAt = function (x1, y1, x2, y2, res, frct, art) {
    var x = (x1 + x2) / 2, y = (y1 + y2) / 2, w = x2 - x1, h = y2 - y1;
    var p = new Renderable();
    p.setColor([1, 1, 1, 0]);
    var xf = p.getXform();
    xf.setSize(w, h);
    xf.setPosition(x, y);
    var g = new GameObject(p);
    var r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    g.toggleDrawRigidShape();

    r.setMass(0);
    r.setRestitution(res);
    r.setFriction(frct);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    this.mShapes.addToSet(g);
};

Maze.prototype.wallAt = function (x, y, h, res, frct, art) {
    var w = 3;
    var p = new TextureRenderable(art);
    var xf = p.getXform();
    xf.setSize(w, h);
    xf.setPosition(x, y);
    var g = new GameObject(p);
    var r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    g.toggleDrawRigidShape();

    r.setMass(0);
    r.setRestitution(res);
    r.setFriction(frct);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    this.mShapes.addToSet(g);
};

Maze.prototype.platformAt = function (x, y, w, rot, res, frct, art) {
    var h = 3;
    var p = new TextureRenderable(art);
    var xf = p.getXform();
    xf.setSize(w, h);
    xf.setPosition(x, y);
    var g = new GameObject(p);
    var r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    g.toggleDrawRigidShape();

    r.setMass(0);
    r.setRestitution(res);
    r.setFriction(frct);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setRotationInDegree(rot);
    this.mShapes.addToSet(g);
};

Maze.prototype.getPos = function () {
    return this.pos;
};

Maze.prototype.particleCollision = function () {
    for (var i = 0; i < 4; i++) {
        gEngine.ParticleSystem.processObjSet(this.mShapes.getObjectAt(i), this.mPset);
    }
};

Maze.prototype.createParticle = function (atX, atY, image) {
    var life = 30 + Math.random() * 200;
    var p = new ParticleGameObject(image, atX, atY, life);
    p.getRenderable().setColor([.61, .30, .08, 1]);

    // size of the particle
    var r = Math.random() * 2.5;
    p.getXform().setSize(r, r);

    // final color
    p.setFinalColor([.61, .30, .08, 1]);

    // velocity on the particle
    var fx = 30 * Math.random() - 60 * Math.random();
    var fy = 20 * Math.random() + 10;
    p.getParticle().setVelocity([fx, fy]);

    // size delta
    p.setSizeDelta(0.985);

    return p;
};