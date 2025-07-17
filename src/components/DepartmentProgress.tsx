import useBoard from "../hooks/useBoard";
import useFilterStore from "../hooks/useFiltersStore";
import DepartmentProgressBar from "./DepartmentProgressBar";

export default function DepartmentProgress() {
    const { department, system } = useFilterStore();
    const { departmentProgress } = useBoard(department || '', system || '');

    const getNoResultsMessage = () => {
        if (!department) {
            return 'Select a department to view progress';
        }
        if (!system) {
            return 'Select a system to filter progress';
        }
        return 'No departments are working on the selected system';
    }

  return (
    <div className='card'>
        <h2 className='text-2xl font-semibold text-white mb-4'>Department Progress</h2>
        <div className='flex flex-col gap-4'>
            {department && departmentProgress.length > 0 ? (
                <div className='flex flex-col gap-4 text-white'>
                    <h3 className='text-xl font-semibold'>{department}</h3>
                    {departmentProgress.map(data => (
                        <DepartmentProgressBar
                            key={data.label}
                            data={data}
                        />
                    ))}
                </div> 
            ) : (
                <div className='text-gray-500'>
                    <p>{getNoResultsMessage()}</p>
                </div>
            )}
        </div>
    </div>
  )
}