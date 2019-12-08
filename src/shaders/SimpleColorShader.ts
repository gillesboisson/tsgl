import {GLShader} from "../gl/core/GLShader";
import {GLUniformsData} from "../gl/core/data/GLUniformsData";
import {AnyWebRenderingGLContext} from "../gl/core/GLHelpers";
import {getDefaultAttributeLocation} from "../gl/core/data/GLDefaultAttributesLocation";
import {glShaderUniformProp, glShaderUniforms} from "../gl/core/data/GLUniformData.decorator";
import {mat4} from "gl-matrix";

const fragSrc = require('./glsl/simpleColor.frag').default;
const vertSrc = require('./glsl/simpleColor.vert').default;


@glShaderUniforms()
export class SimpleColorUniformData extends GLUniformsData{

}

export class SimpleColorShader extends GLShader<SimpleColorUniformData>{
    constructor(gl: AnyWebRenderingGLContext){
        super(gl, vertSrc, fragSrc, SimpleColorUniformData, getDefaultAttributeLocation(['position','uv','color']) )
    }
}
