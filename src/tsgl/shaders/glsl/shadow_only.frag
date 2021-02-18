precision highp float;

varying vec3 v_shadowCoord;
varying vec3 v_normal;

uniform vec3 u_lightDirection;
uniform sampler2D u_shadowMap;

uniform vec2 u_pixelSize;

#pragma glslify: pcfShadow = require(./includes/pcfShadow.glsl)


void main(){
    
    vec3 normal = normalize(v_normal);
    // if(v_shadowCoord.x < 0.0 || v_shadowCoord.y < 0.0 || v_shadowCoord.x > 1.0 || v_shadowCoord.y > 1.0){
    //   discard;
    // }

    float visibility = pcfShadow(u_shadowMap,v_shadowCoord.z,v_shadowCoord.xy,u_pixelSize,normal, u_lightDirection);

    gl_FragColor = vec4(vec3(visibility),1.0);
}
