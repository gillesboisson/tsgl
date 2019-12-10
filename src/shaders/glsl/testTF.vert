#version 300 es
precision mediump float;

in vec2 iposition;
in vec2 ivelocity;

out vec2 oposition;
out vec2 ovelocity;

void main(){
  ovelocity = ivelocity - ivelocity / 1000.0 - vec2(0,0.001);
  oposition = iposition + ivelocity;
  
  
  /*
  if(oposition.x < -1.0 || oposition.x > 1.0) {
    oposition.x = -oposition.x;
    ovelocity.x = -ovelocity.x * 0.95;
  }

  if(oposition.y < -1.0 || oposition.y > 1.0) {
    oposition.y = -oposition.y;
    ovelocity.y = -ovelocity.y * 0.95;
  }
  */
  if(oposition.y < -1.0){
    ovelocity.y = -ovelocity.y;
    //ovelocity.x = ovelocity.x < 0.0 ? -0.05 : +0.05;
    oposition.y = -1.0;
  }


  if(oposition.x < -1.0){
    ovelocity.x = -ovelocity.x;
    oposition.x = -1.0;
  }

  if(oposition.x > 1.0){
    ovelocity.x = -ovelocity.x;
    oposition.x = 1.0;
  }
}