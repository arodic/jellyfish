var mWorld = new M4x4.$();
var mViewInv = new M4x4.$();
var mProjection = new M4x4.$();
var mWorldView = new M4x4.$();
var mWorldViewProj = new M4x4.$();
var mTemp = new M4x4.$();

var joint0 = new M4x4.$();
var joint1 = new M4x4.$();
var joint2 = new M4x4.$();
var joint3 = new M4x4.$();
var joint0InvTranspose = new M4x4.$();
var joint1InvTranspose = new M4x4.$();
var joint2InvTranspose = new M4x4.$();
var joint3InvTranspose = new M4x4.$();

function setTimeUniform(time){
  gl.uniform1f(currentProgram.currentTime, time);
}
function setjTimeUniform(time){
  gl.uniform1f(currentProgram.currentJellyfishTime, time);
}

function setJointUniforms(){
  gl.uniformMatrix4fv(currentProgram.joint0, gl.FALSE, new Float32Array(joint0));
  gl.uniformMatrix4fv(currentProgram.joint1, gl.FALSE, new Float32Array(joint1));
  gl.uniformMatrix4fv(currentProgram.joint2, gl.FALSE, new Float32Array(joint2));
  gl.uniformMatrix4fv(currentProgram.joint3, gl.FALSE, new Float32Array(joint3));

  M4x4.inverseOrthonormal(joint0,joint0InvTranspose);
  M4x4.transpose(joint0InvTranspose,joint0InvTranspose);
  gl.uniformMatrix4fv(currentProgram.joint0InvTranspose, gl.FALSE, new Float32Array(joint0InvTranspose));

  M4x4.inverseOrthonormal(joint1,joint1InvTranspose);
  M4x4.transpose(joint1InvTranspose,joint1InvTranspose);
  gl.uniformMatrix4fv(currentProgram.joint1InvTranspose, gl.FALSE, new Float32Array(joint1InvTranspose));

  M4x4.inverseOrthonormal(joint2,joint2InvTranspose);
  M4x4.transpose(joint2InvTranspose,joint2InvTranspose);
  gl.uniformMatrix4fv(currentProgram.joint2InvTranspose, gl.FALSE, new Float32Array(joint2InvTranspose));

  M4x4.inverseOrthonormal(joint3,joint3InvTranspose);
  M4x4.transpose(joint3InvTranspose,joint3InvTranspose);
  gl.uniformMatrix4fv(currentProgram.joint3InvTranspose, gl.FALSE, new Float32Array(joint3InvTranspose));
}

function setDebugUniforms(){
  gl.uniform3f(currentProgram.lightPos, Param.lightPos[0],Param.lightPos[1],Param.lightPos[2]);
  gl.uniform4f(currentProgram.lightCol, Param.lightCol[0],Param.lightCol[1],Param.lightCol[2],Param.lightCol[3]);
  gl.uniform4f(currentProgram.ambientCol, Param.ambientCol[0],Param.ambientCol[1],Param.ambientCol[2],Param.ambientCol[3]);
  gl.uniform4f(currentProgram.fresnelCol, Param.fresnelCol[0],Param.fresnelCol[1],Param.fresnelCol[2],Param.fresnelCol[3]);
  gl.uniform1f(currentProgram.fresnelPow, Param.fresnelPower);
  gl.uniform1f(currentProgram.shaderDebug, Param.shaderDebug);
  gl.uniform1f(currentProgram.near, localParam.camera.near);
  gl.uniform1f(currentProgram.far, localParam.camera.far);
  gl.uniform1f(currentProgram.alpha, Param.uAlpha);
}

function setMatrixUniforms(){
  // Set necessary matrices
  M4x4.mul(mView,mWorld,mWorldView);
  M4x4.mul(mProjection,mWorldView,mWorldViewProj);
  M4x4.inverseOrthonormal(mView,mViewInv);

  // Set Uniforms
  gl.uniformMatrix4fv(currentProgram.world, gl.FALSE, new Float32Array(mWorld));
  gl.uniformMatrix4fv(currentProgram.worldView, gl.FALSE, new Float32Array(mWorldView));
  gl.uniformMatrix4fv(currentProgram.worldViewProj, gl.FALSE, new Float32Array(mWorldViewProj));
  gl.uniformMatrix4fv(currentProgram.viewInv, gl.FALSE, new Float32Array(mViewInv));
}