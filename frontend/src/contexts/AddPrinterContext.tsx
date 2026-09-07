import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api, ApiError } from '../api/client';
import type { PrinterCreate, PrinterDiagnosticResult } from '../api/client';
import { useToast } from './ToastContext';

interface AddPrinterContextType {
  showAddModal: boolean;
  retryAddData: PrinterCreate | null;
  isRetryActive: boolean;
  diagnosticResult: PrinterDiagnosticResult | null;
  showRetryWarning: boolean;
  existingSerials: string[];
  openAddModal: (existingSerials: string[], initialData?: PrinterCreate) => void;
  closeAddModal: () => void;
  setRetryData: (data: PrinterCreate) => void;
  setRetryActive: (active: boolean) => void;
  setDiagnosticResult: (result: PrinterDiagnosticResult | null) => void;
  setRetryWarning: (show: boolean) => void;
  addPrinter: (data: PrinterCreate) => void;
  asyncAddPrinter: (data: PrinterCreate) => Promise<void>;
}

const AddPrinterContext = createContext<AddPrinterContextType | undefined>(undefined);

export function AddPrinterProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showToast, showPersistentToast, dismissToast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [retryAddData, setRetryAddData] = useState<PrinterCreate | null>(null);
  const [isRetryActive, setIsRetryActive] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<PrinterDiagnosticResult | null>(null);
  const [showRetryWarning, setShowRetryWarning] = useState(false);
  const [existingSerials, setExistingSerials] = useState<string[]>([]);

  const addMutation = useMutation({
    mutationFn: api.createPrinter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] });
      queryClient.invalidateQueries({ queryKey: ['maintenanceOverview'] });
      setShowAddModal(false);
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && error.code === 'printer_connection_failed') {
        showToast(t('printers.toast.connectionFailedNotAdded'), 'error');
        return;
      }
      showToast(error.message || t('printers.toast.failedToAdd'), 'error');
    },
  });

  const asyncAddPrinter = useCallback(async (data: PrinterCreate) => {
    showPersistentToast('add-printer-checking', t('printers.toast.checkingConnection'), 'loading');

    try {
      const result = await api.diagnoseConnection({
        ip_address: data.ip_address.trim(),
        serial_number: data.serial_number.trim() || undefined,
        access_code: data.access_code || undefined,
      });

      const hasFailures = result.checks.some((c) => c.status === 'fail');
      if (hasFailures) {
        setDiagnosticResult(result);
        dismissToast('add-printer-checking');
        showPersistentToast('add-printer-error', t('printers.toast.connectionWarning'), 'warning', {
          actions: [
            {
              label: t('printers.toast.retry'),
              onClick: () => {
                openAddModal(existingSerials, data);
              },
            },
            {
              label: t('printers.toast.addAnyway'),
              disabled: true,
              tooltip: t('printers.toast.addAnywayDisabled'),
            },
          ],
        });
        return;
      }

      dismissToast('add-printer-checking');
      showPersistentToast('add-printer-adding', t('printers.toast.addingPrinter', { printerName: data.name }), 'loading');

      await addMutation.mutateAsync(data);

      dismissToast('add-printer-adding');
      showToast(t('printers.toast.printerAddedSuccess', { printerName: data.name }), 'success');
    } catch (error) {
      dismissToast('add-printer-checking');
      showPersistentToast('add-printer-error', t('printers.toast.connectionWarning'), 'warning', {
        actions: [
          {
            label: t('printers.toast.retry'),
            onClick: () => {
              openAddModal(existingSerials, data);
            },
          },
          {
            label: t('printers.toast.addAnyway'),
            disabled: true,
            tooltip: t('printers.toast.addAnywayDisabled'),
          },
        ],
      });
    }
  }, [showToast, showPersistentToast, dismissToast, t, addMutation, existingSerials]);

  const addPrinter = useCallback((data: PrinterCreate) => {
    addMutation.mutate(data);
  }, [addMutation]);

  const openAddModal = useCallback((existingSerials: string[], initialData?: PrinterCreate) => {
    setExistingSerials(existingSerials);
    setShowAddModal(true);
    if (initialData) {
      setRetryAddData(initialData);
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
    setExistingSerials([]);
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
        existingSerials,
        openAddModal,
        closeAddModal,
        setRetryData,
        setRetryActive,
        setDiagnosticResult,
        setRetryWarning,
        addPrinter,
        asyncAddPrinter,
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
