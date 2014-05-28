var gl, canvas;

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewportWidth = window.innerWidth;
  gl.viewportHeight =  window.innerHeight;
}

window.addEventListener('resize', resize);

function animate(){

  requestAnimationFrame( animate );

  uTime = Date.now() % 100000000 / 1000;

  drawScene();

}

function init() {

  canvas = document.getElementById("webgl-canvas");

  try {
    gl = canvas.getContext( "experimental-webgl" );
    resize();
  } catch(e) {
  }
  if (!gl) {
    alert("Your browser failed to initialize WebGL.");
  }

  initShaders();
  initBuffers();
  initTextures();
  
  gl.clearColor(0, 0, 0, 0);
  gl.clearDepth(1);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  
  interact();
  animate();

}