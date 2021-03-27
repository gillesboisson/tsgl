"use strict";
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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
exports.b2Sweep = exports.b2Transform = exports.b2Rot = exports.b2Mat33 = exports.b2Mat22 = exports.b2Vec3 = exports.b2TypedVec2 = exports.b2Vec2_zero = exports.b2Vec2 = exports.b2RandomRange = exports.b2Random = exports.b2IsPowerOfTwo = exports.b2NextPowerOfTwo = exports.b2Atan2 = exports.b2Asin = exports.b2Acos = exports.b2Sin = exports.b2Cos = exports.b2RadToDeg = exports.b2DegToRad = exports.b2Pow = exports.b2Sqrt = exports.b2InvSqrt = exports.b2Sq = exports.b2IsValid = exports.b2Swap = exports.b2Clamp = exports.b2Max = exports.b2Min = exports.b2Abs = exports.b2_two_pi = exports.b2_180_over_pi = exports.b2_pi_over_180 = void 0;
// DEBUG: import { b2Assert } from "./b2_settings";
var b2_settings_js_1 = require("./b2_settings.js");
exports.b2_pi_over_180 = b2_settings_js_1.b2_pi / 180;
exports.b2_180_over_pi = 180 / b2_settings_js_1.b2_pi;
exports.b2_two_pi = 2 * b2_settings_js_1.b2_pi;
exports.b2Abs = Math.abs;
function b2Min(a, b) { return a < b ? a : b; }
exports.b2Min = b2Min;
function b2Max(a, b) { return a > b ? a : b; }
exports.b2Max = b2Max;
function b2Clamp(a, lo, hi) {
    return (a < lo) ? (lo) : ((a > hi) ? (hi) : (a));
}
exports.b2Clamp = b2Clamp;
function b2Swap(a, b) {
    // DEBUG: b2Assert(false);
    var tmp = a[0];
    a[0] = b[0];
    b[0] = tmp;
}
exports.b2Swap = b2Swap;
/// This function is used to ensure that a floating point number is
/// not a NaN or infinity.
exports.b2IsValid = isFinite;
function b2Sq(n) {
    return n * n;
}
exports.b2Sq = b2Sq;
/// This is a approximate yet fast inverse square-root.
function b2InvSqrt(n) {
    return 1 / Math.sqrt(n);
}
exports.b2InvSqrt = b2InvSqrt;
exports.b2Sqrt = Math.sqrt;
exports.b2Pow = Math.pow;
function b2DegToRad(degrees) {
    return degrees * exports.b2_pi_over_180;
}
exports.b2DegToRad = b2DegToRad;
function b2RadToDeg(radians) {
    return radians * exports.b2_180_over_pi;
}
exports.b2RadToDeg = b2RadToDeg;
exports.b2Cos = Math.cos;
exports.b2Sin = Math.sin;
exports.b2Acos = Math.acos;
exports.b2Asin = Math.asin;
exports.b2Atan2 = Math.atan2;
function b2NextPowerOfTwo(x) {
    x |= (x >> 1) & 0x7FFFFFFF;
    x |= (x >> 2) & 0x3FFFFFFF;
    x |= (x >> 4) & 0x0FFFFFFF;
    x |= (x >> 8) & 0x00FFFFFF;
    x |= (x >> 16) & 0x0000FFFF;
    return x + 1;
}
exports.b2NextPowerOfTwo = b2NextPowerOfTwo;
function b2IsPowerOfTwo(x) {
    return x > 0 && (x & (x - 1)) === 0;
}
exports.b2IsPowerOfTwo = b2IsPowerOfTwo;
function b2Random() {
    return Math.random() * 2 - 1;
}
exports.b2Random = b2Random;
function b2RandomRange(lo, hi) {
    return (hi - lo) * Math.random() + lo;
}
exports.b2RandomRange = b2RandomRange;
/// A 2D column vector.
var b2Vec2 = /** @class */ (function () {
    function b2Vec2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    b2Vec2.prototype.Clone = function () {
        return new b2Vec2(this.x, this.y);
    };
    b2Vec2.prototype.SetZero = function () {
        this.x = 0;
        this.y = 0;
        return this;
    };
    b2Vec2.prototype.Set = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    b2Vec2.prototype.Copy = function (other) {
        this.x = other.x;
        this.y = other.y;
        return this;
    };
    b2Vec2.prototype.SelfAdd = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    b2Vec2.prototype.SelfAddXY = function (x, y) {
        this.x += x;
        this.y += y;
        return this;
    };
    b2Vec2.prototype.SelfSub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    b2Vec2.prototype.SelfSubXY = function (x, y) {
        this.x -= x;
        this.y -= y;
        return this;
    };
    b2Vec2.prototype.SelfMul = function (s) {
        this.x *= s;
        this.y *= s;
        return this;
    };
    b2Vec2.prototype.SelfMulAdd = function (s, v) {
        this.x += s * v.x;
        this.y += s * v.y;
        return this;
    };
    b2Vec2.prototype.SelfMulSub = function (s, v) {
        this.x -= s * v.x;
        this.y -= s * v.y;
        return this;
    };
    b2Vec2.prototype.Dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    b2Vec2.prototype.Cross = function (v) {
        return this.x * v.y - this.y * v.x;
    };
    b2Vec2.prototype.Length = function () {
        var x = this.x, y = this.y;
        return Math.sqrt(x * x + y * y);
    };
    b2Vec2.prototype.LengthSquared = function () {
        var x = this.x, y = this.y;
        return (x * x + y * y);
    };
    b2Vec2.prototype.Normalize = function () {
        var length = this.Length();
        if (length >= b2_settings_js_1.b2_epsilon) {
            var inv_length = 1 / length;
            this.x *= inv_length;
            this.y *= inv_length;
        }
        return length;
    };
    b2Vec2.prototype.SelfNormalize = function () {
        var length = this.Length();
        if (length >= b2_settings_js_1.b2_epsilon) {
            var inv_length = 1 / length;
            this.x *= inv_length;
            this.y *= inv_length;
        }
        return this;
    };
    b2Vec2.prototype.SelfRotate = function (radians) {
        var c = Math.cos(radians);
        var s = Math.sin(radians);
        var x = this.x;
        this.x = c * x - s * this.y;
        this.y = s * x + c * this.y;
        return this;
    };
    b2Vec2.prototype.SelfRotateCosSin = function (c, s) {
        var x = this.x;
        this.x = c * x - s * this.y;
        this.y = s * x + c * this.y;
        return this;
    };
    b2Vec2.prototype.IsValid = function () {
        return isFinite(this.x) && isFinite(this.y);
    };
    b2Vec2.prototype.SelfCrossVS = function (s) {
        var x = this.x;
        this.x = s * this.y;
        this.y = -s * x;
        return this;
    };
    b2Vec2.prototype.SelfCrossSV = function (s) {
        var x = this.x;
        this.x = -s * this.y;
        this.y = s * x;
        return this;
    };
    b2Vec2.prototype.SelfMinV = function (v) {
        this.x = b2Min(this.x, v.x);
        this.y = b2Min(this.y, v.y);
        return this;
    };
    b2Vec2.prototype.SelfMaxV = function (v) {
        this.x = b2Max(this.x, v.x);
        this.y = b2Max(this.y, v.y);
        return this;
    };
    b2Vec2.prototype.SelfAbs = function () {
        this.x = exports.b2Abs(this.x);
        this.y = exports.b2Abs(this.y);
        return this;
    };
    b2Vec2.prototype.SelfNeg = function () {
        this.x = (-this.x);
        this.y = (-this.y);
        return this;
    };
    b2Vec2.prototype.SelfSkew = function () {
        var x = this.x;
        this.x = -this.y;
        this.y = x;
        return this;
    };
    b2Vec2.MakeArray = function (length) {
        return b2_settings_js_1.b2MakeArray(length, function (i) { return new b2Vec2(); });
    };
    b2Vec2.AbsV = function (v, out) {
        out.x = exports.b2Abs(v.x);
        out.y = exports.b2Abs(v.y);
        return out;
    };
    b2Vec2.MinV = function (a, b, out) {
        out.x = b2Min(a.x, b.x);
        out.y = b2Min(a.y, b.y);
        return out;
    };
    b2Vec2.MaxV = function (a, b, out) {
        out.x = b2Max(a.x, b.x);
        out.y = b2Max(a.y, b.y);
        return out;
    };
    b2Vec2.ClampV = function (v, lo, hi, out) {
        out.x = b2Clamp(v.x, lo.x, hi.x);
        out.y = b2Clamp(v.y, lo.y, hi.y);
        return out;
    };
    b2Vec2.RotateV = function (v, radians, out) {
        var v_x = v.x, v_y = v.y;
        var c = Math.cos(radians);
        var s = Math.sin(radians);
        out.x = c * v_x - s * v_y;
        out.y = s * v_x + c * v_y;
        return out;
    };
    b2Vec2.DotVV = function (a, b) {
        return a.x * b.x + a.y * b.y;
    };
    b2Vec2.CrossVV = function (a, b) {
        return a.x * b.y - a.y * b.x;
    };
    b2Vec2.CrossVS = function (v, s, out) {
        var v_x = v.x;
        out.x = s * v.y;
        out.y = -s * v_x;
        return out;
    };
    b2Vec2.CrossVOne = function (v, out) {
        var v_x = v.x;
        out.x = v.y;
        out.y = -v_x;
        return out;
    };
    b2Vec2.CrossSV = function (s, v, out) {
        var v_x = v.x;
        out.x = -s * v.y;
        out.y = s * v_x;
        return out;
    };
    b2Vec2.CrossOneV = function (v, out) {
        var v_x = v.x;
        out.x = -v.y;
        out.y = v_x;
        return out;
    };
    b2Vec2.AddVV = function (a, b, out) { out.x = a.x + b.x; out.y = a.y + b.y; return out; };
    b2Vec2.SubVV = function (a, b, out) { out.x = a.x - b.x; out.y = a.y - b.y; return out; };
    b2Vec2.MulSV = function (s, v, out) { out.x = v.x * s; out.y = v.y * s; return out; };
    b2Vec2.MulVS = function (v, s, out) { out.x = v.x * s; out.y = v.y * s; return out; };
    b2Vec2.AddVMulSV = function (a, s, b, out) { out.x = a.x + (s * b.x); out.y = a.y + (s * b.y); return out; };
    b2Vec2.SubVMulSV = function (a, s, b, out) { out.x = a.x - (s * b.x); out.y = a.y - (s * b.y); return out; };
    b2Vec2.AddVCrossSV = function (a, s, v, out) {
        var v_x = v.x;
        out.x = a.x - (s * v.y);
        out.y = a.y + (s * v_x);
        return out;
    };
    b2Vec2.MidVV = function (a, b, out) { out.x = (a.x + b.x) * 0.5; out.y = (a.y + b.y) * 0.5; return out; };
    b2Vec2.ExtVV = function (a, b, out) { out.x = (b.x - a.x) * 0.5; out.y = (b.y - a.y) * 0.5; return out; };
    b2Vec2.IsEqualToV = function (a, b) {
        return a.x === b.x && a.y === b.y;
    };
    b2Vec2.DistanceVV = function (a, b) {
        var c_x = a.x - b.x;
        var c_y = a.y - b.y;
        return Math.sqrt(c_x * c_x + c_y * c_y);
    };
    b2Vec2.DistanceSquaredVV = function (a, b) {
        var c_x = a.x - b.x;
        var c_y = a.y - b.y;
        return (c_x * c_x + c_y * c_y);
    };
    b2Vec2.NegV = function (v, out) { out.x = -v.x; out.y = -v.y; return out; };
    b2Vec2.ZERO = new b2Vec2(0, 0);
    b2Vec2.UNITX = new b2Vec2(1, 0);
    b2Vec2.UNITY = new b2Vec2(0, 1);
    b2Vec2.s_t0 = new b2Vec2();
    b2Vec2.s_t1 = new b2Vec2();
    b2Vec2.s_t2 = new b2Vec2();
    b2Vec2.s_t3 = new b2Vec2();
    return b2Vec2;
}());
exports.b2Vec2 = b2Vec2;
exports.b2Vec2_zero = new b2Vec2(0, 0);
var b2TypedVec2 = /** @class */ (function () {
    function b2TypedVec2() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args[0] instanceof Float32Array) {
            if (args[0].length !== 2) {
                throw new Error();
            }
            this.data = args[0];
        }
        else {
            var x = typeof args[0] === "number" ? args[0] : 0;
            var y = typeof args[1] === "number" ? args[1] : 0;
            this.data = new Float32Array([x, y]);
        }
    }
    Object.defineProperty(b2TypedVec2.prototype, "x", {
        get: function () { return this.data[0]; },
        set: function (value) { this.data[0] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(b2TypedVec2.prototype, "y", {
        get: function () { return this.data[1]; },
        set: function (value) { this.data[1] = value; },
        enumerable: false,
        configurable: true
    });
    b2TypedVec2.prototype.Clone = function () {
        return new b2TypedVec2(new Float32Array(this.data));
    };
    b2TypedVec2.prototype.SetZero = function () {
        this.x = 0;
        this.y = 0;
        return this;
    };
    b2TypedVec2.prototype.Set = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    b2TypedVec2.prototype.Copy = function (other) {
        if (other instanceof b2TypedVec2) {
            this.data.set(other.data);
        }
        else {
            this.x = other.x;
            this.y = other.y;
        }
        return this;
    };
    b2TypedVec2.prototype.SelfAdd = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    b2TypedVec2.prototype.SelfAddXY = function (x, y) {
        this.x += x;
        this.y += y;
        return this;
    };
    b2TypedVec2.prototype.SelfSub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    b2TypedVec2.prototype.SelfSubXY = function (x, y) {
        this.x -= x;
        this.y -= y;
        return this;
    };
    b2TypedVec2.prototype.SelfMul = function (s) {
        this.x *= s;
        this.y *= s;
        return this;
    };
    b2TypedVec2.prototype.SelfMulAdd = function (s, v) {
        this.x += s * v.x;
        this.y += s * v.y;
        return this;
    };
    b2TypedVec2.prototype.SelfMulSub = function (s, v) {
        this.x -= s * v.x;
        this.y -= s * v.y;
        return this;
    };
    b2TypedVec2.prototype.Dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    b2TypedVec2.prototype.Cross = function (v) {
        return this.x * v.y - this.y * v.x;
    };
    b2TypedVec2.prototype.Length = function () {
        var x = this.x, y = this.y;
        return Math.sqrt(x * x + y * y);
    };
    b2TypedVec2.prototype.LengthSquared = function () {
        var x = this.x, y = this.y;
        return (x * x + y * y);
    };
    b2TypedVec2.prototype.Normalize = function () {
        var length = this.Length();
        if (length >= b2_settings_js_1.b2_epsilon) {
            var inv_length = 1 / length;
            this.x *= inv_length;
            this.y *= inv_length;
        }
        return length;
    };
    b2TypedVec2.prototype.SelfNormalize = function () {
        var length = this.Length();
        if (length >= b2_settings_js_1.b2_epsilon) {
            var inv_length = 1 / length;
            this.x *= inv_length;
            this.y *= inv_length;
        }
        return this;
    };
    b2TypedVec2.prototype.SelfRotate = function (radians) {
        var c = Math.cos(radians);
        var s = Math.sin(radians);
        var x = this.x;
        this.x = c * x - s * this.y;
        this.y = s * x + c * this.y;
        return this;
    };
    b2TypedVec2.prototype.SelfRotateCosSin = function (c, s) {
        var x = this.x;
        this.x = c * x - s * this.y;
        this.y = s * x + c * this.y;
        return this;
    };
    b2TypedVec2.prototype.IsValid = function () {
        return isFinite(this.x) && isFinite(this.y);
    };
    b2TypedVec2.prototype.SelfCrossVS = function (s) {
        var x = this.x;
        this.x = s * this.y;
        this.y = -s * x;
        return this;
    };
    b2TypedVec2.prototype.SelfCrossSV = function (s) {
        var x = this.x;
        this.x = -s * this.y;
        this.y = s * x;
        return this;
    };
    b2TypedVec2.prototype.SelfMinV = function (v) {
        this.x = b2Min(this.x, v.x);
        this.y = b2Min(this.y, v.y);
        return this;
    };
    b2TypedVec2.prototype.SelfMaxV = function (v) {
        this.x = b2Max(this.x, v.x);
        this.y = b2Max(this.y, v.y);
        return this;
    };
    b2TypedVec2.prototype.SelfAbs = function () {
        this.x = exports.b2Abs(this.x);
        this.y = exports.b2Abs(this.y);
        return this;
    };
    b2TypedVec2.prototype.SelfNeg = function () {
        this.x = (-this.x);
        this.y = (-this.y);
        return this;
    };
    b2TypedVec2.prototype.SelfSkew = function () {
        var x = this.x;
        this.x = -this.y;
        this.y = x;
        return this;
    };
    return b2TypedVec2;
}());
exports.b2TypedVec2 = b2TypedVec2;
/// A 2D column vector with 3 elements.
var b2Vec3 = /** @class */ (function () {
    function b2Vec3() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args[0] instanceof Float32Array) {
            if (args[0].length !== 3) {
                throw new Error();
            }
            this.data = args[0];
        }
        else {
            var x = typeof args[0] === "number" ? args[0] : 0;
            var y = typeof args[1] === "number" ? args[1] : 0;
            var z = typeof args[2] === "number" ? args[2] : 0;
            this.data = new Float32Array([x, y, z]);
        }
    }
    Object.defineProperty(b2Vec3.prototype, "x", {
        get: function () { return this.data[0]; },
        set: function (value) { this.data[0] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(b2Vec3.prototype, "y", {
        get: function () { return this.data[1]; },
        set: function (value) { this.data[1] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(b2Vec3.prototype, "z", {
        get: function () { return this.data[2]; },
        set: function (value) { this.data[2] = value; },
        enumerable: false,
        configurable: true
    });
    b2Vec3.prototype.Clone = function () {
        return new b2Vec3(this.x, this.y, this.z);
    };
    b2Vec3.prototype.SetZero = function () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    };
    b2Vec3.prototype.SetXYZ = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    };
    b2Vec3.prototype.Copy = function (other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    };
    b2Vec3.prototype.SelfNeg = function () {
        this.x = (-this.x);
        this.y = (-this.y);
        this.z = (-this.z);
        return this;
    };
    b2Vec3.prototype.SelfAdd = function (v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    };
    b2Vec3.prototype.SelfAddXYZ = function (x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    };
    b2Vec3.prototype.SelfSub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    };
    b2Vec3.prototype.SelfSubXYZ = function (x, y, z) {
        this.x -= x;
        this.y -= y;
        this.z -= z;
        return this;
    };
    b2Vec3.prototype.SelfMul = function (s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    };
    b2Vec3.DotV3V3 = function (a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    };
    b2Vec3.CrossV3V3 = function (a, b, out) {
        var a_x = a.x, a_y = a.y, a_z = a.z;
        var b_x = b.x, b_y = b.y, b_z = b.z;
        out.x = a_y * b_z - a_z * b_y;
        out.y = a_z * b_x - a_x * b_z;
        out.z = a_x * b_y - a_y * b_x;
        return out;
    };
    b2Vec3.ZERO = new b2Vec3(0, 0, 0);
    b2Vec3.s_t0 = new b2Vec3();
    return b2Vec3;
}());
exports.b2Vec3 = b2Vec3;
/// A 2-by-2 matrix. Stored in column-major order.
var b2Mat22 = /** @class */ (function () {
    function b2Mat22() {
        // public readonly data: Float32Array = new Float32Array([ 1, 0, 0, 1 ]);
        // public readonly ex: b2Vec2 = new b2Vec2(this.data.subarray(0, 2));
        // public readonly ey: b2Vec2 = new b2Vec2(this.data.subarray(2, 4));
        this.ex = new b2Vec2(1, 0);
        this.ey = new b2Vec2(0, 1);
    }
    b2Mat22.prototype.Clone = function () {
        return new b2Mat22().Copy(this);
    };
    b2Mat22.FromVV = function (c1, c2) {
        return new b2Mat22().SetVV(c1, c2);
    };
    b2Mat22.FromSSSS = function (r1c1, r1c2, r2c1, r2c2) {
        return new b2Mat22().SetSSSS(r1c1, r1c2, r2c1, r2c2);
    };
    b2Mat22.FromAngle = function (radians) {
        return new b2Mat22().SetAngle(radians);
    };
    b2Mat22.prototype.SetSSSS = function (r1c1, r1c2, r2c1, r2c2) {
        this.ex.Set(r1c1, r2c1);
        this.ey.Set(r1c2, r2c2);
        return this;
    };
    b2Mat22.prototype.SetVV = function (c1, c2) {
        this.ex.Copy(c1);
        this.ey.Copy(c2);
        return this;
    };
    b2Mat22.prototype.SetAngle = function (radians) {
        var c = Math.cos(radians);
        var s = Math.sin(radians);
        this.ex.Set(c, s);
        this.ey.Set(-s, c);
        return this;
    };
    b2Mat22.prototype.Copy = function (other) {
        this.ex.Copy(other.ex);
        this.ey.Copy(other.ey);
        return this;
    };
    b2Mat22.prototype.SetIdentity = function () {
        this.ex.Set(1, 0);
        this.ey.Set(0, 1);
        return this;
    };
    b2Mat22.prototype.SetZero = function () {
        this.ex.SetZero();
        this.ey.SetZero();
        return this;
    };
    b2Mat22.prototype.GetAngle = function () {
        return Math.atan2(this.ex.y, this.ex.x);
    };
    b2Mat22.prototype.GetInverse = function (out) {
        var a = this.ex.x;
        var b = this.ey.x;
        var c = this.ex.y;
        var d = this.ey.y;
        var det = a * d - b * c;
        if (det !== 0) {
            det = 1 / det;
        }
        out.ex.x = det * d;
        out.ey.x = (-det * b);
        out.ex.y = (-det * c);
        out.ey.y = det * a;
        return out;
    };
    b2Mat22.prototype.Solve = function (b_x, b_y, out) {
        var a11 = this.ex.x, a12 = this.ey.x;
        var a21 = this.ex.y, a22 = this.ey.y;
        var det = a11 * a22 - a12 * a21;
        if (det !== 0) {
            det = 1 / det;
        }
        out.x = det * (a22 * b_x - a12 * b_y);
        out.y = det * (a11 * b_y - a21 * b_x);
        return out;
    };
    b2Mat22.prototype.SelfAbs = function () {
        this.ex.SelfAbs();
        this.ey.SelfAbs();
        return this;
    };
    b2Mat22.prototype.SelfInv = function () {
        this.GetInverse(this);
        return this;
    };
    b2Mat22.prototype.SelfAddM = function (M) {
        this.ex.SelfAdd(M.ex);
        this.ey.SelfAdd(M.ey);
        return this;
    };
    b2Mat22.prototype.SelfSubM = function (M) {
        this.ex.SelfSub(M.ex);
        this.ey.SelfSub(M.ey);
        return this;
    };
    b2Mat22.AbsM = function (M, out) {
        var M_ex = M.ex, M_ey = M.ey;
        out.ex.x = exports.b2Abs(M_ex.x);
        out.ex.y = exports.b2Abs(M_ex.y);
        out.ey.x = exports.b2Abs(M_ey.x);
        out.ey.y = exports.b2Abs(M_ey.y);
        return out;
    };
    b2Mat22.MulMV = function (M, v, out) {
        var M_ex = M.ex, M_ey = M.ey;
        var v_x = v.x, v_y = v.y;
        out.x = M_ex.x * v_x + M_ey.x * v_y;
        out.y = M_ex.y * v_x + M_ey.y * v_y;
        return out;
    };
    b2Mat22.MulTMV = function (M, v, out) {
        var M_ex = M.ex, M_ey = M.ey;
        var v_x = v.x, v_y = v.y;
        out.x = M_ex.x * v_x + M_ex.y * v_y;
        out.y = M_ey.x * v_x + M_ey.y * v_y;
        return out;
    };
    b2Mat22.AddMM = function (A, B, out) {
        var A_ex = A.ex, A_ey = A.ey;
        var B_ex = B.ex, B_ey = B.ey;
        out.ex.x = A_ex.x + B_ex.x;
        out.ex.y = A_ex.y + B_ex.y;
        out.ey.x = A_ey.x + B_ey.x;
        out.ey.y = A_ey.y + B_ey.y;
        return out;
    };
    b2Mat22.MulMM = function (A, B, out) {
        var A_ex_x = A.ex.x, A_ex_y = A.ex.y;
        var A_ey_x = A.ey.x, A_ey_y = A.ey.y;
        var B_ex_x = B.ex.x, B_ex_y = B.ex.y;
        var B_ey_x = B.ey.x, B_ey_y = B.ey.y;
        out.ex.x = A_ex_x * B_ex_x + A_ey_x * B_ex_y;
        out.ex.y = A_ex_y * B_ex_x + A_ey_y * B_ex_y;
        out.ey.x = A_ex_x * B_ey_x + A_ey_x * B_ey_y;
        out.ey.y = A_ex_y * B_ey_x + A_ey_y * B_ey_y;
        return out;
    };
    b2Mat22.MulTMM = function (A, B, out) {
        var A_ex_x = A.ex.x, A_ex_y = A.ex.y;
        var A_ey_x = A.ey.x, A_ey_y = A.ey.y;
        var B_ex_x = B.ex.x, B_ex_y = B.ex.y;
        var B_ey_x = B.ey.x, B_ey_y = B.ey.y;
        out.ex.x = A_ex_x * B_ex_x + A_ex_y * B_ex_y;
        out.ex.y = A_ey_x * B_ex_x + A_ey_y * B_ex_y;
        out.ey.x = A_ex_x * B_ey_x + A_ex_y * B_ey_y;
        out.ey.y = A_ey_x * B_ey_x + A_ey_y * B_ey_y;
        return out;
    };
    b2Mat22.IDENTITY = new b2Mat22();
    return b2Mat22;
}());
exports.b2Mat22 = b2Mat22;
/// A 3-by-3 matrix. Stored in column-major order.
var b2Mat33 = /** @class */ (function () {
    function b2Mat33() {
        this.data = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        this.ex = new b2Vec3(this.data.subarray(0, 3));
        this.ey = new b2Vec3(this.data.subarray(3, 6));
        this.ez = new b2Vec3(this.data.subarray(6, 9));
    }
    b2Mat33.prototype.Clone = function () {
        return new b2Mat33().Copy(this);
    };
    b2Mat33.prototype.SetVVV = function (c1, c2, c3) {
        this.ex.Copy(c1);
        this.ey.Copy(c2);
        this.ez.Copy(c3);
        return this;
    };
    b2Mat33.prototype.Copy = function (other) {
        this.ex.Copy(other.ex);
        this.ey.Copy(other.ey);
        this.ez.Copy(other.ez);
        return this;
    };
    b2Mat33.prototype.SetIdentity = function () {
        this.ex.SetXYZ(1, 0, 0);
        this.ey.SetXYZ(0, 1, 0);
        this.ez.SetXYZ(0, 0, 1);
        return this;
    };
    b2Mat33.prototype.SetZero = function () {
        this.ex.SetZero();
        this.ey.SetZero();
        this.ez.SetZero();
        return this;
    };
    b2Mat33.prototype.SelfAddM = function (M) {
        this.ex.SelfAdd(M.ex);
        this.ey.SelfAdd(M.ey);
        this.ez.SelfAdd(M.ez);
        return this;
    };
    b2Mat33.prototype.Solve33 = function (b_x, b_y, b_z, out) {
        var a11 = this.ex.x, a21 = this.ex.y, a31 = this.ex.z;
        var a12 = this.ey.x, a22 = this.ey.y, a32 = this.ey.z;
        var a13 = this.ez.x, a23 = this.ez.y, a33 = this.ez.z;
        var det = a11 * (a22 * a33 - a32 * a23) + a21 * (a32 * a13 - a12 * a33) + a31 * (a12 * a23 - a22 * a13);
        if (det !== 0) {
            det = 1 / det;
        }
        out.x = det * (b_x * (a22 * a33 - a32 * a23) + b_y * (a32 * a13 - a12 * a33) + b_z * (a12 * a23 - a22 * a13));
        out.y = det * (a11 * (b_y * a33 - b_z * a23) + a21 * (b_z * a13 - b_x * a33) + a31 * (b_x * a23 - b_y * a13));
        out.z = det * (a11 * (a22 * b_z - a32 * b_y) + a21 * (a32 * b_x - a12 * b_z) + a31 * (a12 * b_y - a22 * b_x));
        return out;
    };
    b2Mat33.prototype.Solve22 = function (b_x, b_y, out) {
        var a11 = this.ex.x, a12 = this.ey.x;
        var a21 = this.ex.y, a22 = this.ey.y;
        var det = a11 * a22 - a12 * a21;
        if (det !== 0) {
            det = 1 / det;
        }
        out.x = det * (a22 * b_x - a12 * b_y);
        out.y = det * (a11 * b_y - a21 * b_x);
        return out;
    };
    b2Mat33.prototype.GetInverse22 = function (M) {
        var a = this.ex.x, b = this.ey.x, c = this.ex.y, d = this.ey.y;
        var det = a * d - b * c;
        if (det !== 0) {
            det = 1 / det;
        }
        M.ex.x = det * d;
        M.ey.x = -det * b;
        M.ex.z = 0;
        M.ex.y = -det * c;
        M.ey.y = det * a;
        M.ey.z = 0;
        M.ez.x = 0;
        M.ez.y = 0;
        M.ez.z = 0;
    };
    b2Mat33.prototype.GetSymInverse33 = function (M) {
        var det = b2Vec3.DotV3V3(this.ex, b2Vec3.CrossV3V3(this.ey, this.ez, b2Vec3.s_t0));
        if (det !== 0) {
            det = 1 / det;
        }
        var a11 = this.ex.x, a12 = this.ey.x, a13 = this.ez.x;
        var a22 = this.ey.y, a23 = this.ez.y;
        var a33 = this.ez.z;
        M.ex.x = det * (a22 * a33 - a23 * a23);
        M.ex.y = det * (a13 * a23 - a12 * a33);
        M.ex.z = det * (a12 * a23 - a13 * a22);
        M.ey.x = M.ex.y;
        M.ey.y = det * (a11 * a33 - a13 * a13);
        M.ey.z = det * (a13 * a12 - a11 * a23);
        M.ez.x = M.ex.z;
        M.ez.y = M.ey.z;
        M.ez.z = det * (a11 * a22 - a12 * a12);
    };
    b2Mat33.MulM33V3 = function (A, v, out) {
        var v_x = v.x, v_y = v.y, v_z = v.z;
        out.x = A.ex.x * v_x + A.ey.x * v_y + A.ez.x * v_z;
        out.y = A.ex.y * v_x + A.ey.y * v_y + A.ez.y * v_z;
        out.z = A.ex.z * v_x + A.ey.z * v_y + A.ez.z * v_z;
        return out;
    };
    b2Mat33.MulM33XYZ = function (A, x, y, z, out) {
        out.x = A.ex.x * x + A.ey.x * y + A.ez.x * z;
        out.y = A.ex.y * x + A.ey.y * y + A.ez.y * z;
        out.z = A.ex.z * x + A.ey.z * y + A.ez.z * z;
        return out;
    };
    b2Mat33.MulM33V2 = function (A, v, out) {
        var v_x = v.x, v_y = v.y;
        out.x = A.ex.x * v_x + A.ey.x * v_y;
        out.y = A.ex.y * v_x + A.ey.y * v_y;
        return out;
    };
    b2Mat33.MulM33XY = function (A, x, y, out) {
        out.x = A.ex.x * x + A.ey.x * y;
        out.y = A.ex.y * x + A.ey.y * y;
        return out;
    };
    b2Mat33.IDENTITY = new b2Mat33();
    return b2Mat33;
}());
exports.b2Mat33 = b2Mat33;
/// Rotation
var b2Rot = /** @class */ (function () {
    function b2Rot(angle) {
        if (angle === void 0) { angle = 0; }
        this.s = 0;
        this.c = 1;
        if (angle) {
            this.s = Math.sin(angle);
            this.c = Math.cos(angle);
        }
    }
    b2Rot.prototype.Clone = function () {
        return new b2Rot().Copy(this);
    };
    b2Rot.prototype.Copy = function (other) {
        this.s = other.s;
        this.c = other.c;
        return this;
    };
    b2Rot.prototype.SetAngle = function (angle) {
        this.s = Math.sin(angle);
        this.c = Math.cos(angle);
        return this;
    };
    b2Rot.prototype.SetIdentity = function () {
        this.s = 0;
        this.c = 1;
        return this;
    };
    b2Rot.prototype.GetAngle = function () {
        return Math.atan2(this.s, this.c);
    };
    b2Rot.prototype.GetXAxis = function (out) {
        out.x = this.c;
        out.y = this.s;
        return out;
    };
    b2Rot.prototype.GetYAxis = function (out) {
        out.x = -this.s;
        out.y = this.c;
        return out;
    };
    b2Rot.MulRR = function (q, r, out) {
        // [qc -qs] * [rc -rs] = [qc*rc-qs*rs -qc*rs-qs*rc]
        // [qs  qc]   [rs  rc]   [qs*rc+qc*rs -qs*rs+qc*rc]
        // s = qs * rc + qc * rs
        // c = qc * rc - qs * rs
        var q_c = q.c, q_s = q.s;
        var r_c = r.c, r_s = r.s;
        out.s = q_s * r_c + q_c * r_s;
        out.c = q_c * r_c - q_s * r_s;
        return out;
    };
    b2Rot.MulTRR = function (q, r, out) {
        // [ qc qs] * [rc -rs] = [qc*rc+qs*rs -qc*rs+qs*rc]
        // [-qs qc]   [rs  rc]   [-qs*rc+qc*rs qs*rs+qc*rc]
        // s = qc * rs - qs * rc
        // c = qc * rc + qs * rs
        var q_c = q.c, q_s = q.s;
        var r_c = r.c, r_s = r.s;
        out.s = q_c * r_s - q_s * r_c;
        out.c = q_c * r_c + q_s * r_s;
        return out;
    };
    b2Rot.MulRV = function (q, v, out) {
        var q_c = q.c, q_s = q.s;
        var v_x = v.x, v_y = v.y;
        out.x = q_c * v_x - q_s * v_y;
        out.y = q_s * v_x + q_c * v_y;
        return out;
    };
    b2Rot.MulTRV = function (q, v, out) {
        var q_c = q.c, q_s = q.s;
        var v_x = v.x, v_y = v.y;
        out.x = q_c * v_x + q_s * v_y;
        out.y = -q_s * v_x + q_c * v_y;
        return out;
    };
    b2Rot.IDENTITY = new b2Rot();
    return b2Rot;
}());
exports.b2Rot = b2Rot;
/// A transform contains translation and rotation. It is used to represent
/// the position and orientation of rigid frames.
var b2Transform = /** @class */ (function () {
    function b2Transform() {
        this.p = new b2Vec2();
        this.q = new b2Rot();
    }
    b2Transform.prototype.Clone = function () {
        return new b2Transform().Copy(this);
    };
    b2Transform.prototype.Copy = function (other) {
        this.p.Copy(other.p);
        this.q.Copy(other.q);
        return this;
    };
    b2Transform.prototype.SetIdentity = function () {
        this.p.SetZero();
        this.q.SetIdentity();
        return this;
    };
    b2Transform.prototype.SetPositionRotation = function (position, q) {
        this.p.Copy(position);
        this.q.Copy(q);
        return this;
    };
    b2Transform.prototype.SetPositionAngle = function (pos, a) {
        this.p.Copy(pos);
        this.q.SetAngle(a);
        return this;
    };
    b2Transform.prototype.SetPosition = function (position) {
        this.p.Copy(position);
        return this;
    };
    b2Transform.prototype.SetPositionXY = function (x, y) {
        this.p.Set(x, y);
        return this;
    };
    b2Transform.prototype.SetRotation = function (rotation) {
        this.q.Copy(rotation);
        return this;
    };
    b2Transform.prototype.SetRotationAngle = function (radians) {
        this.q.SetAngle(radians);
        return this;
    };
    b2Transform.prototype.GetPosition = function () {
        return this.p;
    };
    b2Transform.prototype.GetRotation = function () {
        return this.q;
    };
    b2Transform.prototype.GetRotationAngle = function () {
        return this.q.GetAngle();
    };
    b2Transform.prototype.GetAngle = function () {
        return this.q.GetAngle();
    };
    b2Transform.MulXV = function (T, v, out) {
        // float32 x = (T.q.c * v.x - T.q.s * v.y) + T.p.x;
        // float32 y = (T.q.s * v.x + T.q.c * v.y) + T.p.y;
        // return b2Vec2(x, y);
        var T_q_c = T.q.c, T_q_s = T.q.s;
        var v_x = v.x, v_y = v.y;
        out.x = (T_q_c * v_x - T_q_s * v_y) + T.p.x;
        out.y = (T_q_s * v_x + T_q_c * v_y) + T.p.y;
        return out;
    };
    b2Transform.MulTXV = function (T, v, out) {
        // float32 px = v.x - T.p.x;
        // float32 py = v.y - T.p.y;
        // float32 x = (T.q.c * px + T.q.s * py);
        // float32 y = (-T.q.s * px + T.q.c * py);
        // return b2Vec2(x, y);
        var T_q_c = T.q.c, T_q_s = T.q.s;
        var p_x = v.x - T.p.x;
        var p_y = v.y - T.p.y;
        out.x = (T_q_c * p_x + T_q_s * p_y);
        out.y = (-T_q_s * p_x + T_q_c * p_y);
        return out;
    };
    b2Transform.MulXX = function (A, B, out) {
        b2Rot.MulRR(A.q, B.q, out.q);
        b2Vec2.AddVV(b2Rot.MulRV(A.q, B.p, out.p), A.p, out.p);
        return out;
    };
    b2Transform.MulTXX = function (A, B, out) {
        b2Rot.MulTRR(A.q, B.q, out.q);
        b2Rot.MulTRV(A.q, b2Vec2.SubVV(B.p, A.p, out.p), out.p);
        return out;
    };
    b2Transform.IDENTITY = new b2Transform();
    return b2Transform;
}());
exports.b2Transform = b2Transform;
/// This describes the motion of a body/shape for TOI computation.
/// Shapes are defined with respect to the body origin, which may
/// no coincide with the center of mass. However, to support dynamics
/// we must interpolate the center of mass position.
var b2Sweep = /** @class */ (function () {
    function b2Sweep() {
        this.localCenter = new b2Vec2();
        this.c0 = new b2Vec2();
        this.c = new b2Vec2();
        this.a0 = 0;
        this.a = 0;
        this.alpha0 = 0;
    }
    b2Sweep.prototype.Clone = function () {
        return new b2Sweep().Copy(this);
    };
    b2Sweep.prototype.Copy = function (other) {
        this.localCenter.Copy(other.localCenter);
        this.c0.Copy(other.c0);
        this.c.Copy(other.c);
        this.a0 = other.a0;
        this.a = other.a;
        this.alpha0 = other.alpha0;
        return this;
    };
    // https://fgiesen.wordpress.com/2012/08/15/linear-interpolation-past-present-and-future/
    b2Sweep.prototype.GetTransform = function (xf, beta) {
        xf.p.x = (1.0 - beta) * this.c0.x + beta * this.c.x;
        xf.p.y = (1.0 - beta) * this.c0.y + beta * this.c.y;
        var angle = (1.0 - beta) * this.a0 + beta * this.a;
        xf.q.SetAngle(angle);
        xf.p.SelfSub(b2Rot.MulRV(xf.q, this.localCenter, b2Vec2.s_t0));
        return xf;
    };
    b2Sweep.prototype.Advance = function (alpha) {
        // DEBUG: b2Assert(this.alpha0 < 1);
        var beta = (alpha - this.alpha0) / (1 - this.alpha0);
        var one_minus_beta = (1 - beta);
        this.c0.x = one_minus_beta * this.c0.x + beta * this.c.x;
        this.c0.y = one_minus_beta * this.c0.y + beta * this.c.y;
        this.a0 = one_minus_beta * this.a0 + beta * this.a;
        this.alpha0 = alpha;
    };
    b2Sweep.prototype.Normalize = function () {
        var d = exports.b2_two_pi * Math.floor(this.a0 / exports.b2_two_pi);
        this.a0 -= d;
        this.a -= d;
    };
    return b2Sweep;
}());
exports.b2Sweep = b2Sweep;
