import { useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from './Card';
import { Button } from './Button';

interface ForceAddWarningModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export function ForceAddWarningModal({ onClose, onConfirm }: ForceAddWarningModalProps) {
  const { t } = useTranslation();
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
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
            <p className="text-sm text-bambu-gray">
              {t('printers.toast.forceAddWarning.description')}
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-white">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{t('printers.toast.forceAddWarning.reasonOffline')}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{t('printers.toast.forceAddWarning.reasonInvalidData')}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{t('printers.toast.forceAddWarning.reasonNotLANMode')}</span>
              </li>
            </ul>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3">
              <p className="text-xs text-amber-200">
                {t('printers.toast.forceAddWarning.warning')}
              </p>
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-bambu-dark/50 rounded-lg border border-bambu-dark-tertiary">
            <button
              type="button"
              onClick={() => setConfirmed(!confirmed)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                confirmed
                  ? 'bg-bambu-green border-bambu-green'
                  : 'border-bambu-dark-tertiary hover:border-bambu-gray'
              }`}
            >
              {confirmed && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
            <label
              className="text-sm text-white cursor-pointer select-none"
              onClick={() => setConfirmed(!confirmed)}
            >
              {t('printers.toast.forceAddWarning.confirmation')}
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
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
        </CardContent>
      </Card>
    </div>
  );
}
