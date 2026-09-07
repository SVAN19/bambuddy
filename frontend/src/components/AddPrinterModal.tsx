import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader2, ChevronDown, AlertTriangle, Stethoscope, Printer, Wifi, Key, Hash, Globe, FolderPlus, CheckCircle2, MapPin, Home, Wrench, Coffee, Briefcase, Building2, Car, Heart, BookOpen, Dumbbell, Music, Gamepad2, Leaf, Palette, Monitor, Utensils, ShoppingBag, Gift, Star, Crown, Shield, Zap, Sun, Moon, Cloud, Snowflake, Flame, Anchor, Plane, Train, Bike, Truck } from 'lucide-react';
import { api, discoveryApi } from '../api/client';
import type { PrinterCreate, DiscoveredPrinter, PrinterDiagnosticResult } from '../api/client';
import { getCachedPrinterLocations, addCachedPrinterLocation } from '../utils/printerLocationsCache';
import { getLocationIcon } from '../utils/printerLocationIcons';
import { getLocationColor } from '../utils/printerLocationColors';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { ConfirmModal } from './ConfirmModal';
import { ConnectionDiagnosticModal, DiagnosticChecklist } from './ConnectionDiagnostic';

// Map SSDP model codes to display names
function mapModelCode(ssdpModel: string | null): string {
  if (!ssdpModel) return '';
  const modelMap: Record<string, string> = {
    // H2 Series
    'O1D': 'H2D',
    'O1E': 'H2D Pro',
    'O2D': 'H2D Pro',
    'O1C': 'H2C',
    'O1C2': 'H2C',
    'O1S': 'H2S',
    // X1 Series
    'BL-P001': 'X1C',
    'BL-P002': 'X1',
    'BL-P003': 'X1E',
    // X2 Series
    'N6': 'X2D',
    // A2 Series
    'N9': 'A2L',
    // P Series
    'C11': 'P1S',
    'C12': 'P1P',
    'C13': 'P2S',
    // A1 Series
    'N2S': 'A1',
    'N1': 'A1 Mini',
    // Direct matches
    'X1C': 'X1C',
    'X1': 'X1',
    'X1E': 'X1E',
    'X2D': 'X2D',
    'P1S': 'P1S',
    'P1P': 'P1P',
    'P2S': 'P2S',
    'A1': 'A1',
    'A1 Mini': 'A1 Mini',
    'A2L': 'A2L',
    'H2D': 'H2D',
    'H2D Pro': 'H2D Pro',
    'H2C': 'H2C',
    'H2S': 'H2S',
  };
  return modelMap[ssdpModel] || ssdpModel;
}

