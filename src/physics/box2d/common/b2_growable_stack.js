"use strict";
/*
* Copyright (c) 2010 Erin Catto http://www.box2d.org
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
exports.b2GrowableStack = void 0;
// DEBUG: import { b2Assert } from "./b2_settings";
var b2_settings_js_1 = require("./b2_settings.js");
/// This is a growable LIFO stack with an initial capacity of N.
/// If the stack size exceeds the initial capacity, the heap is used
/// to increase the size of the stack.
var b2GrowableStack = /** @class */ (function () {
    function b2GrowableStack(N) {
        this.m_stack = [];
        this.m_count = 0;
        this.m_stack = b2_settings_js_1.b2MakeArray(N, function (index) { return null; });
        this.m_count = 0;
    }
    b2GrowableStack.prototype.Reset = function () {
        this.m_count = 0;
        return this;
    };
    b2GrowableStack.prototype.Push = function (element) {
        this.m_stack[this.m_count] = element;
        this.m_count++;
    };
    b2GrowableStack.prototype.Pop = function () {
        // DEBUG: b2Assert(this.m_count > 0);
        this.m_count--;
        var element = this.m_stack[this.m_count];
        this.m_stack[this.m_count] = null;
        return element;
    };
    b2GrowableStack.prototype.GetCount = function () {
        return this.m_count;
    };
    return b2GrowableStack;
}());
exports.b2GrowableStack = b2GrowableStack;
