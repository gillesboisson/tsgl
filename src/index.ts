import { mat4, vec3, vec4 } from 'gl-matrix';

import { Base3DApp } from './app/Base3DApp';
import { convertPlaceSpaceToModelSpaceNormalMap } from './app/helpers/convertPlaceSpaceToModelSpaceNormalMap';
import {
  createCubemapEmptyTexture,
  createCubemapMipmapStorageTexture,
  createEmptyMipmapTexture,
  createEmptyTextureWithLinearFilter,
  createFBAndFlippableTexture,
  createImageTextureWithLinearFilter,
  createMipmapTextureForStorage,
  createMipmapTextureProxy,
} from './tsgl/helpers/texture/texture';
import { TestFlatMaterial } from './app/materials/TestFlatMaterial';
import { CopyShader, CopyShaderID, CopyShaderState } from './app/shaders/CopyShader';
import { TestBlurShader, TestBlurShaderID, TestBlurShaderState } from './app/shaders/TestBlurShader';
import { TestFlatShader } from './app/shaders/TestFlatShader';
import { TestLodShader, TestLodShaderID, TestLodShaderState } from './app/shaders/TestLodShader';
import { LambertVShader } from './app/shaders/VariantShaderTest';
import { Camera } from './tsgl/3d/Camera';
import { GLTFData } from './tsgl/3d/gltf/GLFTSchema';
import { GLTFNode } from './tsgl/3d/gltf/GLTFNode';
import {
  setBufferViewTargetFromMesh,
  loadBuffers,
  getBufferViewsDataLinkedToBuffer,
  loadBufferView,
  createMesh,
  loadTextures,
} from './tsgl/3d/gltf/GLTFParser';
import { IRenderableInstance3D } from './tsgl/3d/IRenderableInstance3D';
import { DepthOnlyMaterial } from './tsgl/3d/Material/DepthOnlyMaterial';
import { PhongBlinnMaterial } from './tsgl/3d/Material/PhongBlinnMaterial';
import { ShadowOnlyMaterial } from './tsgl/3d/Material/ShadownOnlyMaterial';
import { SimplePBRMaterial } from './tsgl/3d/Material/SimplePBRMaterial';
import { SkyboxMaterial } from './tsgl/3d/Material/SkyboxMaterial';
import { MeshNode, SceneInstance3D } from './tsgl/3d/SceneInstance3D';
import { ShadowMap } from './tsgl/3d/ShadowMap';
import { CameraLookAtTransform3D } from './tsgl/geom/CameraTargetTransform3D';
import { CubeMapPatronHelper } from './tsgl/geom/CubeMapPatronHelper';
import { IrradianceHelper } from './tsgl/geom/IrradianceHelper';
import { createBoxMesh, cubeSquarePatronUv } from './tsgl/geom/mesh/createBoxMesh';
import { createCylinderMesh } from './tsgl/geom/mesh/createCylinderMesh';
import { createPlaneMesh } from './tsgl/geom/mesh/createPlaneMesh';
import { createQuadMesh } from './tsgl/geom/mesh/createQuadMesh';
import { createSkyBoxMesh } from './tsgl/geom/mesh/createSkyBoxMesh';
import { createSphereMesh } from './tsgl/geom/mesh/createSphereMesh';
import { Transform3D } from './tsgl/geom/Transform3D';
import { GLBuffer } from './tsgl/gl/core/data/GLBuffer';
import { GLMesh } from './tsgl/gl/core/data/GLMesh';
import { GLVao } from './tsgl/gl/core/data/GLVao';
import { GLFramebuffer } from './tsgl/gl/core/framebuffer/GLFramebuffer';
import { GLViewportStack } from './tsgl/gl/core/framebuffer/GLViewportState';
import { GLRenderer, WebGL2Renderer } from './tsgl/gl/core/GLRenderer';
import { GLTexture } from './tsgl/gl/core/GLTexture';
import { FirstPersonCameraController } from './tsgl/input/CameraController';
import { BasicColorShader } from './tsgl/shaders/BasicColorShader';
import { BasicTextureShaderState, BasicTextureShader, BasicTextureShaderID } from './tsgl/shaders/BasicTextureShader';
import { DepthOnlyShader } from './tsgl/shaders/DepthOnlyShader';
import { MSDFShader } from './tsgl/shaders/MSDFShader';
import { PhongBlinnVShader } from './tsgl/shaders/PhongBlinnVShader';
import {
  PlaneSpaceToModelSpaceNormalShaderState,
  PlaneSpaceToModelSpaceNormalShader,
} from './tsgl/shaders/PlaceSpaceToModelSpaceNormalShader';
import { ShadowOnlyShader } from './tsgl/shaders/ShadowOnlyShader';
import { SimpleLamberianShader } from './tsgl/shaders/SimpleLamberianShader';
import { SimplePBRShader } from './tsgl/shaders/SimplePBRShader';
import { SimpleTextureShader } from './tsgl/shaders/SimpleTextureShader';
import { SkyboxShader } from './tsgl/shaders/SkyboxShader';
import { IrradianceShader, IrradianceShaderState } from './app/shaders/IrradianceShader';
import {
  EquiToCubemapShader,
  EquiToCubemapShaderID,
  EquiToCubemapShaderState,
} from './app/shaders/EquiToCubemapShader';
import { floatToRgb9_e5, loadHDR, loadHDRToFloatTexture, rgbeToFloat } from './tsgl/helpers/texture/hdr';
import { IrradianceShaderID } from './app/shaders/IrradianceShader';
import { HDRToCubemap } from './tsgl/helpers/texture/HDRRectToCubemap';
import { IrradianceCubemapRenderer } from './tsgl/helpers/texture/IrradianceCubemapRenderer';
import { createFramebufferWithDepthStorage } from './tsgl/helpers/framebuffer';