export function AddPrinterModal({
  onClose,
  onAdd,
  existingSerials,
  onAsyncAdd,
  initialFormData,
  diagnosticResult,
  showRetryWarning: showRetryWarningProp,
}: {
  onClose: () => void;
  onAdd: (data: PrinterCreate) => void;
  existingSerials: string[];
  onAsyncAdd?: (data: PrinterCreate) => void;
  initialFormData?: PrinterCreate;
  diagnosticResult?: any;
  showRetryWarning?: boolean;
}) {
  const { t } = useTranslation();
  const [form, setForm] = useState<PrinterCreate>(initialFormData || {
    name: '',
    serial_number: '',
    ip_address: '',
    access_code: '',
    model: '',
    location: '',
    auto_archive: true,
  });

  // Sync form with initialFormData when it changes (retry scenario)
  useEffect(() => {
    if (initialFormData) {
      setForm(initialFormData);
      setLocationInput(initialFormData.location || '');
      // Switch to manual tab when retrying with data
      setActiveTab('manual');
    }
  }, [initialFormData]);

  // Countdown state for closing confirmation
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRetryWarning, setShowRetryWarning] = useState(showRetryWarningProp || false);
  const [locationInput, setLocationInput] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const cachedLocations = getCachedPrinterLocations();

  // Filter locations based on input
  const filteredLocations = cachedLocations.filter((loc) =>
    loc.toLowerCase().includes(locationInput.toLowerCase())
  );

  // Get icon component for a location
  const getLocationIconComponent = useCallback((locationName: string) => {
    const iconName = getLocationIcon(locationName);
    if (!iconName) return null;
    
    // Map common icon names to lucide-react components
    const iconMap: Record<string, any> = {
      'home': Home,
      'wrench': Wrench,
      'coffee': Coffee,
      'briefcase': Briefcase,
      'building': Building2,
      'car': Car,
      'heart': Heart,
      'book': BookOpen,
      'dumbbell': Dumbbell,
      'music': Music,
      'gamepad': Gamepad2,
      'leaf': Leaf,
      'palette': Palette,
      'monitor': Monitor,
      'utensils': Utensils,
      'shopping': ShoppingBag,
      'gift': Gift,
      'star': Star,
      'crown': Crown,
      'shield': Shield,
      'zap': Zap,
      'sun': Sun,
      'moon': Moon,
      'cloud': Cloud,
      'snowflake': Snowflake,
      'flame': Flame,
      'anchor': Anchor,
      'plane': Plane,
      'train': Train,
      'bike': Bike,
      'truck': Truck,
      'box': FolderPlus,
    };
    
    const IconComponent = iconMap[iconName.toLowerCase()];
    return IconComponent || FolderPlus;
  }, []);

  // Get color for a location
  const getLocationColorValue = useCallback((locationName: string) => {
    return getLocationColor(locationName);
  }, []);

  // Sync locationInput with form.location when form changes externally
  useEffect(() => {
    setLocationInput(form.location || '');
  }, [form.location]);

  // Save location to cache when form is submitted
  const saveLocationToCache = useCallback(() => {
    if (form.location && form.location.trim()) {
      addCachedPrinterLocation(form.location);
    }
  }, [form.location]);

  // Close suggestions when clicking outside
  const locationRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync showRetryWarning prop with state
  useEffect(() => {
    if (showRetryWarningProp) {
      setShowRetryWarning(true);
    }
  }, [showRetryWarningProp]);

  // Start countdown before closing
  const startClosingCountdown = useCallback(() => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) {
          clearInterval(timer);
          return 0;
        }
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [onClose]);

  // Cache key for localStorage
  const CACHE_KEY = 'bambuddy.discovery.cache';

  // Discovery state
  const [discovering, setDiscovering] = useState(false);
  const [discovered, setDiscovered] = useState<DiscoveredPrinter[]>([]);
  const [discoveryError, setDiscoveryError] = useState('');
  const [hasScanned, setHasScanned] = useState(false);
  const [isDocker, setIsDocker] = useState(false);
  const [detectedSubnets, setDetectedSubnets] = useState<string[]>([]);
  const [subnet, setSubnet] = useState('');
  // Custom subnet — `__custom__` sentinel in the dropdown reveals a CIDR
  // text input so users can scan a subnet Bambuddy isn't directly on
  // (printer behind a router on a different L3 segment — SSDP multicast
  // won't cross that boundary, only an active unicast scan will). #1564
  const [customSubnet, setCustomSubnet] = useState('');
  const [useCustomSubnet, setUseCustomSubnet] = useState(false);
  const [scanProgress, setScanProgress] = useState({ scanned: 0, total: 0 });
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  // Load cached discovered printers from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached: DiscoveredPrinter[] = JSON.parse(raw);
        if (Array.isArray(cached) && cached.length > 0) {
          setDiscovered(cached);
          setHasScanned(true);
        }
      }
    } catch {
      // localStorage unavailable or corrupt data — start fresh on next scan
    }
  }, []);

  // Setup-time pre-flight: run the connection diagnostic on save and warn
  // (not block) when checks fail, so the user doesn't add a printer that
  // immediately shows offline. checkingSave = probe in flight; saveWarning =
  // failed result awaiting an explicit "save anyway".
  const [checkingSave, setCheckingSave] = useState(false);
  const [saveWarning, setSaveWarning] = useState<PrinterDiagnosticResult | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'manual'>('discover');
  const hasChangesRef = useRef(false);

  // Fetch discovery info on mount + restore the last custom CIDR the user
  // typed (kept in localStorage so they don't retype `10.1.1.0/24` every
  // time they open this modal).
  useEffect(() => {
    discoveryApi.getInfo().then(info => {
      setIsDocker(info.is_docker);
      if (info.subnets.length > 0) {
        setDetectedSubnets(info.subnets);
        setSubnet(info.subnets[0]);
      }
    }).catch(() => {
      // Ignore errors, assume not Docker
    });
    try {
      const saved = localStorage.getItem('bambuddy.discovery.customSubnet');
      if (saved) setCustomSubnet(saved);
    } catch {
      // localStorage unavailable (private mode, quota); recall is opportunistic
    }
  }, []);

  // Filter out already-added printers
  const newPrinters = discovered.filter(p => !existingSerials.includes(p.serial));

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Save location to cache before submitting
    saveLocationToCache();
    
    if (onAsyncAdd) {
      // Async mode: show countdown then close, parent handles async flow with toasts
      startClosingCountdown();
      // Start async add after a short delay to let countdown start
      setTimeout(() => {
        onAsyncAdd(form);
      }, 100);
    } else {
      // Fallback: old behavior (synchronous)
      setCheckingSave(true);
      try {
        const result = await api.diagnoseConnection({
          ip_address: form.ip_address.trim(),
          serial_number: form.serial_number.trim() || undefined,
          access_code: form.access_code || undefined,
        });
        if (result.checks.some((c) => c.status === 'fail')) {
          setSaveWarning(result);
          return;
        }
      } catch {
        // Diagnostic infrastructure failed — never block the save on it.
      } finally {
        setCheckingSave(false);
      }
      onAdd(form);
    }
  };

  // Force add without diagnostic
  const handleForceAdd = async () => {
    if (onAsyncAdd) {
      startClosingCountdown();
      setTimeout(() => {
        onAsyncAdd(form);
      }, 100);
    } else {
      // Skip diagnostic, add directly
      onAdd(form);
    }
  };

  const startDiscovery = async () => {
    setDiscoveryError('');
    setDiscovered([]);
    setDiscovering(true);
    setHasScanned(false);
    setScanProgress({ scanned: 0, total: 0 });

    // Native installs fall back to subnet scanning when the user picks
    // "Custom" — SSDP can't reach a printer on a different L3 segment
    // (#1564). Docker mode always uses subnet scan (multicast unavailable).
    const scanCidr = useCustomSubnet ? customSubnet.trim() : subnet;
    const wantsSubnetScan = isDocker || useCustomSubnet;

    if (wantsSubnetScan && useCustomSubnet) {
      try {
        localStorage.setItem('bambuddy.discovery.customSubnet', scanCidr);
      } catch {
        // localStorage write best-effort; user just retypes next time
      }
    }

    try {
      if (wantsSubnetScan) {
        await discoveryApi.startSubnetScan(scanCidr);

        // Poll for scan status and results
        const pollInterval = setInterval(async () => {
          try {
            const status = await discoveryApi.getScanStatus();
            setScanProgress({ scanned: status.scanned, total: status.total });

            const printers = await discoveryApi.getDiscoveredPrinters();
            setDiscovered(printers);

            if (!status.running) {
              clearInterval(pollInterval);
              setDiscovering(false);
              setHasScanned(true);
            }
          } catch (e) {
            console.error('Failed to get scan status:', e);
          }
        }, 500);
      } else {
        // Use SSDP discovery for native installs
        await discoveryApi.startDiscovery(10);

        // Poll for discovered printers every second
        const pollInterval = setInterval(async () => {
          try {
            const printers = await discoveryApi.getDiscoveredPrinters();
            setDiscovered(printers);
          } catch (e) {
            console.error('Failed to get discovered printers:', e);
          }
        }, 1000);

        // Stop after 10 seconds
        setTimeout(async () => {
          clearInterval(pollInterval);
          try {
            await discoveryApi.stopDiscovery();
          } catch {
            // Ignore stop errors
          }
          setDiscovering(false);
          setHasScanned(true);
          // Final fetch
          try {
            const printers = await discoveryApi.getDiscoveredPrinters();
            setDiscovered(printers);
          } catch (e) {
            console.error('Failed to get final discovered printers:', e);
          }
        }, 10000);
      }
    } catch (e) {
      console.error('Failed to start discovery:', e);
      setDiscoveryError(e instanceof Error ? e.message : t('printers.discovery.failedToStart'));
      setDiscovering(false);
      setHasScanned(true);
    }
  };

  const selectPrinter = (printer: DiscoveredPrinter) => {
    // Don't pre-fill serial if it's a placeholder (unknown-*) - user needs to enter actual serial
    const serialNumber = printer.serial.startsWith('unknown-') ? '' : printer.serial;
    setForm({
      ...form,
      name: printer.name || '',
      serial_number: serialNumber,
      ip_address: printer.ip_address,
      model: mapModelCode(printer.model),
    });
    // Keep cache — don't clear discovered (cache persists in localStorage)
    setHasChanges(true);
    hasChangesRef.current = true;
    // Switch to manual tab to show filled data
    setActiveTab('manual');
  };

  const handleFormChange = useCallback((newForm: PrinterCreate) => {
    setForm(newForm);
    setHasChanges(true);
    hasChangesRef.current = true;
  }, []);

  const handleOutsideClick = () => {
    if (hasChanges) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowCloseConfirm(false);
    onClose();
  };

  // Save discovered printers to localStorage cache on changes
  useEffect(() => {
    try {
      if (discovered.length > 0) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(discovered));
      }
    } catch {
      // localStorage quota exceeded or unavailable — best effort
    }
  }, [discovered]);

  // Cleanup discovery on unmount
  useEffect(() => {
    return () => {
      discoveryApi.stopDiscovery().catch(() => {});
      discoveryApi.stopSubnetScan().catch(() => {});
    };
  }, []);

  // Close on Escape key — disabled to avoid conflicts with ConfirmModal
  // Users can close by clicking outside or using the Cancel button

  return (
    <>
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleOutsideClick}
    >
      <Card className="w-full max-w-lg my-auto max-h-[calc(100vh-2rem)] overflow-y-auto" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bambu-green/20 to-bambu-green/5 flex items-center justify-center">
              <Printer className="w-5 h-5 text-bambu-green" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white">{t('printers.addPrinter.label')}</h2>
              <p className="text-sm text-bambu-gray mt-0.5">{t('printers.addPrinter.subtitle')}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-bambu-dark rounded-lg border border-bambu-dark-tertiary mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('discover')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'discover'
                  ? 'bg-bambu-green text-white shadow-sm'
                  : 'text-bambu-gray hover:text-white hover:bg-bambu-dark-tertiary'
              }`}
            >
              <Wifi className="w-4 h-4" />
              {t('printers.discovery.autoDiscover')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'manual'
                  ? 'bg-bambu-green text-white shadow-sm'
                  : 'text-bambu-gray hover:text-white hover:bg-bambu-dark-tertiary'
              }`}
            >
              <Globe className="w-4 h-4" />
              {t('printers.manualAdd.label')}
            </button>
          </div>

          {/* Discovery Section */}
          {activeTab === 'discover' && (
          <div className="mb-4 pb-4 border-b border-bambu-dark-tertiary">
            {/* Subnet picker — always visible. The dropdown lists detected
                interface subnets and a "Custom..." sentinel that reveals
                a CIDR text input for printers on a different L3 segment
                (router, VLAN, etc.). #1564 */}
            <div className="mb-3">
              <label className="block text-sm text-bambu-gray mb-1">
                {t('printers.discovery.subnetToScan')}
              </label>
              {detectedSubnets.length > 0 ? (
                <select
                  className="w-full px-3 py-2 bg-bambu-dark border border-bambu-dark-tertiary rounded-lg text-white focus:border-bambu-green focus:outline-none text-sm"
                  value={useCustomSubnet ? '__custom__' : subnet}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setUseCustomSubnet(true);
                    } else {
                      setUseCustomSubnet(false);
                      setSubnet(e.target.value);
                    }
                  }}
                  disabled={discovering}
                >
                  {detectedSubnets.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="__custom__">{t('printers.discovery.customSubnetOption')}</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-bambu-dark border border-bambu-dark-tertiary rounded-lg text-white focus:border-bambu-green focus:outline-none text-sm"
                  value={subnet}
                  onChange={(e) => setSubnet(e.target.value)}
                  placeholder="192.168.1.0/24"
                  disabled={discovering}
                />
              )}
              {useCustomSubnet && (
                <input
                  type="text"
                  aria-label={t('printers.discovery.customSubnetLabel')}
                  className="mt-2 w-full px-3 py-2 bg-bambu-dark border border-bambu-dark-tertiary rounded-lg text-white focus:border-bambu-green focus:outline-none text-sm"
                  value={customSubnet}
                  onChange={(e) => setCustomSubnet(e.target.value)}
                  placeholder="10.1.1.0/24"
                  disabled={discovering}
                />
              )}
              <p className="mt-1 text-xs text-bambu-gray">
                {isDocker
                  ? t('printers.discovery.dockerNote')
                  : t('printers.discovery.customSubnetNote')}
              </p>
            </div>


            <Button
              type="button"
              variant="secondary"
              onClick={startDiscovery}
              disabled={discovering}
              className="w-full"
            >
              {discovering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {(isDocker || useCustomSubnet) && scanProgress.total > 0
                    ? t('printers.discovery.scanProgress', { scanned: scanProgress.scanned, total: scanProgress.total })
                    : t('printers.discovery.scanning')}
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  {(isDocker || useCustomSubnet) ? t('printers.discovery.scanSubnet') : t('printers.discovery.discoverNetwork')}
                </>
              )}
            </Button>

            {discoveryError && (
              <div className="mt-2 text-sm text-red-700 dark:text-red-400">{discoveryError}</div>
            )}

            {/* Reset cache button — available when cache exists and not currently scanning */}
            {!discovering && discovered.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setDiscovered([]);
                  setHasScanned(false);
                  try { localStorage.removeItem(CACHE_KEY); } catch { /* best effort */ }
                }}
                className="w-full mt-2 text-xs text-bambu-gray hover:text-white"
              >
                {t('printers.discovery.resetCache')}
              </Button>
            )}

            {newPrinters.length > 0 && (
              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                {newPrinters.map((printer) => (
                  <div
                    key={printer.serial}
                    className="flex items-center justify-between p-2 bg-bambu-dark rounded-lg hover:bg-bambu-dark-secondary cursor-pointer transition-colors"
                    onClick={() => selectPrinter(printer)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white text-sm truncate">
                        {printer.name || printer.serial}
                      </p>
                      <p className="text-xs text-bambu-gray truncate">
                        {mapModelCode(printer.model) || t('printers.discovery.unknown')} • {printer.ip_address}
                        {printer.serial.startsWith('unknown-') && (
                          <span className="text-yellow-500"> • {t('printers.discovery.serialRequired')}</span>
                        )}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-bambu-gray -rotate-90 flex-shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            )}

            {discovering && (
              <p className="mt-2 text-sm text-bambu-gray text-center">
                {(isDocker || useCustomSubnet) ? t('printers.discovery.scanningSubnet') : t('printers.discovery.scanningNetwork')}
              </p>
            )}

            {hasScanned && !discovering && discovered.length === 0 && (
              <p className="mt-2 text-sm text-bambu-gray text-center">
                {(isDocker || useCustomSubnet) ? t('printers.discovery.noPrintersFoundSubnet') : t('printers.discovery.noPrintersFoundNetwork')}
              </p>
            )}

            {hasScanned && !discovering && discovered.length > 0 && newPrinters.length === 0 && (
              <p className="mt-2 text-sm text-bambu-gray text-center">
                {t('printers.discovery.allConfigured')}
              </p>
            )}
          </div>
          )}

          {/* Manual Form Section */}
          {activeTab === 'manual' && countdown === null && (
          <form onSubmit={handleAddSubmit} className="space-y-4">
            {/* Printer Info Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-bambu-gray uppercase tracking-wider flex items-center gap-2">
                <Printer className="w-4 h-4" />
                {t('printers.manualAdd.printerInfo')}
              </h3>
              <div className="grid gap-3">
                <div className="relative">
                  <label className="block text-sm text-bambu-gray mb-1.5">{t('printers.name')}</label>
                  <div className="relative">
                    <FolderPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bambu-gray/40" />
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-bambu-dark border border-bambu-dark-tertiary rounded-lg text-white focus:border-bambu-green focus:outline-none transition-colors"
                      value={form.name}
                      onChange={(e) => handleFormChange({ ...form, name: e.target.value })}
                      placeholder={t('printers.modal.myPrinter')}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <label className="block text-sm text-bambu-gray mb-1.5">{t('printers.ipAddress')}</label>
                    <div className="relative">
                      <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bambu-gray/40" />
                      <input
                        type="text"
                        required
                        pattern="(\d{1,3}(\.\d{1,3}){3}|[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*)"
                        className="w-full pl-10 pr-3 py-2.5 bg-bambu-dark border border-bambu-dark-tertiary rounded-lg text-white focus:border-bambu-green focus:outline-none transition-colors"
                        value={form.ip_address}
                        onChange={(e) => handleFormChange({ ...form, ip_address: e.target.value })}
                        placeholder="192.168.1.100"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm text-bambu-gray mb-1.5">{t('printers.serialNumber')}</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bambu-gray/40" />
                      <input
                        type="text"
                        required
                        className="w-full pl-10 pr-3 py-2.5 bg-bambu-dark border border-bambu-dark-tertiary rounded-lg text-white focus:border-bambu-green focus:outline-none transition-colors"
                        value={form.serial_number}
                        onChange={(e) => handleFormChange({ ...form, serial_number: e.target.value })}
                        placeholder="01P00A000000000"
                      />
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm text-bambu-gray mb-1.5">{t('printers.accessCode')}</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bambu-gray/40" />
                    <input
                      type="password"
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-bambu-dark border border-bambu-dark-tertiary rounded-lg text-white focus:border-bambu-green focus:outline-none transition-colors"
                      value={form.access_code}
                      onChange={(e) => handleFormChange({ ...form, access_code: e.target.value })}
                      placeholder={t('printers.modal.fromPrinterSettings')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-bambu-gray uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {t('printers.manualAdd.configuration')}
              </h3>
              <div className="grid gap-3">
                <div>
                  <label className="block text-sm text-bambu-gray mb-1.5">{t('printers.modal.modelOptional')}</label>
                  <select
                    className="w-full px-3 py-2.5 bg-bambu-dark border border-bambu-dark-tertiary rounded-lg text-white focus:border-bambu-green focus:outline-none transition-colors"
                    value={form.model || ''}
                    onChange={(e) => handleFormChange({ ...form, model: e.target.value })}
                  >
                    <option value="">{t('printers.modal.selectModel')}</option>
                    <optgroup label="A1 Series">
                      <option value="A1">A1</option>
                      <option value="A1 Mini">A1 Mini</option>
                    </optgroup>
                    <optgroup label="A2 Series">
                      <option value="A2L">A2L</option>
                    </optgroup>
                    <optgroup label="H2 Series">
                      <option value="H2C">H2C</option>
                      <option value="H2D">H2D</option>
                      <option value="H2D Pro">H2D Pro</option>
                      <option value="H2S">H2S</option>
                    </optgroup>
                    <optgroup label="P Series">
                      <option value="P1P">P1P</option>
                      <option value="P1S">P1S</option>
                      <option value="P2S">P2S</option>
                    </optgroup>
                    <optgroup label="X1 Series">
                      <option value="X1">X1</option>
                      <option value="X1C">X1 Carbon</option>
                      <option value="X1E">X1E</option>
                    </optgroup>
                    <optgroup label="X2 Series">
                      <option value="X2D">X2D</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-bambu-gray mb-1.5">{t('printers.modal.locationGroup')}</label>
                  <div ref={locationRef} className="relative">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bambu-gray/40" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-10 py-2.5 bg-bambu-dark border border-bambu-dark-tertiary rounded-lg text-white focus:border-bambu-green focus:outline-none transition-colors"
                        value={locationInput}
                        onChange={(e) => {
                          setLocationInput(e.target.value);
                          handleFormChange({ ...form, location: e.target.value });
                        }}
                        onFocus={() => setShowLocationSuggestions(true)}
                        placeholder={t('printers.modal.locationPlaceholder')}
                        autoComplete="off"
                      />
                      {cachedLocations.length > 0 && (
                        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bambu-gray/40 transition-transform ${showLocationSuggestions ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                    {showLocationSuggestions && filteredLocations.length > 0 && (
                      <div className="absolute z-50 mt-1 w-full bg-bambu-dark border border-bambu-dark-tertiary rounded-lg shadow-xl max-h-48 overflow-y-auto">
                        {filteredLocations.map((loc) => {
                          const IconComponent = getLocationIconComponent(loc);
                          const color = getLocationColorValue(loc);
                          return (
                            <button
                              key={loc}
                              type="button"
                              className="w-full px-3 py-2 text-left text-sm text-white hover:bg-bambu-dark-tertiary transition-colors flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                              onClick={() => {
                                setLocationInput(loc);
                                handleFormChange({ ...form, location: loc });
                                setShowLocationSuggestions(false);
                              }}
                            >
                              {IconComponent && (
                                <div
                                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: color ? color + '20' : undefined, border: color ? `1px solid ${color}40` : undefined }}
                                >
                                  <IconComponent
                                    className="w-3.5 h-3.5"
                                    style={{ color: color || undefined }}
                                  />
                                </div>
                              )}
                              {!IconComponent && (
                                <div
                                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-bambu-dark-tertiary"
                                >
                                  <MapPin className="w-3.5 h-3.5 text-bambu-gray/60" />
                                </div>
                              )}
                              <span className="truncate">{loc}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-bambu-gray mt-1.5">{t('printers.locationHelp')}</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-bambu-dark/50 rounded-lg border border-bambu-dark-tertiary">
                  <input
                    type="checkbox"
                    id="auto_archive"
                    checked={form.auto_archive}
                    onChange={(e) => handleFormChange({ ...form, auto_archive: e.target.checked })}
                    className="w-4 h-4 rounded border-bambu-dark-tertiary bg-bambu-dark text-bambu-green focus:ring-bambu-green cursor-pointer"
                  />
                  <div className="flex-1">
                    <label htmlFor="auto_archive" className="text-sm text-white cursor-pointer">
                      {t('printers.modal.autoArchiveLabel')}
                    </label>
                    <p className="text-xs text-bambu-gray mt-0.5">{t('printers.modal.autoArchiveHelp')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic & Actions */}
            <div className="pt-2 space-y-3">
              {showRetryWarning && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      {t('printers.toast.lastConnectionFailed')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowRetryWarning(false)}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline"
                  >
                    {t('common.dismiss')}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowDiagnostic(true)}
                disabled={!form.ip_address.trim()}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-bambu-gray hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-bambu-dark-tertiary rounded-lg transition-all hover:border-bambu-gray/30"
              >
                <Stethoscope className="w-4 h-4" />
                {t('diagnostic.runButton')}
              </button>

              {saveWarning ? (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 p-3 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                    <p className="text-sm text-amber-700 dark:text-amber-300">{t('printers.addPreflight.warning')}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setSaveWarning(null)}
                      className="flex-1"
                    >
                      {t('printers.addPreflight.back')}
                    </Button>
                    <Button type="button" onClick={() => onAdd(form)} className="flex-1">
                      {t('printers.addPreflight.saveAnyway')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" disabled={checkingSave} className="flex-1">
                    {checkingSave ? t('printers.addPreflight.checking') : t('printers.addPrinter.label')}
                  </Button>
                </div>
              )}
            </div>
          </form>
          )}

          {/* Countdown Banner — replaces form when on manual tab */}
          {activeTab === 'manual' && countdown !== null && countdown > 0 && (
            <div className="space-y-4">
              <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-4">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-base text-white font-medium">
                    {t('printers.toast.dataReceived')}
                  </p>
                  <p className="text-sm text-bambu-gray mt-1">
                    {t('printers.toast.closingIn', { seconds: countdown })}
                  </p>
                </div>
                <div className="text-4xl font-bold text-blue-400">{countdown}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    {showDiagnostic && (
      <ConnectionDiagnosticModal
        connection={{
          ip_address: form.ip_address.trim(),
          serial_number: form.serial_number.trim() || undefined,
          access_code: form.access_code || undefined,
        }}
        printerName={form.name || null}
        onClose={() => setShowDiagnostic(false)}
      />
    )}

    {showCloseConfirm && (
      <ConfirmModal
        title={t('printers.modal.closeConfirm.title')}
        message={t('printers.modal.closeConfirm.message')}
        confirmText={t('printers.modal.closeConfirm.confirm')}
        variant="danger"
        onConfirm={handleConfirmClose}
        onCancel={() => setShowCloseConfirm(false)}
      />
    )}
    </>
  );
}
