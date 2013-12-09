var plankton = {};
plankton.count = 0;

function drawPlankton(){
  if(plankton.count<pCount){
    plankton[plankton.count] = 
    new planktonParticle(
      Math.random()*2*uBbox[0]-uBbox[0],
      Math.random()*2*uBbox[1]-uBbox[1],
      Math.random()*2*uBbox[2]-uBbox[2],
      Math.random()*pScaleRandom+pScale,
      plankton.count);
    plankton.count += 1;
  }
  if(plankton.count>pCount){
    plankton.count -= 1;
    delete plankton[plankton.count];
  }
    
  uTemp = M4x4.clone(uWorld);

  gl.depthMask(false);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  bindTexture('plankton', 0);
  
  uWorld = M4x4.makeTranslate3(0,0,0);
  M4x4.rotate(-camera.rotate[1],V3.$(0,1,0),uWorld,uWorld);
  M4x4.rotate(-camera.rotate[0],V3.$(1,0,0),uWorld,uWorld);

  setShader("plankton");
  for (var i=0; i < plankton.count; i++) {
    plankton[i].update();
    plankton[i].draw();
  }

  uWorld = M4x4.clone(uTemp);

  gl.depthMask(true);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function planktonParticle(tx,ty,tz,scl,id){
  this.pos = V3.$(tx,ty,tz);
  this.scl = V3.$(scl,scl,scl);
  this.id = id;
}

planktonParticle.prototype.update = function(){ 
  V3.add(this.pos,pFlow,this.pos);  
  this.pos[0] += Math.sin(this.pos[1]*pTurbFreq)*pTurbAmp;
  this.pos[1] += Math.sin(this.pos[2]/pTurbFreq+100)*pTurbAmp;
  this.pos[2] += Math.sin(this.pos[0]/pTurbFreq+500)*pTurbAmp;

  if (this.pos[0]>uBbox[0]) this.pos[0] -= 2*uBbox[0];
  if (this.pos[1]>uBbox[1]) this.pos[1] -= 2*uBbox[1];
  if (this.pos[2]>uBbox[2]) this.pos[2] -= 2*uBbox[2];
  if (this.pos[0]<-uBbox[0]) this.pos[0] += 2*uBbox[0];
  if (this.pos[1]<-uBbox[1]) this.pos[1] += 2*uBbox[1];
  if (this.pos[2]<-uBbox[2]) this.pos[2] += 2*uBbox[2];
}
planktonParticle.prototype.draw = function(){ 
  gl.uniform3fv(currentShader.program['uPosition'], new Float32Array(this.pos));
  gl.uniform3fv(currentShader.program['uScale'], new Float32Array(this.scl));
  gl.uniform1f(currentShader.program['uPID'], this.id);
  drawBuffer('quad');
}