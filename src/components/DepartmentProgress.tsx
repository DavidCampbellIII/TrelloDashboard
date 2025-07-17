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

    //filter out everything except the selected department
    //so we can display it first and indent all related departments underneath it
    const selectedDepartment = departmentProgress.find(data => data.label === department);
    const filteredDepartments = departmentProgress.filter(data => data.label !== department);

  return (
    <div className='card'>
        <h2 className='text-2xl font-semibold text-white mb-4'>Department Progress</h2>
        <div className='flex flex-col gap-4'>
            {department && departmentProgress.length > 0 ? 
                department === 'all' ? (
                    <div className='flex flex-col gap-4'>
                        {departmentProgress.map(data => (
                            <DepartmentProgressBar
                                key={data.label}
                                data={data}
                            />
                        ))}
                    </div>
                )
                :
                (
                <div className='flex flex-col'>
                    {selectedDepartment && (
                        <DepartmentProgressBar
                            data={selectedDepartment}
                        />
                    )}
                    <hr className='flex self-center w-full border-gray-600 my-4 bg-red-500' />
                    <h3 className='text-lg font-semibold text-white mb-2'>Sharing Tasks With</h3>
                    <div className='flex flex-col gap-4 ml-4 p-4 border-1 bg-gray-700/70 rounded-lg'>
                        {filteredDepartments.map(data => (
                            <DepartmentProgressBar
                                key={data.label}
                                data={data}
                            />
                        ))}
                    </div>
                    
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