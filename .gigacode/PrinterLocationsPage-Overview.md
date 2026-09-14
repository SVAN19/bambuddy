# Printer Locations Page — Overview

The Printer Locations page organizes printers into named groups (locations) with visual customization, sorting, filtering, and bulk operations.

---

## Features

### Group Management
- **Create groups** with custom names
- **Edit groups** — change name, icon, and color
- **Delete a single group** — all printers move to "Ungrouped"
- **Bulk delete** multiple groups via selection mode

### Visual Customization
- **31 icons** from lucide-react for each group (IconPicker)
- **9 color presets** for quick visual identification
- Icon and color displayed on group cards, persisted in localStorage

### Sorting & Filtering
- **4 sort modes**: Name A→Z, Z→A, Count ↑, Count ↓
- "Ungrouped" always stays first regardless of sort mode
- **Hide/show empty groups** (groups with no printers)
- **Search** groups by name

### Printer Management
- **Expand groups** to view printers with status (online/printing/offline)
- **Move a single printer** to another group
- **Remove printer from group** (moves to "Ungrouped")
- **Bulk move** selected printers between groups

### Bulk Operations
- **Group selection mode** — "Select"/"Done" button enables checkboxes on group cards, hide expand arrows, disable group expansion
- **Bulk delete bar** — fixed bottom bar with confirmation modal showing actual printer count
- **Bulk move bar** — fixed bottom bar for moving selected printers

### Persistence
- Sort mode saved in localStorage (`locationSortMode`)
- Hide empty setting saved in localStorage (`hideEmptyGroups`)
- Group icons saved in localStorage (`printerLocationIcons`)
- Group colors saved in localStorage (`printerLocationColors`)
- Group name cache for autocomplete (`printerLocationsCache`)

### Localization
- Full i18n support with correct pluralization for all languages (printer/printers, принтер/принтера/принтеров)

---

## Technical Architecture

### State Management
- **React Query** (`useQuery`, `useMutation`) — data loading and caching
- **useState** — local UI state (modals, selection, sorting)
- **localStorage** — persistent settings (sorting, hideEmpty, icons, colors)

### Utils
- `printerLocationsCache.ts` — group name cache for autocomplete
- `printerLocationIcons.ts` — maps `locationName → iconName`
- `printerLocationColors.ts` — maps `locationName → color`

### Mutations
| Mutation | Purpose |
|----------|---------|
| `deleteLocationMutation` | Delete a single group |
| `editLocationMutation` | Rename + change icon/color |
| `movePrinterMutation` | Move a single printer |
| `bulkMoveMutation` | Bulk move printers |
| `bulkDeleteGroupsMutation` | Bulk delete groups |
| `createLocationMutation` | Create empty group |
| `removeFromGroupMutation` | Remove printer from group |

### Sort Modes
```typescript
type SortMode = 'name-asc' | 'name-desc' | 'count-asc' | 'count-desc';
```
Ungrouped always first. Named groups sorted by selected mode. Secondary sort by name for stability.

### localStorage Schema
```
localStorage:
  printerLocationsCache   → string[]       (group names)
  printerLocationIcons    → { [name]: string } (name → iconName)
  printerLocationColors   → { [name]: string } (name → color hex)
  locationSortMode        → SortMode
  hideEmptyGroups         → boolean
```

### Component Structure
- `PrinterLocationsPage.tsx` — main page component (~1100 lines)
- `utils/printerLocationIcons.ts` — icon persistence utilities
- `utils/printerLocationColors.ts` — color persistence utilities
- `components/IconPicker.tsx` — reused existing icon picker (31 icons)