window.addEventListener('load', async () => {
  const app = new TestApp();
});

class TestApp extends Base3DApp {
  meshVao: GLVao;
  cubeTransform: Transform3D;
  private _corsetNode: GLTFNode;
  private _modelSpaceFramebuffer: GLFramebuffer;

  private _camController: FirstPersonCameraController;
  private _cubeMap: GLTexture;
  fb: GLFramebuffer;
  vps: GLViewportStack;
  private _flatMat: TestFlatMaterial;
  cubePHelper: CubeMapPatronHelper;
  private _cubeMapPatron: GLTexture;
  private _irradianceHelper: IrradianceHelper;
  private _skybox: MeshNode;
  private _ppTomsNormal: PlaneSpaceToModelSpaceNormalShaderState;
  private _sphere: MeshNode;
  private _sceneRenderables: SceneInstance3D;
  private _lcam: Camera<CameraLookAtTransform3D>;
  private _quad: GLMesh;
  private _quadSS: BasicTextureShaderState;
  private _shadowMap: ShadowMap;
  private _shadowMat: ShadowOnlyMaterial;
  constructor() {
    super(document.getElementById('test') as HTMLCanvasElement);
    this.cubeTransform = new Transform3D();

    this._cam.transform.setPosition(0, 0, 3);

    // this.loadScene();
    // this.loadScene().then(() => {
    //   this._lcam = new Camera(CameraLookAtTransform3D).setPerspective(
    //     70,
    //     this._renderer.width / this._renderer.height,
    //     0.1,
    //     100,
    //   );
    //   this._lcam.transform.setPosition(0, 0, 2);
    //   // this._lcam.transform.setTargetPosition(0,0,0);
    //   this._camController = new FirstPersonCameraController(this._cam, this._renderer.canvas, 0.06, 0.002);

    //   // this.start();
    // });

    requestAnimationFrame(() => this.testHdrPng());
  }

