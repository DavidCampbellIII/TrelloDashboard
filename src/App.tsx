
import Filters from './components/Filters';
import NavBar from './components/NavBar';

export default function App() {

  return (
    <div className='bg-gray-900 h-full w-full min-h-[100vh] min-w-full justify-center flex'>
      <div className='max-w-[1600px] mx-8 w-full'>
        <NavBar />
        <Filters />
      </div>
    </div>
  )
}
