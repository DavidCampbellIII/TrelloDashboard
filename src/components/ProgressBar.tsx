import type { Label } from "../types";
import { getProgressBarColors } from "../util/utils";

type Props = {
    department: Label;
    tasksNotStarted: number;
    tasksInProgress: number;
    tasksCompleted: number;
    inProgressHours: number;
    completedHours: number;
    totalHours: number;
};

export default function ProgressBar({
    department,
    tasksNotStarted,
    tasksInProgress,
    tasksCompleted,
    inProgressHours,
    completedHours,
    totalHours
}: Props) {
    const { main, inProgress } = getProgressBarColors(department);

    const totalTasks = tasksNotStarted + tasksInProgress + tasksCompleted;
    const completedHoursProgress = (completedHours / totalHours) * 100;
    const totalHoursProgress = ((completedHours + inProgressHours) / totalHours) * 100;

  return (
    <div className='flex flex-col gap-2'>
        <div className='flex justify-between text-white'>
            <h3 className='text-xl'>{department.name}</h3>
            <div className='text-lg'>{totalHoursProgress}% completed</div>
        </div>
        <div className={`relative bg-gray-600 w-full rounded-lg h-4 overflow-clip`}>
            <div 
                className={`${inProgress} rounded-lg h-full absolute top-0 left-0`}
                style={{ width: `${totalHoursProgress}%` }}
            ></div>
            <div 
                className={`${main} rounded-lg h-full z-10 absolute top-0 left-0 min-w-[10px]`}
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