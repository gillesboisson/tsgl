#version 300 es
precision mediump float;

layout (location = 0) in vec3 a_position;

out vec3 v_normal;

uniform mat4 u_mvpMat;

void main()
{
    v_normal = a_position;  
    gl_Position = u_mvpMat * vec4(a_position, 1.0);
}
