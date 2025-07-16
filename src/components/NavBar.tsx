import { CiImport } from "react-icons/ci";

export default function NavBar() {
  return (
    <div className='w-full pt-4 pb-4 px-8 flex items-center justify-between'>
        <div className='flex flex-col text-left'>
            <h1 className='text-5xl font-semibold text-white'>
                Trello Dashboard
            </h1>
            <h3 className="text-subtitle">Project progress at a glance</h3>
        </div>
        <button className='flex  items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600/70 transition-colors duration-200'>
            Import Board Data <CiImport size={24} />
        </button>
    </div>
  )
}