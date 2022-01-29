import { GLTexture2D, AnyWebRenderingGLContext, loadTexture2D } from '@tsgl/gl';

export function createSubTextureGrid(
  texture: GLTexture2D,
  spriteWidth: number,
  spriteHeight = spriteWidth,
): SubTexture[] {
  const textureWidth = texture.width;
  const textureHeight = texture.height;
  if (textureWidth % spriteWidth !== 0 || textureHeight % spriteHeight !== 0) {
    throw new Error('createSubTextureGrid : texture dimension is not a multiple of sprite size');
  }

  const textures: SubTexture[] = [];

  for (let y = 0; y < textureHeight; y += spriteHeight) {
    for (let x = 0; x < textureWidth; x += spriteWidth) {
      textures.push(new SubTexture(texture, x, y, spriteWidth, spriteHeight));
    }
  }

  return textures;
}

export function createGridAlignedSubTextures(
  texture: GLTexture2D,
  spriteWidth: number,
  spriteHeight: number,
  gridPosX: number,
  gridPosY: number,
  nbTextures = 1,
  gridWidth = spriteWidth,
  gridHeight = spriteHeight,
): SubTexture[] {
  const subTextures = new Array(nbTextures);

  const nbTilePerRow = Math.floor(texture.width / gridWidth);

  for (let i = 0; i < nbTextures; i++) {
    const textureX = ((gridPosX + i) % nbTilePerRow) * gridWidth;
    const textureY = Math.floor((gridPosX + i) / nbTilePerRow + gridPosY) * gridHeight;
    subTextures[i] = new SubTexture(texture, textureX, textureY, spriteWidth, spriteHeight);
  }

  return subTextures;
}

export class SubTexture {
  static async load(gl: AnyWebRenderingGLContext, url: string, type?: GLenum): Promise<SubTexture> {
    return loadTexture2D(gl, url, type).then((glTexture) => this.fromGLTexture(glTexture));
  }
  static fromGLTexture(glTexture: GLTexture2D): SubTexture {
    return new SubTexture(glTexture, 0, 0, glTexture.width, glTexture.height);
  }

  get x(): number {
    return Math.round(this.uv[0] * this._texture.width);
  }

  get y(): number {
    return Math.round(this.uv[1] * this._texture.height);
  }

  get width(): number {
    return Math.round((this.uv[2] - this.uv[0]) * this._texture.width);
  }

  get height(): number {
    return Math.round((this.uv[3] - this.uv[1]) * this._texture.height);
  }

  get glTexture(): GLTexture2D {
    return this._texture;
  }

  uv: Float32Array;

  constructor(
    protected _texture: GLTexture2D,
    x = 0,
    y = 0,
    width: number = _texture.width,
    height: number = _texture.height,
  ) {
    this.uv = new Float32Array(4);
    this.setBounds(x, y, width, height);
  }

  setBounds(x: number, y: number, width: number, height: number): void {
    this.setBoundsRect(x, y, x + width, y + height);
  }

  setBoundsRect(left: number, top: number, right: number, bottom: number): void {
    this.setBoundUv(
      left / this._texture.width,
      top / this._texture.height,
      right / this._texture.width,
      bottom / this._texture.height,
    );
  }

  setBoundUv(left: number, top: number, right: number, bottom: number): void {
    this.uv[0] = left;
    this.uv[1] = top;
    this.uv[2] = right;
    this.uv[3] = bottom;
  }
}
