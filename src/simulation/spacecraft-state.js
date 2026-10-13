// Copy configuration into independent mutable state; never mutate the mission definition.
export function createInitialSpacecraftState(mission) {
  return {
    batteryVoltage: mission.battery.initialVoltage,
    subsystems: mission.subsystems.map((subsystem) => ({ ...subsystem })),
  };
}
