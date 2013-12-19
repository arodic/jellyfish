var delta = new V3.$(0,0,0);
var deltaNorm = new V3.$(0,0,0);
var force = new V3.$(0,0,0);
var accel = new V3.$(0,0,0);
var eyeDist = new V3.$(0,0,0);

var jellyfish = {};
jellyfish.count = 0;
jellyfish.order = [];

function interpolateTargets(){
  while(jellyfish.count != jellyfishTargets.count){
    if(jellyfish.count<jellyfishTargets.count){
      jellyfish[jellyfish.count] = new JellyfishInstance(
              jellyfishTargets[jellyfish.count].pos,
              jellyfishTargets[jellyfish.count].scl,
              jellyfishTargets[jellyfish.count].time);
      jellyfish.count += 1;

    }
    else if(jellyfish.count>jellyfishTargets.count){
      jellyfish.count -= 1;
      delete jellyfish[jellyfish.count];
    }
    jellyfish.order = jellyfishTargets.order;
  }

  for(var i=0; i < jellyfish.count; i++){
    jellyfish[i].pos[0] = jellyfishTargets[i].pos[0];
    jellyfish[i].pos[1] = jellyfishTargets[i].pos[1];
    jellyfish[i].pos[2] = jellyfishTargets[i].pos[2];
    if (jellyfishTargets[i].scl<jellyfish[i].scl) {
      jellyfish[i].scl = jellyfishTargets[i].scl;
    }
    jellyfish[i].scl = jellyfishTargets[i].scl;
    jellyfish[i].time = jellyfishTargets[i].time;

    jellyfish.order[i][0] = i;
    jellyfish.order[i][1] = jellyfish[i].pos;
  }
}

function drawJellyfish(){
  interpolateTargets();
  bindTexture('jellyfish', 0);
  bindTexture('luminescence', 2);
  jellyfish.order.sort(sort3D);
  for (var i=0; i < jellyfish.count; i++) {
    var k = jellyfish.order[i][0];
    if (jellyfish[k]){
      jellyfish[k].simulate();
      jellyfish[k].setLOD();
      jellyfish[k].draw();
    }
  }
  drawJellyfishRays();
}

function drawJellyfishRays(){

  mTemp = M4x4.clone(uWorld);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.depthMask(false);
  gl.disable(gl.DEPTH_TEST);
  gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT);
  bindTexture('blob', 0);
  
  var lookAt = new M4x4.$();  
  M4x4.makeLookAt(V3.$(uLightPos[0],uLightPos[1],uLightPos[2]),V3.$(0,0,0),camera.eye,lookAt);

  uWorld = M4x4.makeTranslate3(0,0,0);
  M4x4.mul(M4x4.makeLookAt(V3.$(uLightPos[0],uLightPos[1],uLightPos[2]),V3.$(0,0,0),camera.eye),uWorld,uWorld);
  M4x4.scale3(3,60,0,uWorld,uWorld);
  
  uAlpha = 1;
  setShader("ray");
  bindTexture('halfBlob', 0);
  for (var i=0; i < jellyfish.count; i++) {
    var k = jellyfish.order[i][0];
    if (jellyfish[k]){
      jellyfish[k].drawRay();
    }
  }
  gl.blendEquation(gl.FUNC_ADD);  
  gl.depthMask(true);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  uWorld = M4x4.clone(mTemp); 
}


function sort3D(a,b){
  var eye = V3.$(-camera.eye[0],-camera.eye[1]+20,-camera.eye[2]);
  return (V3.length(V3.sub(eye,a[1])) > V3.length(V3.sub(eye,b[1])) ? -1 : ((V3.length(V3.sub(eye,a[1])) < V3.length(V3.sub(eye,b[1]))) ? 1 : 0));
}

