import DepartmentsHighlights from './components/DepartmentsHighlights';
import NavBar from './components/NavBar';
import OverallProgress from './components/OverallProgress';
import SystemsHighlights from './components/SystemsHighlights';
import TabView from './components/TabView';

export default function App() {
  return (
    <div className='bg-gray-900 h-full w-full min-h-[100vh] min-w-full justify-center flex'>
      <div className='max-w-[1600px] mx-2 md:mx-8 w-full'>
        <NavBar />
        <div className='flex flex-col lg:flex-row lg:gap-4'>
          <OverallProgress />
          <DepartmentsHighlights />
          <SystemsHighlights />
        </div>
        <TabView />
      </div>
    </div>
  )
}
