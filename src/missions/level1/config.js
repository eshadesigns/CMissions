export const powerManagementMission = {
  id: 'level-1-power-management',
  title: 'Level 1: Power Management',
  description: 'A spacecraft is preparing for launch with critically low avionics battery voltage. The flight computer cannot support every onboard system simultaneously.',
  objective: 'Implement load-shedding logic that keeps essential systems operational and disables non-essential loads below the safety threshold.',
  learningConcepts: [
    'C++ conditionals and boolean state',
    'Reading telemetry and controlling subsystem power',
    'Load shedding and prioritizing essential systems',
    'Systems thinking: software decisions affect spacecraft behavior',
  ],
  battery: {
    initialVoltage: 10.5,
    safetyThreshold: 11,
    illustrative: true,
    note: 'Illustrative teaching values only; not an engineering specification or physical battery model.',
  },
  subsystems: [
    { id: 'flight-computer', name: 'Flight computer', essential: true, poweredOn: true, operatingState: 'operational' },
    { id: 'altimeter', name: 'Altimeter', essential: true, poweredOn: true, operatingState: 'operational' },
    { id: 'camera', name: 'Camera', essential: false, poweredOn: true, operatingState: 'operational' },
    { id: 'telemetry-beacon', name: 'Telemetry beacon', essential: false, poweredOn: true, operatingState: 'operational' },
  ],
  successCondition: 'When voltage is below the configured threshold, essential systems remain powered and operational while non-essential systems are powered off. Mission validation is not implemented yet.',
};
