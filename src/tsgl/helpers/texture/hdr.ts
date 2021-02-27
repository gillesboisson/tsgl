import { IGLTexture } from '../../gl/core/GLTexture';

function m(a: any, b: any): any {
  for (var i in b) a[i] = b[i];
  return a;
}

/** Load and parse a Radiance .HDR file. It completes with a 32bit RGBE buffer.
 * @param {URL} url location of .HDR file to load.
 * @param {function} completion completion callback.
 * @returns {XMLHttpRequest} the XMLHttpRequest used to download the file.
 */
export function loadHDR(url: string): Promise<{ img: Uint8Array; width: number; height: number }> {
  const req = m(new XMLHttpRequest(), { responseType: 'arraybuffer' });

  return new Promise((resolve, reject) => {
    req.onerror = reject;
    req.onload = function () {
      if (this.status >= 400) return this.onerror();
      let header = '',
        pos = 0,
        d8 = new Uint8Array(this.response),
        format;
      // read header.
      while (!header.match(/\n\n[^\n]+\n/g)) header += String.fromCharCode(d8[pos++]);
      // check format.
      format = header.match(/FORMAT=(.*)$/m)[1];
      if (format != '32-bit_rle_rgbe') return console.warn('unknown format : ' + format), this.onerror();
      // parse resolution
      const rez = header.split(/\n/).reverse()[1].split(' ');
      const width = parseFloat(rez[3]);
      const height = parseFloat(rez[1]);
      // Create image.
      var img = new Uint8Array(width * height * 4),
        ipos = 0;
      // Read all scanlines
      for (var j = 0; j < height; j++) {
        var rgbe = d8.slice(pos, (pos += 4)),
          scanline = [];
        if (rgbe[0] != 2 || rgbe[1] != 2 || rgbe[2] & 0x80) {
          var len = width,
            rs = 0;
          pos -= 4;
          while (len > 0) {
            img.set(d8.slice(pos, (pos += 4)), ipos);
            if (img[ipos] == 1 && img[ipos + 1] == 1 && img[ipos + 2] == 1) {
              for (img[ipos + 3] << rs; i > 0; i--) {
                img.set(img.slice(ipos - 4, ipos), ipos);
                ipos += 4;
                len--;
              }
              rs += 8;
            } else {
              len--;
              ipos += 4;
              rs = 0;
            }
          }
        } else {
          if ((rgbe[2] << 8) + rgbe[3] != width) return console.warn('HDR line mismatch ..'), this.onerror();
          for (var i = 0; i < 4; i++) {
            var ptr = i * width,
              ptr_end = (i + 1) * width,
              buf,
              count;
            while (ptr < ptr_end) {
              buf = d8.slice(pos, (pos += 2));
              if (buf[0] > 128) {
                count = buf[0] - 128;
                while (count-- > 0) scanline[ptr++] = buf[1];
              } else {
                count = buf[0] - 1;
                scanline[ptr++] = buf[1];
                while (count-- > 0) scanline[ptr++] = d8[pos++];
              }
            }
          }
          for (var i = 0; i < width; i++) {
            img[ipos++] = scanline[i];
            img[ipos++] = scanline[i + width];
            img[ipos++] = scanline[i + 2 * width];
            img[ipos++] = scanline[i + 3 * width];
          }
        }
      }

      resolve({ img, width, height });
      // completion && completion(img, width, height);
    };
    req.open('GET', url, true);
    req.send(null);
    // return req;
  });
}

/** Convert a float buffer to a RGB9_E5 buffer. (ref https://www.khronos.org/registry/OpenGL/extensions/EXT/EXT_texture_shared_exponent.txt)
 * @param {Float32Array} Buffer Floating point input buffer (96 bits/pixel).
 * @param {Uint32Array} [res] Optional output buffer with 32 bit RGB9_E5 per pixel.
 * @returns {Uint32Array} A 32bit uint32 array in RGB9_E5
 */
