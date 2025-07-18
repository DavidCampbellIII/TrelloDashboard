export const TaskStatus = {
    NotStarted: "NotStarted" as const,
    InProgress: "InProgress" as const,
    Completed: "Completed" as const,
};

export type TaskStatus = keyof typeof TaskStatus;