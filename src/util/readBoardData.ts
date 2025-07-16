import type { CustomFieldOption, Label, TrelloBoardRawExport, TrelloList } from "../types";

const SYSTEM_CUSTOM_FIELD_NAME = 'System';

const extractData = (data: TrelloBoardRawExport) => {
    const labels: Label[] = data.labels.map(label => ({
        id: label.id,
        name: label.name,
        color: label.color
    }));

    const systemField = data.customFields.find(field => field.name === SYSTEM_CUSTOM_FIELD_NAME);
    const customFields: CustomFieldOption[] = 
        systemField?.options?.map(o => ({
            id: o.id,
            name: o.value.text
        })) ?? [];

    const lists: TrelloList[] = data.lists
        .filter(list => !list.closed)
        .map(list => ({
            id: list.id,
            name: list.name
    }));

    return { labels, customFields, lists };
}

export default extractData;