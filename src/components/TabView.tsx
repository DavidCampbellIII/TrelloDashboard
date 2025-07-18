import { useState } from "react";
import DepartmentProgress from "./DepartmentProgress";
import SystemProgress from "./SystemProgress";
import DetailedBreakdown from "./DetailedBreakdown";
import clsx from "clsx";
import Filters from "./Filters";

export default function TabView() {
    const tabs = [
        { value: 'departments', label: 'Departments', view: 
        <>
            <Filters />
            <DepartmentProgress />
        </> },
        { value: 'systems', label: 'Systems', view: <SystemProgress /> },
        { value: 'detailed', label: 'Detailed Breakdown', view: <DetailedBreakdown /> },
    ]

    const [tab, setTab] = useState(tabs[0].value);

  return (
    <>
        <div className='flex flex-col gap-4 mt-4 mb-4 w-full justify-center'>
            <div className='flex gap-4 justify-center'>
                {tabs.map(t => (
                    <button
                        key={t.value}
                        className={clsx('px-4 py-2 text-lg font-semibold rounded-lg border-1 border-gray-600', {
                            'bg-blue-700/70 text-white': tab === t.value,
                            'text-gray-300 hover:bg-gray-500 hover:text-white': tab !== t.value
                        })}
                        onClick={() => setTab(t.value)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            
            <hr className='border-gray-600 border-1 w-full self-center flex' />
        </div>
        
        {tabs.find(t => t.value === tab)?.view}
    </>
  )
}