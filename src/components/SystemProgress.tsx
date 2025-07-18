import useBoard from "../hooks/useBoard";
import type { TaskProgressResults } from "../types";
import { ProgressBarVariant } from "../types/componentVariants";
import { calcTaskProgress } from "../util/utils";
import ProgressBar from "./ProgressBar";

export default function SystemProgress() {
    const { systemsProgress } = useBoard('all', 'all');

    const taskProgressBySystem = systemsProgress.map(data => {
        const { 
            label, 
            colors, 
            tasksWithHours,
            tasksWithoutHours,
        } = data;

        return {
            label,
            colors,
            ...calcTaskProgress(tasksWithHours, tasksWithoutHours)
        };
    });

    const footerStart = (data: TaskProgressResults) => (
        <>
            {data.tasksCompleted} / {data.totalTasks} tasks <br />
            ({data.tasksInProgress} in progress)
        </>
    );

    const footerEnd = (data: TaskProgressResults) => (
        <>
            {data.completedHours} / {data.totalHours}hrs
            {data.totalPointsFromTasks > 0 && (
                <> <br />+ {data.tasksCompleted} tasks</>
            )}
        </>
    );

  return (
    <div className='card'>
        <h2 className='text-3xl font-semibold text-white mb-4'>Systems Progress</h2>
        <div className='flex flex-col gap-4'>
            {systemsProgress && systemsProgress.length > 0 ? (
                <div className='flex flex-col gap-2 text-white'>
                    {taskProgressBySystem.map((data) => (
                        <ProgressBar
                            key={data.label}
                            labelStart={data.label}
                            labelEnd={`${data.completedPercentage.toFixed()}% completed`}
                            footerStart={footerStart(data)}
                            footerEnd={footerEnd(data)}
                            colors={data.colors}
                            inProgressPercentage={data.inProgressPercentage}
                            completedPercentage={data.completedPercentage}
                            variant={ProgressBarVariant.Default}
                        />
                    ))}
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