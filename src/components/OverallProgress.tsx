import useBoard from "../hooks/useBoard";
import { calcTaskProgress } from "../util/utils";
import ProgressBar from "./ProgressBar";

export default function OverallProgress() {
    const { overallProgress } = useBoard('all', 'all');

    const { tasksCompleted, tasksInProgress, totalTasks,
            completedHours, totalHours,
            totalPointsFromTasks,
            completedPercentage, inProgressPercentage
        } = calcTaskProgress(overallProgress.tasksWithHours, overallProgress.tasksWithoutHours);
        
    
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
                    <> <br />+ {overallProgress.tasksWithoutHours.completed} tasks</>
                )}
            </>
        );

  return (
    <div className='card'>
        <h2 className='text-2xl font-semibold text-white mb-4'>Overall Progress</h2>
        <div className='flex flex-col gap-4'>
            {totalTasks > 0 ? (
                <div className='flex flex-col gap-4 text-white'>
                    <ProgressBar
                        labelStart='Completion:'
                        labelEnd={`${completedPercentage.toFixed(1)}% completed`}
                        footerStart={footerStart}
                        footerEnd={footerEnd}
                        colors={overallProgress.colors}
                        inProgressPercentage={inProgressPercentage}
                        completedPercentage={completedPercentage}
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