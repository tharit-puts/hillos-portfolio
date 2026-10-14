---
name: hillos-window
description: Use when adding, changing or debugging a window (an "app" such as About, Projects, Terminal, Guestbook) in HillOS, the desktop-OS style portfolio. Covers the tech stack, how a window is registered and rendered, the design tokens, the project's conventions and the pitfalls already hit. เรียกใช้เมื่อสร้าง/แก้หน้าต่างแอปใหม่ใน HillOS
---

# HillOS: แนวทางสร้างหน้าต่าง (window / app)

HillOS คือ portfolio ของ Tharit "Hill" Putsorn ที่ทำหน้าตาเป็นระบบปฏิบัติการ แต่ละ "แอป" คือหน้าต่างที่ลาก ย่อ ปิดได้
Skill นี้บอกว่าโปรเจกต์ใช้เทคโนโลยีอะไร และถ้าจะเพิ่มหรือแก้หน้าต่าง ต้องทำตามขั้นตอนไหน

## 1. Tech stack

### ที่โปรเจกต์นี้ใช้จริง (ดู `package.json`)

| ด้าน | เทคโนโลยี |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack ตอน dev) |
| UI | React 19 |
| ภาษา | TypeScript (strict, ใช้ union type อย่าง `AppId` แทน `string`) |
| สไตล์ | Tailwind CSS v4 (tokens อยู่ใน `@theme` ของ `src/app/globals.css`) |
| ฟอนต์ | Silkscreen (`font-pixel`) + JetBrains Mono ผ่าน `next/font` |
| Test | Vitest (เทสต์ logic ที่เป็น pure function) |
| Lint | ESLint 9 + `eslint-config-next` |
| Backend/DB | Supabase (Postgres) ผ่าน `@supabase/supabase-js` + `server-only` |
| Deploy | Vercel |

### เทคโนโลยีที่เจ้าของโปรเจกต์รู้ (จาก `src/content/skills.ts` และ `projects.ts`)

- **Frontend:** HTML, CSS, JavaScript, TypeScript, React, Next.js, Vue, Tailwind CSS
- **Backend:** Node.js, Express.js, Java, Spring Boot, PostgreSQL, MongoDB, Supabase, Prisma
- **Tools & Other:** Git, GitHub, Stripe, Clerk, JWT, Gemini API, Cursor, Claude
- **โปรเจกต์ที่เคยทำ:** Neatly Hotel (Next.js, TypeScript, Supabase, Prisma, Stripe, Gemini), Course Flow (Vue, Java, Clerk), Blog Post (React, Tailwind, JavaScript, Supabase), AskHub API (Express, PostgreSQL)

เมื่อต้องเลือกเครื่องมือสำหรับฟีเจอร์ใหม่ ให้เลือกจากกลุ่มที่เจ้าของรู้อยู่แล้วก่อน
(เช่น ต้องการ database → Supabase หรือ PostgreSQL/MongoDB, ต้องการ ORM → Prisma, ต้องการ auth → Clerk หรือ JWT) อย่าเพิ่ม dependency ใหม่ถ้า stack เดิมทำได้

## 2. หน้าต่างทำงานยังไง

```
คลิกไอคอน / พิมพ์ "open guestbook"
  → useOS().open(id)                         src/os/OSProvider.tsx
  → osReducer(state, { type: "open", ... })  src/os/reducer.ts   (pure, มีเทสต์)
  → state.windows[]  (ลำดับในอาร์เรย์ = z-order, ตัวท้ายอยู่บนสุด)
  → <Desktop> render แอปที่เปิดอยู่ใน <Window>  src/components/Desktop.tsx
```

