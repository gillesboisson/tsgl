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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.b2GravityController = void 0;
// #if B2_ENABLE_CONTROLLER
var b2_controller_js_1 = require("./b2_controller.js");
var b2_settings_js_1 = require("../common/b2_settings.js");
var b2_math_js_1 = require("../common/b2_math.js");
/**
 * Applies simplified gravity between every pair of bodies
 */
var b2GravityController = /** @class */ (function (_super) {
    __extends(b2GravityController, _super);
    function b2GravityController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Specifies the strength of the gravitiation force
         */
        _this.G = 1;
        /**
         * If true, gravity is proportional to r^-2, otherwise r^-1
         */
        _this.invSqr = true;
        return _this;
    }
    /**
     * @see b2Controller::Step
     */
    b2GravityController.prototype.Step = function (step) {
        if (this.invSqr) {
            for (var i = this.m_bodyList; i; i = i.nextBody) {
                var body1 = i.body;
                var p1 = body1.GetWorldCenter();
                var mass1 = body1.GetMass();
                for (var j = this.m_bodyList; j && j !== i; j = j.nextBody) {
                    var body2 = j.body;
                    var p2 = body2.GetWorldCenter();
                    var mass2 = body2.GetMass();
                    var dx = p2.x - p1.x;
                    var dy = p2.y - p1.y;
                    var r2 = dx * dx + dy * dy;
                    if (r2 < b2_settings_js_1.b2_epsilon) {
                        continue;
                    }
                    var f = b2GravityController.Step_s_f.Set(dx, dy);
                    f.SelfMul(this.G / r2 / b2_math_js_1.b2Sqrt(r2) * mass1 * mass2);
                    if (body1.IsAwake()) {
                        body1.ApplyForce(f, p1);
                    }
                    if (body2.IsAwake()) {
                        body2.ApplyForce(f.SelfMul(-1), p2);
                    }
                }
            }
        }
        else {
            for (var i = this.m_bodyList; i; i = i.nextBody) {
                var body1 = i.body;
                var p1 = body1.GetWorldCenter();
                var mass1 = body1.GetMass();
                for (var j = this.m_bodyList; j && j !== i; j = j.nextBody) {
                    var body2 = j.body;
                    var p2 = body2.GetWorldCenter();
                    var mass2 = body2.GetMass();
                    var dx = p2.x - p1.x;
                    var dy = p2.y - p1.y;
                    var r2 = dx * dx + dy * dy;
                    if (r2 < b2_settings_js_1.b2_epsilon) {
                        continue;
                    }
                    var f = b2GravityController.Step_s_f.Set(dx, dy);
                    f.SelfMul(this.G / r2 * mass1 * mass2);
                    if (body1.IsAwake()) {
                        body1.ApplyForce(f, p1);
                    }
                    if (body2.IsAwake()) {
                        body2.ApplyForce(f.SelfMul(-1), p2);
                    }
                }
            }
        }
    };
    b2GravityController.prototype.Draw = function (draw) { };
    b2GravityController.Step_s_f = new b2_math_js_1.b2Vec2();
    return b2GravityController;
}(b2_controller_js_1.b2Controller));
exports.b2GravityController = b2GravityController;
// #endif
