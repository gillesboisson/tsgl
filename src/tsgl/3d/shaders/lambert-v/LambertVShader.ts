import { vec3, vec4, mat4 } from 'gl-matrix';
import { Camera } from '../../../common';
import { GLShaderVariants, AnyWebRenderingGLContext, GLVariantValueDefinition, getDefaultAttributeLocation, GLRenderer } from '../../../gl';
import { AMaterial } from '../../Material';
import { LambertVShadersState } from './LambertVShadersState';



// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./variant_shader_test.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./variant_shader_test.vert').default;

export type LambertVariant = {
  extraColor: 'red' | 'green' | 'blue';
  shadeMode: 'vertex' | 'fragment';
};

export const LambertVShaderID = 'test_variant_shader';

export class LambertVShader extends GLShaderVariants<LambertVShadersState, LambertVariant> {
  constructor(gl: AnyWebRenderingGLContext) {
    const valueDefTest: { [name: string]: GLVariantValueDefinition[] } = {
      extraColor: [
        {
          value: 'red',
          flags: {
            EXTRA_COLOR: 'vec3(1.0,0.0,0.0)',
          },
        },
        {
          value: 'green',
          default: true,
          flags: {
            EXTRA_COLOR: 'vec3(0.0,1.0,0.0)',
          },
        },
        {
          value: 'blue',
          flags: {
            EXTRA_COLOR: 'vec3(0.0,0.0,1.0)',
          },
        },
      ],
      shadeMode: [
        {
          value: 'vertex',
          flags: {
            VERTEX_SHADE: true,
          },
        },
        {
          value: 'fragment',
          default: true,
          flags: {
            FRAGMENT_SHADE: true,
          },
        },
      ],
    };

    super(
      gl,
      vertSrc,
      fragSrc,
      LambertVShadersState,
      valueDefTest,
      getDefaultAttributeLocation(['a_position', 'a_normal', 'a_uv']),
    );
  }

  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      LambertVShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new LambertVShader(gl),
    );
  }
}

// export function testVariantShader(gl: AnyWebRenderingGLContext) {
//   const shaderV = new LambertVShader(gl);
//   const state = shaderV.createState();

//   console.log('state',state.dirtyVariant);
//   state.sync();
//   console.log('state',state.dirtyVariant);

//   state.extraColor = 'blue';
//   console.log('state',state.dirtyVariant);

// }

export class TestVariantShaderMaterial extends AMaterial<LambertVShadersState> {
  constructor(renderer: GLRenderer) {
    super();

    this._shaderState = renderer.getShader(LambertVShaderID).createState() as LambertVShadersState;
  }

  lightPos: vec3 = vec3.fromValues(2,-2,-2);
  color: vec4 = vec4.fromValues(1,1,1,1);

  get shadeMode(): 'vertex' | 'fragment' {
    return this._shaderState?.getVariantValue('shadeMode') as any;
  }

  set shadeMode(shadeMode: 'vertex' | 'fragment') {
    this._shaderState?.setVariantValue('shadeMode', shadeMode);
  }

  get extraColor():  'red' | 'green' | 'blue' {
    return this._shaderState?.getVariantValue('extraColor') as any;
  }

  set extraColor(extraColor:  'red' | 'green' | 'blue') {
    this._shaderState?.setVariantValue('extraColor', extraColor);
  }



  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void {
    const ss = this._shaderState;
    
    ss.use();
    // this.diffuseMap.active(GLDefaultTextureLocation.COLOR);
    // this.normalMap.active(GLDefaultTextureLocation.NORMAL);
    // this.pbrMap.active(GLDefaultTextureLocation.PBR_0);

    cam.mvp(ss.mvpMat, transformMat);
    ss.mvMat = transformMat;
    vec3.copy(ss.lightPos, this.lightPos);
    vec4.copy(ss.color, this.color);

    // cam.normalMat(ss.normalMat, transformMat);
    // ss.cameraPos = cam.transform.getRawPosition();

    ss.syncUniforms();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(gl: AnyWebRenderingGLContext): void {
    // this.diffuseMap.unbind();
  }
}
