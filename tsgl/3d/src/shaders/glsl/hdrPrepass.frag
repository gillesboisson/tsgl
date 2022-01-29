#version 300 es
precision mediump float;


layout (location = 0) out vec4 FragColor;
layout (location = 1) out vec4 BrightColor;

uniform vec2 u_gammaExposure;
uniform sampler2D u_texture;

in vec2 v_uv;

void main() 
{
    vec4 color = texture(u_texture, v_uv);
    vec3 mapped = vec3(1.0) - exp(-color.rgb * u_gammaExposure.y);
    // gamma correction 
    mapped = pow(mapped, vec3(1.0 / u_gammaExposure.x));
  
    FragColor = vec4(mapped, color.a);

    float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
    if(brightness > 1.0)
        BrightColor = vec4(color.rgb, 1.0);
    else
        BrightColor = vec4(0.0, 0.0, 0.0, 1.0);
}