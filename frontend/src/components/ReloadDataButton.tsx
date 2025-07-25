import { FiRefreshCcw } from "react-icons/fi";
import { useTrelloData } from "../hooks/useTrelloData";

export default function ReloadDataButton() {
    const { isLoading, refetch } = useTrelloData();

    const handleRefetchData = async () => {
        await refetch();
    };

  return (
    <div>
        <button
            onClick={handleRefetchData}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
        >
            {isLoading ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-solid"></div>
                    Refreshing...
                </>
            ) : (
                <>
                    <FiRefreshCcw />
                    Refresh Data
                </>
            )}
        </button>
    </div>
  )
}