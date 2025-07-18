import useBoard from "../../hooks/useBoard";
import useFilterStore from "../../hooks/useFiltersStore";
import DepartmentProgressBar from "./DepartmentProgressBar";
import DepartmentSharedTasks from "./DepartmentSharedTasks";

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
        if(department !== 'all' && departmentProgress.length === 0) {
            switch(system) {
                case 'all':
                    return `No progress found for ${department} department on any system`;
                case 'none':
                    return `No progress found for ${department} department with no system assigned`;
                default:
                    return `No progress found for ${department} department on ${system}`;
            }
        }
        return 'No departments are working on the selected system';
    }

    //filter out everything except the selected department
    //so we can display it first and indent all related departments underneath it
    const selectedDepartment = departmentProgress.find(data => data.label === department);
    const filteredDepartments = departmentProgress.filter(data => data.label !== department);

    const renderDepartmentProgress = () => (
        department === 'all' ? (
            <div className='flex flex-col gap-4'>
                {departmentProgress.map(data => (
                    <DepartmentProgressBar
                        key={data.label}
                        data={data}
                        verboseLabelEnd={true}
                    />
                ))}
            </div>
        )
        :
        (
            <DepartmentSharedTasks
                selectedDepartment={selectedDepartment!}
                sharedDepartments={filteredDepartments}
            />
        )
    );

  return (
    <div className='card'>
        <h2 className='text-2xl font-semibold text-white mb-4'>Department Progress</h2>
        <div className='flex flex-col gap-4'>
            {department && departmentProgress.length > 0 
            ? 
                renderDepartmentProgress()
            : (
                <div className='text-gray-500'>
                    <p>{getNoResultsMessage()}</p>
                </div>
            )}
        </div>
    </div>
  )
}