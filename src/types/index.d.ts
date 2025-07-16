export type Label = {
    id: string;
    name: string;
    color: string;
};

export type CustomFieldOption = {
    id: string;
    name: string;
};

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

export type TrelloBoardRawExport = {
    labels: Label[];
    customFields: RawCustomField[];
    lists: RawTrelloList[];
};