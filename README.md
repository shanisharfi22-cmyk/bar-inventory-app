# ניהול מלאי בר

אפליקציית ווב משותפת (mobile-first, PWA, RTL) לספירת מלאי משקאות והזמנות סחורה לבר.
כמה עובדים ממכשירים שונים רואים ומעדכנים את אותו מלאי בזמן אמת דרך Supabase.

## ארכיטקטורה

- **Frontend**: React + Vite, PWA (`vite-plugin-pwa`)
- **Backend**: Supabase — Postgres (טבלאות `products`, `suppliers`), Realtime, Storage (`product-images`)
- **Deploy**: Vercel / Netlify

## 1. יצירת פרויקט Supabase

1. היכנס/י ל-[supabase.com](https://supabase.com) וצור/י פרויקט חדש.
2. בתפריט **SQL Editor**, הרץ/י את התוכן של [`supabase/schema.sql`](supabase/schema.sql) — יוצר את הטבלאות, RLS, realtime ו-bucket לתמונות.
3. הרץ/י אחריו את [`supabase/seed.sql`](supabase/seed.sql) — מזין את 96 המוצרים ו-8 הספקים הבסיסיים (נוצר אוטומטית מ-`src/data/seedProducts.js`).
4. בתפריט **Project Settings → API**, העתק/י את ה-`Project URL` וה-`anon public key`.

## 2. חיבור האפליקציה

העתק/י את `.env.example` ל-`.env.local` (כבר נוצר) ומלא/י את הערכים:

```bash
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## 3. הרצה מקומית

```bash
npm install
npm run dev
```

האפליקציה תרוץ בכתובת `http://localhost:5173`. עד שממלאים את `.env.local` היא תציג מסך "חיבור ל-Supabase נדרש".

## 4. פריסה (Deploy)

פריסה ל-Vercel או Netlify: חברו את הריפו, הגדירו את משתני הסביבה `VITE_SUPABASE_URL` ו-`VITE_SUPABASE_ANON_KEY` בהגדרות הפרויקט שם, ופקודת build היא `npm run build` (תיקיית פלט: `dist`).

## מבנה נתונים

טבלת `products` (ראו `supabase/schema.sql` להגדרה המלאה):

| שדה | טיפוס | הסבר |
|---|---|---|
| `id` | integer (PK) | מזהה ייחודי |
| `name` | text | שם המוצר |
| `category` | text | קטגוריה |
| `supplier` | text (FK → suppliers.name) | ספק |
| `bar_stock` | integer | כמות בודדים בבר |
| `storage_boxes` | integer | ארגזים במחסן |
| `storage_singles` | integer | בודדים במחסן |
| `units_per_box` | integer | יחידות בארגז — ניתן לעריכה מהממשק |
| `min_limit` | integer | סף מינימום להזמנה — ניתן לעריכה מהממשק |
| `image_url` | text | קישור לתמונה ב-Supabase Storage |

`total = bar_stock + storage_boxes * units_per_box + storage_singles`

סטטוס: `danger` אם `total < min_limit`, `warn` אם `total < min_limit * 1.25 + 1`, אחרת `ok`.

## תמונות מוצר

תמונות מועלות דרך כפתור העריכה בכל כרטיס מוצר, ישירות ל-bucket `product-images` ב-Supabase Storage.
אין לגרד תמונות מסחריות מאתרי קמעונאות — יש להשתמש בתמונות שצולמו על ידי הבר, בקיטי מדיה רשמיים של היבואנים, או Wikimedia Commons למותגים בינלאומיים גדולים.

## פיצ'רים עיקריים

- **מסך ספירה**: חיפוש, טאבים לפי קטגוריה, סינון לפי ספק, כרטיס מוצר עם 3 שדות ספירה, מד בקבוק ויזואלי, תג סטטוס, עריכת מינימום/יח׳ בארגז/תמונה.
- **מסך הזמנות**: מוצרים מתחת למינימום, מקובצים לפי ספק, עם עיגול לארגזים שלמים ושליחה בוואטסאפ (`wa.me`).
- **עדכון בזמן אמת**: כל שינוי נשמר מיידית ל-Supabase ומשודר לכל שאר המכשירים דרך Realtime.
- **ייצוא CSV**: כפתור בראש מסך הספירה, עם BOM כך שעברית מוצגת נכון באקסל.
- **איפוס ספירה**: מאפס `bar_stock` / `storage_boxes` / `storage_singles` לכל המוצרים (עם אישור), לא מוחק מוצרים.
