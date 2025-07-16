import type { Label } from "../types";

export function getProgressBarColors(department: Label): { main: string; inProgress: string } {
    return {
        main: `label-${department.color}`,
        inProgress: `label-${department.color}-faded`
    }
}