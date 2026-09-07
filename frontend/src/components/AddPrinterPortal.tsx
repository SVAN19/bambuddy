import { createPortal } from 'react-dom';
import { useAddPrinter } from '../contexts/AddPrinterContext';
import { AddPrinterModal } from './AddPrinterModal';

/**
 * Renders AddPrinterModal as a portal to document.body.
 * This ensures the modal is accessible from any page in the app,
 * not just PrintersPage where it was previously rendered inline.
 */
export function AddPrinterPortal() {
  const {
    showAddModal,
    retryAddData,
    isRetryActive,
    diagnosticResult,
    showRetryWarning,
    existingSerials,
    closeAddModal,
    addPrinter,
    asyncAddPrinter,
  } = useAddPrinter();

  if (!showAddModal) return null;

  const modal = (
    <AddPrinterModal
      onClose={closeAddModal}
      onAdd={addPrinter}
      onAsyncAdd={asyncAddPrinter}
      existingSerials={existingSerials}
      initialFormData={isRetryActive ? (retryAddData || undefined) : undefined}
      diagnosticResult={isRetryActive ? diagnosticResult : null}
      showRetryWarning={showRetryWarning}
      key={isRetryActive ? 'retry' : 'new'}
    />
  );

  return createPortal(modal, document.body);
}
