import { useMemo } from "react";
import useBoardStore from "./useBoardStore";
import { getProgressBarColors } from "../util/utils";
import { TaskStatus } from "../types/tasks";
import type { ProgressBarData } from "../types";

const useBoard = (department: string, system: string) => {
    const { tasks, labels } = useBoardStore();

    //first, filter all tasks based on the selected department and system
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesDepartment = department === 'all' || task.labels.some(label => label.name === department);
            const matchesSystem = system === 'all' || task.system === system || (system === 'none' && !task.system);
            return matchesDepartment && matchesSystem;
        });
    }, [department, system, tasks]);

    //next, group tasks into each department they belong to
    const groupedTasks = useMemo(() => {
        return filteredTasks.reduce((acc, task) => {
            task.labels.forEach(label => {
                if (!acc[label.id]) {
                    acc[label.id] = [];
                }
                acc[label.id].push(task);
            });
            return acc;
        }, {} as Record<string, typeof filteredTasks>);
    }, [filteredTasks]);

    //finally, calculate the progress for each department
    const departmentProgress: ProgressBarData[] = useMemo(() => {
        return Object.entries(groupedTasks).map(([labelId, tasks]) => {
            let tasksNotStarted = 0;
            let tasksInProgress = 0;
            let tasksCompleted = 0;
            let inProgressHours = 0;
            let completedHours = 0;
            let totalHours = 0;

            tasks.forEach(task => {
                totalHours += task.hours ?? 0;
                switch (task.status) {
                    case TaskStatus.NotStarted:
                        tasksNotStarted++;
                        break;
                    case TaskStatus.InProgress:
                        tasksInProgress++;
                        inProgressHours += task.hours ?? 0;
                        break;
                    case TaskStatus.Completed:
                        tasksCompleted++;
                        completedHours += task.hours ?? 0;
                        break;
                }
            });

            const label = labels.find(label => label.id === labelId);

            return {
                label: label!.name,
                colors: getProgressBarColors(label),
                tasksNotStarted,
                tasksInProgress,
                tasksCompleted,
                inProgressHours,
                completedHours,
                totalHours,
            };
        });
    }, [groupedTasks, labels]);

    return {
        departmentProgress
    };
};

export default useBoard;