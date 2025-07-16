import { create } from "zustand";
import type { CustomFieldOption, Label } from "../types";

type FilterState = {
    department: Label | null;
    setDepartment: (department: Label | null) => void;

    system: CustomFieldOption | null;
    setSystem: (system: CustomFieldOption | null) => void;
};

const useFilterStore = create<FilterState>((set) => ({
    department: null,
    setDepartment: (department: Label | null) => set({ department }),

    system: null,
    setSystem: (system: CustomFieldOption | null) => set({ system })
}));

export default useFilterStore;