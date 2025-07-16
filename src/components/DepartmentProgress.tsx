import useBoard from "../hooks/useBoard";
import useFilterStore from "../hooks/useFiltersStore";
import ProgressBar from "./ProgressBar";

export default function DepartmentProgress() {
    const { department, system } = useFilterStore();
    const { departmentProgress } = useBoard(department || '', system || '');

  return (
    <div className='card'>
        <h2 className='text-2xl font-semibold text-white mb-4'>Department Progress</h2>
        <div className='flex flex-col gap-4'>
            {department ? (
                <div className='text-white'>
                    <h3 className='text-xl font-semibold'>{department}</h3>
                    {departmentProgress.map(data => (
                        <ProgressBar
                            key={data.label}
                            data={data}
                        />
                    ))}
                </div> 
            ) : (
                <div className='text-gray-500'>
                    <p>Select a department to view progress</p>
                </div>
            )}
        </div>
    </div>
  )
}