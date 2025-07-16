import { create } from "zustand";
import type { CustomFieldOption, Label, TrelloBoardRawExport, TrelloList } from "../types";
import extractData from "../util/readBoardData";

type BoardState = {
    labels: Label[];
    customFields: CustomFieldOption[];
    lists: TrelloList[];
    importData: (data: TrelloBoardRawExport) => void;
};

const useBoardStore = create<BoardState>((set) => ({
    labels: [],
    customFields: [],
    lists: [],

    importData: (data: TrelloBoardRawExport) => set(extractData(data))
}));

export default useBoardStore;