# HillOS

Portfolio ของ **Tharit "Hill" Putsorn — Full-Stack Developer** ที่ทำหน้าตาเป็นระบบปฏิบัติการ
มีหน้าต่างลากได้ เทอร์มินัลพิมพ์คำสั่งได้จริง และลูกเล่นเล็กๆ ซ่อนอยู่ทั่วไป

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Vitest

---

## เริ่มใช้งาน

```bash
npm install
npm run dev        # เปิด http://localhost:3000
```

| คำสั่ง | ทำอะไร |
|---|---|
| `npm run dev` | รัน dev server |
| `npm test` | รันเทสต์ (Vitest) |
| `npm run test:watch` | รันเทสต์แบบเฝ้าดูไฟล์ |
| `npm run typecheck` | เช็ก TypeScript ทั้งโปรเจกต์ |
| `npm run lint` | ESLint |
| `npm run build` | build production (ต้องผ่านก่อน deploy) |

### สิ่งที่ต้องแก้ก่อนใช้จริง

- [ ] `src/content/profile.ts` → `email`, `links.github`, `links.linkedin`
- [ ] `public/resume.pdf` → แทนที่ด้วย resume จริง (ตอนนี้เป็นไฟล์ตัวอย่าง)
- [ ] `src/content/projects.ts` → ใส่ `liveUrl` / `repoUrl` ของแต่ละโปรเจกต์ (ปุ่มจะขึ้นมาเอง)

---

## ฟีเจอร์และลูกเล่น

- **หน้าต่าง**: ลากด้วย title bar ได้, คลิกแล้วขึ้นมาอยู่หน้าสุด, ย่อ/ปิดได้, กด `Esc` เพื่อปิดหน้าต่างที่อยู่หน้าสุด
- **Terminal**: พิมพ์คำสั่งได้จริง มี `Tab` auto-complete, `↑ ↓` ดูประวัติคำสั่ง, `Ctrl+L` ล้างจอ
  ลองพิมพ์ `help`, `ls skills`, `cat status.txt`, `open projects`, `sudo hire hill`
- **Taskbar** แบบ Windows: ปุ่ม Start (โลโก้ HillOS) อยู่กลาง ตามด้วยแอปที่เปิด/ย่ออยู่
  กดแอปที่อยู่หน้าสุด = ย่อ, กดแอปอื่น = ดึงขึ้นมาหน้าสุด
- **Shut down** จากเมนู Start: หน้า "Shutting down…" → จอดำมีโลโก้ กดโลโก้เพื่อเปิดเครื่อง (เล่น boot ใหม่)
- **แถบกาแฟ** บน menu bar ลดลงทุกครั้งที่เปิดหน้าต่าง กดเพื่อเติม
- **Boot screen** ตอนเข้าเว็บครั้งแรก (แสดงครั้งเดียวต่อ session)
- **Trash** กดล้างถังหลายครั้งแล้วจะมี easter egg
- **มือถือ**: หน้าต่างกลายเป็นแผ่นเต็มจอ, เริ่มที่หน้า desktop สะอาดๆ
- เคารพ `prefers-reduced-motion` (ปิดอนิเมชันให้คนที่ตั้งค่าไว้)

---

## โครงสร้างโปรเจกต์

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # ฟอนต์ (next/font), metadata
│   ├── page.tsx            # หน้าแรก → <Desktop />
│   ├── globals.css         # Tailwind + design tokens (@theme)
│   └── icon.svg            # favicon
│
├── content/                # ★ ข้อมูลส่วนตัวทั้งหมดอยู่ที่นี่ แก้ตรงนี้ที่เดียว
│   ├── profile.ts
│   ├── projects.ts
│   └── skills.ts
│
├── os/                     # "เคอร์เนล" — window manager
│   ├── types.ts            # AppId, WindowState, OSAction
│   ├── reducer.ts          # logic ทั้งหมดของหน้าต่าง (pure function)
│   ├── reducer.test.ts
│   ├── OSProvider.tsx      # React Context + useOS()
│   ├── useDrag.ts          # ลากหน้าต่างด้วย Pointer Events
│   └── useClock.ts
│
├── apps/                   # แต่ละ "แอป" ที่เปิดเป็นหน้าต่างได้
│   ├── manifest.ts         # metadata: ชื่อ, ตำแหน่งเริ่มต้น, ขนาด, สี
│   ├── registry.tsx        # จับคู่ AppId → component
│   ├── about/  projects/  resume/  contact/  trash/
│   └── terminal/
│       ├── TerminalApp.tsx # UI
│       ├── commands.ts     # คำสั่งทั้งหมด (pure, ไม่มี React)
│       └── commands.test.ts
│
└── components/             # ชิ้นส่วน UI ของ OS
    ├── Desktop.tsx  MenuBar.tsx  Window.tsx  TaskBar.tsx
    ├── DesktopIcons.tsx  StickyNote.tsx  BootScreen.tsx  ShutdownScreen.tsx
    ├── icons.tsx           # SVG icons + <Spinner> (แบบ shadcn)
    └── ui.tsx              # cn(), buttonClass, <Chip>
```

### ข้อมูลไหลยังไง

```
คลิกไอคอน / พิมพ์ "open projects"
        │
        ▼
useOS().open("projects")          ← OSProvider.tsx
        │  dispatch({ type: "open", ... })
        ▼
osReducer(state, action)          ← reducer.ts (pure, มีเทสต์)
        │  คืน state ใหม่: windows[] (ลำดับ = z-order), coffee
        ▼
