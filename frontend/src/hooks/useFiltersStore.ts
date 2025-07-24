import { create } from "zustand";

type FilterState = {
    department?: string;
    setDepartment: (department?: string) => void;

    system?: string;
    setSystem: (system?: string) => void;
};

const useFilterStore = create<FilterState>((set) => ({
    department: undefined,
    setDepartment: (department?: string) => set({ department }),

    system: undefined,
    setSystem: (system?: string) => set({ system })
}));

export default useFilterStore;