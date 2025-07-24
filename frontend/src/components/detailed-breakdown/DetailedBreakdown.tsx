import useBoard from "../../hooks/useBoard";
import DepartmentSystems from "./DepartmentSystems";
import DetailedBreakdownProgressBar from "./DetailedBreakdownProgressBar";

export default function DetailedBreakdown() {

    const { departmentProgress } = useBoard();

  return (
    <div className='card'>
        <h2 className='text-3xl font-semibold text-white mb-4'>Detailed Breakdown</h2>
        <div className='flex flex-col gap-4'>
            {departmentProgress.length > 0 ? departmentProgress.map(data => (
                <div 
                    key={data.label}
                    className='flex flex-col gap-4 rounded-lg border-1 border-gray-600/60 bg-gray-900/50'
                >
                    <DetailedBreakdownProgressBar
                        data={data}
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