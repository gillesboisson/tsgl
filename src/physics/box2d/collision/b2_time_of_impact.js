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
exports.b2TimeOfImpact = exports.b2SeparationFunction = exports.b2SeparationFunctionType = exports.b2TOIOutput = exports.b2TOIOutputState = exports.b2TOIInput = exports.b2_toi_reset = exports.b2_toiMaxRootIters = exports.b2_toiRootIters = exports.b2_toiMaxIters = exports.b2_toiIters = exports.b2_toiCalls = exports.b2_toiMaxTime = exports.b2_toiTime = void 0;
// DEBUG: import { b2Assert } from "../common/b2_settings";
var b2_settings_js_1 = require("../common/b2_settings.js");
var b2_math_js_1 = require("../common/b2_math.js");
var b2_timer_js_1 = require("../common/b2_timer.js");
var b2_distance_js_1 = require("./b2_distance.js");
exports.b2_toiTime = 0;
exports.b2_toiMaxTime = 0;
exports.b2_toiCalls = 0;
exports.b2_toiIters = 0;
exports.b2_toiMaxIters = 0;
exports.b2_toiRootIters = 0;
exports.b2_toiMaxRootIters = 0;
function b2_toi_reset() {
    exports.b2_toiTime = 0;
    exports.b2_toiMaxTime = 0;
    exports.b2_toiCalls = 0;
    exports.b2_toiIters = 0;
    exports.b2_toiMaxIters = 0;
    exports.b2_toiRootIters = 0;
    exports.b2_toiMaxRootIters = 0;
}
exports.b2_toi_reset = b2_toi_reset;
var b2TimeOfImpact_s_xfA = new b2_math_js_1.b2Transform();
var b2TimeOfImpact_s_xfB = new b2_math_js_1.b2Transform();
var b2TimeOfImpact_s_pointA = new b2_math_js_1.b2Vec2();
var b2TimeOfImpact_s_pointB = new b2_math_js_1.b2Vec2();
var b2TimeOfImpact_s_normal = new b2_math_js_1.b2Vec2();
var b2TimeOfImpact_s_axisA = new b2_math_js_1.b2Vec2();
var b2TimeOfImpact_s_axisB = new b2_math_js_1.b2Vec2();
/// Input parameters for b2TimeOfImpact
var b2TOIInput = /** @class */ (function () {
    function b2TOIInput() {
        this.proxyA = new b2_distance_js_1.b2DistanceProxy();
        this.proxyB = new b2_distance_js_1.b2DistanceProxy();
        this.sweepA = new b2_math_js_1.b2Sweep();
        this.sweepB = new b2_math_js_1.b2Sweep();
        this.tMax = 0; // defines sweep interval [0, tMax]
    }
    return b2TOIInput;
}());
exports.b2TOIInput = b2TOIInput;
/// Output parameters for b2TimeOfImpact.
var b2TOIOutputState;
(function (b2TOIOutputState) {
    b2TOIOutputState[b2TOIOutputState["e_unknown"] = 0] = "e_unknown";
    b2TOIOutputState[b2TOIOutputState["e_failed"] = 1] = "e_failed";
    b2TOIOutputState[b2TOIOutputState["e_overlapped"] = 2] = "e_overlapped";
    b2TOIOutputState[b2TOIOutputState["e_touching"] = 3] = "e_touching";
    b2TOIOutputState[b2TOIOutputState["e_separated"] = 4] = "e_separated";
})(b2TOIOutputState = exports.b2TOIOutputState || (exports.b2TOIOutputState = {}));
var b2TOIOutput = /** @class */ (function () {
    function b2TOIOutput() {
        this.state = b2TOIOutputState.e_unknown;
        this.t = 0;
    }
    return b2TOIOutput;
}());
exports.b2TOIOutput = b2TOIOutput;
var b2SeparationFunctionType;
(function (b2SeparationFunctionType) {
    b2SeparationFunctionType[b2SeparationFunctionType["e_unknown"] = -1] = "e_unknown";
    b2SeparationFunctionType[b2SeparationFunctionType["e_points"] = 0] = "e_points";
    b2SeparationFunctionType[b2SeparationFunctionType["e_faceA"] = 1] = "e_faceA";
    b2SeparationFunctionType[b2SeparationFunctionType["e_faceB"] = 2] = "e_faceB";
})(b2SeparationFunctionType = exports.b2SeparationFunctionType || (exports.b2SeparationFunctionType = {}));
var b2SeparationFunction = /** @class */ (function () {
    function b2SeparationFunction() {
        this.m_sweepA = new b2_math_js_1.b2Sweep();
        this.m_sweepB = new b2_math_js_1.b2Sweep();
        this.m_type = b2SeparationFunctionType.e_unknown;
        this.m_localPoint = new b2_math_js_1.b2Vec2();
        this.m_axis = new b2_math_js_1.b2Vec2();
    }
    b2SeparationFunction.prototype.Initialize = function (cache, proxyA, sweepA, proxyB, sweepB, t1) {
        this.m_proxyA = proxyA;
        this.m_proxyB = proxyB;
        var count = cache.count;
        // DEBUG: b2Assert(0 < count && count < 3);
        this.m_sweepA.Copy(sweepA);
        this.m_sweepB.Copy(sweepB);
        var xfA = b2TimeOfImpact_s_xfA;
        var xfB = b2TimeOfImpact_s_xfB;
        this.m_sweepA.GetTransform(xfA, t1);
        this.m_sweepB.GetTransform(xfB, t1);
        if (count === 1) {
            this.m_type = b2SeparationFunctionType.e_points;
            var localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
            var localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
            var pointA = b2_math_js_1.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
            var pointB = b2_math_js_1.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
            b2_math_js_1.b2Vec2.SubVV(pointB, pointA, this.m_axis);
            var s = this.m_axis.Normalize();
            // #if B2_ENABLE_PARTICLE
            this.m_localPoint.SetZero();
            // #endif
            return s;
        }
        else if (cache.indexA[0] === cache.indexA[1]) {
            // Two points on B and one on A.
            this.m_type = b2SeparationFunctionType.e_faceB;
            var localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
            var localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
            b2_math_js_1.b2Vec2.CrossVOne(b2_math_js_1.b2Vec2.SubVV(localPointB2, localPointB1, b2_math_js_1.b2Vec2.s_t0), this.m_axis).SelfNormalize();
            var normal = b2_math_js_1.b2Rot.MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
            b2_math_js_1.b2Vec2.MidVV(localPointB1, localPointB2, this.m_localPoint);
            var pointB = b2_math_js_1.b2Transform.MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
            var localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
            var pointA = b2_math_js_1.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
            var s = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(pointA, pointB, b2_math_js_1.b2Vec2.s_t0), normal);
            if (s < 0) {
                this.m_axis.SelfNeg();
                s = -s;
            }
            return s;
        }
        else {
            // Two points on A and one or two points on B.
            this.m_type = b2SeparationFunctionType.e_faceA;
            var localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
            var localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
            b2_math_js_1.b2Vec2.CrossVOne(b2_math_js_1.b2Vec2.SubVV(localPointA2, localPointA1, b2_math_js_1.b2Vec2.s_t0), this.m_axis).SelfNormalize();
            var normal = b2_math_js_1.b2Rot.MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
            b2_math_js_1.b2Vec2.MidVV(localPointA1, localPointA2, this.m_localPoint);
            var pointA = b2_math_js_1.b2Transform.MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
            var localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
            var pointB = b2_math_js_1.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
            var s = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(pointB, pointA, b2_math_js_1.b2Vec2.s_t0), normal);
            if (s < 0) {
                this.m_axis.SelfNeg();
                s = -s;
            }
            return s;
        }
    };
    b2SeparationFunction.prototype.FindMinSeparation = function (indexA, indexB, t) {
        var xfA = b2TimeOfImpact_s_xfA;
        var xfB = b2TimeOfImpact_s_xfB;
        this.m_sweepA.GetTransform(xfA, t);
        this.m_sweepB.GetTransform(xfB, t);
        switch (this.m_type) {
            case b2SeparationFunctionType.e_points: {
                var axisA = b2_math_js_1.b2Rot.MulTRV(xfA.q, this.m_axis, b2TimeOfImpact_s_axisA);
                var axisB = b2_math_js_1.b2Rot.MulTRV(xfB.q, b2_math_js_1.b2Vec2.NegV(this.m_axis, b2_math_js_1.b2Vec2.s_t0), b2TimeOfImpact_s_axisB);
                indexA[0] = this.m_proxyA.GetSupport(axisA);
                indexB[0] = this.m_proxyB.GetSupport(axisB);
                var localPointA = this.m_proxyA.GetVertex(indexA[0]);
                var localPointB = this.m_proxyB.GetVertex(indexB[0]);
                var pointA = b2_math_js_1.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                var pointB = b2_math_js_1.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                var separation = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(pointB, pointA, b2_math_js_1.b2Vec2.s_t0), this.m_axis);
                return separation;
            }
            case b2SeparationFunctionType.e_faceA: {
                var normal = b2_math_js_1.b2Rot.MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
                var pointA = b2_math_js_1.b2Transform.MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
                var axisB = b2_math_js_1.b2Rot.MulTRV(xfB.q, b2_math_js_1.b2Vec2.NegV(normal, b2_math_js_1.b2Vec2.s_t0), b2TimeOfImpact_s_axisB);
                indexA[0] = -1;
                indexB[0] = this.m_proxyB.GetSupport(axisB);
                var localPointB = this.m_proxyB.GetVertex(indexB[0]);
                var pointB = b2_math_js_1.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                var separation = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(pointB, pointA, b2_math_js_1.b2Vec2.s_t0), normal);
                return separation;
            }
            case b2SeparationFunctionType.e_faceB: {
                var normal = b2_math_js_1.b2Rot.MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
                var pointB = b2_math_js_1.b2Transform.MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
                var axisA = b2_math_js_1.b2Rot.MulTRV(xfA.q, b2_math_js_1.b2Vec2.NegV(normal, b2_math_js_1.b2Vec2.s_t0), b2TimeOfImpact_s_axisA);
                indexB[0] = -1;
                indexA[0] = this.m_proxyA.GetSupport(axisA);
                var localPointA = this.m_proxyA.GetVertex(indexA[0]);
                var pointA = b2_math_js_1.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                var separation = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(pointA, pointB, b2_math_js_1.b2Vec2.s_t0), normal);
                return separation;
            }
            default:
                // DEBUG: b2Assert(false);
                indexA[0] = -1;
                indexB[0] = -1;
                return 0;
        }
    };
    b2SeparationFunction.prototype.Evaluate = function (indexA, indexB, t) {
        var xfA = b2TimeOfImpact_s_xfA;
        var xfB = b2TimeOfImpact_s_xfB;
        this.m_sweepA.GetTransform(xfA, t);
        this.m_sweepB.GetTransform(xfB, t);
        switch (this.m_type) {
            case b2SeparationFunctionType.e_points: {
                var localPointA = this.m_proxyA.GetVertex(indexA);
                var localPointB = this.m_proxyB.GetVertex(indexB);
                var pointA = b2_math_js_1.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                var pointB = b2_math_js_1.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                var separation = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(pointB, pointA, b2_math_js_1.b2Vec2.s_t0), this.m_axis);
                return separation;
            }
            case b2SeparationFunctionType.e_faceA: {
                var normal = b2_math_js_1.b2Rot.MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
                var pointA = b2_math_js_1.b2Transform.MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
                var localPointB = this.m_proxyB.GetVertex(indexB);
                var pointB = b2_math_js_1.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                var separation = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(pointB, pointA, b2_math_js_1.b2Vec2.s_t0), normal);
                return separation;
            }
            case b2SeparationFunctionType.e_faceB: {
                var normal = b2_math_js_1.b2Rot.MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
                var pointB = b2_math_js_1.b2Transform.MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
                var localPointA = this.m_proxyA.GetVertex(indexA);
                var pointA = b2_math_js_1.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                var separation = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(pointA, pointB, b2_math_js_1.b2Vec2.s_t0), normal);
                return separation;
            }
            default:
                // DEBUG: b2Assert(false);
                return 0;
        }
    };
    return b2SeparationFunction;
}());
exports.b2SeparationFunction = b2SeparationFunction;
var b2TimeOfImpact_s_timer = new b2_timer_js_1.b2Timer();
var b2TimeOfImpact_s_cache = new b2_distance_js_1.b2SimplexCache();
var b2TimeOfImpact_s_distanceInput = new b2_distance_js_1.b2DistanceInput();
var b2TimeOfImpact_s_distanceOutput = new b2_distance_js_1.b2DistanceOutput();
var b2TimeOfImpact_s_fcn = new b2SeparationFunction();
var b2TimeOfImpact_s_indexA = [0];
var b2TimeOfImpact_s_indexB = [0];
var b2TimeOfImpact_s_sweepA = new b2_math_js_1.b2Sweep();
var b2TimeOfImpact_s_sweepB = new b2_math_js_1.b2Sweep();
function b2TimeOfImpact(output, input) {
    var timer = b2TimeOfImpact_s_timer.Reset();
    ++exports.b2_toiCalls;
    output.state = b2TOIOutputState.e_unknown;
    output.t = input.tMax;
    var proxyA = input.proxyA;
    var proxyB = input.proxyB;
    var maxVertices = b2_math_js_1.b2Max(b2_settings_js_1.b2_maxPolygonVertices, b2_math_js_1.b2Max(proxyA.m_count, proxyB.m_count));
    var sweepA = b2TimeOfImpact_s_sweepA.Copy(input.sweepA);
    var sweepB = b2TimeOfImpact_s_sweepB.Copy(input.sweepB);
    // Large rotations can make the root finder fail, so we normalize the
    // sweep angles.
    sweepA.Normalize();
    sweepB.Normalize();
    var tMax = input.tMax;
    var totalRadius = proxyA.m_radius + proxyB.m_radius;
    var target = b2_math_js_1.b2Max(b2_settings_js_1.b2_linearSlop, totalRadius - 3 * b2_settings_js_1.b2_linearSlop);
    var tolerance = 0.25 * b2_settings_js_1.b2_linearSlop;
    // DEBUG: b2Assert(target > tolerance);
    var t1 = 0;
    var k_maxIterations = 20; // TODO_ERIN b2Settings
    var iter = 0;
    // Prepare input for distance query.
    var cache = b2TimeOfImpact_s_cache;
    cache.count = 0;
    var distanceInput = b2TimeOfImpact_s_distanceInput;
    distanceInput.proxyA.Copy(input.proxyA);
    distanceInput.proxyB.Copy(input.proxyB);
    distanceInput.useRadii = false;
    // The outer loop progressively attempts to compute new separating axes.
    // This loop terminates when an axis is repeated (no progress is made).
    for (;;) {
        var xfA = b2TimeOfImpact_s_xfA;
        var xfB = b2TimeOfImpact_s_xfB;
        sweepA.GetTransform(xfA, t1);
        sweepB.GetTransform(xfB, t1);
        // Get the distance between shapes. We can also use the results
        // to get a separating axis.
        distanceInput.transformA.Copy(xfA);
        distanceInput.transformB.Copy(xfB);
        var distanceOutput = b2TimeOfImpact_s_distanceOutput;
        b2_distance_js_1.b2Distance(distanceOutput, cache, distanceInput);
        // If the shapes are overlapped, we give up on continuous collision.
        if (distanceOutput.distance <= 0) {
            // Failure!
            output.state = b2TOIOutputState.e_overlapped;
            output.t = 0;
            break;
        }
        if (distanceOutput.distance < target + tolerance) {
            // Victory!
            output.state = b2TOIOutputState.e_touching;
            output.t = t1;
            break;
        }
        // Initialize the separating axis.
        var fcn = b2TimeOfImpact_s_fcn;
        fcn.Initialize(cache, proxyA, sweepA, proxyB, sweepB, t1);
        /*
        #if 0
            // Dump the curve seen by the root finder {
              const int32 N = 100;
              float32 dx = 1.0f / N;
              float32 xs[N+1];
              float32 fs[N+1];
        
              float32 x = 0.0f;
        
              for (int32 i = 0; i <= N; ++i) {
                sweepA.GetTransform(&xfA, x);
                sweepB.GetTransform(&xfB, x);
                float32 f = fcn.Evaluate(xfA, xfB) - target;
        
                printf("%g %g\n", x, f);
        
                xs[i] = x;
                fs[i] = f;
        
                x += dx;
              }
            }
        #endif
        */
        // Compute the TOI on the separating axis. We do this by successively
        // resolving the deepest point. This loop is bounded by the number of vertices.
        var done = false;
        var t2 = tMax;
        var pushBackIter = 0;
        for (;;) {
            // Find the deepest point at t2. Store the witness point indices.
            var indexA = b2TimeOfImpact_s_indexA;
            var indexB = b2TimeOfImpact_s_indexB;
            var s2 = fcn.FindMinSeparation(indexA, indexB, t2);
            // Is the final configuration separated?
            if (s2 > (target + tolerance)) {
                // Victory!
                output.state = b2TOIOutputState.e_separated;
                output.t = tMax;
                done = true;
                break;
            }
            // Has the separation reached tolerance?
            if (s2 > (target - tolerance)) {
                // Advance the sweeps
                t1 = t2;
                break;
            }
            // Compute the initial separation of the witness points.
            var s1 = fcn.Evaluate(indexA[0], indexB[0], t1);
            // Check for initial overlap. This might happen if the root finder
            // runs out of iterations.
            if (s1 < (target - tolerance)) {
                output.state = b2TOIOutputState.e_failed;
                output.t = t1;
                done = true;
                break;
            }
            // Check for touching
            if (s1 <= (target + tolerance)) {
                // Victory! t1 should hold the TOI (could be 0.0).
                output.state = b2TOIOutputState.e_touching;
                output.t = t1;
                done = true;
                break;
            }
            // Compute 1D root of: f(x) - target = 0
            var rootIterCount = 0;
            var a1 = t1;
            var a2 = t2;
            for (;;) {
                // Use a mix of the secant rule and bisection.
                var t = 0;
                if (rootIterCount & 1) {
                    // Secant rule to improve convergence.
                    t = a1 + (target - s1) * (a2 - a1) / (s2 - s1);
                }
                else {
                    // Bisection to guarantee progress.
                    t = 0.5 * (a1 + a2);
                }
                ++rootIterCount;
                ++exports.b2_toiRootIters;
                var s = fcn.Evaluate(indexA[0], indexB[0], t);
                if (b2_math_js_1.b2Abs(s - target) < tolerance) {
                    // t2 holds a tentative value for t1
                    t2 = t;
                    break;
                }
                // Ensure we continue to bracket the root.
                if (s > target) {
                    a1 = t;
                    s1 = s;
                }
                else {
                    a2 = t;
                    s2 = s;
                }
                if (rootIterCount === 50) {
                    break;
                }
            }
            exports.b2_toiMaxRootIters = b2_math_js_1.b2Max(exports.b2_toiMaxRootIters, rootIterCount);
            ++pushBackIter;
            if (pushBackIter === maxVertices) {
                break;
            }
        }
        ++iter;
        ++exports.b2_toiIters;
        if (done) {
            break;
        }
        if (iter === k_maxIterations) {
            // Root finder got stuck. Semi-victory.
            output.state = b2TOIOutputState.e_failed;
            output.t = t1;
            break;
        }
    }
    exports.b2_toiMaxIters = b2_math_js_1.b2Max(exports.b2_toiMaxIters, iter);
    var time = timer.GetMilliseconds();
    exports.b2_toiMaxTime = b2_math_js_1.b2Max(exports.b2_toiMaxTime, time);
    exports.b2_toiTime += time;
}
exports.b2TimeOfImpact = b2TimeOfImpact;
