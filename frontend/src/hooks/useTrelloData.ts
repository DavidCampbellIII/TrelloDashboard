import { useEffect, useCallback } from "react";
import { httpsCallable, getFunctions } from "firebase/functions";
import type { TrelloBoardRawExport } from "../types";
import useBoardStore from "./useBoardStore";
import useFilterStore from "./useFiltersStore";

type UseTrelloDataReturn = {
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useTrelloData = (): UseTrelloDataReturn => {
    const { importData, isLoading, error, setIsLoading, setError } = useBoardStore();
    const { setDepartment, setSystem } = useFilterStore();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const fetchTrelloBoard = httpsCallable(getFunctions(), "fetchTrelloBoard");
            const result = await fetchTrelloBoard();
            importData(result.data as TrelloBoardRawExport);

        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    }, [importData, setIsLoading, setError]);

    //initial load on mount
    useEffect(() => {
        fetchData();
        setDepartment("all");
        setSystem("all");
    }, [fetchData, setDepartment, setSystem]);

    return {
        isLoading,
        error,
        refetch: fetchData,
    };
}
