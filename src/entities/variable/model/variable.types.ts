export type Variable = {
  id: string;
  name: string;
  value: string;
  description?: string;
  isSecret?: boolean; // Для скрытия значений токенов
  createdAt: number;
  updatedAt: number;
};

export type VariableState = {
  variables: Variable[];
  isLoading: boolean;
  searchQuery: string;
  selectedVariableId: string | null;

  // Actions
  addVariable: (variable: Omit<Variable, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVariable: (id: string, updates: Partial<Variable>) => Promise<void>;
  deleteVariable: (id: string) => Promise<void>;
  setVariables: (variables: Variable[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedVariable: (id: string | null) => void;

  // Computed
  getVariableById: (id: string) => Variable | undefined;
  getVariableByName: (name: string) => Variable | undefined;
  getFilteredVariables: () => Variable[];
  exportVariables: () => string;
  importVariables: (data: string) => Promise<void>;
};

export type VariableValidationResult = {
  isValid: boolean;
  errors: {
    name?: string;
    value?: string;
    description?: string;
  };
};

export type SubstitutionPreview = {
  originalText: string;
  substitutedText: string;
  foundVariables: {
    name: string;
    value: string;
    position: { start: number; end: number };
  }[];
  missingVariables: string[];
};
