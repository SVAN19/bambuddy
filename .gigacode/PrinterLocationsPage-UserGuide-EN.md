# Printer Locations — User Guide

Organize printers by locations (groups), customize their appearance, and manage bulk operations.

---

## Table of Contents

1. [What is this page for](#what-is-this-page-for)
2. [Page overview](#page-overview)
3. [Creating a group](#creating-a-group)
4. [Customizing group icon and color](#customizing-group-icon-and-color)
5. [Editing a group](#editing-a-group)
6. [Viewing printers in a group](#viewing-printers-in-a-group)
7. [Moving a printer to a group](#moving-a-printer-to-a-group)
8. [Removing a printer from a group](#removing-a-printer-from-a-group)
9. [Bulk delete groups](#bulk-delete-groups)
10. [Bulk move printers](#bulk-move-printers)
11. [Sorting groups](#sorting-groups)
12. [Searching groups](#searching-groups)
13. [Hiding empty groups](#hiding-empty-groups)

---

## What is this page for

Groups help you organize printers by location: workshop, office, lab, warehouse, and more. This makes navigation, filtering, and bulk management easier.

---

## Page overview

[![Screenshot: Page overview](../docs/screenshots/printer_locations_overview.png)]

The page displays a list of all printer groups. Each group is shown as a card with a name, icon, color, and printer count.

**At the bottom** — "Ungrouped Printers" section with all printers not yet assigned to any group.

---

## Creating a group

[![Screenshot: Creating a group](../docs/screenshots/printer_locations_create.png)]

1. Click **"New Location"** (green plus) in the top bar
2. Enter a group name (e.g., "Workshop")
3. Choose an icon and color (optional)
4. Click **"Create"**

Group created! Now you can move printers into it.

---

## Customizing group icon and color

[![Screenshot: Icon and color customization](../docs/screenshots/printer_locations_icon_color.png)]

When creating or editing a group, you can customize its appearance:

**Icons (31 options):**
- 🏠 Home, 🏢 Building, 🏭 Factory
- 💻 Computer, 🖨️ Printer, 🔧 Tools
- ☕ Coffee, 📦 Box, 📚 Book
- And many more...

**Colors (9 presets):**
- 🔴 Red, 🟠 Orange, 🟡 Yellow
- 🟢 Green, 🔵 Blue, 🟣 Purple
- And others...

Selected icon and color are saved and displayed on the group card.

---

## Editing a group

[![Screenshot: Editing a group](../docs/screenshots/printer_locations_edit.png)]

1. Hover over the group card
2. Click **"✏️ Edit"**
3. Change the name, icon, or color
4. Click **"Save"**

**Important:** If you change the group name, the old icon and color are removed — you need to select new ones.

---

## Viewing printers in a group

[![Screenshot: Expanded group](../docs/screenshots/printer_locations_expanded.png)]

Click on a group card to expand the list of printers inside.

**Each printer shows:**
- 🟢 **Green indicator** — printer is online
- 🟠 **Orange indicator** — printer is printing or paused
- ⚫ **Grey indicator** — printer is offline
- **Status badge** — Printing, Paused, Finished, Idle, or Offline

---

## Moving a printer to a group

[![Screenshot: Moving a printer](../docs/screenshots/printer_locations_move.png)]

**From "Ungrouped":**
1. Expand the "Ungrouped Printers" section
2. Find the printer you want to move
3. Click **"Move"** (arrow icon)
4. Select the target group from the dropdown
5. Click **"Move"**

**From another group:**
1. Expand the source group
2. Click **"Move"** next to the printer
3. Select the new group

**Remove from group:** Select "Ungrouped" from the list.

---

## Removing a printer from a group

1. Expand the group
2. Find the printer
3. Click **"Remove from group"** (UserMinus icon)

The printer will move to the "Ungrouped Printers" section.

---

## Bulk delete groups

[![Screenshot: Bulk delete groups](../docs/screenshots/printer_locations_bulk_delete.png)]

**Step 1:** Click **"Select"** in the top bar.

**Step 2:** Check the groups you want to delete (checkboxes will appear).

**Step 3:** A fixed bar appears at the bottom with a **"Delete selected"** button (red).

**Step 4:** Confirm deletion in the modal dialog. The system will show how many printers will be ungrouped.

**Result:** All printers from deleted groups move to "Ungrouped Printers".

---

## Bulk move printers

[![Screenshot: Bulk move](../docs/screenshots/printer_locations_bulk_move.png)]

**Step 1:** Expand the groups you need.

**Step 2:** Check the printers you want to move.

**Step 3:** A fixed bar appears at the bottom with a **"Move"** button.

**Step 4:** Select the target group and confirm.

All selected printers will be moved to the chosen group.

---

## Sorting groups

[![Screenshot: Sorting groups](../docs/screenshots/printer_locations_sort.png)]

Click the sort button with the ↕ arrow next to "Select".

**Available modes:**
- **Name A→Z** — alphabetically (A-Z)
- **Name Z→A** — alphabetically (Z-A)
- **Count ↑** — by printer count (ascending)
- **Count ↓** — by printer count (descending)

"Ungrouped" always stays at the top.

---

## Searching groups

[![Screenshot: Searching groups](../docs/screenshots/printer_locations_search.png)]

Enter a group name in the search field in the top bar. The list is instantly filtered by the entered text.

Works together with the "Hide empty" filter.

---

## Hiding empty groups

[![Screenshot: Hide empty groups](../docs/screenshots/printer_locations_hide_empty.png)]

Click **"Hide empty"** in the top bar.

- **Hide empty** — hides groups without printers
- **Show empty** — shows all groups including empty ones

The setting is saved between sessions.

---

## Deleting a group

[![Screenshot: Deleting a group](../docs/screenshots/printer_locations_delete.png)]

1. Hover over the group card
2. Click **"Delete"** (trash icon)
3. Confirm deletion in the modal dialog

The system will show how many printers will be ungrouped. All printers will move to "Ungrouped Printers".

---

## Organization tips

**Recommended groups:**
- 🏠 Home — printers for home use
- 🏢 Office — office printers
- 🏭 Workshop — workshop printers
- 📦 Warehouse — warehouse printers
- 🔧 Testing — printers for testing and development

**Use colors for quick identification:**
- 🟢 Green — active/main groups
- 🔴 Red — critical/testing groups
- 🔵 Blue — office groups
- 🟡 Yellow — groups needing attention

**Tips:**
- Assign printers to groups when setting them up
- Use icons for quick visual navigation
- Sort by printer count to see the most loaded groups first
- Hide empty groups to keep the list clean
