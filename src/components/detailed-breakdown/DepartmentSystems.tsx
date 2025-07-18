import useBoard from "../../hooks/useBoard";
import type { TaskProgressResults } from "../../types";
import { ProgressBarVariant } from "../../types/componentVariants";
import { calcTaskProgress } from "../../util/utils";
import ProgressBar from "../ProgressBar";

type Props = {
    department: string;
}

export default function DepartmentSystems({ department }: Props) {
    const { systemsProgress } = useBoard(department, 'all');

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
    <div className='flex flex-col'>
        {
            systemsProgress.length > 0 && (
                <div className='flex flex-col gap-2 ml-4 p-4 border-1 rounded-lg'>
                    {taskProgressBySystem.map(data => (
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
                </div>
            )
        }
    </div> 
  )
}