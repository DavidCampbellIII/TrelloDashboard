import useBoard from "../../hooks/useBoard";
import DepartmentProgressBar from "../department-progress/DepartmentProgressBar";
import DepartmentSystems from "./DepartmentSystems";

export default function DetailedBreakdown() {

    const { departmentProgress } = useBoard();

    //TODO use these chips
    // <div className='flex gap-2'>
    //                         <div className='flex rounded-xl bg-slate-700/70 p-2 text-gray-300 border border-gray-600'>
    //                             {tasksNotStarted} not started
    //                         </div>
    //                         <div className='flex rounded-xl bg-orange-800/50 p-2 text-gray-300 border border-gray-600'>
    //                             {tasksInProgress} in progress
    //                         </div>
    //                         <div className='flex rounded-xl bg-green-900/50 p-2 text-gray-300 border border-gray-600'>
    //                             {tasksCompleted} completed
    //                         </div>
    //                     </div>

  return (
    <div className='card'>
        <h2 className='text-3xl font-semibold text-white mb-4'>Detailed Breakdown</h2>
        <div className='flex flex-col gap-4'>
            {departmentProgress.length > 0 ? departmentProgress.map(data => (
                <div 
                    key={data.label}
                    className='flex flex-col gap-4 rounded-lg border-1 border-gray-600/60 bg-gray-900/50'
                >
                    <DepartmentProgressBar
                        data={data}
                        verboseLabelEnd={true}
                    />
                    <DepartmentSystems 
                        department={data.label}
                    />
                </div>
            ))
            :
            (
                <div className='text-gray-500'>
                    <p>No departments found</p>
                </div>        
            )}
        </div>
    </div>
  )
}