  registeShader(gl: WebGL2RenderingContext, renderer: GLRenderer) {
    SimpleTextureShader.register(renderer);
    SimpleLamberianShader.register(renderer);
    TestFlatShader.register(renderer);
    MSDFShader.register(renderer);
    // PhongBlinnShader.register(renderer);
    PhongBlinnVShader.register(renderer);
    IrradianceShader.register(renderer);
    SkyboxShader.register(renderer);
    PlaneSpaceToModelSpaceNormalShader.register(renderer);
    LambertVShader.register(renderer);
    DepthOnlyShader.register(renderer);
    BasicTextureShader.register(renderer);
    ShadowOnlyShader.register(renderer);
    SimplePBRShader.register(renderer);
    BasicColorShader.register(renderer);
    TestLodShader.register(renderer);
    TestBlurShader.register(renderer, 4);
    CopyShader.register(renderer);
    EquiToCubemapShader.register(renderer);
    IrradianceShader.register(renderer);
  }

  // async testmipmapMax() {
  //   const gl = this.renderer.gl as WebGL2RenderingContext;

  //   const quad = createQuadMesh(gl);

  //   // const shaderState = this.renderer.getShader<BasicColorShaderState>(BasicColorShaderID).createState();
  //   const lodShader = this.renderer.getShader<TestLodShaderState>(TestLodShaderID).createState();

  //   const { width, height, texture } = await createMipmapMax(gl, './images/panda-wallpaper.jpg');
  //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //   lodShader.use();
  //   gl.activeTexture(gl.TEXTURE0);
  //   gl.bindTexture(gl.TEXTURE_2D, texture);

  //   lodShader.syncUniforms();

  //   quad.draw();

  // }

  async testHdrPng() {
    const gl = this._renderer.gl as WebGL2RenderingContext;


    const { img: hdrImage, width: hdrWidth, height: hdrHeight } = await loadHDR('./images/ballroom_2k.hdr');
    
    
    const {texture: hdrTexture} = loadHDRToFloatTexture(gl as WebGL2RenderingContext, hdrWidth, hdrHeight,rgbeToFloat(hdrImage));
    
    
    const { cubemap, size: cubemapSize, internalFormat, format, type } = createCubemapEmptyTexture(
      gl,
      256,
      gl.RGBA16F,
      gl.RGBA,
      gl.FLOAT,
    );
    const { cubemap:irradianceCubemap } = createCubemapEmptyTexture(
      gl,
      cubemapSize,
      internalFormat,
      format,
      type,
    );


    const {framebuffer} = createFramebufferWithDepthStorage(gl,cubemapSize,cubemapSize,gl.DEPTH_COMPONENT24);

    const hdrRenderer = new HDRToCubemap(this._renderer as WebGL2Renderer,cubemapSize,framebuffer);
    hdrRenderer.source = hdrTexture;
    hdrRenderer.dest = cubemap;
    hdrRenderer.render();

    const irradianceRenderer = new IrradianceCubemapRenderer(this._renderer as WebGL2Renderer,cubemapSize,framebuffer);
    irradianceRenderer.source = cubemap;
    irradianceRenderer.dest = irradianceCubemap;
    irradianceRenderer.render();


    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

    gl.viewport(0, 0, this._renderer.width, this._renderer.height);
    
    const skybox = createSkyBoxMesh(gl);
    // const debugT = new GLTexture({ gl, texture: cubemap }, gl.TEXTURE_CUBE_MAP);
    const debugT = new GLTexture({ gl, texture: irradianceCubemap }, gl.TEXTURE_CUBE_MAP);
    const debugSB = new MeshNode(new SkyboxMaterial(this.renderer, debugT), skybox);
    this._camController = this._camController = new FirstPersonCameraController(
      this._cam,
      this._renderer.canvas,
      0.06,
      0.002,
    );

    const renderLoop = () => {
      debugSB.transform.setScale(30);

      debugSB.updateTransform();
      this._cam.updateTransform();

      this._renderer.clear();
      this._camController.update(1000 / 60);

      debugSB.render(gl, this._cam);

      window.requestAnimationFrame(renderLoop);
    };

    renderLoop();
  }

