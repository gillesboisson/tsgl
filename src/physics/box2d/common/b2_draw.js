"use strict";
/*
* Copyright (c) 2011 Erin Catto http://box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
exports.__esModule = true;
exports.b2Draw = exports.b2DrawFlags = exports.b2TypedColor = exports.b2Color = void 0;
/// Color for debug drawing. Each value has the range [0,1].
var b2Color = /** @class */ (function () {
    function b2Color(r, g, b, a) {
        if (r === void 0) { r = 0.5; }
        if (g === void 0) { g = 0.5; }
        if (b === void 0) { b = 0.5; }
        if (a === void 0) { a = 1.0; }
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    b2Color.prototype.Clone = function () {
        return new b2Color().Copy(this);
    };
    b2Color.prototype.Copy = function (other) {
        this.r = other.r;
        this.g = other.g;
        this.b = other.b;
        this.a = other.a;
        return this;
    };
    b2Color.prototype.IsEqual = function (color) {
        return (this.r === color.r) && (this.g === color.g) && (this.b === color.b) && (this.a === color.a);
    };
    b2Color.prototype.IsZero = function () {
        return (this.r === 0) && (this.g === 0) && (this.b === 0) && (this.a === 0);
    };
    b2Color.prototype.Set = function (r, g, b, a) {
        if (a === void 0) { a = this.a; }
        this.SetRGBA(r, g, b, a);
    };
    b2Color.prototype.SetByteRGB = function (r, g, b) {
        this.r = r / 0xff;
        this.g = g / 0xff;
        this.b = b / 0xff;
        return this;
    };
    b2Color.prototype.SetByteRGBA = function (r, g, b, a) {
        this.r = r / 0xff;
        this.g = g / 0xff;
        this.b = b / 0xff;
        this.a = a / 0xff;
        return this;
    };
    b2Color.prototype.SetRGB = function (rr, gg, bb) {
        this.r = rr;
        this.g = gg;
        this.b = bb;
        return this;
    };
    b2Color.prototype.SetRGBA = function (rr, gg, bb, aa) {
        this.r = rr;
        this.g = gg;
        this.b = bb;
        this.a = aa;
        return this;
    };
    b2Color.prototype.SelfAdd = function (color) {
        this.r += color.r;
        this.g += color.g;
        this.b += color.b;
        this.a += color.a;
        return this;
    };
    b2Color.prototype.Add = function (color, out) {
        out.r = this.r + color.r;
        out.g = this.g + color.g;
        out.b = this.b + color.b;
        out.a = this.a + color.a;
        return out;
    };
    b2Color.prototype.SelfSub = function (color) {
        this.r -= color.r;
        this.g -= color.g;
        this.b -= color.b;
        this.a -= color.a;
        return this;
    };
    b2Color.prototype.Sub = function (color, out) {
        out.r = this.r - color.r;
        out.g = this.g - color.g;
        out.b = this.b - color.b;
        out.a = this.a - color.a;
        return out;
    };
    b2Color.prototype.SelfMul = function (s) {
        this.r *= s;
        this.g *= s;
        this.b *= s;
        this.a *= s;
        return this;
    };
    b2Color.prototype.Mul = function (s, out) {
        out.r = this.r * s;
        out.g = this.g * s;
        out.b = this.b * s;
        out.a = this.a * s;
        return out;
    };
    b2Color.prototype.Mix = function (mixColor, strength) {
        b2Color.MixColors(this, mixColor, strength);
    };
    b2Color.MixColors = function (colorA, colorB, strength) {
        var dr = (strength * (colorB.r - colorA.r));
        var dg = (strength * (colorB.g - colorA.g));
        var db = (strength * (colorB.b - colorA.b));
        var da = (strength * (colorB.a - colorA.a));
        colorA.r += dr;
        colorA.g += dg;
        colorA.b += db;
        colorA.a += da;
        colorB.r -= dr;
        colorB.g -= dg;
        colorB.b -= db;
        colorB.a -= da;
    };
    b2Color.prototype.MakeStyleString = function (alpha) {
        if (alpha === void 0) { alpha = this.a; }
        return b2Color.MakeStyleString(this.r, this.g, this.b, alpha);
    };
    b2Color.MakeStyleString = function (r, g, b, a) {
        if (a === void 0) { a = 1.0; }
        // function clamp(x: number, lo: number, hi: number) { return x < lo ? lo : hi < x ? hi : x; }
        r *= 255; // r = clamp(r, 0, 255);
        g *= 255; // g = clamp(g, 0, 255);
        b *= 255; // b = clamp(b, 0, 255);
        // a = clamp(a, 0, 1);
        if (a < 1) {
            return "rgba(" + r + "," + g + "," + b + "," + a + ")";
        }
        else {
            return "rgb(" + r + "," + g + "," + b + ")";
        }
    };
    b2Color.ZERO = new b2Color(0, 0, 0, 0);
    b2Color.RED = new b2Color(1, 0, 0);
    b2Color.GREEN = new b2Color(0, 1, 0);
    b2Color.BLUE = new b2Color(0, 0, 1);
    return b2Color;
}());
exports.b2Color = b2Color;
var b2TypedColor = /** @class */ (function () {
    function b2TypedColor() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args[0] instanceof Float32Array) {
            if (args[0].length !== 4) {
                throw new Error();
            }
            this.data = args[0];
        }
        else {
            var rr = typeof args[0] === "number" ? args[0] : 0.5;
            var gg = typeof args[1] === "number" ? args[1] : 0.5;
            var bb = typeof args[2] === "number" ? args[2] : 0.5;
            var aa = typeof args[3] === "number" ? args[3] : 1.0;
            this.data = new Float32Array([rr, gg, bb, aa]);
        }
    }
    Object.defineProperty(b2TypedColor.prototype, "r", {
        get: function () { return this.data[0]; },
        set: function (value) { this.data[0] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(b2TypedColor.prototype, "g", {
        get: function () { return this.data[1]; },
        set: function (value) { this.data[1] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(b2TypedColor.prototype, "b", {
        get: function () { return this.data[2]; },
        set: function (value) { this.data[2] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(b2TypedColor.prototype, "a", {
        get: function () { return this.data[3]; },
        set: function (value) { this.data[3] = value; },
        enumerable: false,
        configurable: true
    });
    b2TypedColor.prototype.Clone = function () {
        return new b2TypedColor(new Float32Array(this.data));
    };
    b2TypedColor.prototype.Copy = function (other) {
        if (other instanceof b2TypedColor) {
            this.data.set(other.data);
        }
        else {
            this.r = other.r;
            this.g = other.g;
            this.b = other.b;
            this.a = other.a;
        }
        return this;
    };
    b2TypedColor.prototype.IsEqual = function (color) {
        return (this.r === color.r) && (this.g === color.g) && (this.b === color.b) && (this.a === color.a);
    };
    b2TypedColor.prototype.IsZero = function () {
        return (this.r === 0) && (this.g === 0) && (this.b === 0) && (this.a === 0);
    };
    b2TypedColor.prototype.Set = function (r, g, b, a) {
        if (a === void 0) { a = this.a; }
        this.SetRGBA(r, g, b, a);
    };
    b2TypedColor.prototype.SetByteRGB = function (r, g, b) {
        this.r = r / 0xff;
        this.g = g / 0xff;
        this.b = b / 0xff;
        return this;
    };
    b2TypedColor.prototype.SetByteRGBA = function (r, g, b, a) {
        this.r = r / 0xff;
        this.g = g / 0xff;
        this.b = b / 0xff;
        this.a = a / 0xff;
        return this;
    };
    b2TypedColor.prototype.SetRGB = function (rr, gg, bb) {
        this.r = rr;
        this.g = gg;
        this.b = bb;
        return this;
    };
    b2TypedColor.prototype.SetRGBA = function (rr, gg, bb, aa) {
        this.r = rr;
        this.g = gg;
        this.b = bb;
        this.a = aa;
        return this;
    };
    b2TypedColor.prototype.SelfAdd = function (color) {
        this.r += color.r;
        this.g += color.g;
        this.b += color.b;
        this.a += color.a;
        return this;
    };
    b2TypedColor.prototype.Add = function (color, out) {
        out.r = this.r + color.r;
        out.g = this.g + color.g;
        out.b = this.b + color.b;
        out.a = this.a + color.a;
        return out;
    };
    b2TypedColor.prototype.SelfSub = function (color) {
        this.r -= color.r;
        this.g -= color.g;
        this.b -= color.b;
        this.a -= color.a;
        return this;
    };
    b2TypedColor.prototype.Sub = function (color, out) {
        out.r = this.r - color.r;
        out.g = this.g - color.g;
        out.b = this.b - color.b;
        out.a = this.a - color.a;
        return out;
    };
    b2TypedColor.prototype.SelfMul = function (s) {
        this.r *= s;
        this.g *= s;
        this.b *= s;
        this.a *= s;
        return this;
    };
    b2TypedColor.prototype.Mul = function (s, out) {
        out.r = this.r * s;
        out.g = this.g * s;
        out.b = this.b * s;
        out.a = this.a * s;
        return out;
    };
    b2TypedColor.prototype.Mix = function (mixColor, strength) {
        b2Color.MixColors(this, mixColor, strength);
    };
    b2TypedColor.prototype.MakeStyleString = function (alpha) {
        if (alpha === void 0) { alpha = this.a; }
        return b2Color.MakeStyleString(this.r, this.g, this.b, alpha);
    };
    return b2TypedColor;
}());
exports.b2TypedColor = b2TypedColor;
var b2DrawFlags;
(function (b2DrawFlags) {
    b2DrawFlags[b2DrawFlags["e_none"] = 0] = "e_none";
    b2DrawFlags[b2DrawFlags["e_shapeBit"] = 1] = "e_shapeBit";
    b2DrawFlags[b2DrawFlags["e_jointBit"] = 2] = "e_jointBit";
    b2DrawFlags[b2DrawFlags["e_aabbBit"] = 4] = "e_aabbBit";
    b2DrawFlags[b2DrawFlags["e_pairBit"] = 8] = "e_pairBit";
    b2DrawFlags[b2DrawFlags["e_centerOfMassBit"] = 16] = "e_centerOfMassBit";
    // #if B2_ENABLE_PARTICLE
    b2DrawFlags[b2DrawFlags["e_particleBit"] = 32] = "e_particleBit";
    // #endif
    // #if B2_ENABLE_CONTROLLER
    b2DrawFlags[b2DrawFlags["e_controllerBit"] = 64] = "e_controllerBit";
    // #endif
    b2DrawFlags[b2DrawFlags["e_all"] = 63] = "e_all";
})(b2DrawFlags = exports.b2DrawFlags || (exports.b2DrawFlags = {}));
/// Implement and register this class with a b2World to provide debug drawing of physics
/// entities in your game.
var b2Draw = /** @class */ (function () {
    function b2Draw() {
        this.m_drawFlags = 0;
    }
    b2Draw.prototype.SetFlags = function (flags) {
        this.m_drawFlags = flags;
    };
    b2Draw.prototype.GetFlags = function () {
        return this.m_drawFlags;
    };
    b2Draw.prototype.AppendFlags = function (flags) {
        this.m_drawFlags |= flags;
    };
    b2Draw.prototype.ClearFlags = function (flags) {
        this.m_drawFlags &= ~flags;
    };
    return b2Draw;
}());
exports.b2Draw = b2Draw;
