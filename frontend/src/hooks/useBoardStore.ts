import { create } from "zustand";
import type { SystemFieldOption, Label, TrelloBoardRawExport, TrelloList, TrelloTask } from "../types";
import extractBoardData from "../util/extractBoardData";

type BoardState = {
    labels: Label[];
    systems: SystemFieldOption[];
    lists: TrelloList[];
    tasks: TrelloTask[];
    importData: (data: TrelloBoardRawExport) => void;
};

const useBoardStore = create<BoardState>((set) => ({
    labels: [],
    systems: [],
    lists: [],
    tasks: [],

    importData: (data: TrelloBoardRawExport) => set(extractBoardData(data))
}));

export default useBoardStore;