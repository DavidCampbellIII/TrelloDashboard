import type { Label, ProgressBarColors, TaskProgressNoHours, TaskProgressResults, TaskProgressWithHours } from "../types";

export function getProgressBarColors(department?: Label): ProgressBarColors {
    if (!department) {
        return { completedColor: 'bg-magenta-500', inProgressColor: 'bg-magenta-400' };
    }

    if(department.name === 'all') {
        return {
            completedColor: 'bg-blue-600',
            inProgressColor: 'bg-blue-500'
        };
    }

    return {
        completedColor: `label-${department.color}`,
        inProgressColor: `label-${department.color}-faded`
    }
};

const DEFAULT_TASK_POINTS = 1;
export function calcTaskProgress(tasksWithHours: TaskProgressWithHours, 
    tasksNoHours: TaskProgressNoHours): TaskProgressResults
{
    const tasksInProgress = tasksWithHours.inProgress.numTasks + tasksNoHours.inProgress;
    const tasksCompleted = tasksWithHours.completed.numTasks + tasksNoHours.completed;
    const totalTasks = tasksInProgress + tasksCompleted + tasksWithHours.notStarted.numTasks + tasksNoHours.notStarted;

    const inProgressHours = tasksWithHours.inProgress.hours;
    const completedHours = tasksWithHours.completed.hours;
    const totalHours = tasksWithHours.notStarted.hours + inProgressHours + completedHours

    //if we have tasks with hours, use the average hours per task as the default points for the tasks WITHOUT hours
    const totalTasksWithHours = tasksWithHours.notStarted.numTasks + tasksWithHours.inProgress.numTasks + tasksWithHours.completed.numTasks;
    
    const averageHoursPerTask = totalTasksWithHours > 0 ? totalHours / totalTasksWithHours : DEFAULT_TASK_POINTS;
    const effectiveDefaultPoints = Math.max(averageHoursPerTask, 1);

    //calculate total points based on hours and tasks without hours
    const totalPointsFromHours = totalHours;
    const totalPointsFromTasks = (tasksNoHours.notStarted + tasksNoHours.inProgress + tasksNoHours.completed) * effectiveDefaultPoints;
    const totalPoints = totalPointsFromHours + totalPointsFromTasks;

    //calculate completed points
    const completedPointsFromHours = completedHours;
    const completedPointsFromTasks = tasksNoHours.completed * effectiveDefaultPoints;
    const totalCompletedPoints = completedPointsFromHours + completedPointsFromTasks;

    //calculate in-progress points
    const inProgressPointsFromHours = inProgressHours;
    const inProgressPointsFromTasks = tasksNoHours.inProgress * effectiveDefaultPoints;
    const totalInProgressPoints = inProgressPointsFromHours + inProgressPointsFromTasks;

    //calculate percentages
    const completedPercentage = totalPoints > 0 ? (totalCompletedPoints / totalPoints) * 100 : 0;
    const inProgressPercentage = totalPoints > 0 ? ((totalCompletedPoints + totalInProgressPoints) / totalPoints) * 100 : 0;

    return {
        tasksNotStarted: (totalTasks - tasksInProgress - tasksCompleted),
        tasksInProgress,
        tasksCompleted,
        totalTasks,

        hoursNotStarted: (totalHours - inProgressHours - completedHours),
        inProgressHours,
        completedHours,
        totalHours,

        totalPointsFromTasks,
        totalPointsFromHours,

        inProgressPercentage,
        completedPercentage
    }
};