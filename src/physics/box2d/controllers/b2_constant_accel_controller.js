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
exports.b2ConstantAccelController = void 0;
// #if B2_ENABLE_CONTROLLER
var b2_controller_js_1 = require("./b2_controller.js");
var b2_math_js_1 = require("../common/b2_math.js");
/**
 * Applies a force every frame
 */
var b2ConstantAccelController = /** @class */ (function (_super) {
    __extends(b2ConstantAccelController, _super);
    function b2ConstantAccelController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * The acceleration to apply
         */
        _this.A = new b2_math_js_1.b2Vec2(0, 0);
        return _this;
    }
    b2ConstantAccelController.prototype.Step = function (step) {
        var dtA = b2_math_js_1.b2Vec2.MulSV(step.dt, this.A, b2ConstantAccelController.Step_s_dtA);
        for (var i = this.m_bodyList; i; i = i.nextBody) {
            var body = i.body;
            if (!body.IsAwake()) {
                continue;
            }
            body.SetLinearVelocity(b2_math_js_1.b2Vec2.AddVV(body.GetLinearVelocity(), dtA, b2_math_js_1.b2Vec2.s_t0));
        }
    };
    b2ConstantAccelController.prototype.Draw = function (draw) { };
    b2ConstantAccelController.Step_s_dtA = new b2_math_js_1.b2Vec2();
    return b2ConstantAccelController;
}(b2_controller_js_1.b2Controller));
exports.b2ConstantAccelController = b2ConstantAccelController;
// #endif