| ไฟล์ | หน้าที่ |
|---|---|
| `src/os/types.ts` | `AppId`, `WindowState {id, position, minimized}`, `OSAction` |
| `src/os/reducer.ts` | logic ทั้งหมดของหน้าต่าง (open / close / focus / move / minimize / refill / shutdown) |
| `src/os/OSProvider.tsx` | React Context + `useOS()`; `initialOSState` กำหนดว่าเปิดอะไรตอนเริ่ม |
| `src/os/useDrag.ts` | ลาก title bar ด้วย Pointer Events (ปิดบนมือถือ) |
| `src/apps/manifest.ts` | metadata ของแอป: ชื่อ ตำแหน่ง ความกว้าง/สูง สี title bar |
| `src/apps/registry.tsx` | จับคู่ `AppId` → component |
| `src/components/icons.tsx` | `AppIcon` วาดไอคอน desktop (SVG, `switch` ครบทุก `AppId`) |
| `src/components/Window.tsx` | กรอบหน้าต่าง: title bar, ปุ่มย่อ/ปิด, z-index, โหมดมือถือ |
| `src/components/Desktop.tsx` | render หน้าต่าง, จัดการ `Esc`, boot/shutdown |
| `src/apps/terminal/commands.ts` | `open <app>` และ Tab-complete อ่านจาก manifest เอง |

## 3. ขั้นตอนเพิ่มหน้าต่างใหม่ (ตัวอย่าง id: `notes`)

TypeScript จะฟ้องทุกจุดที่ลืม (เพราะ `manifest` และ `registry` เป็น `Record<AppId, ...>`) ทำตามที่มันบอก

1. **`src/os/types.ts`**: เพิ่ม `| "notes"` ใน `AppId`
2. **`src/apps/manifest.ts`**: เพิ่ม entry
   ```ts
   notes: {
     id: "notes",
     label: "Notes.txt",          // ข้อความใต้ไอคอน
     title: "Notes.txt",          // ข้อความใน title bar
     defaultPosition: { x: 260, y: 180 },
     widthClass: "w-[420px]",
     heightClass: "md:h-[560px]", // ไม่บังคับ; ต้องมี md: นำหน้าเสมอ
     titleBarClass: "bg-mint",    // bg-sun | bg-sky | bg-coral | bg-mint | bg-white
     onDesktop: true,
   },
   ```
3. **`src/apps/notes/NotesApp.tsx`**: สร้าง component (`"use client"` ถ้ามี state/event)
4. **`src/apps/registry.tsx`**: import แล้วเพิ่ม `notes: NotesApp,`
5. **`src/components/icons.tsx`**: เพิ่ม `case "notes":` ใน `AppIcon`
6. ถ้ามี logic ที่ซับซ้อน แยกเป็น pure function ในไฟล์ของมันเอง + `*.test.ts` ข้างๆ

เสร็จแล้วไอคอนขึ้นบน desktop และ `open notes` ใน Terminal ใช้ได้ทันที ไม่ต้องแก้ `commands.ts`

### ถ้าต้องการให้เปิดตั้งแต่เริ่ม
เพิ่มใน `initialOSState.windows` ที่ `src/os/OSProvider.tsx` (ตอนนี้เปิด `about` และ `terminal`)

## 4. สไตล์ (ใช้ token เสมอ ห้าม hard-code hex)

- สี: `bg-ink`, `bg-lilac`, `bg-violet`, `bg-sun`, `bg-sky`, `bg-coral`, `bg-mint`, `bg-term`
- เงาแข็ง: `shadow-hard`, `shadow-hard-sm`, `shadow-btn`, `shadow-btn-hover`
- อนิเมชัน: `animate-pop`, `animate-wiggle`, `animate-blink`
- กรอบ: `border-2 border-ink` เป็นภาษาของทั้ง OS
- หัวข้อ: `font-pixel`
- ปุ่ม: `buttonClass.dark` / `buttonClass.light` จาก `src/components/ui.tsx` (ปรับขนาดด้วย `cn(buttonClass.dark, "min-h-9 px-3")`)
- ชิป: `<Chip>` ใน `src/components/ui.tsx`
- Tailwind v4 ใช้ชื่อ canonical: `wrap-break-word` (ไม่ใช่ `break-words`), `aspect-7/8` (ไม่ใช่ `aspect-[7/8]`), `size-4`
- ค่า important ใช้ suffix `!` เช่น `max-md:top-14!`
- สีที่รู้ตอน runtime (เช่นสีแบรนด์ใน `Skills.app`): ใส่เป็น CSS variable ต่อ element แล้วอ้างด้วย `border-(--brand)`, `text-(--brand)`, `hover:bg-(--brand)` เพราะ Tailwind สร้างคลาสจากค่าที่ไม่รู้ล่วงหน้าไม่ได้
- ข้อมูล `skills` ใน `src/content/skills.ts` เป็น `{ name, color }` ใช้ร่วมกันทั้ง `Skills.app`, About และ `ls skills` ใน Terminal สีแบรนด์ที่อ่อนเกินไปถูกทำให้เข้มลงจนตัวอักษรขาวมี contrast ≥ 4.5:1 (เทสต์ใน `skills.test.ts` บังคับไว้)

