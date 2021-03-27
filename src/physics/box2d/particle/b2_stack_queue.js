"use strict";
/*
 * Copyright (c) 2013 Google, Inc.
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
exports.b2StackQueue = void 0;
// #if B2_ENABLE_PARTICLE
// DEBUG: import { b2Assert } from "../common/b2_settings";
var b2StackQueue = /** @class */ (function () {
    function b2StackQueue(capacity) {
        this.m_buffer = [];
        this.m_front = 0;
        this.m_back = 0;
        this.m_buffer.fill(null, 0, capacity);
    }
    Object.defineProperty(b2StackQueue.prototype, "m_capacity", {
        get: function () { return this.m_buffer.length; },
        enumerable: false,
        configurable: true
    });
    b2StackQueue.prototype.Push = function (item) {
        if (this.m_back >= this.m_capacity) {
            for (var i = this.m_front; i < this.m_back; i++) {
                this.m_buffer[i - this.m_front] = this.m_buffer[i];
            }
            this.m_back -= this.m_front;
            this.m_front = 0;
        }
        this.m_buffer[this.m_back] = item;
        this.m_back++;
    };
    b2StackQueue.prototype.Pop = function () {
        // DEBUG: b2Assert(this.m_front < this.m_back);
        this.m_buffer[this.m_front] = null;
        this.m_front++;
    };
    b2StackQueue.prototype.Empty = function () {
        // DEBUG: b2Assert(this.m_front <= this.m_back);
        return this.m_front === this.m_back;
    };
    b2StackQueue.prototype.Front = function () {
        var item = this.m_buffer[this.m_front];
        if (!item) {
            throw new Error();
        }
        return item;
    };
    return b2StackQueue;
}());
exports.b2StackQueue = b2StackQueue;
// #endif
