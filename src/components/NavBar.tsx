import ImportButton from "./ImportButton";

export default function NavBar() {
  return (
    <div className='w-full pt-4 pb-4 flex items-center justify-between'>
        <div className='flex flex-col text-left'>
            <h1 className='text-5xl font-semibold text-white'>
                Trello Dashboard
            </h1>
            <h3 className="text-subtitle mt-1">Project progress at a glance</h3>
        </div>
        <ImportButton />
    </div>
  )
}