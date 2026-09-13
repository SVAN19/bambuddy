import { createPortal } from 'react-dom';
import { useAddPrinter } from '../contexts/AddPrinterContext';
import { AddPrinterModal } from './AddPrinterModal';
import { ForceAddWarningModal } from './ForceAddWarningModal';

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
    showRetryWarning,
    showForceAddModal,
    forceAddData,
    existingSerials,
    openAddModal,
    closeAddModal,
    closeForceAddModal,
    addPrinter,
    asyncAddPrinter,
  } = useAddPrinter();

  return createPortal(
    <>
      {showAddModal && (
        <AddPrinterModal
          onClose={closeAddModal}
          onAdd={addPrinter}
          onAsyncAdd={asyncAddPrinter}
          existingSerials={existingSerials}
          initialFormData={isRetryActive ? (retryAddData || undefined) : undefined}
          showRetryWarning={showRetryWarning}
          key={isRetryActive ? 'retry' : 'new'}
        />
      )}
      {showForceAddModal && forceAddData && (
        <ForceAddWarningModal
          onClose={closeForceAddModal}
          onConfirm={() => {
            // Send force_add: true to skip connection diagnostic
            addPrinter({ ...forceAddData, force_add: true });
            closeForceAddModal();
          }}
          onGoBack={() => {
            closeForceAddModal();
            openAddModal(existingSerials, forceAddData);
          }}
        />
      )}
    </>,
    document.body
  );
}
