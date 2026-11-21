# راهنمای استقرار سرور یکپارچه هوش مصنوعی دانشیار (DaneshYar Server Deployment Guide)

این راهنما نحوه استقرار سرور بک‌اند دانشیار (`server.ts`) را برای دسترسی عمومی و همگانی دانشجویان به تمام قابلیت‌های هوش مصنوعی توضیح می‌دهد.

---

## ۱. قابلیت‌های فعال روی سرور (Server AI Capabilities)

سرور دانشیار کلیه قابلیت‌های پیشرفته را به صورت یکپارچه ارائه می‌دهد:
- ⚡ **دانشیار مرکیوری (Mercury Agent)**: مغز دوم، حافظه پایدار، و ربات‌های تخصصی (ارشمیدس، تورینگ، اویلر، هیپاتیا) (`/api/mercury/*`)
- 🐭 **اوپن‌ماوس‌بات (OpenMausBot)**: فلیت ربات‌های خودکار، ماشین‌های مجازی سندباکس و کارت‌های تایید مجوز (`/api/mausbot/*`)
- ⚡ **استراتا (Strata Engine)**: استنتاج محلی و لایه‌بندی حافظه MoE روی VRAM و RAM (`/api/strata/*`)
- ✨ **کلودبل (Claudable Studio)**: استودیوی وب‌ساز و تولید کد بر پایه ایجنت‌های CLI (`/api/claudable/*`)
- 🔬 **آزمایشگاه AI و حل فرمول**: روش فاینمن، حل تشریحی معادلات، استخراج جزوه، آزمون‌ساز هوشمند و چت صوتی (`/api/ai/*`)
- 💬 **سوکت بلادرنگ**: وب‌سوکت اتاق مطالعه اشتراکی، پومودورو گروهی و چت دانشگاهی (`/ws/study-room`)

---

## ۲. روش‌های استقرار سرور برای دسترسی همگانی (Public Deployment Options)

### روش الف: استقرار روی سرور مجازی یا اختصاصی (VPS با Docker)

ساده‌ترین و پایدارترین روش، اجرای کانتینر داکر است:

```bash
# ۱. کلون مخزن روی سرور
git clone https://github.com/drydevil2007-git/new_ver.git
cd new_ver

# ۲. اجرای خودکار با Docker Compose
docker compose up -d --build
```

سرویس بلافاصله روی پورت `3000` بالا آمده و آماده خدمت‌رسانی است.

---

### روش ب: استقرار مستقیم با Node.js و PM2 (روی اوبونتو / لینوکس)

```bash
# ۱. نصب Node.js 22 و PM2
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# ۲. کلون و نصب پکیج‌ها
git clone https://github.com/drydevil2007-git/new_ver.git
cd new_ver
npm install
npm run build

# ۳. اجرای دائم در پس‌زمینه با PM2
pm2 start "npm start" --name "danshyar-server"
pm2 save
pm2 startup
```

---

### روش ج: اتصال سرور مجازی به دامنه با Nginx و SSL رایگان

فایل تنظیمات Nginx (`/etc/nginx/sites-available/danshyar`):

```nginx
server {
    server_name api.danshyar.ir danshyar.ir;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

سپس گواهی SSL رایگان Certbot:
```bash
sudo certbot --nginx -d danshyar.ir -d api.danshyar.ir
```

---

### روش د: استقرار بدون سرور در پلتفرم‌های ابری رایگان (Render / Railway / Cloud Run)

پروژه به طور کامل با سرویس‌های ابری سازگار است:
- **Render.com**: یک `Web Service` جدید بسازید، ریپازیتوری را متصل کنید؛ دستور Build برابر `npm install && npm run build` و دستور Start برابر `npm start` است.
- **Railway.app**: مخزن را وصل کنید، به صورت اتوماتیک با Dockerfile موجود بیلد و روی دامنه اختصاصی آنلاین می‌شود.

---

## ۳. معماری دوگانه (Dual Universal Resilience)

برای اطمینان از اینکه حتی در زمان قطعی سرور یا استفاده از هاستینگ استاتیک، **هیچ دانشجویی با خطای ارتباط مواجه نشود**:
- اگر درخواست به سرور برسد، مستقیماً توسط `server.ts` پردازش می‌شود.
- در صورتی که کاربر به سایت استاتیک مراجعه کند یا سرور در دسترس نباشد، هسته `apiBridge.ts` به طور خودکار استنتاج هوش مصنوعی را با حفظ پایداری کامل در سمت کلاینت مدیریت می‌کند.
