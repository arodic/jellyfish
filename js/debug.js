var localParam = new LocalParam();
var Param = new Param();

function LocalParam(){
  this.camera = new Object;
  this.camera.near = 5;
  this.camera.far = 530;
  this.camera.fov = 27;

  this.camera.rotate = [-0.3,0,0];
  this.camera.translate = [0,0,-280];
  this.camera.eye = [0,0,-64];

  this.LODBias = 8.0;
  this.millis = 0.0;
  this.elapsed = 1.0;
  this.timeNow = 0.0;
  this.currentTime = 0.0;
  this.lastTime = 0.0;
  this.fps = 60.0;
  this.fpsAverage = 60.0;
  this.cycle32 = 0.0;
}

function Param(){

  //jellyfish
  this.jCount = 5;
  this.jScale = 4;
  this.jScaleRandom = 0;
  this.jTurb = 0.08;
  this.jSpeed = 0.02;

  //particle
  this.pBbox = [30,30,20];
  this.pFlow = [0,-0.01,0];
  this.pTurbAmp = 0.03;
  this.pTurbFreq = 1;

  //lighting
  this.lightPos = [1,1,0];
  this.lightCol = [1,0.5,0.2,1];
  this.ambientCol = [0.3,0.2,0.1,1];
  this.lightTime = 0;
  this.lightBlend = [1,-1,0];
  this.fresnelCol = [0.9,0.4,0.3,1];
  this.fresnelPower = 2;

  this.shaderDebug = 0;

  this.uAlpha = 1;
}

function setDebugParam(){

  $("#lightX").val(Param.lightPos[0]);$("#lightY").val(Param.lightPos[1]);$("#lightZ").val(Param.lightPos[2]);
  $("#lightR").val(Param.lightCol[0]);$("#lightG").val(Param.lightCol[1]);$("#lightB").val(Param.lightCol[2]);$("#lightA").val(Param.lightCol[3]);
  $("#ambientR").val(Param.ambientCol[0]);$("#ambientG").val(Param.ambientCol[1]);$("#ambientB").val(Param.ambientCol[2]);$("#ambientA").val(Param.ambientCol[3]);
  $("#fresnelR").val(Param.fresnelCol[0]);$("#fresnelG").val(Param.fresnelCol[1]);$("#fresnelB").val(Param.fresnelCol[2]);$("#fresnelA").val(Param.fresnelCol[3]);
  $("#fresnelPower").val(Param.fresnelPower);
  $("#lightTime").val(Param.lightTime);
  $("#lightBlendX").val(Param.lightBlend[0]);$("#lightBlendY").val(Param.lightBlend[1]);

  $("#jCount").val(Param.jCount);
  $("#jScale").val(Param.jScale);
  $("#jScaleRandom").val(Param.jScaleRandom);
  $("#jTurb").val(Param.jTurb);
  $("#jSpeed").val(Param.jSpeed);

}

function readDebugParam(){
  Param.shaderDebug = parseFloat($('input:radio[name=shaderDebug]:checked').val());

  Param.lightPos = [parseFloat($("#lightX").val()),parseFloat($("#lightY").val()),parseFloat($("#lightZ").val())];
  Param.lightCol = [parseFloat($("#lightR").val()),parseFloat($("#lightG").val()),parseFloat($("#lightB").val()),parseFloat($("#lightA").val())];
  Param.ambientCol = [parseFloat($("#ambientR").val()),parseFloat($("#ambientG").val()),parseFloat($("#ambientB").val()),parseFloat($("#ambientA").val())];
  Param.fresnelCol = [parseFloat($("#fresnelR").val()),parseFloat($("#fresnelG").val()),parseFloat($("#fresnelB").val()),parseFloat($("#fresnelA").val())];
  Param.shaderDebug = parseInt($('input[name=shaderDebug]:checked').val());
  Param.fresnelPower = parseFloat($("#fresnelPower").val());
  Param.lightTime = parseFloat($("#lightTime").val());
  Param.lightBlend = [parseFloat($("#lightBlendX").val()), parseFloat($("#lightBlendY").val()), 0];

  Param.jCount = parseFloat($("#jCount").val());
  Param.jScale = parseFloat($("#jScale").val());
  Param.jScaleRandom = parseFloat($("#jScaleRandom").val());
  Param.jTurb = parseFloat($("#jTurb").val());
  Param.jSpeed = parseFloat($("#jSpeed").val());
}