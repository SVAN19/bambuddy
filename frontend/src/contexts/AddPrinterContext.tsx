import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { PrinterCreate, PrinterDiagnosticResult } from '../api/client';

interface AddPrinterContextType {
  showAddModal: boolean;
  retryAddData: PrinterCreate | null;
  isRetryActive: boolean;
  diagnosticResult: PrinterDiagnosticResult | null;
  showRetryWarning: boolean;
  openAddModal: (data?: PrinterCreate) => void;
  closeAddModal: () => void;
  setRetryData: (data: PrinterCreate) => void;
  setRetryActive: (active: boolean) => void;
  setDiagnosticResult: (result: PrinterDiagnosticResult | null) => void;
  setRetryWarning: (show: boolean) => void;
}

const AddPrinterContext = createContext<AddPrinterContextType | undefined>(undefined);

export function AddPrinterProvider({ children }: { children: ReactNode }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [retryAddData, setRetryAddData] = useState<PrinterCreate | null>(null);
  const [isRetryActive, setIsRetryActive] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<PrinterDiagnosticResult | null>(null);
  const [showRetryWarning, setShowRetryWarning] = useState(false);

  const openAddModal = useCallback((data?: PrinterCreate) => {
    setShowAddModal(true);
    if (data) {
      setRetryAddData(data);
      setIsRetryActive(true);
      setShowRetryWarning(true);
    } else {
      setRetryAddData(null);
      setIsRetryActive(false);
      setShowRetryWarning(false);
    }
  }, []);

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
    if (!isRetryActive) {
      setRetryAddData(null);
      setDiagnosticResult(null);
    } else {
      setIsRetryActive(false);
    }
  }, [isRetryActive]);

  const setRetryData = useCallback((data: PrinterCreate) => {
    setRetryAddData(data);
  }, []);

  const setRetryActive = useCallback((active: boolean) => {
    setIsRetryActive(active);
  }, []);

  const setRetryWarning = useCallback((show: boolean) => {
    setShowRetryWarning(show);
  }, []);

  return (
    <AddPrinterContext.Provider
      value={{
        showAddModal,
        retryAddData,
        isRetryActive,
        diagnosticResult,
        showRetryWarning,
        openAddModal,
        closeAddModal,
        setRetryData,
        setRetryActive,
        setDiagnosticResult,
        setRetryWarning,
      }}
    >
      {children}
    </AddPrinterContext.Provider>
  );
}

export function useAddPrinter() {
  const context = useContext(AddPrinterContext);
  if (!context) {
    throw new Error('useAddPrinter must be used within AddPrinterProvider');
  }
  return context;
}
