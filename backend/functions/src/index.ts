import { https } from 'firebase-functions';
import { defineSecret, defineString } from 'firebase-functions/params';

const trelloApiKey = defineSecret('TRELLO_API_KEY');
const trelloApiToken = defineSecret('TRELLO_TOKEN');
const trelloBoardId = defineString('TRELLO_BOARD_ID');

export const fetchTrelloBoard = https.onCall(
    {secrets: [trelloApiKey, trelloApiToken]},
    async () => {
    try {
        const apiKey = trelloApiKey.value();
        const apiToken = trelloApiToken.value();
        const boardId = trelloBoardId.value();

        const params = new URLSearchParams({
            lists: 'open',
            list_fields: 'name,id',
            cards: 'visible',
            card_customFieldItems: 'true',
            card_fields: 'idLabels,idList,closed',
            labels: 'all',
            label_fields: 'name,color',
            customFields: 'true',
            fields: 'none',
            key: apiKey,
            token: apiToken
        });

        const response = await fetch(`https://api.trello.com/1/boards/${boardId}?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Trello API error fetching cards: ${response.statusText}`);
        }

        const boardData = await response.json();
        return boardData;

    } catch (error) {
        console.error("Error fetching Trello board:", error);
        throw new https.HttpsError('internal', 'Failed to fetch Trello board data');
    }
});