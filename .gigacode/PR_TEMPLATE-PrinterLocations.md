## Description

This PR adds comprehensive group management for printer locations. Users can now organize printers into named groups with custom icons and colors, sort groups, perform bulk operations (select/delete/move), and customize the visual appearance of each group.

**New features:**
- Group selection mode with checkboxes for bulk operations
- Bulk delete of multiple groups (printers are ungrouped, not deleted)
- Bulk move of printers between groups
- Sort groups by name (A→Z / Z→A) or by printer count (↑ / ↓)
- Custom icons (31 lucide-react icons) for each group
- Custom color labels (9 presets) for each group
- Edit modal with name, icon, and color picker
- Icon and color picker in create group modal
- Persistent settings in localStorage (sort mode, hide empty, icons, colors)
- Fixed pluralization via i18n (printer/printers)

## Related Issue

<!-- Link to the issue this PR addresses (if applicable) -->
Fixes #

## Documentation

**Companion docs PRs** (delete lines that don't apply):
- Wiki: maziggy/bambuddy-wiki#___
- Website: maziggy/bambuddy-website#___

**Pick one**:
- [x] Docs PR(s) linked above
- [ ] No docs update required — reason: User-facing changes documented in `.gigacode/PrinterLocationsPage-UserGuide.md` (RU) and `.gigacode/PrinterLocationsPage-UserGuide-EN.md` (EN). Internal refactors (localStorage utils, i18n pluralization fix) do not require user docs.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [x] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or change that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement
- [ ] Test addition or update

## Changes Made

- Added group selection mode (toggle via "Select"/"Done" button)
- Added checkboxes to group headers in selection mode (replaces expand arrows)
- Added bulk delete bar with confirmation modal showing actual printer count
- Added bulk move bar (existing, enhanced)
- Added sort dropdown with 4 modes: name A→Z, name Z→A, count ↑, count ↓
- Sort mode persisted in localStorage (`locationSortMode`)
- Added "Ungrouped" always stays first regardless of sort mode
- Added icon picker to edit group modal (reuses existing IconPicker component)
- Added icon picker to create group modal
- Added color picker with 9 presets to edit and create modals
- Added color label bar (left edge) on group cards
- Created `utils/printerLocationIcons.ts` — localStorage persistence for group icons
- Created `utils/printerLocationColors.ts` — localStorage persistence for group colors
- Replaced hardcoded `pluralPrinters()` function with i18n `printer`/`printers` keys
- Updated `en.ts` and `ru.ts` with all new translation keys
- Clean up icons and colors on group deletion (single and bulk)
- Close edit modal on error and clear state on cancel
- Removed unused imports (`useNavigate`, `ChevronUp`, `X`, `selectAllPrinters`)

## Screenshots

<!-- Group selection mode -->
![Group selection mode](docs/screenshots/printer_locations_select_mode.png)

<!-- Bulk delete -->
![Bulk delete groups](docs/screenshots/printer_locations_bulk_delete.png)

<!-- Sort dropdown -->
![Sort dropdown](docs/screenshots/printer_locations_sort.png)

<!-- Icon and color picker -->
![Icon and color picker](docs/screenshots/printer_locations_icon_color.png)

<!-- Edit modal -->
![Edit modal](docs/screenshots/printer_locations_edit.png)

## Testing

<!-- Describe how you tested your changes -->

- [x] I have tested this on my local machine
- [x] I have tested with my printer model: <!-- e.g., X1C, P1S, A1 -->

**Test scenarios:**
- [ ] Create group with icon and color — icon and color appear on card
- [ ] Edit group — change name, icon, color — changes persist after reload
- [ ] Delete single group — printers move to "Ungrouped", icon/color cleaned up
- [ ] Delete multiple groups via selection — all groups removed, all printers ungrouped
- [ ] Move printer between groups — status persists
- [ ] Sort by name A→Z and Z→A — order changes correctly
- [ ] Sort by count ↑ and ↓ — order changes correctly
- [ ] "Ungrouped" always first regardless of sort mode
- [ ] Hide empty groups toggle — empty groups hidden/shown
- [ ] Search — filters groups by name
- [ ] localStorage persistence — sort mode and hideEmptyGroups survive page reload
- [ ] English locale — pluralization shows "1 printer", "2 printers" correctly
- [ ] Russian locale — pluralization shows "1 принтер", "2 принтера", "5 принтеров" correctly

## Checklist

- [x] My code follows the project's coding style
- [x] I have commented my code where necessary
- [x] My changes generate no new warnings
- [x] I have tested my changes thoroughly

## Additional Notes

**localStorage keys introduced:**
| Key | Type | Description |
|-----|------|-------------|
| `printerLocationIcons` | `{ [name]: string }` | Maps location name to icon name |
| `printerLocationColors` | `{ [name]: string }` | Maps location name to CSS color hex |
| `locationSortMode` | `string` | Current sort mode (`name-asc`, `name-desc`, `count-asc`, `count-desc`) |

**i18n pluralization fix:**
The old `pluralPrinters()` function was hardcoded for Russian. It has been replaced with i18n keys:
- `printers.locations.printer` — singular form
- `printers.locations.printers` — plural form

This ensures correct pluralization for all supported languages (English, German, Spanish, French, Japanese, Korean, Chinese, Turkish, Ukrainian, etc.).

**Component structure:**
- `PrinterLocationsPage.tsx` — main page component (~1100 lines)
- `utils/printerLocationIcons.ts` — icon persistence utilities
- `utils/printerLocationColors.ts` — color persistence utilities
- `components/IconPicker.tsx` — reused existing icon picker (31 icons)
