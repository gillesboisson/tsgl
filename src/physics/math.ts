import { vec2, vec3, vec4 } from 'gl-matrix';
import { XY } from './box2d/common/b2_math';



export function clamp(val: number,min: number,max: number): number{
  if(val < min)
    val = min;
  else if(val > max)
    val = max;
  return val;
}

export function lerp(min: number,max: number,ratio: number,ratioMin = 0,ratioMax = 1): number{


  ratio = clamp(ratio,ratioMin,ratioMax);

  ratio = (ratio - ratioMin) / (ratioMax - ratioMin);

  return ratio * (max - min) + min;
}

export function rotVec2FromNormal(out: vec2,source: vec2,normal: vec2): vec2{
  const x = source[0];
  const y = source[1];

  out[0] = normal[0] * x - normal[1] * y;
  out[1] = normal[0] * y + normal[1] * x;

  return out;
}


// same with b2vec
export function rotB2vFromNormal(out: vec2,source: XY,normal: vec2): vec2{
  const x = source.x;
  const y = source.y;

  out[0] = normal[0] * x - normal[1] * y;
  out[1] = normal[0] * y + normal[1] * x;

  return out;
}


export function rotToVec2Normal(out: vec2,angle: number): vec2{
  out[0] = Math.cos(angle);
  out[1] = Math.sin(angle);

  return out;
}

export function randomIndex(max: number,included = false): number{
  if(included) max++;
  return Math.floor(Math.random() * (max - 0.00000001));
}

export function colorToVec3(out: vec3,rgbColor: number): vec3{

  out[0] = ((rgbColor & 0xFF0000) >> 16 ) / 0xFF;
  out[1] = ((rgbColor & 0x00FF00) >> 8 ) / 0xFF;
  out[2] = (rgbColor & 0x0000FF) / 0xFF;



  return out;
}

export function colorToVec4(out:vec4,rgbaColor: number): vec4{
  out[0] =  rgbaColor / 0xFF000000;
  out[1] = ((rgbaColor & 0x00FF0000) >> 16 )/ 0xFF;
  out[2] = ((rgbaColor & 0x0000FF00) >> 8 )/ 0xFF;
  out[3] = (rgbaColor & 0x000000FF) / 0xFF;

  return out;
}
