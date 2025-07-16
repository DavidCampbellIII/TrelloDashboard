import useBoardStore from "../hooks/useBoardStore";

export default function Filters() {
    const { labels: departments, customFields: systems } = useBoardStore();

  return (
    <div className='rounded-xl bg-gray-800 p-4 my-4 w-full'>
        <h2 className='text-2xl font-semibold text-white mb-4'>Filters</h2>
        <div className='flex gap-4'>
            <div className='flex flex-col gap-2'>
                <label className='text-base text-subtitle' htmlFor='department-select'>
                Department
                </label>
                <select id='department-select' className='p-2 rounded bg-gray-700 text-white min-w-xs'>
                    {departments.length > 0 ? departments.map(department => (
                        <option key={department.id} value={department.id}>
                            {department.name}
                        </option>
                    )) :
                        <option value=''>No departments found</option>
                    }
                </select>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='text-base text-subtitle' htmlFor='system-select'>
                System
                </label>
                <select id='system-select' className='p-2 rounded bg-gray-700 text-white min-w-xs'>
                    {systems.length > 0 ? systems.map(system => (
                        <option key={system.id} value={system.id}>
                            {system.name}
                        </option>
                    )) :
                        <option value=''>No systems found</option>
                    }
                </select>
            </div>
        </div>
    </div>
  )
}