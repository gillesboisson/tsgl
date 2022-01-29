#version 300 es
precision mediump float;


out vec4 FragColor;
in vec3 v_localPosition;

uniform sampler2D u_texture;

const vec2 invAtan = vec2(0.1591, 0.3183);
vec2 SampleSphericalMap(vec3 v)
{
    vec2 uv = vec2(atan(v.z, v.x), asin(v.y));
    uv *= invAtan;
    uv += 0.5;
    return vec2(uv.x, 1.0 - uv.y);
}

void main()
{		
    vec2 uv = SampleSphericalMap(normalize(v_localPosition)); // make sure to normalize v_localPosition
    vec3 color = texture(u_texture, uv).rgb;
    
    FragColor = vec4(color, 1.0);
}