// Type definitions for Trello Dashboard Visualizer

// Trello data types
export interface TrelloCard {
  id: string;
  name: string;
  listId: string;
  labels: TrelloLabel[];
  customFields: {
    estimatedHours?: number;
    system?: string;
  };
}

export interface TrelloLabel {
  id: string;
  name: string;
  color: string;
}

export interface TrelloList {
  id: string;
  name: string;
}

export interface TrelloBoardData {
  cards: TrelloCard[];
  lists: TrelloList[];
  labels: TrelloLabel[];
}

// Statistics types
export interface ProgressStats {
  totalCards: number;
  completedCards: number;
  totalHours: number;
  completedHours: number;
  completionPercentage: number;
}

export interface DepartmentStats extends ProgressStats {
  department: string;
  color: string;
}

export interface SystemStats extends ProgressStats {
  system: string;
}
