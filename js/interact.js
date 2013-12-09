// JavaScript Document
// Original code by egeny Demidov
// http://www.ibiblio.org/e-notes/webgl/gpu/n-toy.html

var drag = 0;
var rxOffs = 0;
var ryOffs = 0;
var txOffs = 0;
var tyOffs = 0;
var tzOffs = 0;

var mouseXY = V3.$(0,0,0);

function interact(){
  canvas.onmousedown = function ( e ){
    drag  = 1;
    rxOffs = e.clientX/100 - camera.rotate[1];
    ryOffs = e.clientY/100 - camera.rotate[0];
    txOffs = +e.clientX/10 - camera.translate[0];
    tyOffs = +e.clientY/10 - camera.translate[1];
    tzOffs = +e.clientY/10 +e.clientX/10 - camera.translate[2];
  }
  canvas.onmouseup = function ( e ){
    drag  = 0;
    rxOffs = e.clientX/100;
    ryOffs = e.clientY/100;
    txOffs = +e.clientX/10;
    tyOffs = +e.clientY/10;
    tzOffs = +e.clientY/10 +e.clientX/10;
  }
  canvas.onmousemove = function ( e ){

   if ( drag == 0 ) return;
   if ( e.altKey ) {
      camera.translate[2] = +e.clientY/10 +e.clientX/10 - tzOffs;}
   else if ( e.shiftKey ) {
      camera.translate[0] = e.clientX/10 - txOffs;
      camera.translate[1] = e.clientY/10 - tyOffs;         
   } else {
      camera.rotate[1] = (e.clientX/100 - rxOffs);
      camera.rotate[0] = (e.clientY/100 - ryOffs);
   }
  }
}