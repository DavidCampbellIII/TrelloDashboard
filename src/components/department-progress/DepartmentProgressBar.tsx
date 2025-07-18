import type { ProgressBarData } from "../../types";
import { ProgressBarVariant } from "../../types/componentVariants";
import { calcTaskProgress } from "../../util/utils";
import ProgressBar from "../ProgressBar";

type Props = {
    data: ProgressBarData;
    variant?: ProgressBarVariant;
};

export default function DepartmentProgressBar({ data, variant = ProgressBarVariant.Default }: Props) {
    const { 
        label, 
        colors, 
        tasksWithHours,
        tasksWithoutHours,
    } = data;

    const { tasksCompleted, tasksInProgress, totalTasks,
        completedHours, totalHours,
        totalPointsFromTasks,
        completedPercentage, inProgressPercentage
    } = calcTaskProgress(tasksWithHours, tasksWithoutHours);
    

    const footerStart = (
        <>
            {tasksCompleted} / {totalTasks} tasks <br />
            ({tasksInProgress} in progress)
        </>
    );

    const footerEnd = (
        <>
            {completedHours} / {totalHours}hrs
            {totalPointsFromTasks > 0 && (
                <> <br />+ {tasksWithoutHours.completed} tasks</>
            )}
        </>
    );

  return (
    <ProgressBar 
        labelStart={label}
        labelEnd={`${completedPercentage.toFixed(1)}% completed`}
        footerStart={footerStart}
        footerEnd={footerEnd}
        colors={colors}
        inProgressPercentage={inProgressPercentage}
        completedPercentage={completedPercentage}
        variant={variant}
    />
  )
}