  async testLodBlur2() {
    const gl = this._renderer.gl as WebGL2RenderingContext;

    // init shaders
    const blurShaderState = this.renderer.getShader<TestBlurShaderState>(TestBlurShaderID).createState();
    const lodShader = this.renderer.getShader<TestLodShaderState>(TestLodShaderID).createState(); // split

    blurShaderState.radius = 2;

    blurShaderState.kernel = new Float32Array(new Array(49).fill(1 / 49));

    const image = await fetch('./images/panda-wallpaper.jpg')
      .then((response) => response.blob())
      .then((blob) => createImageBitmap(blob));

    const { texture: textureDest, width, height, levels } = createMipmapTextureForStorage(
      gl,
      image.width,
      image.height,
      4,
    );
    const { texture: textureProxy } = createEmptyMipmapTexture(gl, image.width, image.height, 4);

    const framebuffer = gl.createFramebuffer();

    const quad = createQuadMesh(gl);

    // upload image data to both texture
    gl.bindTexture(gl.TEXTURE_2D, textureProxy);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, image as any);

    gl.bindTexture(gl.TEXTURE_2D, textureDest);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, image as any);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.activeTexture(gl.TEXTURE0);

    for (let level = 1; level < 4; level++) {
      // setup viewport and shader based on current level source and destination texture
      const vpWidth = width / Math.pow(2, level); // size / 2 every iteration = size / pow(2,level)
      const vpHeight = height / Math.pow(2, level);
      gl.viewport(0, 0, vpWidth, vpHeight);

      const tWidth = width / Math.pow(2, level - 1);
      const tHeight = height / Math.pow(2, level - 1);
      blurShaderState.textureWidth = tWidth;
      blurShaderState.textureHeight = tHeight;
      blurShaderState.textureLod = level - 1;

      // bind source texture
      gl.bindTexture(gl.TEXTURE_2D, textureProxy);

      // target mipmap texture
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureDest, level);

      console.log('sizes', vpWidth, vpHeight, tWidth, tHeight);

      // do blur pass
      this._renderer.clear();
      blurShaderState.use();
      blurShaderState.syncUniforms();
      quad.draw();

      gl.bindTexture(gl.TEXTURE_2D, textureProxy);
      gl.copyTexSubImage2D(gl.TEXTURE_2D, level, 0, 0, 0, 0, vpWidth, vpHeight);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.renderer.clear();
    gl.viewport(0, 0, this._renderer.width, this._renderer.height);
    lodShader.use();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureDest);

    lodShader.syncUniforms();
    quad.draw();
  }
  async testLodBlur() {
    const gl = this._renderer.gl as WebGL2RenderingContext;

    // init shaders
    const blurShaderState = this.renderer.getShader<TestBlurShaderState>(TestBlurShaderID).createState();
    const copyShader = this.renderer.getShader<CopyShaderState>(CopyShaderID).createState();
    const lodShader = this.renderer.getShader<TestLodShaderState>(TestLodShaderID).createState(); // split mipmap screen just for debugging

    // setup kernel to have full 1/kernel size split
    blurShaderState.kernel = new Float32Array(new Array(49).fill(1 / 49));

    // load image
    const image = await fetch('./images/panda-wallpaper.jpg')
      .then((response) => response.blob())
      .then((blob) => createImageBitmap(blob));

    // create 2 mipmap texture and store loaded image to a source texture
    const { texture: texture1, width, height, levels } = createMipmapTextureForStorage(
      gl,
      image.width,
      image.height,
      4,
    );
    const { texture: texture2 } = createMipmapTextureForStorage(gl, image.width, image.height, 4);
    const { texture: sourceT } = createImageTextureWithLinearFilter(gl, image);

    // create a quad vao for all passes
    const quad = createQuadMesh(gl);

    // init fb
    const framebuffer = gl.createFramebuffer();

    // prepare first mipmap level by copying source texture in two texture on lod level 0
    const prepareTopLevel = () => {
      gl.viewport(0, 0, width, height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sourceT);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);
      this.renderer.clear();
      copyShader.use();
      copyShader.textureLod = 0;
      copyShader.syncUniforms();
      quad.draw();
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture2, 0);
      this.renderer.clear();
      quad.draw();
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      // equivalent of
      // gl.bindTexture(gl.TEXTURE_2D, texture1);
      // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image as any);
      // gl.bindTexture(gl.TEXTURE_2D, texture2);
      // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image as any);
      // ... with non storage texture
    };

    const draw = () => {
      // setup static settings and bind framebuffer
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      blurShaderState.radius = 3;

      // go through every level
      for (let level = 1; level < 4; level++) {
        // break;

        // swap source and dest texture
        const textureS = level % 2 === 1 ? texture1 : texture2;
        const textureD = level % 2 === 1 ? texture2 : texture1;

        // setup viewport and shader based on current level source and destination texture
        const vpWidth = width / Math.pow(2, level); // size / 2 every iteration = size / pow(2,level)
        const vpHeight = height / Math.pow(2, level);
        gl.viewport(0, 0, vpWidth, vpHeight);

        const tWidth = width / Math.pow(2, level - 1);
        const tHeight = height / Math.pow(2, level - 1);
        blurShaderState.textureWidth = tWidth;
        blurShaderState.textureHeight = tHeight;
        blurShaderState.textureLod = level - 1;

        // bind source texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureS);

        // target mipmap texture
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureD, level);

        // do blur pass
        this._renderer.clear();
        blurShaderState.use();
        blurShaderState.syncUniforms();
        quad.draw();

        // every two iteration (when t2 render to t1) we copy the result to t2 in order to set t2 with every levels
        if (level % 2 === 0) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture1);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture2, level);
          this.renderer.clear();
          copyShader.use();
          copyShader.textureLod = level;
          copyShader.syncUniforms();
          quad.draw();
        }
      }

      // doing a debugging pass in screen framebuffer
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      this.renderer.clear();
      gl.viewport(0, 0, this._renderer.width, this._renderer.height);
      lodShader.use();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture2);

      lodShader.syncUniforms();
      quad.draw();
    };

    prepareTopLevel();
    draw();
  }

  async testBlur() {
    const gl = this._renderer.gl as WebGL2RenderingContext;

    const shaderState = this.renderer.getShader<TestBlurShaderState>(TestBlurShaderID).createState();

    const image = await fetch('./images/panda-wallpaper.jpg')
      .then((response) => response.blob())
      .then((blob) => createImageBitmap(blob));

    const { texture: textureSource, width, height } = createImageTextureWithLinearFilter(gl, image);

    const { texture1, texture2, framebuffer } = createFBAndFlippableTexture(gl, width, height);

    const ratio = shaderState;

    shaderState.textureWidth = width;
    shaderState.textureHeight = height;
    shaderState.kernel = new Float32Array(new Array(25).fill(1 / 25));
    shaderState.radius = 2;

    const quad = createQuadMesh(gl);

    const draw = () => {
      gl.viewport(0, 0, width, height);
      this._renderer.clear();

      shaderState.radius = 8;

      // gl.bindTexture(gl.TEXTURE_2D, texture1);
      // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image as any);

      const nbPass = 8;
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      let sourceT: WebGLTexture;
      let destT: WebGLTexture;
      for (let i = 0; i < nbPass; i++) {
        sourceT = i === 0 ? textureSource : i % 2 === 0 ? texture1 : texture2;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sourceT);

        destT = i % 2 === 0 ? texture2 : texture1;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, destT, 0);

        this._renderer.clear();
        shaderState.use();
        shaderState.syncUniforms();
        quad.draw();
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, this._renderer.width, this._renderer.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, destT);

      shaderState.radius = 0;

      shaderState.use();
      shaderState.syncUniforms();
      quad.draw();

      window.requestAnimationFrame(draw);
    };

    draw();
  }

  async loadTexture(): Promise<void> {}

  protected async loadScene(): Promise<void> {
    const gl = this._renderer.gl;

    const dir = './models/Corset/glTF';

    const gltfData: GLTFData = await fetch(`${dir}/Corset.gltf`).then((response) => response.json());
    setBufferViewTargetFromMesh(gl, gltfData);

    const glBuffers: GLBuffer[] = new Array(gltfData.bufferViews.length);

    await loadBuffers(gltfData, dir, (ind, buffer) => {
      getBufferViewsDataLinkedToBuffer(gltfData, ind).forEach((bufferViewData) => {
        glBuffers[bufferViewData.ind] = loadBufferView(gl, bufferViewData.bufferView, buffer);
      });
    });

    const textures = await loadTextures(gl, gltfData, dir);

    const corsetMesh = createMesh(gl, gltfData.meshes[0], gltfData.accessors, gltfData.bufferViews, glBuffers);
    const corsetNormalMap = textures[2];
    const corsetPbrMap = textures[1];
    const corsetModelSpaceNormalMap = convertPlaceSpaceToModelSpaceNormalMap(
      this._renderer,
      corsetMesh.vaos[0],
      corsetMesh.primitives[0].nbElements,
      corsetNormalMap,
    );

    this._shadowMap = new ShadowMap(this.renderer, 1024, 1024, 3, 0.001, 10);
    this._shadowMap.setPosition(2, 2, 2);
    this._shadowMap.setLookAt(-1, -1, -1);

    this._shadowMat = new ShadowOnlyMaterial(this._renderer, this._shadowMap);

    // this._shadowFB = new GLFramebuffer(gl, 512, 512, true, false, true, false);
    // this._shadowCam = new Camera(CameraLookAtTransform3D).setOrtho(-3, 3, -3, 3, 0.001, 5);
    // this._shadowCam.transform.setPosition(2, 2, 2);
    // this._shadowCam.transform.setLookAt(-1, -1, -1);

    // const corsetMaterial =  new SimpleLamberianMaterial(this._renderer, textures[0], textures[2], textures[1]);
    // const corsetMaterial =  new TestVariantShaderMaterial(this._renderer);

    // const phongBlinnMaterial = new PhongBlinnVMaterial(this._renderer, corsetModelSpaceNormalMap, {
    //   position: vec3.fromValues(10,10,10),
    //   color: vec3.create(),
    //   specularColor: vec3.create(),
    //   shininess: 0.0,
    //   ambiantColor: vec3.fromValues(1,1,1),
    // });

    const light = {
      direction: vec3.normalize(vec3.create(), vec3.fromValues(-1, -1, -1)),
      color: vec3.fromValues(1.0, 1.0, 1.0),
      specularColor: vec3.fromValues(0.3, 0.3, 0.3),
      shininess: 32.0,
      ambiantColor: vec3.fromValues(0.7, 0.7, 0.7),
    };

    // this._shadowCam.transform.copyLookAt(light.direction);

    const phongBlinnMaterial = new PhongBlinnMaterial(this._renderer, light);

    phongBlinnMaterial.normalMap = corsetNormalMap;
    phongBlinnMaterial.tbnEnabled = true;
    phongBlinnMaterial.diffuseMap = textures[0];

    // phongBlinnMaterial.debug = PhongBlinnShaderDebug.shadow;

    // phongBlinnMaterial.normalMap = corsetModelSpaceNormalMap;
    // phongBlinnMaterial.tbnEnabled = false;

    // enable ambiant occlusionMap
    phongBlinnMaterial.extraMap = corsetPbrMap;
    phongBlinnMaterial.occlusionMapEnabled = true;

    // phongBlinnMaterial.debug = PhongBlinnShaderDebug.ambiant

    // corsetMaterial.shadeMode = 'fragment';
    // corsetMaterial.extraColor = 'green';
    // vec3.set(corsetMaterial.lightPos,5,10,5);

    this._corsetNode = new GLTFNode(corsetMesh, phongBlinnMaterial, gltfData.nodes[0]);
    this._corsetNode.transform.setScale(20);
    this._corsetNode.transform.setPosition(0, -0.5, 0);

    // cubemap size
    const bufferSize = 512;
    const cubeMapPatron = await GLTexture.loadTexture2D(this._renderer.gl, './images/circus/hdri/test_cmap.jpeg');
    this.cubePHelper = new CubeMapPatronHelper(this.renderer, bufferSize);
    this.cubePHelper.unwrap(cubeMapPatron);

    this._irradianceHelper = new IrradianceHelper(this.renderer, bufferSize);
    this._irradianceHelper.unwrap(this.cubePHelper.framebufferTexture);

    // create skybox
    this._skybox = new MeshNode(
      new SkyboxMaterial(this._renderer, this.cubePHelper.framebufferTexture),
      createSkyBoxMesh(this._renderer.gl),
    );

    this._skybox.transform.setScale(50);

    phongBlinnMaterial.irradianceMap = this._irradianceHelper.framebufferTexture;

    this._quad = createQuadMesh(gl);
    this._quadSS = this.renderer.getShader(BasicTextureShaderID).createState() as BasicTextureShaderState;

    // this._ppTomsNormal = this._renderer.getShader(PlaneSpaceToModelSpaceNormalShaderID).createState() as PlaneSpaceToModelSpaceNormalShaderState;
    // this._modelSpaceFramebuffer = new GLFramebuffer(gl,corsetNormalMap.width,corsetNormalMap.height,false,true,false,false);
    // const normalImageData = new Uint8Array(corsetNormalMap.width * corsetNormalMap.height * 4);

    // this._modelSpaceFramebuffer.bind();
    // // const format = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_FORMAT);
    // // const type = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_TYPE);

    // gl.disable(gl.CULL_FACE);
    // this._ppTomsNormal.use();
    // corsetMesh.vaos[0].bind();
    // textures[2].active(GLDefaultTextureLocation.NORMAL);
    // gl.drawElements(gl.TRIANGLES,corsetMesh.primitives[0].nbElements,gl.UNSIGNED_SHORT,0);

    // gl.enable(gl.CULL_FACE);
    // this._modelSpaceFramebuffer.unbind();

    // gl.bindFramebuffer(gl.FRAMEBUFFER, this._modelSpaceFramebuffer.glFrameBuffer);
    // // gl.readPixels(0,0,512,512,gl.RGBA,gl.UNSIGNED_BYTE,normalImageData);
    // gl.bindFramebuffer(gl.FRAMEBUFFER,null);

    // setTimeout(() => console.log(normalImageData),2000);
    const depthMaterial = new DepthOnlyMaterial(this._renderer);

    const cubePatronTexture = await GLTexture.loadTexture2D(gl, 'images/base-cube-patron.jpg');

    const sphereMesh = createSphereMesh(gl, 1, 64, 32);
    const cylinderMesh = createCylinderMesh(gl, 1, 1, 1, 32, 1);
    const cubeMesh = createBoxMesh(gl, 1, 1, 1, 3, 3, 3, cubeSquarePatronUv);
    const sphereMat = new PhongBlinnMaterial(this._renderer, light);
    sphereMat.diffuseMap = cubePatronTexture;
    sphereMat.irradianceMap = this._irradianceHelper.framebufferTexture;
    this._sphere = new MeshNode(sphereMat, cubeMesh);
    this._sphere.transform.translate(0.5, 1, 1);

    const planeMesh = createPlaneMesh(gl);
    const plane = new MeshNode(sphereMat, planeMesh);

    plane.transform.rotateEuler(-Math.PI / 2, 0, 0);
    plane.transform.setScale(5);
    plane.transform.setPosition(0, -1, 0);

    this._sceneRenderables = new SceneInstance3D();

    sphereMat.shadowMap = this._shadowMap;
    // sphereMat.debug = PhongBlinnShaderDebug.shadow;
    phongBlinnMaterial.shadowMap = this._shadowMap;

    // this._shadowCam.transform.setPosition(-10,-10,-10);
    // quat.rotationTo(this._shadowCam.transform.getRawRotation(), this._sphere.transform.getRawPosition(), this._shadowCam.transform.getRawPosition());

    // [this._skybox, this._sphere, this._corsetNode, plane].forEach((node) => this._sceneRenderables.addChild(node));
    [plane, this._skybox].forEach((node) => this._sceneRenderables.addChild(node));

    const step = 5;

    for (let i = 0; i <= step; i++) {
      for (let f = 0; f <= step; f++) {
        // const pbrMat = new PhongBlinnMaterial(this.renderer, light);

        const pbrMat = new SimplePBRMaterial(this.renderer, light);

        pbrMat.irradianceMap = this._irradianceHelper.framebufferTexture;
        pbrMat.refelexionMap = this.cubePHelper.framebufferTexture;

        vec3.set(pbrMat.color, 1, 1, 1);

        pbrMat.metalic = f / step;
        pbrMat.roughness = i / step;

        const pbrSphere = new MeshNode(pbrMat, createSphereMesh(this._renderer.gl, 0.4, 32, 32));
        // const pbrSphere = new MeshNode(pbrMat, createBoxMesh(gl,0.5,0.5,0.5));

        pbrSphere.transform.translate(i, f, 0);

        // this._sceneRenderables.addChild(pbrSphere);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, elapsedTime: number): void {
    this._camController.update(elapsedTime);
    //
    this._corsetNode.transform.rotateEuler(0, elapsedTime * 0.001, 0);

    // const camQuat = this._cam.transform.getRawRotation();

    // // console.log('camQuat',camQuat);
    // const diff = vec3.create();

    // vec3.normalize(diff, this._cam.transform.getRawPosition());

    // quat.rotationTo(camQuat,vec3.fromValues(0,0,-1), diff);

    // this._cam.transform.rotationTo(vec3.create());
    // this._lcam.transform.translate(0.01,0,0);
    this._cam.updateTransform();
    this._lcam.updateTransform();

    this._shadowMap.updateTransform();

    this._sceneRenderables.updateTransform();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: number, elapsedTime: number): void {
    // this.stop();

    // this._irradianceHelper.framebufferTexture.active(9);
    // this._renderer.gl.viewport(0, 0, 1280, 720);

    // this._skybox.render(this._renderer.gl,this._cam);
    // this._corsetNode.render(this._renderer.gl, this._cam);
    // this._sphere.render(this._renderer.gl,this._cam);
    const renderer = this._renderer;
    const gl = this._renderer.gl;

    // this._shadowFB.bind();
    // // renderable.
    // this._renderer.clear();
    // this._sceneRenderables.getNodes<IRenderableInstance3D>().forEach((node) => node.render(gl, this._shadowCam));
    // this._shadowFB.unbind();

    // this._shadowMap.renderDepthMap(this._sceneRenderables.getNodes<IRenderableInstance3D>());

    this._sceneRenderables.getNodes<IRenderableInstance3D>().forEach((node) => node.render(gl, this._cam));

    // this._quadSS.use();
    // this._shadowMap.depthTexture.active(0);
    // // mat4.identity(this._quadSS.mvp);
    // this._quadSS.syncUniforms();
    // this._quad.draw();
    // this._shadowFB.colorTexture.unbind();
  }

  renderElement(renderable: IRenderableInstance3D) {
    // renderable.render(this._renderer.gl, this._shadowCam as any);
    // this._shadowFB.unbind();
    // this._shadowFB.colorTexture.active(0);
    // mat4.identity(this._quadSS.mvp);
    // this._quadSS.use();
    // this._quadSS.syncUniforms();
    // this._quad.draw();
  }
}
