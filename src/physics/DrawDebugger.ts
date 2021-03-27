import { vec3, vec4 } from 'gl-matrix';
import { Camera } from '../tsgl/3d/Camera';
import { WireframeBatch } from '../tsgl/3d/helpers/WireframeBatch';
import { createPlaneMesh } from '../tsgl/geom/mesh/createPlaneMesh';
import { VertexColorShaderState } from '../tsgl/shaders/VertexColorShader';
import { b2Draw, RGBA } from './box2d/common/b2_draw';
import { b2Transform, XY } from './box2d/common/b2_math';

const _v = { x: 0, y: 0 };
const _v2 = { x: 0, y: 0 };
const _tr = new b2Transform();
const PI2 = Math.PI * 2;

const crossPointMap: XY[] = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
];

const diamondPointMap: XY[] = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

export class DrawDebugger extends b2Draw {
  transforms: b2Transform[] = [];

  constructor(readonly batch: WireframeBatch, readonly pixelSize = 1) {
    super();
  }

  public PushTransform(xf: b2Transform): void {
    if (this.transforms.length === 0) {
      this.transforms.push(xf);
    } else {
      const out = new b2Transform();
      const t0 = this.transforms[this.transforms.length - 1];
      b2Transform.MulXX(t0, xf, out);
      this.transforms.push(out);
    }
  }

  get transform(): b2Transform {
    return this.transforms.length > 0 ? this.transforms[this.transforms.length - 1] : b2Transform.IDENTITY;
  }

  public PopTransform(xf: b2Transform): void {
    this.transforms.pop();
  }
  public DrawPolygon(verticesPos: XY[], vertexCount: number, color: RGBA): void {
    const { vertexIndex, indicesIndex } = this.batch.pull(vertexCount * 2, vertexCount);
    const t = this.transform;
    const { vertices, indices } = this.batch;

    for (let i = 0; i < vertexCount; i++) {
      b2Transform.MulXV(t, verticesPos[i], _v);
      const vert = vertices[i + vertexIndex];

      vec3.set(vert.pos, _v.x, _v.y, 0);
      vec4.set(vert.color, color.r, color.g, color.b, color.a);

      // create loop
      indices[indicesIndex + i * 2] = vertexIndex + i;
      indices[indicesIndex + i * 2 + 1] = vertexIndex + ((i + 1) % vertexCount);
    }
  }
  public DrawSolidPolygon(vertices: XY[], vertexCount: number, color: RGBA): void {
    this.DrawPolygon(vertices, vertexCount, color);
  }
  public DrawCircle(center: XY, radius: number, color: RGBA): void {
    const segment = 32;
    const segmentAngle = (Math.PI * 2) / segment;
    const { vertexIndex, indicesIndex } = this.batch.pull(segment * 2 + 2, segment + 1);
    const t = this.transform;
    const { vertices, indices } = this.batch;

    // use to draw circle center to border line
    const vs0 = _v2;

    for (let i = 0; i < segment; i++) {
      const angle = i * segmentAngle;
      _v.x = Math.cos(angle) * radius + center.x;
      _v.y = Math.sin(angle) * radius + center.y;
      b2Transform.MulXV(t, _v, _v);

      const vert = vertices[i + vertexIndex];

      vec3.set(vert.pos, _v.x, _v.y, 0);
      vec4.set(vert.color, color.r, color.g, color.b, color.a);

      // create loop
      indices[indicesIndex + i * 2] = vertexIndex + i;
      indices[indicesIndex + i * 2 + 1] = vertexIndex + ((i + 1) % segment);
    }

    b2Transform.MulXV(t, center, _v);

    // set last point as circle center to draw line between center to border
    const vert0 = vertices[vertexIndex + segment];

    vec3.set(vert0.pos, _v.x, _v.y, 0);
    vec4.set(vert0.color, color.r, color.g, color.b, color.a);

    indices[indicesIndex + segment * 2] = vertexIndex;
    indices[indicesIndex + segment * 2 + 1] = vertexIndex + segment;

    // this.drawCross(center, vertexIndex + segment, indicesIndex + segment * 2, color, t);
  }
  public DrawSolidCircle(center: XY, radius: number, axis: XY, color: RGBA): void {
    this.DrawCircle(center, radius, color);
  }
  public DrawParticles(centers: XY[], radius: number, colors: RGBA[], count: number): void {
    const { vertexIndex, indicesIndex } = this.batch.pull(count * 8 + 2, count * 4);
    const transform = this.transform;
    const { vertices, indices } = this.batch;

    for (let ct = 0; ct < count; ct++) {
      const center = centers[ct];
      const color = colors[ct];

      const indOffset = ct * 4;

      for (let i = 0; i < diamondPointMap.length; i++) {
        const ind = i + indOffset;
        const vert = vertices[vertexIndex + ind];
        _v2.x = center.x + diamondPointMap[i].x * radius;
        _v2.y = center.y + diamondPointMap[i].y * radius;
        b2Transform.MulXV(transform, _v2, _v);
        vec3.set(vert.pos, _v.x, _v.y, 0);
        vec4.set(vert.color, color.r, color.g, color.b, color.a);

        indices[indicesIndex + ind * 2] = vertexIndex + indOffset + i ;
        indices[indicesIndex + ind * 2 + 1] = vertexIndex + indOffset + ((i+1) % 4);
      }
    }
  }
  public DrawSegment(p1: XY, p2: XY, color: RGBA): void {
    const { vertexIndex, indicesIndex } = this.batch.pull(2, 2);
    // const t = this.transform;
    const { vertices, indices } = this.batch;

    b2Transform.MulXV(this.transform, p1, _v);
    b2Transform.MulXV(this.transform, p2, _v2);

    const vert1 = vertices[vertexIndex];
    const vert2 = vertices[vertexIndex + 1];

    vec3.set(vert1.pos, _v.x, _v.y, 0);
    vec3.set(vert2.pos, _v2.x, _v2.y, 0);

    vec4.set(vert1.color, color.r, color.g, color.b, color.a);
    vec4.set(vert2.color, color.r, color.g, color.b, color.a);

    indices[indicesIndex] = vertexIndex;
    indices[indicesIndex + 1] = vertexIndex + 1;
  }

  protected drawCross(
    center: XY,
    vertexIndex: number,
    indicesIndex: number,
    color: RGBA,
    transform = this.transform,
    pixelRadius = 4,
  ): void {
    const { vertices, indices } = this.batch;

    for (let i = 0; i < crossPointMap.length; i++) {
      const vert = vertices[vertexIndex + i];
      _v2.x = center.x + crossPointMap[i].x * this.pixelSize * pixelRadius;
      _v2.y = center.y + crossPointMap[i].y * this.pixelSize * pixelRadius;
      b2Transform.MulXV(transform, _v2, _v);
      vec3.set(vert.pos, _v.x, _v.y, 0);
      vec4.set(vert.color, color.r, color.g, color.b, color.a);

      indices[indicesIndex + i] = vertexIndex + i;
    }
  }

  public DrawTransform(xf: b2Transform): void {}
  public DrawPoint(p: XY, size: number, color: RGBA): void {
    //throw new Error('Method not implemented.');
    const { vertexIndex, indicesIndex } = this.batch.pull(4, 4);

    this.drawCross(p,vertexIndex,indicesIndex,color,this.transform,size);

  }
}
