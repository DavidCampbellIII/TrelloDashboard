// components/LoadingData.tsx
import { BiSolidError } from 'react-icons/bi';
import { useTrelloData } from '../hooks/useTrelloData'; // adjust path as needed

export default function LoadingData() {
    const { isLoading, error, refetch } = useTrelloData();
    
    if (!isLoading && !error) return null;

    const renderError = () => (
        <div className='flex flex-col items-center'>
            <BiSolidError size={64} className='text-red-500' />
            <p className='mt-2 text-red-400 text-2xl text-center'>Something went wrong</p>
            <p className='mt-2 text-gray-400 text-sm text-center max-w-md'>{error ?? 'Unknown error loading Trello data'}</p>
            {refetch && (
                <button 
                    onClick={refetch}
                    className='mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
                >
                    Try Again
                </button>
            )}
        </div>
    );

  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-[1000]'>
        {isLoading ? (
            <>
                <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500 border-solid'></div>
                <p className='mt-4 text-gray-300 text-2xl'>Loading data...</p>
            </>
        ) : renderError()}
    </div>
  );
}