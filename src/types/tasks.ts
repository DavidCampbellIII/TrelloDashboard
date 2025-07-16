export const TaskStatus = {
    NotStarted: "NotStarted",
    InProgress: "InProgress",
    Completed: "Completed",
};

export type TaskStatus = keyof typeof TaskStatus;