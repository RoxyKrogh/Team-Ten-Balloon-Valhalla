/*
 * File: MazeLevel.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MazeLevel() {
    this.kSpriteSheet = "assets/balloonsprites.png";
    this.kMazeWalls = "assets/maze.png";
    
    // The camera to view the scene
    this.mLeftCamera = null;
    this.mRightCamera = null;
    this.mMapCamera = null;
    
    this.mLeftBalloon = null;
    this.mRightBalloon = null;
    
    this.mLabels = null;
    
    this.world = null;
    
    this.mCurrentObj = 0;
    this.mTarget = null;
    
    this.mTargetAngle = 0;
    this.mSmoothAngle = null;
}
gEngine.Core.inheritPrototype(MazeLevel, Scene);


MazeLevel.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kSpriteSheet);
    gEngine.Textures.loadTexture(this.kMazeWalls);
};

MazeLevel.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kSpriteSheet);
    gEngine.Textures.loadTexture(this.kMazeWalls);
    gEngine.Core.startScene(new MyGame());
};

MazeLevel.prototype.initialize = function () {
    
    // Step A: set up the cameras
    this.mLeftCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        50,                     // width of camera
        [0, 0, 400, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mLeftCamera.setBackgroundColor([1, 0.8, 0.8, 1]);
    
    this.mRightCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        50,                     // width of camera
        [400, 0, 400, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mRightCamera.setBackgroundColor([0.8, 1, 0.8, 1]);
    
    this.mMapCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        150,                     // width of camera
        [150, 50, 450, 500]         // viewport (orgX, orgY, width, height)
    );
    this.mMapCamera.setBackgroundColor([0.8, 0.8, 1, 1]);
    
    this.mSmoothAngle = new Interpolate(0, 60, 0.1);
    
    // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    this.world = new GameObjectSet();
    var m;
    m = new Maze(this.kMazeWalls, 0,0,100,100,.3,.7,false); 
    this.world.addToSet(m);
    
    this.mLeftBalloon = new Balloon(this.kSpriteSheet, -30, -40);
    this.mLeftBalloon.getRenderable().setColor([1,0,0,0.5]);
    this.mLeftBalloon.setUpVector(this.mLeftCamera.getUpVector());
    m.mShapes.addToSet(this.mLeftBalloon);
    
    this.mRightBalloon = new Balloon(this.kSpriteSheet, 30, -40);
    this.mRightBalloon.getRenderable().setColor([0,1,0,0.5]);
    this.mRightBalloon.setUpVector(this.mRightCamera.getUpVector());
    m.mShapes.addToSet(this.mRightBalloon);
    
    this.mLabels = new GameObjectSet();
};

MazeLevel.prototype.addLabel = function(text, color, x, y, h) {
    var m = new FontRenderable(text);
    m.setColor(color);
    m.getXform().setPosition(x, y);
    m.setTextHeight(h);
    this.mLabels.addToSet(m);
};

MazeLevel.prototype.drawView = function(aCamera) {
    aCamera.setupViewProjection();
    this.world.draw(aCamera);
    this.mLabels.draw(aCamera);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MazeLevel.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.drawView(this.mLeftCamera);
    this.drawView(this.mRightCamera);
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.M))
        this.drawView(this.mMapCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MazeLevel.kBoundDelta = 0.1;
MazeLevel.prototype.update = function () {
    var camAngle = this.mLeftCamera.getRotation();
    
    var area = this.world.getObjectAt(this.mCurrentObj);
    var pos = area.getPos();
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Left)) {
        this.mTargetAngle += Math.PI / 4;
        this.mSmoothAngle.setFinalValue(this.mTargetAngle);
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Right)) {
        this.mTargetAngle -= Math.PI / 4;
        this.mSmoothAngle.setFinalValue(this.mTargetAngle);
    }
    
    this.mSmoothAngle.updateInterpolation();
    this.world.update();
    
    
    console.log(this.mTargetAngle, this.mGravityAngle)
    
    this.mLeftCamera.setRotation(this.mSmoothAngle.getValue());
    this.mLeftCamera.getWCCenter()[0] = this.mLeftBalloon.getXform().getXPos();
    this.mLeftCamera.getWCCenter()[1] = this.mLeftBalloon.getXform().getYPos();
    this.mRightCamera.setRotation(this.mSmoothAngle.getValue());
    this.mRightCamera.getWCCenter()[0] = this.mRightBalloon.getXform().getXPos();
    this.mRightCamera.getWCCenter()[1] = this.mRightBalloon.getXform().getYPos();
    this.mMapCamera.setRotation(this.mSmoothAngle.getValue());
};
