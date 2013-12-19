var jellyfishTargets = {};
jellyfishTargets.objName = "targets";
jellyfishTargets.count = 0;
jellyfishTargets.order = [];
jellyfishTargets.order3D = [];

JellyfishTarget = function(tx,ty,tz,scl,id,time){
  this.pos = V3.$(tx,ty,tz);
  this.scl = scl;
  this.id = id;
  this.time = Math.random()*100;
  this.speed = Math.random()+0.5;
};

// var dist;
// var dir;
// var s1,s2;

var force = new MJS_FLOAT_ARRAY_TYPE(3);
var falloff = new MJS_FLOAT_ARRAY_TYPE(3);
var delta = new MJS_FLOAT_ARRAY_TYPE(3);

function simulate(){

  var i = 0;
  if(jellyfishTargets.count<jCount){
    jellyfishTargets[jellyfishTargets.count] = new JellyfishTarget(
            Math.random()*uBbox[0]-uBbox[0],
            Math.random()*uBbox[1]-uBbox[1]-40,
            Math.random()*uBbox[2]-uBbox[2],
            Math.random()*jScaleRandom+jScale,
            jellyfishTargets.count,
            uTime%100000000/1000
    );
    jellyfishTargets.order.push([jellyfishTargets.count,0]);
    jellyfishTargets.order3D.push([jellyfishTargets.count,0]);
    jellyfishTargets.count += 1;
    i++;
  }
  else if(jellyfishTargets.count>jCount){
    jellyfishTargets.order3D.pop();
    jellyfishTargets.order.pop();
    jellyfishTargets.count -= 1;
    delete jellyfishTargets[jellyfishTargets.count];
  }

  for(var i=0; i < jellyfishTargets.count; i++){

    //SET TIME
    jellyfishTargets[i].time += (jSpeed*16/(jellyfishTargets[i].scl+1))*jellyfishTargets[i].speed;

    //MOVE
    var time = new Date().getTime();
    var speed = jellyfishTargets[i].scl*jSpeed*3.8;
    var flow = V3.$(
      speed*Math.sin((jellyfishTargets[i].pos[2]+jellyfishTargets[i].id+time/10000)*jTurb),
      speed*Math.sin((jellyfishTargets[i].pos[0]+jellyfishTargets[i].id+time/10000)*jTurb),
      speed*Math.sin((jellyfishTargets[i].pos[1]+jellyfishTargets[i].id+time/10000)*jTurb)
    );

    V3.add(jellyfishTargets[i].pos, flow, jellyfishTargets[i].pos);

    // //REPEL
    // for(var j=0; j < jellyfishTargets.count; j++){
    //   if (i != j){
    //     delta = V3.sub(jellyfishTargets[i].pos, jellyfishTargets[j].pos);
    //     dist = V3.length(delta);// - (jellyfishTargets[i].scl+jellyfishTargets[j].scl)*6;
    //     dir = V3.normalize(delta);
    //     force = V3.scale(dir, Math.pow(1/dist, 3)*20000);
    //     V3.add(jellyfishTargets[i].pos, force, jellyfishTargets[i].pos);
    //   }
    // }

    //REPEL
    force[0] = 0;
    force[1] = 0;
    force[2] = 0;
    for(var j=0; j < jellyfishTargets.count; j++){
      if (i != j){
        V3.sub(jellyfishTargets[i].pos, jellyfishTargets[j].pos, delta);
        V3.falloff(delta, falloff);
        V3.add(force, falloff, force);
      }
    }
    V3.scale(force, jRepel*jellyfishTargets[i].scl, force);
    V3.add(jellyfishTargets[i].pos, force, jellyfishTargets[i].pos);

    //CENTER
    jellyfishTargets[i].pos[0] *= 0.995;
    jellyfishTargets[i].pos[1] *= 0.995;
    jellyfishTargets[i].pos[2] *= 0.995;

  }
}