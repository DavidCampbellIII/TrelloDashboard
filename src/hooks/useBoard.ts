import { useMemo } from "react";
import useBoardStore from "./useBoardStore";
import { getProgressBarColors } from "../util/utils";
import { TaskStatus } from "../types/tasks";
import type { Label, ProgressBarData, TaskProgressNoHours, TaskProgressWithHours, TrelloTask } from "../types";

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
        const data = Object.entries(groupedTasks).map(([labelId, tasks]) => {
            
            const { tasksWithoutHours, tasksWithHours } = calcTaskHours(tasks);
            const label = labels.find(label => label.id === labelId);

            return {
                label: label!.name,
                colors: getProgressBarColors(label),
                tasksWithHours,
                tasksWithoutHours,
            };
        });

        const outstanding = (p: ProgressBarData) =>
            p.tasksWithHours.notStarted.numTasks +
            p.tasksWithHours.inProgress.numTasks +
            p.tasksWithoutHours.notStarted +
            p.tasksWithoutHours.inProgress;

        //sort by largest backlog first
        return data.sort((a, b) => outstanding(b) - outstanding(a));
    }, [groupedTasks, labels]);

    const overallProgress: ProgressBarData = useMemo(() => {
        const { tasksWithoutHours, tasksWithHours } = calcTaskHours(tasks);
        
        return {
            label: 'all',
            colors: getProgressBarColors({name: 'all'} as Label),
            tasksWithHours,
            tasksWithoutHours,
        };
    }, [tasks]);

    return {
        overallProgress,
        departmentProgress
    };
};

const calcTaskHours = (tasks: TrelloTask[]): 
    {tasksWithoutHours: TaskProgressNoHours, tasksWithHours: TaskProgressWithHours} => 
{
    const tasksWithoutHours: TaskProgressNoHours = {
        notStarted: 0,
        inProgress: 0,
        completed: 0
    };
    const tasksWithHours: TaskProgressWithHours = {
        notStarted: {
            numTasks: 0,
            hours: 0,
        },
        inProgress: {
            numTasks: 0,
            hours: 0
        },
        completed: {
            numTasks: 0,
            hours: 0,
        }
    };

    tasks.forEach(task => {
        switch (task.status) {
            case TaskStatus.NotStarted:
                if (task.hours) {
                    tasksWithHours.notStarted.numTasks++;
                    tasksWithHours.notStarted.hours += task.hours;
                } else {
                    tasksWithoutHours.notStarted++;
                }
                break;
            case TaskStatus.InProgress:
                if (task.hours) {
                    tasksWithHours.inProgress.numTasks++;
                    tasksWithHours.inProgress.hours += task.hours;
                } else {
                    tasksWithoutHours.inProgress++;
                }
                break;
            case TaskStatus.Completed:
                if (task.hours) {
                    tasksWithHours.completed.numTasks++;
                    tasksWithHours.completed.hours += task.hours;
                } else {
                    tasksWithoutHours.completed++;
                }
                break;
        }
    });

    return { tasksWithoutHours, tasksWithHours };
};

export default useBoard;