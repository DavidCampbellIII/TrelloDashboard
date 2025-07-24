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

    const chipSizing = 'text-xs sm:text-sm';

    const taskProgressChips = (<>
        <div className={`flex rounded-xl bg-slate-700/70 h-min p-2 ${chipSizing} text-center text-gray-300 border border-gray-600`}>
            {tasksNotStarted} not started
        </div>
        <div className={`flex rounded-xl bg-orange-800/50 h-min p-2 ${chipSizing} text-center text-gray-300 border border-gray-600`}>
            {tasksInProgress} in progress
        </div>
        <div className={`flex rounded-xl bg-green-900/50 h-min p-2 ${chipSizing} text-center text-gray-300 border border-gray-600`}>
            {tasksCompleted} completed
        </div>
    </>)

    const labelEnd = (
        <div className='flex gap-2 items-center w-full justify-end'>
            {/* <span className='hidden lg:flex gap-2'>{taskProgressChips}</span> */}
            <div className='text-2xl'>
                <span className='w-min'>{completedPercentage.toFixed(1)}% completed</span>
                <div className='flex flex-wrap gap-2 mt-2 w-full justify-end'>
                    {taskProgressChips}
                </div>
            </div>
        </div>
    );

    const labelStart = (<>
        <div className='text-2xl'>
            {label}
        </div>
        <div className='justify-right md:hidden text-right w-full'>
            {labelEnd}
        </div>
    </>);
    

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
        labelEnd={<div className='hidden md:flex'>{labelEnd}</div>}
        footerStart={footerStart}
        footerEnd={footerEnd}
        colors={colors}
        inProgressPercentage={inProgressPercentage}
        completedPercentage={completedPercentage}
    />
  )
}