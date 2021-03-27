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
exports.b2EdgeAndCircleContact = void 0;
var b2_collide_edge_js_1 = require("../collision/b2_collide_edge.js");
var b2_contact_js_1 = require("./b2_contact.js");
var b2EdgeAndCircleContact = /** @class */ (function (_super) {
    __extends(b2EdgeAndCircleContact, _super);
    function b2EdgeAndCircleContact() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    b2EdgeAndCircleContact.Create = function () {
        return new b2EdgeAndCircleContact();
    };
    b2EdgeAndCircleContact.Destroy = function (contact) {
    };
    b2EdgeAndCircleContact.prototype.Evaluate = function (manifold, xfA, xfB) {
        b2_collide_edge_js_1.b2CollideEdgeAndCircle(manifold, this.GetShapeA(), xfA, this.GetShapeB(), xfB);
    };
    return b2EdgeAndCircleContact;
}(b2_contact_js_1.b2Contact));
exports.b2EdgeAndCircleContact = b2EdgeAndCircleContact;
