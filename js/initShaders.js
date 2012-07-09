// JavaScript Document
function getShader(gl, id) {
var shaderScript = document.getElementById(id);
  if (!shaderScript) {
	return null;
  }

  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
	if (k.nodeType == 3) {
	  str += k.textContent;
	}
	k = k.nextSibling;
  }

  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
	shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
	shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
	return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	alert(gl.getShaderInfoLog(shader));
	return null;
  }

  return shader;
}

function createProgram(fragmentShaderID, vertexShaderID) {
  var fragmentShader = getShader(gl, fragmentShaderID);
  var vertexShader = getShader(gl, vertexShaderID);

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	alert("Could not initialise shaders");
  }

  program.vertexPositionAttribute = gl.getAttribLocation(program,   "aVertexPosition");
  gl.enableVertexAttribArray(program.vertexPositionAttribute);
  program.vertexNormalAttribute = gl.getAttribLocation(program,     "aVertexNormal");
  gl.enableVertexAttribArray(program.vertexNormalAttribute);
  program.vertexColorAttribute = gl.getAttribLocation(program,      "aVertexColor");
  gl.enableVertexAttribArray(program.vertexColorAttribute);
  program.textureCoordAttribute = gl.getAttribLocation(program,     "aTextureCoord");
  gl.enableVertexAttribArray(program.textureCoordAttribute);
  
  program.world = gl.getUniformLocation(program,              "uWorld");
  program.worldView = gl.getUniformLocation(program,          "uWorldView");
  program.worldViewProj = gl.getUniformLocation(program,      "uWorldViewProj");
  program.viewInv = gl.getUniformLocation(program,            "uView");
  program.viewInv = gl.getUniformLocation(program,            "uViewInv");
  
  program.sampler = [];
  program.sampler[0] = gl.getUniformLocation(program,           "uSampler0");
  program.sampler[1] = gl.getUniformLocation(program,           "uSampler1");
  program.sampler[2] = gl.getUniformLocation(program,           "uSampler2");
  program.sampler[3] = gl.getUniformLocation(program,           "uSampler3");
  
  program.joint0 = gl.getUniformLocation(program,             "uJoint0");
  program.joint1 = gl.getUniformLocation(program,             "uJoint1");
  program.joint2 = gl.getUniformLocation(program,             "uJoint2");
  program.joint3 = gl.getUniformLocation(program,             "uJoint3");
  program.joint0InvTranspose = gl.getUniformLocation(program,             "uJoint0InvTranspose");
  program.joint1InvTranspose = gl.getUniformLocation(program,             "uJoint1InvTranspose");
  program.joint2InvTranspose = gl.getUniformLocation(program,             "uJoint2InvTranspose");
  program.joint3InvTranspose = gl.getUniformLocation(program,             "uJoint3InvTranspose");

  program.currentTime = gl.getUniformLocation(program,          "uCurrentTime");
  program.currentJellyfishTime = gl.getUniformLocation(program, "uCurrentJellyfishTime");
  
  program.near = gl.getUniformLocation(program,               "uNear");
  program.far = gl.getUniformLocation(program,                "uFar");
  program.alpha = gl.getUniformLocation(program,              "uAlpha");
  
  program.lightPos = gl.getUniformLocation(program,           "uLightPos");
  program.lightCol = gl.getUniformLocation(program,           "uLightCol");
  program.ambientCol = gl.getUniformLocation(program,         "uAmbientCol");
  program.fogDist = gl.getUniformLocation(program,            "uFogDist");
  program.fogTopCol = gl.getUniformLocation(program,          "uFogTopCol");
  program.fogBottomCol = gl.getUniformLocation(program,       "uFogBottomCol");
  program.fresnelCol = gl.getUniformLocation(program,         "uFresnelCol");
  program.fresnelPow = gl.getUniformLocation(program,         "uFresnelPower");  
  program.shaderDebug = gl.getUniformLocation(program,        "uShaderDebug");
 
  return program;
}

var currentProgram;
var shaderProgram = {};
  
function initShaders() {
  shaderProgram["jellyfish"] = createProgram("jellyfish-fs", "jellyfish-vs");
  currentProgram = shaderProgram["jellyfish"];
  setShader("jellyfish");
  bindTexture('jellyfishColor', 0);
  bindTexture('jellyfishAlpha', 2);
  bindTexture('caustics'+localParam.cycle32, 1);

}

function setShader(name){
  currentProgram = shaderProgram[name];
  gl.useProgram(currentProgram);
  //TODO:remove
  setDebugUniforms();
}
