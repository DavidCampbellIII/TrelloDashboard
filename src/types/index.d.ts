import type { TaskStatus } from "./tasks";

export type Label = {
    id: string;
    name: string;
    color: string;
};

export type SystemFieldOption = {
    id: string;
    name: string;
};

export type EstimatedHoursFieldOption = {
    id: string;
    hours: number;
}

export type TrelloList = {
    id: string;
    name: string;
}

type RawTrelloList = {
    id: string;
    name: string;
    closed: boolean;
};

type RawCustomField = {
    id: string;
    name: string;
    options?: RawCustomFieldOption[];
}

type RawCustomFieldOption = {
    id: string;
    value: {
        text: string;
    };
};

type RawTrelloCard = {
    closed: boolean;
    idLabels: string[];
    idList: string;
    customFieldItems: {
        idCustomField: string;
        value: {
            number: string;
        } | null;
        idValue: string | null;
    }[];
};

export type TrelloBoardRawExport = {
    labels: Label[];
    customFields: RawCustomField[];
    lists: RawTrelloList[];
    cards: RawTrelloCard[];
};

export type TrelloTask = {
    labels: Label[];
    status: TaskStatus;
    system?: string;
    hours?: number;
};

export type ProgressBarColors = {
    completedColor: string;
    inProgressColor: string;
};

export type TaskProgressWithHours = {
    notStarted: {
        numTasks: number;
        hours: number;
    };
    inProgress: {
        numTasks: number;
        hours: number;
    };
    completed: {
        numTasks: number;
        hours: number;
    }
};

export type TaskProgressNoHours = {
    notStarted: number;
    inProgress: number;
    completed: number;
};

export type ProgressBarData = {
    label: string;
    colors: ProgressBarColors;
    tasksWithHours: TaskProgressWithHours;
    tasksWithoutHours: TaskProgressNoHours;
};

export type TaskProgressResults = {
    tasksInProgress: number;
    tasksCompleted: number;
    totalTasks: number;

    inProgressHours: number;
    completedHours: number;
    totalHours: number;

    totalPointsFromTasks: number;
    totalPointsFromHours: number;

    inProgressPercentage: number;
    completedPercentage: number;
}