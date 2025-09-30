export interface BatteryInputs {
    sideLoadAmp: number;
    desiredBBHrs: number;
    numBatteries: number;
    batteryChargingFactor: number;
    batteryCapacity: number;
    rectifierModule: number;
    cpCapacity: number;
}

export interface RowResult {
    parameter: string;
    design: string | number;
    actual: string | number;
    ok: string;
    difference: string | number;
}

export type Results = RowResult[];

// Main calculation function
export function calculateBattery(inputs: BatteryInputs): Results {
    // --- Design values ---
    const designBatteryCapacity = (inputs.sideLoadAmp * inputs.desiredBBHrs) / 0.8;
    const designRectifier =
        ((designBatteryCapacity * 0.25 + inputs.sideLoadAmp) * 50) / 1000;
    const designCP = designRectifier + 1;
    const designChargingFactor = 0.25;

    // --- Actual values ---
    const actualBatteryCapacity = inputs.batteryCapacity;
    const actualRectifier = inputs.rectifierModule;
    const actualCP = inputs.cpCapacity;
    const desiredBBHrs = inputs.desiredBBHrs;
    const actualBB = (inputs.batteryCapacity * 0.8) / inputs.sideLoadAmp;
    const actualChargingFactor = inputs.batteryChargingFactor;

    // Helper: OK check with tolerance (±5%)
    const isOk = (design: number, actual: number): string => {
        if (design === 0) return '-';
        const diff = actual - design;
        if (diff < 0) {
            return "Not Okay";
        } else if (diff >= 0) {
            return "OK";
        }
        // return "OK";
        return "-";
    };

    return [
        {
            parameter: "Battery Capacity (AH)",
            design: designBatteryCapacity.toFixed(2),
            actual: actualBatteryCapacity.toFixed(2),
            ok: isOk(designBatteryCapacity, actualBatteryCapacity),
            difference: (designBatteryCapacity - actualBatteryCapacity).toFixed(2),
        },
        {
            parameter: "Rectifier Module (KW)",
            design: designRectifier.toFixed(2),
            actual: actualRectifier.toFixed(2),
            ok: isOk(designRectifier, actualRectifier),
            difference: (designRectifier - actualRectifier).toFixed(2),
        },
        {
            parameter: "CP Capacity (KW)",
            design: designCP.toFixed(2),
            actual: actualCP.toFixed(2),
            ok: isOk(designCP, actualCP),
            difference: (designCP - actualCP).toFixed(2),
        },
        {
            parameter: "Battery BB (Hrs)",
            design: inputs.desiredBBHrs.toFixed(2),
            actual: actualBB.toFixed(2),
            ok: isOk(desiredBBHrs, actualBB),
            difference: (desiredBBHrs - actualBB).toFixed(2),
        },
        {
            parameter: "Battery Charging Factor",
            design: designChargingFactor.toFixed(2),
            actual: actualChargingFactor.toFixed(2),
            ok: isOk(designChargingFactor, actualChargingFactor),
            difference: (designChargingFactor - actualChargingFactor).toFixed(2),
        },
        {
            parameter: "CP",
            design: designCP.toFixed(2),
            actual: actualCP.toFixed(2),
            ok: isOk(designCP, actualCP),
            difference: (designCP - actualCP).toFixed(2),
        },
    ];
}
