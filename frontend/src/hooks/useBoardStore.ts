import { create } from "zustand";
import type { SystemFieldOption, Label, TrelloBoardRawExport, TrelloList, TrelloTask } from "../types";
import extractBoardData from "../util/extractBoardData";

type BoardState = {
    labels: Label[];
    systems: SystemFieldOption[];
    lists: TrelloList[];
    tasks: TrelloTask[];

    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;

    importData: (data: TrelloBoardRawExport) => void;
};

const useBoardStore = create<BoardState>((set) => ({
    labels: [],
    systems: [],
    lists: [],
    tasks: [],
    isLoading: false,
    error: null,

    setIsLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),

    importData: (data: TrelloBoardRawExport) => set(extractBoardData(data))
}));

export default useBoardStore;