function JellyfishInstance(pos,scl,time){
  this.pos = pos;
  this.scl = scl;
  this.time = time;
  this.lod = 0;
  this.propel = 1;

  this.s = {};
  this.s[0] = new Spring3D(pos[0],pos[1]-1,pos[2]);
  for (j=1;j<=3;j++){
    this.s[j] = new Spring3D(pos[0],pos[1]-1-1*j*this.scl,pos[2]);
  }

  this.draw = function(){
      jTime = this.time;
      this.propel = (Math.sin(this.time+Math.PI)+0.6)*0.2;
      /// Investigate
      M4x4.inverseOrthonormal(uJoint0,uJoint0InvTranspose);
      M4x4.transpose(uJoint0InvTranspose,uJoint0InvTranspose);
      setShader("jellyfish");
      drawBuffer('jellyfish'+this.lod);
  };
  this.drawRay = function(){
    gl.uniform3fv(currentShader.program['uPosition'], new Float32Array(this.s[0].pos));
    gl.uniform3fv(currentShader.program['uScale'], new Float32Array([this.scl*2,this.scl*2,this.scl*2]));
    // gl.uniform1f(currentShader.program['uPID'], this.id);
    drawBuffer('quad');
  }
  this.setLOD = function(){
    V3.sub(this.pos,V3.neg(camera.eye),eyeDist);
    this.lod = 1;//Math.max(3-Math.floor(4/this.scl/2),0);
  }

  this.simulate = function(){
    this.s[0].spring = 1.295 * this.scl * (1-this.propel);
    this.s[0].update(this.pos);
    // this.s[0].gravity = -0.01;

    M4x4.makeTranslate(this.s[0].pos,uJoint0);
    M4x4.mul(uJoint0,this.s[0].lookat,uJoint0);
    M4x4.scale1(this.scl,uJoint0,uJoint0);

    for (j=1;j<=3;j++){
      this.s[j].spring = 2.95 * this.scl;
      this.s[j].update(this.s[j-1].pos);
      // this.s[j].gravity = -0.02;
      if (j==1){
        // this.s[j].repel();
        M4x4.makeTranslate(this.s[j].pos,uJoint1);
        M4x4.mul(uJoint1,this.s[j].lookat, uJoint1);
        M4x4.scale1(this.scl,uJoint1,uJoint1);
        M4x4.translate3(0,3*j,0,uJoint1,uJoint1);
      }
      if (j==2){
        // this.s[j].repel();
        M4x4.makeTranslate(this.s[j].pos,uJoint2);
        M4x4.mul(uJoint2,this.s[j].lookat, uJoint2);
        M4x4.scale1(this.scl,uJoint2,uJoint2);
        M4x4.translate3(0,3*j,0,uJoint2,uJoint2);
      }
      if (j==3){
        // this.s[j].repel();
        M4x4.makeTranslate(this.s[j].pos,uJoint3);
        M4x4.mul(uJoint3,this.s[j].lookat, uJoint3);
        M4x4.scale1(this.scl,uJoint3,uJoint3);
        M4x4.translate3(0,3*j,0,uJoint3,uJoint3);
      }
    }
  }

}

function Spring3D(xpos, ypos, zpos){
  this.veloc = new V3.$(0,0,0);
  this.pos = new V3.$(xpos, ypos, zpos);
  this.spring = 2;
  this.lookat = new M4x4.$();

  this.update = function(target){
      V3.sub(target,this.pos,delta);

      V3.normalize(delta, deltaNorm);
      V3.scale(deltaNorm, this.spring, deltaNorm);
      V3.sub(delta, deltaNorm, delta);

      V3.scale(delta,jStiffness,force);
      force[1] += jGravity;
      V3.scale(force,1/jMass,accel);
      V3.add(force,accel,this.veloc);
      V3.scale(this.veloc,jDamping,this.veloc);
      V3.add(this.pos,this.veloc,this.pos);

    M4x4.makeLookAt(this.pos,target,camera.eye,this.lookat);
  };

  // this.repel = function() {
  //   force[0] = 0;
  //   force[1] = 0;
  //   force[2] = 0;

  //   for(var i=0; i < jellyfishTargets.count; i++){
  //     V3.sub(this.pos, jellyfishTargets[i].pos, delta);
  //     V3.falloff(delta, falloff);
  //     V3.add(force, delta, force);
  //   }
  //   V3.scale(force, 0.001, force);
  //   V3.add(this.pos, force, this.pos);
  // }

}