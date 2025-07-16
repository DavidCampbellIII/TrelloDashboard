import type { SystemFieldOption, Label, TrelloBoardRawExport, TrelloList, TrelloTask } from "../types";
import { TaskStatus } from "../types/tasks";

const SYSTEM_CUSTOM_FIELD_NAME = 'System';
const ESTIMATED_HOURS_CUSTOM_FIELD_NAME = 'Est. Time';

const COMPLETED_LIST_PATTERNS = [
    'done',
    'complete',
    'finished'
];

const IN_PROGRESS_LIST_PATTERNS = [
    'progress',
    'doing',
    'review'
];

const determineCardStatus = (listName: string): TaskStatus => {
    const nameLower = listName.toLowerCase();
    
    if (COMPLETED_LIST_PATTERNS.some(pattern => nameLower.includes(pattern))) {
        return TaskStatus.Completed as TaskStatus;
    } else if (IN_PROGRESS_LIST_PATTERNS.some(pattern => nameLower.includes(pattern))) {
        return TaskStatus.InProgress as TaskStatus;
    }
    return TaskStatus.NotStarted as TaskStatus;
}

const extractBoardData = (data: TrelloBoardRawExport) => {
    const labels: Label[] = data.labels.map(label => ({
        id: label.id,
        name: label.name,
        color: label.color
    }));

    const systemField = data.customFields.find(field => field.name === SYSTEM_CUSTOM_FIELD_NAME);
    const systems: SystemFieldOption[] = 
        systemField?.options?.map(o => ({
            id: o.id,
            name: o.value.text
        })) ?? [];

    console.log('Extracted systems:', systems);

    const lists: TrelloList[] = data.lists
        .filter(list => !list.closed)
        .map(list => ({
            id: list.id,
            name: list.name
    }));

    const estimatedHoursField = data.customFields.find(field => field.name === ESTIMATED_HOURS_CUSTOM_FIELD_NAME);
    const tasks: TrelloTask[] = data.cards
        .filter(card => !card.closed && card.customFieldItems.length > 0)
        .map(card => {
            console.log(`${card.customFieldItems[0].idCustomField} - ${card.customFieldItems[0].idValue} - ${card.customFieldItems[0].value?.number}`);
            const systemValue = card.customFieldItems.find(item => item.idCustomField === systemField?.id);
            const systemId = systemValue?.idValue || null;
            const system = systems.find(s => s.id === systemId)?.name ?? 'Unknown';
            if(system === 'Unknown') {
                console.warn(`System not found for card, system was: ${systemId} and system value was: ${systemValue}`);
            }

            const hoursValue = card.customFieldItems.find(item => item.idCustomField === estimatedHoursField?.id)?.value?.number || '0';
            if(hoursValue === '0') {
                console.warn(`Estimated hours not found for card, using default value of 0`);
            }

            return {
                status: determineCardStatus(lists.find(list => list.id === card.idList)?.name || ''),
                labels: card.idLabels.map(id => labels.find(label => label.id === id)).filter(Boolean) as Label[],
                system: system,
                hours: parseFloat(hoursValue),
            };
        });

    return { labels, systems, lists, tasks };
}

export default extractBoardData;