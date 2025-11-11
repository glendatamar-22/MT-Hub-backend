# Feature Update - November 2025

## Summary of Changes

This update adds several new features to the Minu Tantsukool application, including a logo header, CSV export functionality, and enhanced user management.

---

## 1. Logo Header Implementation ✅

### Frontend Changes

**New Component: `frontend/src/components/AppHeader.jsx`**
- Reusable header component with MT logo
- Logo image: `https://i.postimg.cc/y8NjSQHT/MT-Logo.jpg`
- Max height: 56px (responsive on mobile: 40-48px)
- Logo is clickable and navigates to dashboard
- Includes user menu with logout and admin access
- Supports optional back button and custom title

**Updated Pages:**
- `frontend/src/pages/Dashboard.jsx` - Uses `<AppHeader />`
- `frontend/src/pages/GroupDetail.jsx` - Uses `<AppHeader title={group.name} showBackButton />`
- `frontend/src/pages/AdminPanel.jsx` - Uses `<AppHeader title="Admin Paneel" showBackButton />`
- `frontend/src/pages/AdminGroupBulkEdit.jsx` - Uses `<AppHeader title="Rühma bulk-muutmine" showBackButton />`

### Features:
- ✅ Logo displays in all authenticated pages
- ✅ Responsive design (mobile-friendly)
- ✅ Maintains existing navigation functionality
- ✅ Consistent header across the app

---

## 2. CSV Export for Groups ✅

### Backend Changes

**Route: `backend/routes/groups.js`**
- Added `GET /api/groups/:id/export-csv`
- Admin-only access
- Exports group students with parent data
- **UTF-8 BOM** included for Estonian characters (äöüõ)

**CSV Columns:**
1. Grupi nimi (Group Name)
2. Õpilase nimi (Student Name)
3. Õpilase vanus (Student Age)
4. Lapsevanema nimi (Parent Name)
5. Lapsevanema e-post (Parent Email)
6. Telefon (Phone)

**CSV Features:**
- Proper escaping for commas, quotes, and newlines
- UTF-8 with BOM encoding for Excel compatibility
- Estonian characters display correctly
- Filename: `{group_name}_opilased.csv`

### Frontend Changes

**Updated: `frontend/src/pages/AdminPanel.jsx`**
- Added download icon button to groups table
- Function: `handleExportGroupCSV(groupId)`
- Creates blob and triggers browser download
- Filename based on group name

### Usage:
1. Navigate to Admin Panel → Grupid tab
2. Click the green download icon next to any group
3. CSV file downloads automatically
4. Opens correctly in Excel with Estonian characters

---

## 3. Enhanced User Management ✅

### Backend Changes

**Route: `backend/routes/admin.js`**
- Updated `PUT /api/admin/users/:id`
- Now accepts: `name`, `email`, `role`, `assignedGroups`
- Allows admins to edit user details and change roles

### Frontend Changes

**Updated: `frontend/src/pages/AdminPanel.jsx`**

**New State:**
- `editUser` - Tracks user being edited

**Modified User Dialog:**
- Now supports both create and edit modes
- Edit mode: Shows existing user data
- Edit mode: Password field hidden (users can't change passwords via admin panel)
- Role dropdown: Switch between `teacher` and `admin`

**New Function:**
- `handleUpdateUser()` - Sends PUT request to update user

**UI Updates:**
- Edit icon (pencil) added to each user row
- Click to open pre-filled dialog
- Dynamic dialog title: "Lisa kasutaja" or "Muuda kasutajat"
- Dynamic button text: "Lisa" or "Salvesta"

### Features:
- ✅ Edit user name
- ✅ Edit user email
- ✅ Switch user role (teacher ↔ admin)
- ✅ Create new users (existing functionality maintained)
- ⚠️ Password changes not supported via admin panel (security feature)

---

## Testing Checklist

### Logo Header
- [ ] Logo displays on dashboard
- [ ] Logo displays on group detail page
- [ ] Logo displays on admin panel
- [ ] Logo displays on bulk edit page
- [ ] Logo is clickable and navigates to home
- [ ] User menu works correctly
- [ ] Responsive on mobile devices

### CSV Export
- [ ] Download button visible in groups table
- [ ] CSV downloads with correct filename
- [ ] Estonian characters display correctly (äöüõ)
- [ ] All columns present
- [ ] Data matches database
- [ ] Opens correctly in Excel/LibreOffice
- [ ] Commas in names don't break formatting

### User Management
- [ ] Edit button appears for each user
- [ ] Click opens pre-filled dialog
- [ ] Can edit user name
- [ ] Can edit user email
- [ ] Can change user role
- [ ] Save button updates user
- [ ] Changes reflect in user list
- [ ] Create new user still works

---

## File Changes Summary

### New Files:
1. `frontend/src/components/AppHeader.jsx` - Reusable header component with logo

### Modified Frontend Files:
1. `frontend/src/pages/Dashboard.jsx` - Integrated AppHeader
2. `frontend/src/pages/GroupDetail.jsx` - Integrated AppHeader
3. `frontend/src/pages/AdminPanel.jsx` - Integrated AppHeader, CSV export, user editing
4. `frontend/src/pages/AdminGroupBulkEdit.jsx` - Integrated AppHeader

### Modified Backend Files:
1. `backend/routes/groups.js` - Added CSV export endpoint
2. `backend/routes/admin.js` - Enhanced user update endpoint

---

## API Endpoints Added/Modified

### New Endpoints:
```
GET /api/groups/:id/export-csv
  - Admin only
  - Returns CSV file (UTF-8 with BOM)
  - Response type: text/csv
```

### Modified Endpoints:
```
PUT /api/admin/users/:id
  - Previously: { role, assignedGroups }
  - Now: { name, email, role, assignedGroups }
```

---

## Security Notes

- All new endpoints require authentication
- CSV export restricted to admin role only
- User management restricted to admin role only
- Password changes not allowed via admin panel (prevents unauthorized password resets)
- Logo served from external CDN (PostImg)

---

## Deployment Notes

1. **Frontend:**
   - New component `AppHeader.jsx` needs to be deployed
   - All page components updated
   - No new dependencies required

2. **Backend:**
   - Updated routes: `groups.js`, `admin.js`
   - No new dependencies required
   - No database migrations needed

3. **Environment Variables:**
   - No new environment variables required

---

## Known Limitations

1. **Logo:** Hosted on external CDN (PostImg). If the URL becomes unavailable, logo won't display.
2. **CSV Export:** No pagination - exports all students in group (could be slow for very large groups)
3. **User Password:** Admins cannot reset user passwords through the panel. Users must use forgot password flow.

---

## Future Enhancements (Not Implemented)

- Bulk user role changes (checkbox + bulk action)
- Password reset functionality in admin panel
- CSV export with custom column selection
- Logo upload/management in admin panel
- Export all groups at once (mega CSV)

---

## Estonian Language Support

All new features maintain Estonian language support:
- CSV headers in Estonian
- UI labels in Estonian
- UTF-8 with BOM ensures åäöüõ display correctly in Excel
- Dialog titles and buttons in Estonian

---

## Questions or Issues?

If you encounter any issues with these new features:

1. Check browser console for errors
2. Verify backend is running (`npm run dev` in `backend/`)
3. Verify frontend is running (`npm run dev` in `frontend/`)
4. Check that user has admin role for CSV export and user editing
5. Verify logo URL is accessible: https://i.postimg.cc/y8NjSQHT/MT-Logo.jpg

