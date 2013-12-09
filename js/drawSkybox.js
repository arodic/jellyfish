var uWorldTemp = new M4x4.$();
var uWorldViewProjTemp = new M4x4.$();

function drawSkybox(){

  gl.depthMask(false);
  
  uWorldTemp = M4x4.clone(uWorld);
  uWorldViewProjTemp = M4x4.clone(uWorldViewProj);

  M4x4.scale1(100,uViewInv,uWorld);
  
  M4x4.mul(uView,uWorld,uWorldView);
  M4x4.mul(mProjection,uWorldView,uWorldViewProj);
  M4x4.inverseOrthonormal(uView,uViewInv);

  setShader("skybox");
  drawBuffer("sphere");

  uWorld = M4x4.clone(uWorldTemp);
  uWorldViewProj = M4x4.clone(uWorldViewProjTemp);
  gl.depthMask(true);

}