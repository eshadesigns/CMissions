import test from 'node:test';
import assert from 'node:assert/strict';
import { powerManagementMission as mission } from '../src/missions/level1/config.js';
import { createInitialSpacecraftState } from '../src/simulation/spacecraft-state.js';

test('Level 1 contains mission information and explicitly illustrative battery settings', () => {
  assert.equal(mission.id, 'level-1-power-management');
  assert.equal(mission.title, 'Level 1: Power Management');
  for (const key of ['description', 'objective', 'successCondition']) {
    assert.ok(mission[key].length > 0);
  }
  assert.ok(mission.learningConcepts.length > 0);
  assert.ok(mission.learningConcepts.some((concept) => concept.includes('C++')));
  assert.equal(mission.battery.illustrative, true);
  assert.ok(Number.isFinite(mission.battery.initialVoltage));
  assert.ok(mission.battery.initialVoltage < mission.battery.safetyThreshold);
  assert.equal(new Set(mission.subsystems.map((system) => system.id)).size, mission.subsystems.length);
});

test('initial state represents essential and non-essential powered operational systems', () => {
  const state = createInitialSpacecraftState(mission);
  assert.equal(state.batteryVoltage, mission.battery.initialVoltage);
  assert.deepEqual(state.subsystems.filter((system) => system.essential).map((system) => system.id), ['flight-computer', 'altimeter']);
  assert.deepEqual(state.subsystems.filter((system) => !system.essential).map((system) => system.id), ['camera', 'telemetry-beacon']);
  for (const system of state.subsystems) {
    assert.equal(system.poweredOn, true);
    assert.equal(system.operatingState, 'operational');
    assert.equal(typeof system.essential, 'boolean');
  }
});

test('state changes do not mutate configuration or other initialized instances', () => {
  const first = createInitialSpacecraftState(mission);
  const second = createInitialSpacecraftState(mission);
  first.batteryVoltage = 0;
  first.subsystems[2].poweredOn = false;
  first.subsystems[2].operatingState = 'offline';
  assert.equal(second.batteryVoltage, mission.battery.initialVoltage);
  assert.equal(second.subsystems[2].poweredOn, true);
  assert.equal(mission.subsystems[2].poweredOn, true);
  assert.equal(mission.subsystems[2].operatingState, 'operational');
});

test('initialization respects custom voltage and subsystem defaults', () => {
  const customMission = {
    ...mission,
    battery: { ...mission.battery, initialVoltage: 12, safetyThreshold: 13 },
    subsystems: [{ id: 'test-load', name: 'Test load', essential: false, poweredOn: false, operatingState: 'offline' }],
  };
  const state = createInitialSpacecraftState(customMission);
  assert.equal(state.batteryVoltage, 12);
  assert.deepEqual(state.subsystems, customMission.subsystems);
  assert.notEqual(state.subsystems[0], customMission.subsystems[0]);
});
