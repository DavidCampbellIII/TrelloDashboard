// Mock data generation for development

import { TrelloBoardData, TrelloCard } from '../types';

/**
 * Generates mock Trello board data for development and testing
 */
export function generateMockData(): TrelloBoardData {
  // Mock lists
  const lists = [
    { id: 'list1', name: 'To Do' },
    { id: 'list2', name: 'In Progress' },
    { id: 'list3', name: 'Done' }
  ];
  
  // Mock labels
  const labels = [
    { id: 'label1', name: 'Art', color: 'green' },
    { id: 'label2', name: 'Programming', color: 'blue' },
    { id: 'label3', name: 'Design', color: 'purple' },
    { id: 'label4', name: 'QA', color: 'red' }
  ];
  
  // Mock cards
  const cards: TrelloCard[] = [];
  
  // Art tasks
  cards.push(
    { 
      id: 'card1', 
      name: 'Create character concept art', 
      listId: 'list3', 
      labels: [labels[0]], 
      customFields: { estimatedHours: 12, system: 'Characters' }
    },
    { 
      id: 'card2', 
      name: 'Environment sketches', 
      listId: 'list2', 
      labels: [labels[0]], 
      customFields: { estimatedHours: 8, system: 'Environment' }
    },
    { 
      id: 'card3', 
      name: 'UI icons', 
      listId: 'list1', 
      labels: [labels[0]], 
      customFields: { estimatedHours: 6, system: 'UI' }
    }
  );
  
  // Programming tasks
  cards.push(
    { 
      id: 'card4', 
      name: 'Implement character controller', 
      listId: 'list3', 
      labels: [labels[1]], 
      customFields: { estimatedHours: 16, system: 'Characters' }
    },
    { 
      id: 'card5', 
      name: 'Create inventory system', 
      listId: 'list2', 
      labels: [labels[1]], 
      customFields: { estimatedHours: 20, system: 'UI' }
    },
    { 
      id: 'card6', 
      name: 'Fix collision bugs', 
      listId: 'list1', 
      labels: [labels[1]], 
      customFields: { estimatedHours: 8, system: 'Environment' }
    }
  );
  
  // Design tasks
  cards.push(
    { 
      id: 'card7', 
      name: 'Level design document', 
      listId: 'list3', 
      labels: [labels[2]], 
      customFields: { estimatedHours: 10, system: 'Environment' }
    },
    { 
      id: 'card8', 
      name: 'UI wireframes', 
      listId: 'list3', 
      labels: [labels[2]], 
      customFields: { estimatedHours: 8, system: 'UI' }
    },
    { 
      id: 'card9', 
      name: 'Character abilities design', 
      listId: 'list2', 
      labels: [labels[2]], 
      customFields: { estimatedHours: 12, system: 'Characters' }
    }
  );
  
  // QA tasks
  cards.push(
    { 
      id: 'card10', 
      name: 'Test character movement', 
      listId: 'list2', 
      labels: [labels[3]], 
      customFields: { estimatedHours: 6, system: 'Characters' }
    },
    { 
      id: 'card11', 
      name: 'UI testing', 
      listId: 'list1', 
      labels: [labels[3]], 
      customFields: { estimatedHours: 8, system: 'UI' }
    },
    { 
      id: 'card12', 
      name: 'Map collision testing', 
      listId: 'list1', 
      labels: [labels[3]], 
      customFields: { estimatedHours: 10, system: 'Environment' }
    }
  );
  
  return { cards, lists, labels };
}
