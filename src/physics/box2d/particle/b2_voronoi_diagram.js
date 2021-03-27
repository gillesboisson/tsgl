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
exports.b2VoronoiDiagram_Task = exports.b2VoronoiDiagram_Generator = exports.b2VoronoiDiagram = void 0;
// #if B2_ENABLE_PARTICLE
// DEBUG: import { b2Assert } from "../common/b2_settings";
var b2_settings_js_1 = require("../common/b2_settings.js");
var b2_math_js_1 = require("../common/b2_math.js");
var b2_stack_queue_js_1 = require("./b2_stack_queue.js");
/**
 * A field representing the nearest generator from each point.
 */
var b2VoronoiDiagram = /** @class */ (function () {
    function b2VoronoiDiagram(generatorCapacity) {
        this.m_generatorCapacity = 0;
        this.m_generatorCount = 0;
        this.m_countX = 0;
        this.m_countY = 0;
        this.m_diagram = [];
        this.m_generatorBuffer = b2_settings_js_1.b2MakeArray(generatorCapacity, function (index) { return new b2VoronoiDiagram_Generator(); });
        this.m_generatorCapacity = generatorCapacity;
    }
    /**
     * Add a generator.
     *
     * @param center the position of the generator.
     * @param tag a tag used to identify the generator in callback functions.
     * @param necessary whether to callback for nodes associated with the generator.
     */
    b2VoronoiDiagram.prototype.AddGenerator = function (center, tag, necessary) {
        // DEBUG: b2Assert(this.m_generatorCount < this.m_generatorCapacity);
        var g = this.m_generatorBuffer[this.m_generatorCount++];
        g.center.Copy(center);
        g.tag = tag;
        g.necessary = necessary;
    };
    /**
     * Generate the Voronoi diagram. It is rasterized with a given
     * interval in the same range as the necessary generators exist.
     *
     * @param radius the interval of the diagram.
     * @param margin margin for which the range of the diagram is extended.
     */
    b2VoronoiDiagram.prototype.Generate = function (radius, margin) {
        var inverseRadius = 1 / radius;
        var lower = new b2_math_js_1.b2Vec2(+b2_settings_js_1.b2_maxFloat, +b2_settings_js_1.b2_maxFloat);
        var upper = new b2_math_js_1.b2Vec2(-b2_settings_js_1.b2_maxFloat, -b2_settings_js_1.b2_maxFloat);
        var necessary_count = 0;
        for (var k = 0; k < this.m_generatorCount; k++) {
            var g = this.m_generatorBuffer[k];
            if (g.necessary) {
                b2_math_js_1.b2Vec2.MinV(lower, g.center, lower);
                b2_math_js_1.b2Vec2.MaxV(upper, g.center, upper);
                ++necessary_count;
            }
        }
        if (necessary_count === 0) {
            ///debugger;
            this.m_countX = 0;
            this.m_countY = 0;
            return;
        }
        lower.x -= margin;
        lower.y -= margin;
        upper.x += margin;
        upper.y += margin;
        this.m_countX = 1 + Math.floor(inverseRadius * (upper.x - lower.x));
        this.m_countY = 1 + Math.floor(inverseRadius * (upper.y - lower.y));
        this.m_diagram = []; // b2MakeArray(this.m_countX * this.m_countY, (index) => null);
        // (4 * m_countX * m_countY) is the queue capacity that is experimentally
        // known to be necessary and sufficient for general particle distributions.
        var queue = new b2_stack_queue_js_1.b2StackQueue(4 * this.m_countX * this.m_countY);
        for (var k = 0; k < this.m_generatorCount; k++) {
            var g = this.m_generatorBuffer[k];
            ///  g.center = inverseRadius * (g.center - lower);
            g.center.SelfSub(lower).SelfMul(inverseRadius);
            var x = Math.floor(g.center.x);
            var y = Math.floor(g.center.y);
            if (x >= 0 && y >= 0 && x < this.m_countX && y < this.m_countY) {
                queue.Push(new b2VoronoiDiagram_Task(x, y, x + y * this.m_countX, g));
            }
        }
        while (!queue.Empty()) {
            var task = queue.Front();
            var x = task.m_x;
            var y = task.m_y;
            var i = task.m_i;
            var g = task.m_generator;
            queue.Pop();
            if (!this.m_diagram[i]) {
                this.m_diagram[i] = g;
                if (x > 0) {
                    queue.Push(new b2VoronoiDiagram_Task(x - 1, y, i - 1, g));
                }
                if (y > 0) {
                    queue.Push(new b2VoronoiDiagram_Task(x, y - 1, i - this.m_countX, g));
                }
                if (x < this.m_countX - 1) {
                    queue.Push(new b2VoronoiDiagram_Task(x + 1, y, i + 1, g));
                }
                if (y < this.m_countY - 1) {
                    queue.Push(new b2VoronoiDiagram_Task(x, y + 1, i + this.m_countX, g));
                }
            }
        }
        for (var y = 0; y < this.m_countY; y++) {
            for (var x = 0; x < this.m_countX - 1; x++) {
                var i = x + y * this.m_countX;
                var a = this.m_diagram[i];
                var b = this.m_diagram[i + 1];
                if (a !== b) {
                    queue.Push(new b2VoronoiDiagram_Task(x, y, i, b));
                    queue.Push(new b2VoronoiDiagram_Task(x + 1, y, i + 1, a));
                }
            }
        }
        for (var y = 0; y < this.m_countY - 1; y++) {
            for (var x = 0; x < this.m_countX; x++) {
                var i = x + y * this.m_countX;
                var a = this.m_diagram[i];
                var b = this.m_diagram[i + this.m_countX];
                if (a !== b) {
                    queue.Push(new b2VoronoiDiagram_Task(x, y, i, b));
                    queue.Push(new b2VoronoiDiagram_Task(x, y + 1, i + this.m_countX, a));
                }
            }
        }
        while (!queue.Empty()) {
            var task = queue.Front();
            var x = task.m_x;
            var y = task.m_y;
            var i = task.m_i;
            var k = task.m_generator;
            queue.Pop();
            var a = this.m_diagram[i];
            var b = k;
            if (a !== b) {
                var ax = a.center.x - x;
                var ay = a.center.y - y;
                var bx = b.center.x - x;
                var by = b.center.y - y;
                var a2 = ax * ax + ay * ay;
                var b2 = bx * bx + by * by;
                if (a2 > b2) {
                    this.m_diagram[i] = b;
                    if (x > 0) {
                        queue.Push(new b2VoronoiDiagram_Task(x - 1, y, i - 1, b));
                    }
                    if (y > 0) {
                        queue.Push(new b2VoronoiDiagram_Task(x, y - 1, i - this.m_countX, b));
                    }
                    if (x < this.m_countX - 1) {
                        queue.Push(new b2VoronoiDiagram_Task(x + 1, y, i + 1, b));
                    }
                    if (y < this.m_countY - 1) {
                        queue.Push(new b2VoronoiDiagram_Task(x, y + 1, i + this.m_countX, b));
                    }
                }
            }
        }
    };
    /**
     * Enumerate all nodes that contain at least one necessary
     * generator.
     */
    b2VoronoiDiagram.prototype.GetNodes = function (callback) {
        for (var y = 0; y < this.m_countY - 1; y++) {
            for (var x = 0; x < this.m_countX - 1; x++) {
                var i = x + y * this.m_countX;
                var a = this.m_diagram[i];
                var b = this.m_diagram[i + 1];
                var c = this.m_diagram[i + this.m_countX];
                var d = this.m_diagram[i + 1 + this.m_countX];
                if (b !== c) {
                    if (a !== b && a !== c &&
                        (a.necessary || b.necessary || c.necessary)) {
                        callback(a.tag, b.tag, c.tag);
                    }
                    if (d !== b && d !== c &&
                        (a.necessary || b.necessary || c.necessary)) {
                        callback(b.tag, d.tag, c.tag);
                    }
                }
            }
        }
    };
    return b2VoronoiDiagram;
}());
exports.b2VoronoiDiagram = b2VoronoiDiagram;
var b2VoronoiDiagram_Generator = /** @class */ (function () {
    function b2VoronoiDiagram_Generator() {
        this.center = new b2_math_js_1.b2Vec2();
        this.tag = 0;
        this.necessary = false;
    }
    return b2VoronoiDiagram_Generator;
}());
exports.b2VoronoiDiagram_Generator = b2VoronoiDiagram_Generator;
var b2VoronoiDiagram_Task = /** @class */ (function () {
    function b2VoronoiDiagram_Task(x, y, i, g) {
        this.m_x = x;
        this.m_y = y;
        this.m_i = i;
        this.m_generator = g;
    }
    return b2VoronoiDiagram_Task;
}());
exports.b2VoronoiDiagram_Task = b2VoronoiDiagram_Task;
// #endif
