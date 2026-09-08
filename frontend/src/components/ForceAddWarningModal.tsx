import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { ConfirmModal } from './ConfirmModal';

interface ForceAddWarningModalProps {
  onClose: () => void;
  onConfirm: () => void;
  onGoBack: () => void;
}

export function ForceAddWarningModal({ onClose, onConfirm, onGoBack }: ForceAddWarningModalProps) {
  const { t } = useTranslation();
  const [confirmed, setConfirmed] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  return (
    <>
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowCloseConfirm(true)}
    >
      <Card
        className="w-full max-w-md my-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white">
                {t('printers.toast.forceAddWarning.title')}
              </h2>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 mb-6">
            <p className="text-sm text-white">
              {t('printers.toast.forceAddWarning.description')}
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-white">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                <span>{t('printers.toast.forceAddWarning.reasonOffline')}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                <span>{t('printers.toast.forceAddWarning.reasonInvalidData')}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                <span>{t('printers.toast.forceAddWarning.reasonNotLANMode')}</span>
              </li>
            </ul>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3">
              <p className="text-xs text-amber-700 font-medium">
                {t('printers.toast.forceAddWarning.warning')}
              </p>
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-bambu-dark/50 rounded-lg border border-bambu-dark-tertiary">
            <input
              type="checkbox"
              id="force-add-confirm"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-5 h-5 rounded border-bambu-dark-tertiary bg-bambu-dark text-bambu-green focus:ring-bambu-green cursor-pointer flex-shrink-0"
            />
            <label
              htmlFor="force-add-confirm"
              className="text-sm text-white cursor-pointer select-none"
            >
              {t('printers.toast.forceAddWarning.confirmation')}
            </label>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onGoBack}
              className="w-full"
            >
              {t('printers.toast.forceAddWarning.goBack')}
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCloseConfirm(true)}
                className="flex-1"
              >
                {t('printers.toast.forceAddWarning.cancel')}
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                disabled={!confirmed}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('printers.toast.forceAddWarning.add')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    {showCloseConfirm && (
      <ConfirmModal
        title={t('printers.modal.closeConfirm.title')}
        message={t('printers.modal.closeConfirm.message')}
        confirmText={t('printers.modal.closeConfirm.confirm')}
        variant="danger"
        onConfirm={() => {
          setShowCloseConfirm(false);
          onClose();
        }}
        onCancel={() => setShowCloseConfirm(false)}
      />
    )}
    </>
  );
}
