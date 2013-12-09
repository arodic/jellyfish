var rays = {};
rays.count = -1;

function drawRays(){
  if(rays.count<rCount){
    rays.count += 1;
    rays[rays.count] = new rayParticle(
      Math.random()*6*uBbox[0]-3*uBbox[0],uBbox[1],
      Math.random()*6*uBbox[2]-3*uBbox[2],5,
      rays.count);
  }
  if(rays.count>rCount){
    rays.count -= 1;
  }

  mTemp = M4x4.clone(uWorld);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.depthMask(false);
  gl.disable(gl.DEPTH_TEST);
  bindTexture('blob', 0);
  
  var lookAt = new M4x4.$();  
  M4x4.makeLookAt(V3.$(uLightPos[0],uLightPos[1],uLightPos[2]),V3.$(0,0,0),camera.eye,lookAt);

  uWorld = M4x4.makeTranslate3(0,0,0);
  M4x4.mul(M4x4.makeLookAt(V3.$(uLightPos[0],uLightPos[1],uLightPos[2]),V3.$(0,0,0),camera.eye),uWorld,uWorld);
  M4x4.scale3(2,60,0,uWorld,uWorld);
  
  uAlpha = 0.15;
  setShader("ray");
  for (var j=0; j <= rays.count; j += 1) {    
    rays[j].update(); 
    rays[j].draw();
  }

  gl.depthMask(true);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  uWorld = M4x4.clone(mTemp);	
}

function rayParticle(tx,ty,tz,scl,id){
  this.pos = V3.$(tx,ty,tz);
  this.scl = V3.$(scl,scl,scl);
  this.id = id;
}
rayParticle.prototype.update = function(){ 
  V3.add(this.pos,pFlow,this.pos);
  this.pos[0] += Math.sin(0.1*this.pos[2]*pTurbFreq)*rSpeed*10;
  this.pos[2] += Math.sin(0.1*this.pos[0]*pTurbFreq+500)*rSpeed*10;

  if (this.pos[0]>uBbox[0]) this.pos[0] -= uBbox[0];
  if (this.pos[2]>uBbox[2]) this.pos[2] -= uBbox[2];
  if (this.pos[0]<-uBbox[0]) this.pos[0] += uBbox[0];
  if (this.pos[2]<-uBbox[2]) this.pos[2] += uBbox[2];
  this.pos[1] = 0;
}
rayParticle.prototype.draw = function(){ 
  gl.uniform3fv(currentShader.program['uPosition'], new Float32Array(this.pos));
  gl.uniform3fv(currentShader.program['uScale'], new Float32Array(this.scl));
  gl.uniform1f(currentShader.program['uPID'], this.id);
  drawBuffer('quad');
}