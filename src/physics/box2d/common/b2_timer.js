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
exports.b2Counter = exports.b2Timer = void 0;
/// Timer for profiling. This has platform specific code and may
/// not work on every platform.
var b2Timer = /** @class */ (function () {
    function b2Timer() {
        this.m_start = Date.now();
    }
    /// Reset the timer.
    b2Timer.prototype.Reset = function () {
        this.m_start = Date.now();
        return this;
    };
    /// Get the time since construction or the last reset.
    b2Timer.prototype.GetMilliseconds = function () {
        return Date.now() - this.m_start;
    };
    return b2Timer;
}());
exports.b2Timer = b2Timer;
var b2Counter = /** @class */ (function () {
    function b2Counter() {
        this.m_count = 0;
        this.m_min_count = 0;
        this.m_max_count = 0;
    }
    b2Counter.prototype.GetCount = function () {
        return this.m_count;
    };
    b2Counter.prototype.GetMinCount = function () {
        return this.m_min_count;
    };
    b2Counter.prototype.GetMaxCount = function () {
        return this.m_max_count;
    };
    b2Counter.prototype.ResetCount = function () {
        var count = this.m_count;
        this.m_count = 0;
        return count;
    };
    b2Counter.prototype.ResetMinCount = function () {
        this.m_min_count = 0;
    };
    b2Counter.prototype.ResetMaxCount = function () {
        this.m_max_count = 0;
    };
    b2Counter.prototype.Increment = function () {
        this.m_count++;
        if (this.m_max_count < this.m_count) {
            this.m_max_count = this.m_count;
        }
    };
    b2Counter.prototype.Decrement = function () {
        this.m_count--;
        if (this.m_min_count > this.m_count) {
            this.m_min_count = this.m_count;
        }
    };
    return b2Counter;
}());
exports.b2Counter = b2Counter;
