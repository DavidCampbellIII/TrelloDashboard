import useBoard from "../hooks/useBoard";
import type { TaskProgressResults } from "../types";
import { calcTaskProgress } from "../util/utils";
import ProgressBar from "./ProgressBar";

export default function SystemsHighlights() {
  const { systemsProgress } = useBoard('all', 'all');

    const taskProgressByDepartment = systemsProgress.slice(0, 3).map(data => {
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
            {data.totalTasks - data.tasksCompleted} tasks remaining
        </>
    );

  return (
    <div className='card'>
        <h2 className='text-2xl font-semibold text-white mb-4'>Most Backlogged System</h2>
        <div className='flex flex-col gap-4'>
            {systemsProgress && systemsProgress.length > 0 ? (
                <div className='flex flex-col gap-4 text-white'>
                    {taskProgressByDepartment.map((data) => (
                        <ProgressBar
                            key={data.label}
                            labelStart={data.label}
                            labelEnd={`${data.completedPercentage.toFixed(1)}% completed`}
                            footerStart={footerStart(data)}
                            footerEnd={footerEnd(data)}
                            colors={data.colors}
                            inProgressPercentage={data.inProgressPercentage}
                            completedPercentage={data.completedPercentage}
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