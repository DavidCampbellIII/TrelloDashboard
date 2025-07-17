import type { ProgressBarData } from "../types";
import ProgressBar from "./ProgressBar";

const DEFAULT_TASK_POINTS = 1;

type Props = {
    data: ProgressBarData;
};

export default function DepartmentProgressBar({ data }: Props) {
    const { 
        label, 
        colors, 
        tasksWithHours,
        tasksWithoutHours,
    } = data;

    console.log(`Rendering ProgressBar for ${label} with data:`, data);

    const tasksInProgress = tasksWithHours.inProgress.numTasks + tasksWithoutHours.inProgress;
    const tasksCompleted = tasksWithHours.completed.numTasks + tasksWithoutHours.completed;
    const totalTasks = tasksInProgress + tasksCompleted + tasksWithHours.notStarted.numTasks + tasksWithoutHours.notStarted;

    const inProgressHours = tasksWithHours.inProgress.hours;
    const completedHours = tasksWithHours.completed.hours;
    const totalHours = tasksWithHours.notStarted.hours + inProgressHours + completedHours

    //if we have tasks with hours, use the average hours per task as the default points for the tasks WITHOUT hours
    const totalTasksWithHours = tasksWithHours.notStarted.numTasks + tasksWithHours.inProgress.numTasks + tasksWithHours.completed.numTasks;
    
    const averageHoursPerTask = totalTasksWithHours > 0 ? totalHours / totalTasksWithHours : DEFAULT_TASK_POINTS;
    const effectiveDefaultPoints = Math.max(averageHoursPerTask, 1);

    //calculate total points based on hours and tasks without hours
    const totalPointsFromHours = totalHours;
    const totalPointsFromTasks = (tasksWithoutHours.notStarted + tasksWithoutHours.inProgress + tasksWithoutHours.completed) * effectiveDefaultPoints;
    const totalPoints = totalPointsFromHours + totalPointsFromTasks;

    //calculate completed points
    const completedPointsFromHours = completedHours;
    const completedPointsFromTasks = tasksWithoutHours.completed * effectiveDefaultPoints;
    const totalCompletedPoints = completedPointsFromHours + completedPointsFromTasks;

    //calculate in-progress points
    const inProgressPointsFromHours = inProgressHours;
    const inProgressPointsFromTasks = tasksWithoutHours.inProgress * effectiveDefaultPoints;
    const totalInProgressPoints = inProgressPointsFromHours + inProgressPointsFromTasks;

    //calculate percentages
    const completedPercentage = totalPoints > 0 ? (totalCompletedPoints / totalPoints) * 100 : 0;
    const inProgressPercentage = totalPoints > 0 ? ((totalCompletedPoints + totalInProgressPoints) / totalPoints) * 100 : 0;

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
    />
  )
}