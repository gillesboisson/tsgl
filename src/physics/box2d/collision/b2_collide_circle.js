"use strict";
exports.__esModule = true;
exports.b2CollidePolygonAndCircle = exports.b2CollideCircles = void 0;
var b2_settings_js_1 = require("../common/b2_settings.js");
var b2_math_js_1 = require("../common/b2_math.js");
var b2_collision_js_1 = require("./b2_collision.js");
var b2CollideCircles_s_pA = new b2_math_js_1.b2Vec2();
var b2CollideCircles_s_pB = new b2_math_js_1.b2Vec2();
function b2CollideCircles(manifold, circleA, xfA, circleB, xfB) {
    manifold.pointCount = 0;
    var pA = b2_math_js_1.b2Transform.MulXV(xfA, circleA.m_p, b2CollideCircles_s_pA);
    var pB = b2_math_js_1.b2Transform.MulXV(xfB, circleB.m_p, b2CollideCircles_s_pB);
    var distSqr = b2_math_js_1.b2Vec2.DistanceSquaredVV(pA, pB);
    var radius = circleA.m_radius + circleB.m_radius;
    if (distSqr > radius * radius) {
        return;
    }
    manifold.type = b2_collision_js_1.b2ManifoldType.e_circles;
    manifold.localPoint.Copy(circleA.m_p);
    manifold.localNormal.SetZero();
    manifold.pointCount = 1;
    manifold.points[0].localPoint.Copy(circleB.m_p);
    manifold.points[0].id.key = 0;
}
exports.b2CollideCircles = b2CollideCircles;
var b2CollidePolygonAndCircle_s_c = new b2_math_js_1.b2Vec2();
var b2CollidePolygonAndCircle_s_cLocal = new b2_math_js_1.b2Vec2();
var b2CollidePolygonAndCircle_s_faceCenter = new b2_math_js_1.b2Vec2();
function b2CollidePolygonAndCircle(manifold, polygonA, xfA, circleB, xfB) {
    manifold.pointCount = 0;
    // Compute circle position in the frame of the polygon.
    var c = b2_math_js_1.b2Transform.MulXV(xfB, circleB.m_p, b2CollidePolygonAndCircle_s_c);
    var cLocal = b2_math_js_1.b2Transform.MulTXV(xfA, c, b2CollidePolygonAndCircle_s_cLocal);
    // Find the min separating edge.
    var normalIndex = 0;
    var separation = (-b2_settings_js_1.b2_maxFloat);
    var radius = polygonA.m_radius + circleB.m_radius;
    var vertexCount = polygonA.m_count;
    var vertices = polygonA.m_vertices;
    var normals = polygonA.m_normals;
    for (var i = 0; i < vertexCount; ++i) {
        var s = b2_math_js_1.b2Vec2.DotVV(normals[i], b2_math_js_1.b2Vec2.SubVV(cLocal, vertices[i], b2_math_js_1.b2Vec2.s_t0));
        if (s > radius) {
            // Early out.
            return;
        }
        if (s > separation) {
            separation = s;
            normalIndex = i;
        }
    }
    // Vertices that subtend the incident face.
    var vertIndex1 = normalIndex;
    var vertIndex2 = (vertIndex1 + 1) % vertexCount;
    var v1 = vertices[vertIndex1];
    var v2 = vertices[vertIndex2];
    // If the center is inside the polygon ...
    if (separation < b2_settings_js_1.b2_epsilon) {
        manifold.pointCount = 1;
        manifold.type = b2_collision_js_1.b2ManifoldType.e_faceA;
        manifold.localNormal.Copy(normals[normalIndex]);
        b2_math_js_1.b2Vec2.MidVV(v1, v2, manifold.localPoint);
        manifold.points[0].localPoint.Copy(circleB.m_p);
        manifold.points[0].id.key = 0;
        return;
    }
    // Compute barycentric coordinates
    var u1 = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(cLocal, v1, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.SubVV(v2, v1, b2_math_js_1.b2Vec2.s_t1));
    var u2 = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(cLocal, v2, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.SubVV(v1, v2, b2_math_js_1.b2Vec2.s_t1));
    if (u1 <= 0) {
        if (b2_math_js_1.b2Vec2.DistanceSquaredVV(cLocal, v1) > radius * radius) {
            return;
        }
        manifold.pointCount = 1;
        manifold.type = b2_collision_js_1.b2ManifoldType.e_faceA;
        b2_math_js_1.b2Vec2.SubVV(cLocal, v1, manifold.localNormal).SelfNormalize();
        manifold.localPoint.Copy(v1);
        manifold.points[0].localPoint.Copy(circleB.m_p);
        manifold.points[0].id.key = 0;
    }
    else if (u2 <= 0) {
        if (b2_math_js_1.b2Vec2.DistanceSquaredVV(cLocal, v2) > radius * radius) {
            return;
        }
        manifold.pointCount = 1;
        manifold.type = b2_collision_js_1.b2ManifoldType.e_faceA;
        b2_math_js_1.b2Vec2.SubVV(cLocal, v2, manifold.localNormal).SelfNormalize();
        manifold.localPoint.Copy(v2);
        manifold.points[0].localPoint.Copy(circleB.m_p);
        manifold.points[0].id.key = 0;
    }
    else {
        var faceCenter = b2_math_js_1.b2Vec2.MidVV(v1, v2, b2CollidePolygonAndCircle_s_faceCenter);
        var separation_1 = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(cLocal, faceCenter, b2_math_js_1.b2Vec2.s_t1), normals[vertIndex1]);
        if (separation_1 > radius) {
            return;
        }
        manifold.pointCount = 1;
        manifold.type = b2_collision_js_1.b2ManifoldType.e_faceA;
        manifold.localNormal.Copy(normals[vertIndex1]).SelfNormalize();
        manifold.localPoint.Copy(faceCenter);
        manifold.points[0].localPoint.Copy(circleB.m_p);
        manifold.points[0].id.key = 0;
    }
}
exports.b2CollidePolygonAndCircle = b2CollidePolygonAndCircle;
