export interface CompanionState {
  status: 'idle' | 'analyzing' | 'proactive' | 'responding';
  currentMessage: string;
  recommendedAction?: {
    label: string;
    action: string;
  };
  lastUpdate: string;
}

export interface UserContext {
  activeProjects: string[];
  productivityScore: number;
  focusMode: boolean;
}

export interface AppState {
  companion: CompanionState;
  user: UserContext;
  activeApp: 'Mind' | 'Network' | 'Notes' | 'Calendar';
}