export function floatToRgb9_e5(buffer: Float32Array, res?: Uint32Array): Uint32Array {
  let r,
    g,
    b,
    v,
    maxColor,
    ExpShared,
    denom,
    s,
    l = (buffer.byteLength / 12) | 0;
  const final = res || new Uint32Array(l);
  for (var i = 0; i < l; i++) {
    r = Math.min(32768.0, buffer[i * 3]);
    g = Math.min(32768.0, buffer[i * 3 + 1]);
    b = Math.min(32768.0, buffer[i * 3 + 2]);
    maxColor = Math.max(Math.max(r, g), b);
    ExpShared = Math.max(-16, Math.floor(Math.log2(maxColor))) + 16;
    denom = Math.pow(2, ExpShared - 24);
    if (Math.floor(maxColor / denom + 0.5) == 511) {
      denom *= 2;
      ExpShared += 1;
    }
    final[i] =
      (Math.floor(r / denom + 0.5) << 23) +
      (Math.floor(g / denom + 0.5) << 14) +
      (Math.floor(b / denom + 0.5) << 5) +
      (ExpShared | 0);
  }
  return final;
}

/** Convert an RGB9_E5 buffer to a Float buffer.
 * @param {Uint32Array} Buffer in RGB9_E5 format. (Uint32 buffer).
 * @param {Float32Array} [res] Optional float output buffer.
 * @returns {Float32Array} A Float32Array.
 */
export function rgb9_e5ToFloat(buffer: Uint8Array, res?: Float32Array): Float32Array {
  var v,
    s,
    l = buffer.byteLength >> 2;
  let final = res || new Float32Array(l * 3);
  for (var i = 0; i < l; i++) {
    v = buffer[i];
    s = Math.pow(2, (v & 31) - 24);
    final[i * 3] = (v >>> 23) * s;
    final[i * 3 + 1] = ((v >>> 14) & 511) * s;
    final[i * 3 + 2] = ((v >>> 5) & 511) * s;
  }
  return final;
}

/** Convert a float buffer to a RGBE buffer.
 * @param {Float32Array} Buffer Floating point input buffer (96 bits/pixel).
 * @param {Uint8Array} [res] Optional output buffer with 32 bit RGBE per pixel.
 * @returns {Uint8Array} A 32bit uint8 array in RGBE
 */
export function floatToRgbe(buffer: Float32Array, res?: Uint8Array): Uint8Array {
  let e,
    r,
    g,
    b,
    v,
    s,
    l = (buffer.byteLength / 12) | 0;
  const final = res || new Uint8Array(l * 4);
  for (var i = 0; i < l; i++) {
    r = buffer[i * 3];
    g = buffer[i * 3 + 1];
    b = buffer[i * 3 + 2];
    v = Math.max(Math.max(r, g), b);
    e = Math.ceil(Math.log2(v));
    s = Math.pow(2, e - 8);
    final[i * 4] = (r / s) | 0;
    final[i * 4 + 1] = (g / s) | 0;
    final[i * 4 + 2] = (b / s) | 0;
    final[i * 4 + 3] = e + 128;
  }
  return final;
}

/** Convert an RGBE buffer to a Float buffer.
 * @param {Uint8Array} buffer The input buffer in RGBE format. (as returned from loadHDR)
 * @param {Float32Array} [res] Optional result buffer containing 3 floats per pixel.
 * @returns {Float32Array} A floating point buffer with 96 bits per pixel (32 per channel, 3 channels).
 */
export function rgbeToFloat(buffer: Uint8Array, res?: Float32Array): Float32Array {
  let s,
    l = buffer.byteLength >> 2;
  const final = res || new Float32Array(l * 3);
  for (var i = 0; i < l; i++) {
    s = Math.pow(2, buffer[i * 4 + 3] - (128 + 8));
    final[i * 3] = buffer[i * 4] * s;
    final[i * 3 + 1] = buffer[i * 4 + 1] * s;
    final[i * 3 + 2] = buffer[i * 4 + 2] * s;
  }
  return final;
}

export function loadHDRToFloatTexture(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  data: Float32Array,
): IGLTexture & { data: Float32Array } {
  //
  const ext = gl.getExtension('EXT_color_buffer_float');
  // console.log('ext',ext);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // only NEAREST supported on FLOAT 32 Texture filtering
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // image stored in RGB FLOAT
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB32F, width, height, 0, gl.RGB, gl.FLOAT, data);

  return {
    texture,
    width,
    height,
    data,
  };
}
