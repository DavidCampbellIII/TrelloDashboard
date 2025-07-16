import type { ProgressBarData } from "../types";

type Props = {
    data: ProgressBarData;
};

export default function ProgressBar({ data }: Props) {
    const { label, colors, tasksNotStarted, tasksInProgress, tasksCompleted, completedHours, inProgressHours, totalHours } = data;

    console.log(`Rendering ProgressBar for ${label} with data:`, data);

    const totalTasks = tasksNotStarted + tasksInProgress + tasksCompleted;
    const completedHoursProgress = (completedHours / totalHours) * 100;
    const totalHoursProgress = ((completedHours + inProgressHours) / totalHours) * 100;

  return (
    <div className='flex flex-col gap-2'>
        <div className='flex justify-between text-white'>
            <h3 className='text-xl'>{label}</h3>
            <div className='text-lg'>{completedHoursProgress.toFixed(1)}% completed</div>
        </div>
        <div className={`relative bg-gray-600 w-full rounded-lg h-4 overflow-clip`}>
            <div 
                className={`${colors.inProgressColor} rounded-lg h-full absolute top-0 left-0`}
                style={{ width: `${totalHoursProgress}%` }}
            ></div>
            <div 
                className={`${colors.completedColor} rounded-lg h-full z-10 absolute top-0 left-0 min-w-[10px]`}
                style={{ width: `${completedHoursProgress}%` }}
            ></div>
        </div>
        <div className='flex justify-between text-xs text-gray-400'>
            <span>
                {tasksCompleted} / {totalTasks} tasks <br />
                ({tasksInProgress} in progress)
            </span>
            <span>
                {completedHours} / {totalHours}hrs
            </span>
        </div>
    </div>
  )
}