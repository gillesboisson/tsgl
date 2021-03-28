// import { vec2, vec4 } from 'gl-matrix';
// import { b2Vec2 } from '../../physics/box2d/common/b2_math';
// import { b2Body } from '../../physics/box2d/dynamics/b2_body';
// import { clamp } from '../../physics/math';
// import {  GameInputController } from '../../tsgl/input/_GameInput';

// const boatDirectionNormal = new b2Vec2();
// const boatDriftNormal = new b2Vec2();

// const playerForce = new b2Vec2();

// const throttleV = new b2Vec2();
// const driftV = new b2Vec2();
// const v3 = new b2Vec2();

// let throttleAngle = 0.0; // use for boat angle
// let throttleAngleV = 0.0; // use for boat angle

// const tMaxV = 0.05;
// const tMinV = -tMaxV;
// const tAcc = 0.0003;

// const BREAK_VELOCITY_THRESHOLD = 1;
// let breakState = false;
// let accSmooth = 0;
// const smoothBoatPositionV = vec2.create();

// const inputState = new GameInputController('keyboard');


// export default {
//   vegetationInfluence: vec4.create(),
//   engineState: 0,
//   smoothEngineState: 0,
//   driftV: driftV,
//   throttleV: throttleV,
//   directionalAxe: 0,
//   fowardAxe: 0,
//   releaseLinearDamping: 0,
//   breakLinearDamping: 2,
//   directionTorque: 7,
//   forwardForce: 25,
//   backwardForce: 20,
//   alignRatio: 0.03,
//   speedInfo: 0,
//   springSpeed: 0,
//   inputEnabled: true,
//   smoothBoatPosition: vec4.fromValues(0, 0, 0, 1),

//   pressBreak(boat: b2Body): void {
//     boat.SetLinearDamping(this.breakLinearDamping);
//     breakState = true;
//   },
//   releaseBreak(boat: b2Body): void {
//     boat.SetLinearDamping(this.releaseLinearDamping);
//     breakState = false;
//   },
//   resetBoatPosition(boat: b2Body): void{
//     const boatPos = boat.GetPosition();

//     this.smoothBoatPosition[0] = boatPos.x;
//     this.smoothBoatPosition[1] = boatPos.y;

//     smoothBoatPositionV[0] = 0;
//     smoothBoatPositionV[1] = 0;
//   },
//   update(boat: b2Body): void {
//     const angle = boat.GetAngle();

//     boatDirectionNormal.x = Math.cos(angle);
//     boatDirectionNormal.y = Math.sin(angle);

//     boatDriftNormal.x = Math.cos(angle + Math.PI / 2);
//     boatDriftNormal.y = Math.sin(angle + Math.PI / 2);

//     const boatSpeedV = boat.GetLinearVelocity();
//     const scalar = boatDirectionNormal.ScalarProduct(boatSpeedV);

//     let speed = 0;
//     let directionS = scalar / 3 + (scalar >= 0 ? 5 : 0);

//     if (this.releaseLinearDamping === 0) this.releaseLinearDamping = boat.GetLinearDamping();

//     if (directionS > this.directionTorque) directionS = this.directionTorque;
//     else if (directionS < -this.directionTorque) directionS = -this.directionTorque;

//     // gameInput.updateState(inputState);

//     // if(gameInput.controlType === 3 )
//     //   debugger;

//     // console.log('inputState : ', inputState);

//     // const speedSC = boatSpeedV.Length;

//     if (this.inputEnabled) {
//       if (inputState.d_pad_left) {
//         boat.ApplyTorque(directionS);
//       } else if (inputState.d_pad_right) {
//         boat.ApplyTorque(-directionS);
//       }

//       if (inputState.d_pad_up || inputState.d_pad_down || inputState.button_3 || inputState.button_1) {
//         if (inputState.d_pad_up || inputState.button_3) {
//           // if(scalar < -BREAK_VELOCITY_THRESHOLD){
//           //   if(!breakState) this.pressBreak(boat);
//           // }else {
//           if (breakState) this.releaseBreak(boat);

//           speed = this.forwardForce;
//           this.engineState = 1;
//           // }
//         } else {
//           if (scalar > BREAK_VELOCITY_THRESHOLD) {
//             if (!breakState) this.pressBreak(boat);
//           } else {
//             if (breakState) this.releaseBreak(boat);
//             speed = -this.backwardForce;
//             this.engineState = -0.7;
//           }
//         }

//         playerForce.x = boatDirectionNormal.x * speed;
//         playerForce.y = boatDirectionNormal.y * speed;

//         boat.ApplyForce(playerForce, boat.GetWorldCenter());
//       } else this.engineState = 0;

//       throttleAngleV += tAcc * (inputState.d_pad_up ? 1 : -1);
//     } else this.engineState = 0;

//     throttleAngleV = clamp(throttleAngleV, tMinV, tMaxV);

//     throttleAngle += throttleAngleV;

//     throttleAngle = clamp(throttleAngle, 0, 1);

//     this.smoothEngineState += (this.engineState - this.smoothEngineState) / 20;

//     // fix boat trajectory

//     // var boatSpeedV = boat.GetLinearVelocity();
//     // var scalar = boatDirectionNormal.ScalarProduct(boatSpeedV);

//     this.driftRatio = 1 - this.alignRatio;
//     this.speedScalar = scalar;
//     this.driftScalar = boatDriftNormal.ScalarProduct(boatSpeedV);

//     throttleV.x = scalar * boatDirectionNormal.x;
//     throttleV.y = scalar * boatDirectionNormal.y;

//     driftV.x = boatSpeedV.x - throttleV.x;
//     driftV.y = boatSpeedV.y - throttleV.y;

//     v3.x = this.alignRatio * throttleV.x + this.driftRatio * boatSpeedV.x;
//     v3.y = this.alignRatio * throttleV.y + this.driftRatio * boatSpeedV.y;

//     boat.SetLinearVelocity(v3);

//     // boat.model.transform.rotation[0] = this.driftScalar * 0.05;
//     // boat.model.transform.rotation[1] = -throttleAngle * 0.5;

//     this.speedInfo = scalar;

//     accSmooth += ((Math.abs(scalar) - this.springSpeed) * 0.1 - accSmooth) * 0.1;

//     this.springSpeed += accSmooth;

//     const pos = boat.GetPosition();

//     smoothBoatPositionV[0] += (pos.x - this.smoothBoatPosition[0] - smoothBoatPositionV[0]) * 0.02;
//     smoothBoatPositionV[1] += (pos.y - this.smoothBoatPosition[1] - smoothBoatPositionV[1]) * 0.02;

//     this.smoothBoatPosition[0] += smoothBoatPositionV[0];
//     this.smoothBoatPosition[1] += smoothBoatPositionV[1];

//     // if(this.springSpeed < 0)
//     //   this.springSpeed = 0;
//     // console.log('accSmooth : ', this.springSpeed);

//     // vegetation infuence

//     //vegetationInfluenceDelta[0] +=
//   },
// };