<Desktop> render แอปที่เปิดอยู่ → <Window> อ่าน position / z-index จาก state
```

**ทำไมแยกแบบนี้**
- `reducer.ts` และ `commands.ts` ไม่มี React เลย เทสต์ได้ง่ายและเร็ว
- คำสั่งใน terminal ไม่สั่งเปิดหน้าต่างเอง แต่คืนค่าเป็น **effect** (`{ type: "open", app: "contact" }`)
  แล้วให้ `TerminalApp` เป็นคนทำ ทำให้ logic ยัง pure อยู่
- `manifest.ts` แยกจาก `registry.tsx` เพื่อไม่ให้ import วนกัน (OSProvider ต้องรู้ตำแหน่งเริ่มต้น แต่ไม่ต้องรู้ component)
- หน้าต่าง render ตามลำดับคงที่ และใช้ `z-index` จัดว่าอันไหนอยู่หน้า
  (ถ้าสลับลำดับ DOM ตอนกดเมาส์ เบราว์เซอร์จะทิ้ง click ไป ทำให้ปุ่มปิด/ย่อต้องกดสองครั้ง)

---

## วิธีเพิ่มแอปใหม่ (ตัวอย่าง: `Notes`)

**1. เพิ่ม id** ใน `src/os/types.ts`

```ts
export type AppId = "about" | "projects" | /* ... */ | "notes";
```

TypeScript จะฟ้องทุกจุดที่ยังไม่ได้เพิ่ม ทำตามที่มันบอกได้เลย

**2. เพิ่ม metadata** ใน `src/apps/manifest.ts`

```ts
notes: {
  id: "notes",
  label: "Notes.txt",
  title: "Notes.txt",
  defaultPosition: { x: 260, y: 180 },
  widthClass: "w-[420px]",
  titleBarClass: "bg-mint",
  onDesktop: true,
},
```

**3. สร้าง component** `src/apps/notes/NotesApp.tsx`

```tsx
"use client";

export default function NotesApp() {
  return <div className="p-6">Hello from Notes</div>;
}
```

**4. ลงทะเบียน** ใน `src/apps/registry.tsx` → `notes: NotesApp,`

**5. วาดไอคอน** ใน `src/components/icons.tsx` → เพิ่ม `case "notes":`

เสร็จแล้ว ไอคอนจะขึ้นบน desktop และพิมพ์ `open notes` ใน terminal ได้ทันที

## วิธีเพิ่มคำสั่ง terminal

เพิ่ม entry ใน `commands` ที่ `src/apps/terminal/commands.ts` แล้ว `help` และ Tab-complete จะรู้จักเอง

```ts
coffee: {
  description: "how much coffee is left?",
  run: () => say("enough for one more bug."),
},
```

แล้วเพิ่มเทสต์ใน `commands.test.ts` ด้วย

---

## แนวทางการเขียนโค้ด

1. **ข้อมูลแยกจาก UI**: ข้อความ/ลิงก์/โปรเจกต์อยู่ใน `src/content/` เท่านั้น ห้าม hard-code ใน component
2. **Logic ที่ซับซ้อนให้เป็น pure function + มีเทสต์** (แบบ `reducer.ts`, `commands.ts`) แล้วให้ component เป็นแค่ตัวเชื่อม
3. **`"use client"` เฉพาะไฟล์ที่ต้องใช้** (state, effect, event) ไฟล์ข้อมูลและ `layout.tsx` เป็น server
4. **สี/ฟอนต์/เงา/อนิเมชันใช้ token** จาก `@theme` ใน `globals.css` (`bg-sun`, `shadow-hard`, `animate-pop`) ไม่ใส่ค่า hex กระจัดกระจาย
5. **Accessibility**: ปุ่มต้องเป็น `<button>`, ลิงก์เป็น `<a href>`, ปุ่มที่มีแต่ไอคอนต้องมี `aria-label`, อย่าใส่ `onClick` บน `<div>` ที่ผู้ใช้ต้องกด
6. **Type ต้องเข้มงวด**: ใช้ union type อย่าง `AppId` แทน `string` เพื่อให้ TypeScript ช่วยจับข้อผิดพลาด
7. **Commit message** แบบ Conventional Commits: `feat: add notes app`, `fix: window drag on safari`, `test: terminal history`

---

## Roadmap: ต่อยอดอะไรได้บ้าง

เรียงจากที่ช่วยโชว์สกิล Full-Stack ได้มากที่สุด

| # | ไอเดีย | ได้โชว์อะไร |
|---|---|---|
| 1 | **Guestbook.app**: ให้คนเข้าเว็บเขียนข้อความทิ้งไว้ (Supabase + Server Actions + rate limit) | Backend, database, validation, security |
| 2 | **GitHub.app**: ดึง repo / commit ล่าสุดจาก GitHub API แล้ว cache | Server-side fetch, caching, error handling |
| 3 | **Settings.app**: เปลี่ยน wallpaper/ธีม และจำค่าไว้ใน `localStorage` | State persistence, theming |
| 4 | จำตำแหน่งหน้าต่างไว้ข้ามการ refresh | `localStorage` + hydration ที่ถูกต้อง |
| 5 | ย่อ-ขยายหน้าต่าง (resize), maximize, snap ชิดขอบ | Pointer events, geometry |
| 6 | **Minesweeper / Snake** ในตัว OS (เข้ากับปริญญาสายเกมของคุณ) | Game loop, canvas, logic ที่มีเทสต์ |
| 7 | สลับภาษา TH / EN | i18n |
| 8 | Playwright e2e test + GitHub Actions CI | Testing, CI/CD |
| 9 | Lighthouse 95+ ทุกหมวด | Performance, a11y, SEO |

---

## Deploy (Vercel)

1. push โปรเจกต์ขึ้น GitHub
2. เข้า [vercel.com](https://vercel.com) → **Add New → Project** → เลือก repo
3. กด Deploy (ไม่ต้องตั้งค่าอะไรเพิ่ม) แล้วจะได้ URL ไปใส่ใน resume
