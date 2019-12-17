#version 300 es


precision  mediump float;

struct NodeResult {
  mat4 mvp;
  mat4 mv;
  mat4 rot;
};

uniform transform {
  NodeResult data[128];
} ;
  

in vec3 position;
in vec4 color;

out vec4 vcolor;

void main(){
    //vuv = vec2(uv.x,1.0-uv.y);
    vcolor = color;

    gl_Position =  data[gl_InstanceID].mvp * vec4(position,1.0);
    // gl_Position = vec4(position,1.0);
}