## 5. กฎของหน้าต่างที่ต้องจำ

- **เนื้อหาหน้าต่างเลื่อนเองได้**: `Window` ห่อด้วย `min-h-0 flex-1 overflow-auto` และจำกัดสูงด้วย `max-h-[calc(100%-16px)]`
  จอเตี้ยจะเลื่อนในหน้าต่าง ไม่ล้นจอ
- **ความสูง**: ใช้ `heightClass` พร้อมคำนำหน้า `md:` เท่านั้น มือถือหน้าต่างเป็น sheet เต็มจอ (`max-md:fixed ...`) ถ้าไม่ใส่ `md:` ความสูงจะชนกับ `top/bottom` บนมือถือ
- **ลำดับ DOM คงที่**: `Desktop` render ตามลำดับ `appIds` แล้วใช้ `z-index` จัดชั้น
  ห้ามสลับลำดับ DOM ตอน pointerdown เพราะเบราว์เซอร์จะทิ้ง click (ปุ่มปิด/ย่อต้องกดสองครั้ง)
- **มือถือ**: ตอน mount ถ้าจอ < 768px `Desktop` ปิดหน้าต่างทั้งหมดให้เริ่มที่ desktop สะอาดๆ
- **`Esc`** ปิดหน้าต่างบนสุด แต่จะไม่ทำงานถ้า target เป็น `INPUT` หรือ `TEXTAREA` (กำลังพิมพ์)
  ถ้าเพิ่ม element ที่รับพิมพ์ชนิดอื่น (เช่น `contenteditable`, `select`) ต้องไปเพิ่มเงื่อนไขใน `Desktop.tsx`
- **Overlay ที่ลอยเหนือหน้าต่าง** (เช่น ตัวดูรูปใน `src/components/PhotoViewer.tsx`):
  - render ด้วย `createPortal(..., document.body)` เพื่อไม่ติดอยู่ใน stacking context ของหน้าต่าง
  - ใช้ `z-[1000]`
  - ดักปุ่ม `Esc` ที่ `window` แบบ **capture phase** แล้ว `e.stopPropagation()` ไม่งั้น `Esc` จะปิดหน้าต่างที่อยู่ข้างหลังด้วย
  - ย้าย focus ไปที่ปุ่มปิดตอนเปิด
- **ห้ามใช้ `scrollIntoView()` หรือ `autoFocus` ในแอปที่อยู่ในหน้าต่าง**: `main` เป็น `overflow-hidden` ถ้าหน้าต่างยื่นเลยขอบจอ (เช่น Terminal ที่ x=1200) เบราว์เซอร์จะเลื่อน desktop ไปด้านข้างจนหน้าต่างอื่นและไอคอนเลื่อนหาย
  ให้เลื่อนที่ container ของตัวเอง (`el.scrollTop = el.scrollHeight`) และใช้ `focus({ preventScroll: true })`
- **ไอคอนบน desktop** เรียงเป็นคอลัมน์ตามความสูงของจอ เมื่อไม่พอจะขึ้นคอลัมน์ที่สองเอง (`md:flex-wrap` ใน `DesktopIcons.tsx`) ไม่ต้องจัดตำแหน่งเอง
  แต่ตำแหน่งเริ่มต้นของหน้าต่างควรเริ่มที่ x ≥ 280 เพื่อไม่ทับป้ายชื่อไอคอนคอลัมน์ที่สอง
- **State ของ OS** มีแค่ตำแหน่ง/ย่อ/ลำดับ ไม่ต้องเก็บ state ภายในแอปใน reducer ใช้ `useState` ในแอปเอง

## 6. แอปที่ต้องคุยกับ backend (แบบ Guestbook)

ดูตัวอย่างจริงที่ `src/apps/guestbook/`:

