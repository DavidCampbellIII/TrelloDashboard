//Filters out sensitive data from a raw Trello export JSON file
//and saves it in a format that contains only the necessary fields

import { readFile, writeFile } from "fs/promises";
import { argv, cwd, exit } from "process";
import { resolve } from "path";
import type { TrelloBoardRawExport } from "../frontend/src/types";

function filterTrelloExport(rawData: any): TrelloBoardRawExport {
  const filtered: TrelloBoardRawExport = {
    labels: [],
    customFields: [],
    lists: [],
    cards: []
  };

  // Filter labels
  if (Array.isArray(rawData.labels)) {
    filtered.labels = rawData.labels.map((label: any) => ({
      id: label.id,
      name: label.name,
      color: label.color
    })).filter((label: any) => label.id && label.name && label.color);
  }

  // Filter customFields
  if (Array.isArray(rawData.customFields)) {
    filtered.customFields = rawData.customFields.map((field: any) => {
      const filteredField: any = {
        id: field.id,
        name: field.name
      };

      // Handle options if they exist
      if (Array.isArray(field.options)) {
        filteredField.options = field.options.map((option: any) => ({
          id: option.id,
          value: {
            text: option.value?.text
          }
        })).filter((option: any) => option.id && option.value?.text);
      }

      return filteredField;
    }).filter((field: any) => field.id && field.name);
  }

  // Filter lists
  if (Array.isArray(rawData.lists)) {
    filtered.lists = rawData.lists.map((list: any) => ({
      id: list.id,
      name: list.name,
      closed: list.closed
    })).filter((list: any) => list.id && list.name && typeof list.closed === 'boolean');
  }

  // Filter cards
  if (Array.isArray(rawData.cards)) {
    filtered.cards = rawData.cards.map((card: any) => {
      const filteredCard: any = {
        closed: card.closed,
        idLabels: Array.isArray(card.idLabels) ? card.idLabels : [],
        idList: card.idList,
        customFieldItems: []
      };

      // Filter customFieldItems
      if (Array.isArray(card.customFieldItems)) {
        filteredCard.customFieldItems = card.customFieldItems.map((item: any) => {
          const filteredItem: any = {
            idCustomField: item.idCustomField,
            value: item.value,
            idValue: item.idValue
          };

          return filteredItem;
        }).filter((item: any) => item.idCustomField);
      }

      return filteredCard;
    }).filter((card: any) => 
      typeof card.closed === 'boolean' && 
      Array.isArray(card.idLabels) && 
      card.idList && 
      Array.isArray(card.customFieldItems)
    );
  }

  return filtered;
}

async function main() {
  const [, , inFile, outFile = "trello-export.json"] = argv;
  if (!inFile) {
    console.error("Usage: save-trello <input> [output]");
    exit(1);
  }

  const srcPath = resolve(cwd(), inFile);
  const dstPath = resolve(cwd(), outFile);

  try {
    const text = await readFile(srcPath, "utf8");
    const rawJson = JSON.parse(text);

    // Filter the data to match TrelloBoardRawExport structure
    const filteredData = filterTrelloExport(rawJson);

    await writeFile(dstPath, JSON.stringify(filteredData, null, 2), "utf8");
    console.log(`✔  Wrote filtered export to ${dstPath}`);
    
    console.log(`Labels: ${filteredData.labels.length}`);
    console.log(`Custom Fields: ${filteredData.customFields.length}`);
    console.log(`Lists: ${filteredData.lists.length}`);
    console.log(`Cards: ${filteredData.cards.length}`);
  } catch (error) {
    console.error("Error processing file:", error);
    exit(1);
  }
}

main();
