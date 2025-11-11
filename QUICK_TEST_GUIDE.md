# Quick Test Guide - New Features

## 🚀 How to Test the New Features

### Prerequisites
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Visit: http://localhost:5173
Login with admin credentials

---

## ✅ Feature 1: Logo Header

**What to look for:**
- MT logo appears in top-left corner (instead of text)
- Logo is ~56px height, responsive on mobile
- Logo is clickable → takes you to dashboard
- User menu still works (profile icon on right)

**Test Steps:**
1. Log in
2. Check dashboard - logo visible?
3. Click logo → goes to home?
4. Navigate to different pages (group detail, admin) - logo everywhere?
5. Resize browser → logo scales on mobile?

---

## ✅ Feature 2: CSV Export

**What to look for:**
- Green download icon in Admin Panel → Grupid tab
- Click downloads CSV file
- Estonian characters (õ, ä, ö, ü) display correctly in Excel

**Test Steps:**
1. Go to Admin Panel
2. Click "Grupid" tab
3. Find download icon (between edit and delete)
4. Click download icon
5. Open CSV in Excel/LibreOffice
6. Verify:
   - Filename: `{group_name}_õpilased.csv`
   - Columns: Grupi nimi, Õpilase nimi, Õpilase vanus, Lapsevanema nimi, Lapsevanema e-post, Telefon
   - Estonian characters display correctly
   - Data matches admin panel

**Test CSV Content:**
```csv
Grupi nimi,Õpilase nimi,Õpilase vanus,Lapsevanema nimi,Lapsevanema e-post,Telefon
Algajad,Mari Mägi,8,Kati Mägi,kati.magi@email.ee,5551234
```

---

## ✅ Feature 3: User Management

**What to look for:**
- Edit icon (pencil) next to each user in Admin Panel → Kasutajad tab
- Click opens dialog with pre-filled user data
- Can change name, email, role
- Save updates the user

**Test Steps:**
1. Go to Admin Panel
2. Click "Kasutajad" tab
3. Click pencil icon next to any user
4. Dialog opens with user data
5. Change name (e.g., add "TEST" to name)
6. Change role (teacher → admin or vice versa)
7. Click "Salvesta"
8. Verify user list updates
9. Refresh page - changes persist?

**Notes:**
- Password field NOT shown in edit mode (security)
- Can still create new users with "Lisa kasutaja" button

---

## 🐛 Common Issues

### Logo doesn't display
- Check URL: https://i.postimg.cc/y8NjSQHT/MT-Logo.jpg
- Check browser console for errors
- Verify internet connection (logo is external)

### CSV download fails
- Check user has admin role
- Check backend console for errors
- Verify group has students

### User edit doesn't save
- Check user has admin role
- Check backend console for errors
- Verify email is valid format

---

## 🎯 Expected Behavior Summary

| Feature | Action | Expected Result |
|---------|--------|-----------------|
| Logo | Click logo | Navigate to dashboard |
| Logo | View on mobile | Scales to 40-48px |
| CSV Export | Click download icon | CSV downloads with Estonian chars |
| CSV Export | Open in Excel | All columns visible, chars correct |
| User Edit | Click pencil icon | Dialog opens with user data |
| User Edit | Change role | User role updates in list |
| User Edit | Save changes | User updates in database |

---

## 📝 Quick Regression Tests

Make sure existing features still work:

- [ ] Login/logout works
- [ ] Dashboard shows groups
- [ ] Group detail page loads
- [ ] Can create new students
- [ ] Can create new groups
- [ ] Bulk group edit works
- [ ] Admin panel stats display
- [ ] Updates/schedule features work

---

## 🔧 Developer Commands

```bash
# Backend
cd backend
npm run dev          # Start dev server
npm run seed        # Re-seed database if needed

# Frontend  
cd frontend
npm run dev          # Start dev server
npm run build       # Production build
```

---

## 📞 Need Help?

1. Check `FEATURE_UPDATE.md` for detailed documentation
2. Check browser console (F12) for errors
3. Check backend terminal for API errors
4. Verify you're logged in as admin

