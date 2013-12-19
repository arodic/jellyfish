var uWorld = new M4x4.$();
var uView = new M4x4.$();
var uViewInv = new M4x4.$();
var uProjection = new M4x4.$();
var uWorldView = new M4x4.$();
var uWorldViewProj = new M4x4.$();

var uJoint0 = new M4x4.$();
var uJoint1 = new M4x4.$();
var uJoint2 = new M4x4.$();
var uJoint3 = new M4x4.$();
var uJoint0InvTranspose = new M4x4.$();

var uPosition = new Float32Array([0,0,0]);
var uScale = new Float32Array([0,0,0]);
var uBbox = new Float32Array([80,80,80])
var uAlpha = 1;

var uTime = 0;
var uShaderDebug = 0;

var uFogTopCol = new Float32Array([0.7,0.8,1.1,0.75])
var uFogBottomCol = new Float32Array([0.15,0.15,0.2,0.5])
var uFogDist = 500;

var uFresnelCol = new Float32Array([0.3,0.8,1,0.6]);
var uFresnelPower = 2;

var uLightPos = new Float32Array([0,200,-34]);
var uLightCol = new Float32Array([0.8,0.8,0.4,1]);
var uLightSpecCol = new Float32Array([0.3,0.4,0.6,0.5]);
var uLightRadius = 800;
var uLightSpecPower = 3;
var uAmbientCol = new Float32Array([0.7,0.4,0.4,1]);

var uNear = 5;
var uFar = 530;
var uFov = 27;

var jTime = 0;
var jCount = 10;
var jScale = 3;
var jScaleRandom = 3;
var jTurb = 0.1;
var jSpeed = 0.01;
var jRepel = 1;

var jGravity = -0.005;
var jSpring = 2;
var jMass = 0.1;
var jStiffness = 0.2;
var jDamping = 0.1;

var pCount = 50;
var pScale = 1;
var pScaleRandom = 0.9;
var pFlow = new Float32Array([0,-0.01,0]);
var pTurbAmp = 0.03;
var pTurbFreq = 1;

//rays
var rCount = 25;
var rSpeed = 0.05;

var camera = {    
  rotate: [-0.3,0,0],
  translate: [0,0,-280],
  eye: [0,0,-64]
}

window.addEventListener('keydown', function(event){

  switch(event.which){
    case 49:
      uFogTopCol = new Float32Array([0.7,0.8,1,0.75]);
      uFogBottomCol = new Float32Array([0.05,0.14,0.2,0.5]);
      uLightPos = new Float32Array([0,1,0]);
      uLightCol = new Float32Array([1,0.8,0.9,1]);
      uLightSpecCol = new Float32Array([0.3,0.4,0.6,0.5]);
      uAmbientCol = new Float32Array([0.7,0.3,0.2,1]);
      uFresnelCol = new Float32Array([0.3,0.8,1,0.6]);
      uFresnelPower = 2;
      break;

    case 50:
      uFogTopCol = new Float32Array([0.3,0.65,1,0.75]);
      uFogBottomCol = new Float32Array([0.2,0.35,0.85,0.5]);
      uLightPos = new Float32Array([0,1,1]);
      uLightCol = new Float32Array([0.65,0.5,0.6,1]);
      uLightSpecCol = new Float32Array([1.2,0.5,1.3,0.5]);
      uAmbientCol = new Float32Array([0.4,0.2,0.4,1]);
      uFresnelCol = new Float32Array([0.8,0.6,0.9,0.6]);
      uFresnelPower = 0.5;
      break;

    case 51:
      uFogTopCol = new Float32Array([0.8,0.8,0.7,0.75]);
      uFogBottomCol = new Float32Array([0.27,0.32,0.29,0.5]);
      uLightPos = new Float32Array([1,0.5,0]);
      uLightCol = new Float32Array([0.5,0.4,0.2,1]);
      uLightSpecCol = new Float32Array([0.9,0.4,0.5,0.5]);
      uAmbientCol = new Float32Array([0.35,0.4,0.35,1]);
      uFresnelCol = new Float32Array([0.6,0.7,0.5,0.6]);
      uFresnelPower = 2;
      break;

    case 52:
      uFogTopCol = new Float32Array([0.45,0.55,0.45,0.75]);
      uFogBottomCol = new Float32Array([0.15,0.2,0.15,0.5]);
      uLightPos = new Float32Array([0,0,0]);
      uLightCol = new Float32Array([0.4,0.5,0.3,1]);
      uLightSpecCol = new Float32Array([0.8,0.2,0.1,0.5]);
      uAmbientCol = new Float32Array([0.2,0.2,0.15,1]);
      uFresnelCol = new Float32Array([0.3,0.4,0.2,0.6]);
      uFresnelPower = 2;
      break;

    case 53:
      uFogTopCol = new Float32Array([0.1,0.2,0.5,0.75]);
      uFogBottomCol = new Float32Array([0,0.1,0.2,0.5]);
      uLightPos = new Float32Array([1,1,0]);
      uLightCol = new Float32Array([1,0.7,0.1,1]);
      uLightSpecCol = new Float32Array([1,0.7,0.5,0.5]);
      uAmbientCol = new Float32Array([0.8,0.1,0.05,1]);
      uFresnelCol = new Float32Array([0.8,0.3,0.2,0.6]);
      uFresnelPower = 1;
      break;
     
     case 54:
      uFogTopCol = new Float32Array([0.2,0.3,0.7,0.75]);
      uFogBottomCol = new Float32Array([0.1,0.1,0.3,0.5]);
      uLightPos = new Float32Array([1,1,0]);
      uLightCol = new Float32Array([0.7,0.6,0.5,1]);
      uLightSpecCol = new Float32Array([0.2,0.3,0.4,0.5]);
      uAmbientCol = new Float32Array([0.5,0.6,1,1]);
      uFresnelCol = new Float32Array([1,1,1,0.6]);
      uFresnelPower = 2;
      break;

    case 55:
      uFogTopCol = new Float32Array([0.3,0.8,0.7,0.75]);
      uFogBottomCol = new Float32Array([0.1,0.3,0.25,0.5]);
      uLightPos = new Float32Array([-1,1,0]);
      uLightCol = new Float32Array([0.8,0.3,0.1,1]);
      uLightSpecCol = new Float32Array([1,1,1,0.5]);
      uAmbientCol = new Float32Array([0.6,0.3,0.2,1]);
      uFresnelCol = new Float32Array([0.1,0.7,0.4,0.6]);
      uFresnelPower = 2;
      break;

    case 56:
      uFogTopCol = new Float32Array([1,1,1,0.75]);
      uFogBottomCol = new Float32Array([0.6,0.4,0.2,0.5]);
      uLightPos = new Float32Array([1,1,0]);
      uLightCol = new Float32Array([0.6,0.6,0.6,1]);
      uLightSpecCol = new Float32Array([0.9,0.6,0,0.5]);
      uAmbientCol = new Float32Array([0.6,0.5,0,1]);
      uFresnelCol = new Float32Array([0.4,0.1,0.2,0.6]);
      uFresnelPower = 2;
      break;

    case 57:
      uFogTopCol = new Float32Array([0.1,0.1,0.1,0.8]);
      uFogBottomCol = new Float32Array([0,0,0,0]);
      uLightPos = new Float32Array([1,1,0]);
      uLightCol = new Float32Array([0,0,0,0]);
      uLightSpecCol = new Float32Array([0,0,0,1]);
      uAmbientCol = new Float32Array([0,0,0,1]);
      uFresnelCol = new Float32Array([0.4,0.1,0.2,0.6]);
      uFresnelPower = 2;
      break;
  }
})