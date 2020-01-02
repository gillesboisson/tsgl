#version 300 es
precision mediump float;

layout (std140) uniform model {
  mat4 uMvp;
  vec4 uColor;
};

in vec2 position;
in vec2 uv;
in vec4 color;

out vec4 vcolor;
out vec2 vuv;

void main(){
    //vuv = vec2(uv.x,1.0-uv.y);
    vuv = uv;
    vcolor = uColor * color;

    gl_Position = uMvp * vec4(position,0.0,1.0);
}
