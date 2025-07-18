import type { ReactNode } from "react";
import type { ProgressBarColors } from "../types";
import clsx from "clsx";

type Props = {
    labelStart?: string;
    labelEnd?: string;
    footerStart?: ReactNode;
    footerEnd?: ReactNode;
    colors: ProgressBarColors;
    inProgressPercentage: number;
    completedPercentage: number;
    variant?: 'default' | 'compact';
    barHeight?: string;
}

export default function ProgressBar({
    labelStart,
    labelEnd,
    footerStart,
    footerEnd,
    colors,
    inProgressPercentage,
    completedPercentage,
    variant = 'default',
    barHeight,
}: Props) {
    const getBarHeight = () => {
        if (barHeight) return barHeight;
        return variant === 'default' ? 'h-4 mt-2' : 'h-2 mt-1';
    };

  return (
    <div className='flex flex-col'>
        <div className='flex justify-between text-white'>
            <h3 className={clsx({
                'text-xl font-semibold': variant === 'default',
                'text-lg': variant === 'compact'
            })}>{labelStart}</h3>
            <div className={clsx({
                'text-lg font-semibold': variant === 'default',
                'text-base': variant === 'compact'
            })}>{labelEnd}</div>
        </div>
        <div className={clsx(`relative bg-gray-600 w-full rounded-lg mb-1 overflow-clip`, 
            getBarHeight())}
        >
            <div 
                className={`${colors.inProgressColor} rounded-lg h-full absolute top-0 left-0`}
                style={{ width: `${inProgressPercentage}%` }}
            ></div>
            <div 
                className={`${colors.completedColor} rounded-lg h-full z-10 absolute top-0 left-0 min-w-[10px]`}
                style={{ width: `${completedPercentage}%` }}
            ></div>
        </div>
        <div className={clsx('flex justify-between text-gray-400', {
            'text-sm': variant === 'default',
            'text-xs': variant === 'compact'
        })}>
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