import useBoard from "../hooks/useBoard";
import { ProgressBarVariant } from "../types/componentVariants";
import { calcTaskProgress } from "../util/utils";
import ProgressBar from "./ProgressBar";

export default function OverallProgress() {
    const { overallProgress } = useBoard('all', 'all');

    const { tasksCompleted, tasksInProgress, totalTasks,
            inProgressHours, completedHours, totalHours,
            completedPercentage, inProgressPercentage
        } = calcTaskProgress(overallProgress.tasksWithHours, overallProgress.tasksWithoutHours);

    const tasksCompletedPercentage = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;
    //add completion percentage to get the total percentage value
    const tasksInProgressPercentage = (totalTasks > 0 ? (tasksInProgress / totalTasks) * 100 : 0) + tasksCompletedPercentage;

    const hoursCompletedPercentage = totalHours > 0 ? (completedHours / totalHours) * 100 : 0;
    //add completion percentage to get the total percentage value
    const hoursInProgressPercentage = (totalHours > 0 ? (inProgressHours / totalHours) * 100 : 0) + hoursCompletedPercentage;

  return (
    <div className='card'>
        <h2 className='text-3xl font-semibold text-white mb-4'>Overall Progress</h2>
        <div className='flex flex-col gap-4'>
            {totalTasks > 0 ? (
                <div className='flex flex-col gap-4 text-white'>
                    <ProgressBar
                        labelStart="Total Project Completion"
                        labelEnd={`${completedPercentage.toFixed(2)}% complete`}
                        colors={overallProgress.colors}
                        inProgressPercentage={inProgressPercentage}
                        completedPercentage={completedPercentage}
                        variant={ProgressBarVariant.Default}
                        barHeight="h-6 mt-2"
                    />

                    <ProgressBar
                        labelStart="Tasks"
                        labelEnd={`${tasksCompletedPercentage.toFixed(2)}% complete`}
                        colors={overallProgress.colors}
                        inProgressPercentage={tasksInProgressPercentage}
                        completedPercentage={tasksCompletedPercentage}
                        variant={ProgressBarVariant.Compact}
                        barHeight="h-6 mt-2"
                    />

                    <ProgressBar
                        labelStart="Hours"
                        labelEnd={`${hoursCompletedPercentage.toFixed(2)}% complete`}
                        colors={overallProgress.colors}
                        inProgressPercentage={hoursInProgressPercentage}
                        completedPercentage={hoursCompletedPercentage}
                        variant={ProgressBarVariant.Compact}
                        barHeight="h-6 mt-2"
                    />
                    
                </div>
            ) : (
                <div className='text-gray-500'>
                    <p>No tasks found</p>
                </div>
            )}
        </div>
    </div>
  )
}