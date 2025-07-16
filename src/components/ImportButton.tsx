import { CiImport } from "react-icons/ci";
import { useRef } from "react";
import useBoardStore from "../hooks/useBoardStore";

export default function ImportButton() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { labels, customFields, lists, importData } = useBoardStore();

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const text = await file.text();
        importData(JSON.parse(text));

        console.log("Labels:", labels);
        console.log("Custom Fields:", customFields);
        console.log("Lists:", lists);
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