import type { ProgressBarData } from "../../types";
import { calcTaskProgress } from "../../util/utils";
import ProgressBar from "../ProgressBar";

type Props = {
    data: ProgressBarData;
};

export default function DetailedBreakdownProgressBar({ data }: Props) {
    const { 
        label, 
        colors, 
        tasksWithHours,
        tasksWithoutHours,
    } = data;

    const { tasksNotStarted, tasksCompleted, tasksInProgress, totalTasks,
        completedHours, totalHours,
        totalPointsFromTasks,
        completedPercentage, inProgressPercentage
    } = calcTaskProgress(tasksWithHours, tasksWithoutHours);

    const labelStart = (
        <h3 className='text-2xl'>
            {label}
        </h3>
    );

    const labelEnd = (
        <div className='flex gap-2 items-center'>
            <div className='flex rounded-xl bg-slate-700/70 h-min p-2 text-sm text-gray-300 border border-gray-600'>
                {tasksNotStarted} not started
            </div>
            <div className='flex rounded-xl bg-orange-800/50 h-min p-2 text-sm text-gray-300 border border-gray-600'>
                {tasksInProgress} in progress
            </div>
            <div className='flex rounded-xl bg-green-900/50 h-min p-2 text-sm text-gray-300 border border-gray-600'>
                {tasksCompleted} completed
            </div>
            <span className='text-2xl'>{completedPercentage.toFixed(1)}% completed</span>
        </div>
    )
    

    const footerStart = (
        <>
            {tasksCompleted} / {totalTasks} tasks <br />
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
        labelStart={labelStart}
        labelEnd={labelEnd}
        footerStart={footerStart}
        footerEnd={footerEnd}
        colors={colors}
        inProgressPercentage={inProgressPercentage}
        completedPercentage={completedPercentage}
    />
  )
}