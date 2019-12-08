import {GLShader} from "../gl/core/GLShader";
import {GLUniformsData} from "../gl/core/data/GLUniformsData";
import {AnyWebRenderingGLContext} from "../gl/core/GLHelpers";
import {getDefaultAttributeLocation} from "../gl/core/data/GLDefaultAttributesLocation";
import {glShaderUniformProp, glShaderUniforms} from "../gl/core/data/GLUniformData.decorator";
import {mat4} from "gl-matrix";

const fragSrc = require('./glsl/sprite.frag').default;
const vertSrc = require('./glsl/sprite.vert').default;

@glShaderUniforms()
export class SpriteUniformData extends GLUniformsData{

    @glShaderUniformProp('f',16,'mvp')
    mvp: mat4 = mat4.create();

    @glShaderUniformProp('i',1,'texture')
    textureInd: number = 0;
}

export class SpriteShader extends GLShader<SpriteUniformData>{
    constructor(gl: AnyWebRenderingGLContext){
        super(gl, vertSrc, fragSrc, SpriteUniformData, getDefaultAttributeLocation(['position','uv','color']) )
    }
}
