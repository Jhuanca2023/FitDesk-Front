
export interface PlanFilters {
  isActive?: boolean;
  searchTerm?: string;
  target?: 'all' | 'members' | 'trainers';
}

export interface PlanState {
 
  currentPlanId: string | null;
  isDialogOpen: boolean;
  filters: PlanFilters;
  
 
  setCurrentPlanId: (id: string | null) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  setFilters: (filters: Partial<PlanFilters>) => void;
  reset: () => void;
}
