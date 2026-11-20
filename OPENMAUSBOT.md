# معماری و یکپارچه‌سازی OpenMausBot در پلتفرم دانشیار (DaneshYar)

> بر اساس پروژه متن‌باز **OpenMausBot** (جایگزین متن‌باز Grok Bot / Team of AI Bots in a Chat App)  
> مخزن مرجع: [milind-soni/OpenMausBot](https://github.com/milind-soni/OpenMausBot)

---

## ۱. معرفی و هدف یکپارچه‌سازی

پروژه **OpenMausBot** ایده‌ی بنیادین جدیدی در دستیارهای هوش مصنوعی ارائه می‌دهد:
> **«به‌جای یک چت‌بات عمومی، یک پیام‌رسان با تیمی از بات‌های متخصص داشته باشید که هر کدام یک کامپیوتر ایزوله، ابزارهای متصل و خط‌مشی امنیتی اختصاصی دارند.»**

در دانشیار، این معماری در بخش **🐭 اوپن‌ماوس‌بات (`/mausbot`)** پیاده‌سازی شده و امکانات زیر را در اختیار اساتید و دانشجویان مهندسی قرار می‌دهد:

1. **فلیت ربات‌های چندمدله (Multi-Model Fleet):**
   - اتصال مستقیم به **Gemini 2.5 Flash / Pro** (گوگل دیپ‌مایند)
   - **Claude 3.7 Sonnet** (انتروپیک)
   - **GPT-4o Codex** (اوپن‌ای‌آی)
   - **Grok-3 Sandbox** (xAI)
   - **DeepSeek R1** (حل مسائل استدلالی ریاضی و فیزیک)
   - **Ollama Local** (اجرای آفلاین ۱۰۰٪ روی سخت‌افزار محلی)

2. **«هر بات یک کامپیوتر دارد» (Every Bot Gets a Computer):**
   - هر بات دارای یک ماشین مجازی ایزوله (`hostname`, `os`, `ports`) است.
   - مانیتورینگ زنده مصرف منابع: **CPU Usage**، **RAM Usage**، و **Disk Usage**.
   - فایل‌سیستم ایزوله در پوشه `~/workspace/`.
   - ترمینال زنده با امکان تایپ و اجرای دستورات لینوکسی (`ls`, `ps`, `top`, `uname`, تست‌ها).

3. **کارت‌های تایید امنیتی دو مرحله‌ای (Permission Approval Cards):**
   - اقدامات حساس نظیر اجرای شل (`bash`)، نوشتن در فایل‌ها (`fs_write`)، و ایجاد دسترسی شبکه نیازمند تایید صریح دانشجو هستند.
   - نمایش کارت رنگی با سطح خطر (`low`, `medium`, `high`) و دکمه‌های **Allow** و **Deny**.

4. **اتاق‌های گفتگوی چندرباته (Collaborative Multi-Bot Rooms):**
   - کانال‌های گروهی نظیر «اتاق فرمان مهندسی (War Room)» و «تالار ماراتن امتحانات».
   - پشتیبانی از `@Mention` برای صدا زدن بات مدنظر در اتاق.

---

## ۲. ربات‌های پیش‌فرض فلیت دانشیار

| ربات | نقش تخصصی | مدل پیش‌فرض | کانتینر ایزوله |
| :--- | :--- | :--- | :--- |
| **Maus Architect** | معمار نرم‌افزار، زیرساخت داکر و کوبرنتیز | `gemini-2.5-pro` | `maus-vm-architect.local` |
| **Code Runner & Tester** | اجرای اسکریپت‌ها، تست خودکار با Pytest | `claude-3-7-sonnet` | `maus-vm-runner.local` |
| **Research Scout** | کاوش در مخازن گیت‌هاب و مقالات arXiv | `gemini-2.5-flash` | `maus-vm-scout.local` |
| **Math & Physics TA** | اثبات قضایا و حل مسائل تحلیلی با LaTeX | `deepseek-r1` | `maus-vm-math.local` |
| **Grok Sentinel** | ممیزی امنیت کد و صدور کارت‌های تایید | `grok-3` | `maus-vm-security.local` |

---

## ۳. ساختار فایل‌های اضافه شده در دانشیار

- `src/types/app.ts`: تعاریف رابط‌ها و تایپ‌های `MausBotProfile`، `MausRoom`، `MausApprovalCard`، `MausVMState`، و `MausMessage`.
- `src/lib/apiBridge.ts`:
  - اندپوینت `GET /api/mausbot/state`: بارگذاری وضعیت بات‌ها، اتاق‌ها و کارت‌های تایید
  - اندپوینت `POST /api/mausbot/chat`: ارسال پیام، استدلال هوشمند و ساخت خودکار Approval Card
  - اندپوینت `POST /api/mausbot/approvals/:id/decide`: ثبت پاسخ کاربر (Allow / Deny) و اجرای شل در ماشین مجازی
  - اندپوینت `POST /api/mausbot/bots/create`: افزودن بات دلخواه توسط دانشجو
  - اندپوینت `POST /api/mausbot/rooms/create`: ایجاد اتاق‌های چندرباته جدید
  - اندپوینت `POST /api/mausbot/bots/:id/model`: تغییر آنی مدل هوش مصنوعی هر بات
  - اندپوینت `POST /api/mausbot/vm/:id/command`: اجرای مستقیم دستورات شل در ترمینال بات
- `src/components/OpenMausBotHub.tsx`: کامپوننت ۳ ستونه و مدرن شامل سایدبار مخاطبین و اتاق‌ها، استریم چت با کارت‌های تایید و پنل سندباکس کامپیوتر و مانیتورینگ.
- `src/components/Header.tsx` & `src/components/OverviewHero.tsx`: دسترسی منو، ناوبری ریسپانسیو و معرفی در صفحه اول.
