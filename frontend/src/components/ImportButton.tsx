import { CiImport } from "react-icons/ci";
import { useEffect, useRef } from "react";
import useBoardStore from "../hooks/useBoardStore";
import useFilterStore from "../hooks/useFiltersStore";
import { getFunctions, httpsCallable } from "firebase/functions";
import type { TrelloBoardRawExport } from "../types";

export default function ImportButton() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { importData } = useBoardStore();
    const { setDepartment, setSystem } = useFilterStore();

    //initialize with default data on first load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchTrelloBoard = httpsCallable(getFunctions(), 'fetchTrelloBoard');
                const result = await fetchTrelloBoard();
                importData(result.data as TrelloBoardRawExport);
            } catch(error) {
                console.error("Error fetching Trello board:", error);
            }
        };

        fetchData();
        setDepartment('all');
        setSystem('all');
    }, []);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const text = await file.text();
        importData(JSON.parse(text));

        //set filters to show all on initial import
        setDepartment('all');
        setSystem('all');
    };

  return (
    <div>
        <input
            type='file'
            accept='.json'
            ref={fileInputRef}
            onChange={handleFile}
            className='hidden'
        />
        <button
            onClick={() => fileInputRef.current?.click()}
            className='flex items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600/70 transition-colors duration-200'
        >
            Import Board Data <CiImport size={24} />
        </button>
    </div>
  )
}