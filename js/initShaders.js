function compileShader(shaderName, gl) {
  var shader = document.querySelector(shaderName); 
  shader.compile(gl);
  return shader;
}

var currentShader;
var shaders = {};
  
function initShaders() {
  shaders["skybox"] = compileShader("shader-skybox", gl);
  shaders["jellyfish"] = compileShader("shader-jellyfish", gl);
  shaders["plankton"] = compileShader("shader-plankton", gl);
  shaders["ray"] = compileShader("shader-ray", gl);

  setShader("skybox");
}

function setShader(name){
  currentShader = shaders[name];
  gl.useProgram(currentShader.program);
  currentShader.setUniforms();
}
