import type { ProgressBarData } from "../../types";
import { ProgressBarVariant } from "../../types/componentVariants";
import DepartmentProgressBar from "./DepartmentProgressBar";

type Props = {
    selectedDepartment: ProgressBarData;
    sharedDepartments: ProgressBarData[];
}

export default function DepartmentSharedTasks({ selectedDepartment, sharedDepartments }: Props) {

  return (
    <div className='flex flex-col'>
        {selectedDepartment && (
            <DepartmentProgressBar
                data={selectedDepartment}
            />
        )}
        {
            sharedDepartments.length > 0 && (<>
                <hr className='flex self-center w-full border-gray-600 my-4' />
                <h3 className='text-xl font-semibold text-white mb-2 ml-4'>Sharing Tasks With</h3>
                <div className='flex flex-col gap-2 ml-4 p-4 border-1 rounded-lg'>
                    {sharedDepartments.map(data => (
                        <DepartmentProgressBar
                            key={data.label}
                            data={data}
                            variant={ProgressBarVariant.Compact}
                        />
                    ))}
                </div>
            </>)
        }
        
    </div> 
  )
}