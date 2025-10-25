import React, { createContext, useState, useCallback, type ReactNode } from 'react';
import { LoadingType, type LoadingState } from '../types/api.types';

/**
 * Interface del contexto de carga
 */
export interface LoadingContextType {
  // Estado actual de carga
  loadingStates: Map<string, LoadingState>;

  // Verificar si hay alguna operación en progreso
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isUploading: boolean;
  isDownloading: boolean;

  // Acciones
  startLoading: (key: string, type?: LoadingType, message?: string) => void;
  stopLoading: (key: string) => void;
  updateProgress: (key: string, progress: number) => void;
  getLoadingState: (key: string) => LoadingState | undefined;
}

/**
 * Contexto de carga
 */
export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * Provider de carga
 *
 * Maneja múltiples estados de carga simultáneos con identificadores únicos.
 * Permite trackear diferentes tipos de operaciones: cargando, guardando, eliminando, etc.
 */
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<Map<string, LoadingState>>(new Map());

  /**
   * Iniciar una operación de carga
   */
  const startLoading = useCallback((key: string, type: LoadingType = LoadingType.LOADING, message?: string) => {
    setLoadingStates(prev => {
      const newMap = new Map(prev);
      newMap.set(key, {
        type,
        isLoading: true,
        message,
        progress: 0,
      });
      return newMap;
    });
  }, []);

  /**
   * Detener una operación de carga
   */
  const stopLoading = useCallback((key: string) => {
    setLoadingStates(prev => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  /**
   * Actualizar progreso de una operación
   */
  const updateProgress = useCallback((key: string, progress: number) => {
    setLoadingStates(prev => {
      const newMap = new Map(prev);
      const state = newMap.get(key);
      if (state) {
        newMap.set(key, { ...state, progress });
      }
      return newMap;
    });
  }, []);

  /**
   * Obtener estado de carga específico
   */
  const getLoadingState = useCallback((key: string): LoadingState | undefined => {
    return loadingStates.get(key);
  }, [loadingStates]);

  /**
   * Verificadores de estado por tipo
   */
  const isLoading = Array.from(loadingStates.values()).some(
    state => state.type === LoadingType.LOADING && state.isLoading
  );

  const isSaving = Array.from(loadingStates.values()).some(
    state => state.type === LoadingType.SAVING && state.isLoading
  );

  const isDeleting = Array.from(loadingStates.values()).some(
    state => state.type === LoadingType.DELETING && state.isLoading
  );

  const isUploading = Array.from(loadingStates.values()).some(
    state => state.type === LoadingType.UPLOADING && state.isLoading
  );

  const isDownloading = Array.from(loadingStates.values()).some(
    state => state.type === LoadingType.DOWNLOADING && state.isLoading
  );

  const value: LoadingContextType = {
    loadingStates,
    isLoading,
    isSaving,
    isDeleting,
    isUploading,
    isDownloading,
    startLoading,
    stopLoading,
    updateProgress,
    getLoadingState,
  };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};
