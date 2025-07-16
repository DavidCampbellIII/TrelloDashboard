import useFilterStore from "../hooks/useFiltersStore";
import ProgressBar from "./ProgressBar";

export default function DepartmentProgress() {
    const { department } = useFilterStore();

  return (
    <div className='card'>
        <h2 className='text-2xl font-semibold text-white mb-4'>Department Progress</h2>
        <div className='flex flex-col gap-4'>
            {department ? (
                <div className='text-white'>
                    <h3 className='text-xl font-semibold'>{department.name}</h3>
                    </div> 
            ) : (
                <div className='text-gray-500'>
                    <p>Select a department to view progress</p>
                </div>
            )}
            {department && <ProgressBar 
                department={department}
                tasksNotStarted={50}
                tasksInProgress={5}
                tasksCompleted={45}
                inProgressHours={25}
                completedHours={50}
                totalHours={100}
            />}
        </div>
    </div>
  )
}