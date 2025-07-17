import type { ReactNode } from "react";
import type { ProgressBarColors } from "../types";

type Props = {
    labelStart: string;
    labelEnd: string;
    footerStart?: ReactNode;
    footerEnd?: ReactNode;
    colors: ProgressBarColors;
    inProgressPercentage: number;
    completedPercentage: number;
}

export default function ProgressBar({
    labelStart,
    labelEnd,
    footerStart,
    footerEnd,
    colors,
    inProgressPercentage,
    completedPercentage
}: Props) {
  return (
    <div className='flex flex-col'>
        <div className='flex justify-between text-white'>
            <h3 className='text-xl'>{labelStart}</h3>
            <div className='text-lg'>{labelEnd}</div>
        </div>
        <div className={`relative bg-gray-600 w-full rounded-lg h-4  mt-2 mb-1 overflow-clip`}>
            <div 
                className={`${colors.inProgressColor} rounded-lg h-full absolute top-0 left-0`}
                style={{ width: `${inProgressPercentage}%` }}
            ></div>
            <div 
                className={`${colors.completedColor} rounded-lg h-full z-10 absolute top-0 left-0 min-w-[10px]`}
                style={{ width: `${completedPercentage}%` }}
            ></div>
        </div>
        <div className='flex justify-between text-xs text-gray-400'>
            <span>
                {footerStart}
            </span>
            <span className='text-right'>
                {footerEnd}
            </span>
        </div>
    </div>
  )
}