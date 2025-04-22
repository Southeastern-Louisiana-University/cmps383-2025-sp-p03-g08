import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WorkflowContextType {
  movieId: number | null;
  setMovieId: React.Dispatch<React.SetStateAction<number | null>>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

interface WorkflowProviderProps {
  children: ReactNode;
}

export const WorkflowProvider = ({ children }: WorkflowProviderProps) => {
  const [movieId, setMovieId] = useState<number | null>(null);

  return (
    <WorkflowContext.Provider value={{ movieId, setMovieId }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
