import useBoard from "../hooks/useBoard";
import type { TaskProgressResults } from "../types";
import { ProgressBarVariant } from "../types/componentVariants";
import { calcTaskProgress } from "../util/utils";
import ProgressBar from "./ProgressBar";

export default function DepartmentsHighlights() {
    const { departmentProgress } = useBoard('all', 'all');

    const taskProgressByDepartment = departmentProgress.slice(0, 3).map(data => {
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
        </>
    );

    const footerEnd = (data: TaskProgressResults) => (
        <>
            {data.totalTasks - data.tasksCompleted} tasks remaining
        </>
    );

  return (
    <div className='card'>
        <h2 className='text-2xl font-semibold text-white mb-4'>Most Backlogged Department</h2>
        <div className='flex flex-col gap-4'>
            {departmentProgress && departmentProgress.length > 0 ? (
                <div className='flex flex-col gap-2 text-white'>
                    {taskProgressByDepartment.map((data) => (
                        <ProgressBar
                            key={data.label}
                            labelStart={data.label}
                            labelEnd={`${data.completedPercentage.toFixed()}%`}
                            footerStart={footerStart(data)}
                            footerEnd={footerEnd(data)}
                            colors={data.colors}
                            inProgressPercentage={data.inProgressPercentage}
                            completedPercentage={data.completedPercentage}
                            variant={ProgressBarVariant.Compact}
                        />
                    ))}
                    <div className='text-gray-500 text-xs mt-2'>
                        Showing top 3 of {departmentProgress.length}
                    </div>
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