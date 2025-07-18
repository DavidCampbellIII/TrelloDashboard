import type { ReactNode } from "react";
import type { ProgressBarColors } from "../types";
import clsx from "clsx";
import { ProgressBarVariant } from "../types/componentVariants";

type Props = {
    labelStart?: string;
    labelEnd?: string;
    footerStart?: ReactNode;
    footerEnd?: ReactNode;
    colors: ProgressBarColors;
    inProgressPercentage: number;
    completedPercentage: number;
    variant?: ProgressBarVariant;
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
    variant = ProgressBarVariant.Default,
    barHeight,
}: Props) {
    const getBarHeight = () => {
        if (barHeight) return barHeight;
        return variant === ProgressBarVariant.Default ? 'h-4 mt-2' : 'h-2 mt-1';
    };

  return (
    <div className={clsx('flex flex-col rounded-md bg-gray-900', {
        'shadow-md p-4': variant === ProgressBarVariant.Default,
        'shadow-sm p-2': variant === ProgressBarVariant.Compact,
    })}>
        <div className='flex justify-between text-white'>
            <h3 className={clsx('text-left', {
                'text-xl font-semibold': variant === ProgressBarVariant.Default,
                'text-lg': variant === ProgressBarVariant.Compact
            })}>{labelStart}</h3>
            <div className={clsx('text-right', {
                'text-lg font-semibold': variant === ProgressBarVariant.Default,
                'text-base': variant === ProgressBarVariant.Compact
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
            'text-sm': variant === ProgressBarVariant.Default,
            'text-xs': variant === ProgressBarVariant.Compact
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