- เขียนผ่าน **Server Action** (`"use server"` ใน `actions.ts`) ไม่ให้เบราว์เซอร์คุยกับ database ตรงๆ
  - ไฟล์ `"use server"` export ได้เฉพาะ async function (type ได้ แต่ constant ไม่ได้)
- client ของ database อยู่ที่ `src/lib/supabase.ts`, ขึ้นต้นด้วย `import "server-only"`, ใช้ service role key
- ตัวแปร env **ห้ามขึ้นต้นด้วย `NEXT_PUBLIC_`** เด็ดขาดถ้าเป็นความลับ (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `IP_HASH_SALT`)
  - `SUPABASE_URL` ต้องเป็น `https://<ref>.supabase.co` ไม่มี path ต่อท้าย (ไม่ใช่ connection string ของ Postgres)
- `schema.sql` เก็บใน `supabase/` เปิด RLS โดยไม่ใส่ policy; ใส่ `check` constraint ซ้ำกับ validation ในโค้ด
- ข้อมูลจากฟอร์มเป็น `unknown` เสมอ ตรวจใน pure function (`validate.ts`) ก่อนใช้
- กัน spam: honeypot + rate limit ที่นับจาก database (ไม่ใช่ตัวแปรในหน่วยความจำ เพราะ serverless แชร์กันไม่ได้)
- ถ้าเก็บอะไรไว้ที่ `localStorage` ต้องห่อ `try/catch` เสมอ และต้องใช้งานได้เมื่อมันว่าง
- ใช้ `useTransition` กับ `onSubmit` เมื่อไม่อยากให้ React 19 รีเซ็ตฟอร์มตอน error
- ฟังก์ชันดึงรายการ (`listEntries`) คืน `null` เมื่อเข้าถึง database ไม่ได้ เพื่อให้ UI แสดงข้อความสุภาพแทนที่จะพัง
- การ "ลบ" ที่เกี่ยวกับ rate limit ให้ซ่อน/ล้างเนื้อหา ไม่ลบแถวทิ้ง

## 7. ข้อมูลส่วนตัวและเนื้อหา

ข้อความ ลิงก์ โปรเจกต์ ทักษะ อยู่ใน `src/content/` (`profile.ts`, `projects.ts`, `skills.ts`) เท่านั้น
component ดึงมาแสดง ห้าม hard-code ใน component

## 8. Accessibility

- ปุ่มต้องเป็น `<button>`, ลิงก์เป็น `<a href>`, ห้ามใส่ `onClick` บน `<div>`
- ปุ่มที่มีแต่ไอคอนต้องมี `aria-label`
- ข้อความสถานะที่เปลี่ยนเอง ใส่ `aria-live="polite"`
- เคารพ `prefers-reduced-motion` (มีใน `globals.css` แล้ว `.animate-spin` ยกเว้น เพราะเป็นตัวบอกความคืบหน้า)

## 9. ตรวจก่อนส่ง

```bash
npm run typecheck
npm run lint
npm test
npm run build      # ต้องผ่านก่อน deploy
```

ดูผลจริงในเบราว์เซอร์ที่ความกว้างจอคอมและจอมือถือ (< 768px) ถ้าจะถ่ายภาพหน้าจออัตโนมัติ:
รัน `npx next start -p 3100` แล้วใช้ Chrome headless
(`--headless=new --window-size=1400,900 --virtual-time-budget=15000 --screenshot=out.png http://localhost:3100`)
ต้องรอให้ boot screen จบก่อน จึงต้องตั้ง `--virtual-time-budget`

## 10. Git และ PR

- branch ชื่อ `feat/<เรื่อง>` หนึ่ง branch ต่อหนึ่งเรื่อง
- commit แบบ Conventional Commits: `feat:`, `fix:`, `test:`, `chore:`, `docs:`
- PR เข้า `dev` (ไม่ใช่ `main`) อธิบายสิ่งที่เปลี่ยน ข้อจำกัด และ test plan
- ถ้า PR ต่อกัน (stacked) ให้เขียนลำดับ merge ไว้ในคำอธิบาย
- อย่า commit `.env*` (ถูก gitignore อยู่แล้ว) และอย่าพิมพ์ค่าความลับออกมาในแชท/log
