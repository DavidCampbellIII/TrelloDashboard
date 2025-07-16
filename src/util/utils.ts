import type { Label, ProgressBarColors } from "../types";

export function getProgressBarColors(department?: Label): ProgressBarColors {
    if (!department) {
        return { completedColor: 'bg-magenta-500', inProgressColor: 'bg-magenta-400' };
    }

    return {
        completedColor: `label-${department.color}`,
        inProgressColor: `label-${department.color}-faded`
    }
}