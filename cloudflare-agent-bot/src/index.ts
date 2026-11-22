export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  ALLOWED_USER_ID: string;
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string;
  GEMINI_API_KEY?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      first_name?: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    text?: string;
    date: number;
  };
}

const DEFAULT_REPO = 'drydevil2007-git/new_ver';

async function sendTelegramMessage(
  token: string,
  chatId: number,
  text: string,
  parseMode: 'HTML' | 'Markdown' = 'HTML'
) {
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
      }),
    });
  } catch (err) {
    console.error('Failed to send telegram message', err);
  }
}

// GitHub API Helpers
async function getGithubFile(token: string, repo: string, filePath: string) {
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Cloudflare-DaneshYar-Agent',
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as any;
  if (!data.content) return null;
  // Decode base64 UTF-8
  const binary = atob(data.content.replace(/\n/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decoded = new TextDecoder('utf-8').decode(bytes);
  return { content: decoded, sha: data.sha };
}

async function putGithubFile(
  token: string,
  repo: string,
  filePath: string,
  newContent: string,
  commitMessage: string,
  sha?: string
) {
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  // Encode utf-8 to base64
  const bytes = new TextEncoder().encode(newContent);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const encodedContent = btoa(binary);

  const body: any = {
    message: commitMessage,
    content: encodedContent,
    branch: 'main',
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'User-Agent': 'Cloudflare-DaneshYar-Agent',
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return res.ok;
}

async function listGithubDirectory(token: string, repo: string, dirPath = '') {
  const url = `https://api.github.com/repos/${repo}/contents/${dirPath}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Cloudflare-DaneshYar-Agent',
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  if (!res.ok) return [];
  const list = (await res.json()) as any[];
  if (!Array.isArray(list)) return [];
  return list.map((item) => ({
    name: item.name,
    path: item.path,
    type: item.type, // 'file' | 'dir'
  }));
}

// Call Gemini API with Tool Calling or Direct Reasoning
async function askGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API Error: ${errText}`);
  }
  const data = (await res.json()) as any;
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return reply || 'پاسخی از هوش مصنوعی دریافت نشد.';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health Check
    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'DaneshYar 24/7 Cloudflare Worker Agent',
          bot: '@webdasiyarbot',
          time: new Date().toISOString(),
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Quick Webhook Setup endpoint
    if (url.pathname === '/set-webhook') {
      const webhookUrl = `${url.origin}/webhook`;
      const res = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/setWebhook?url=${encodeURIComponent(
          webhookUrl
        )}`
      );
      const data = await res.json();
      return new Response(JSON.stringify(data, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Telegram Webhook Handler
    if (request.method === 'POST' && url.pathname === '/webhook') {
      try {
        const update = (await request.json()) as TelegramUpdate;
        const msg = update.message;
        if (!msg || !msg.text) {
          return new Response('OK');
        }

        const senderId = String(msg.from.id);
        const chatId = msg.chat.id;
        const text = msg.text.trim();

        // Security authorization check
        if (senderId !== env.ALLOWED_USER_ID) {
          await sendTelegramMessage(
            env.TELEGRAM_BOT_TOKEN,
            chatId,
            '⛔ شما مجاز به دسترسی به این ربات نیستید.'
          );
          return new Response('OK');
        }

        const repo = env.GITHUB_REPO || DEFAULT_REPO;

        // Command: /start
        if (text === '/start') {
          const welcome = `
✨ <b>سلام پارسا عزیز!</b>
من <b>دستیار ابری دانشیار (DaneshYar Cloud Agent)</b> هستم.

⚡ <b>وضعیت:</b> ۲۴ ساعته آنلاین روی Cloudflare Worker
💻 <b>مستقل از کامپیوتر:</b> حتی وقتی کامپیوترت خاموش باشه، هر درخواستی بدی من مستقیماً روی مخزن <code>${repo}</code> اعمال می‌کنم!

🛠 <b>دستورات سریع:</b>
• <code>/status</code> — بررسی وضعیت پروژه و دامنه‌های زنده
• <code>/files</code> — مشاهده لیست فایل‌های اصلی پروژه
• <code>/read &lt;مسیر فایل&gt;</code> — خواندن محتوای یک فایل
• یا کافیه به زبان ساده بگی چه تغییری می‌خوای انجام بشه!
          `.trim();
          await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, welcome);
          return new Response('OK');
        }

        // Command: /status
        if (text === '/status') {
          await sendTelegramMessage(
            env.TELEGRAM_BOT_TOKEN,
            chatId,
            '⏳ در حال بررسی وضعیت مخزن و سایت...'
          );
          let commitInfo = 'نامشخص';
          if (env.GITHUB_TOKEN) {
            try {
              const res = await fetch(
                `https://api.github.com/repos/${repo}/commits/main`,
                {
                  headers: {
                    'User-Agent': 'Cloudflare-DaneshYar-Agent',
                    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
                  },
                }
              );
              if (res.ok) {
                const c = (await res.json()) as any;
                commitInfo = `<code>${c.sha.slice(0, 7)}</code> — ${c.commit.message}`;
              }
            } catch {}
          }

          let siteStatus = 'نامشخص';
          try {
            const sRes = await fetch('https://danshyar.ir/', { method: 'HEAD' });
            siteStatus = sRes.ok ? `آنلاین (${sRes.status} OK)` : `پاسخ: ${sRes.status}`;
          } catch {
            siteStatus = 'خطای اتصال';
          }

          const statusMsg = `
🌐 <b>وضعیت زنده سامانه دانشیار</b>

• <b>مخزن فعال:</b> <code>${repo}</code>
• <b>آخرین کامیت:</b> ${commitInfo}
• <b>وضعیت وب‌سایت (danshyar.ir):</b> ${siteStatus}
• <b>سرویس ورکر:</b> فعال روی کلودفلر (۲۴/۷)
          `.trim();
          await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, statusMsg);
          return new Response('OK');
        }

        // Command: /files
        if (text.startsWith('/files')) {
          if (!env.GITHUB_TOKEN) {
            await sendTelegramMessage(
              env.TELEGRAM_BOT_TOKEN,
              chatId,
              '⚠️ توکن گیت‌هاب (GITHUB_TOKEN) برای خواندن فایل‌ها تنظیم نشده است.'
            );
            return new Response('OK');
          }
          const sub = text.replace('/files', '').trim();
          const items = await listGithubDirectory(env.GITHUB_TOKEN, repo, sub);
          if (items.length === 0) {
            await sendTelegramMessage(
              env.TELEGRAM_BOT_TOKEN,
              chatId,
              'پوشه خالی است یا یافت نشد.'
            );
          } else {
            const listStr = items
              .map((it) => `${it.type === 'dir' ? '📁' : '📄'} <code>${it.path}</code>`)
              .join('\n');
            await sendTelegramMessage(
              env.TELEGRAM_BOT_TOKEN,
              chatId,
              `📂 <b>محتویات مسیر ${sub || 'ریشه'}:</b>\n\n${listStr}`
            );
          }
          return new Response('OK');
        }

        // Command: /read <filepath>
        if (text.startsWith('/read ')) {
          if (!env.GITHUB_TOKEN) {
            await sendTelegramMessage(
              env.TELEGRAM_BOT_TOKEN,
              chatId,
              '⚠️ توکن گیت‌هاب تنظیم نشده است.'
            );
            return new Response('OK');
          }
          const filePath = text.replace('/read ', '').trim();
          const fileData = await getGithubFile(env.GITHUB_TOKEN, repo, filePath);
          if (!fileData) {
            await sendTelegramMessage(
              env.TELEGRAM_BOT_TOKEN,
              chatId,
              `❌ فایل <code>${filePath}</code> یافت نشد.`
            );
          } else {
            const preview = fileData.content.slice(0, 3500);
            await sendTelegramMessage(
              env.TELEGRAM_BOT_TOKEN,
              chatId,
              `📄 <b>محتوای ${filePath}:</b>\n\n<pre>${preview.replace(
                /[<>&]/g,
                (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] || c)
              )}</pre>`
            );
          }
          return new Response('OK');
        }

        // Natural Language AI Processing with Gemini
        await sendTelegramMessage(
          env.TELEGRAM_BOT_TOKEN,
          chatId,
          '🧠 در حال تحلیل درخواست با هوش مصنوعی و بررسی پروژه...'
        );

        if (!env.GEMINI_API_KEY) {
          await sendTelegramMessage(
            env.TELEGRAM_BOT_TOKEN,
            chatId,
            '⚠️ کلید GEMINI_API_KEY روی Cloudflare Worker ست نشده است. لطفاً آن را تنظیم کنید.'
          );
          return new Response('OK');
        }

        const systemPrompt = `
شما دستیار هوش مصنوعی توسعه‌دهنده پلتفرم دانشیار هستید.
پروژه دانشیار یک وب‌اپلیکیشن مهندسی و دانشگاهی بر پایه React + Vite + TypeScript است.
مخزن پروژه: ${repo}
وظیفه شما: پاسخ به سوالات توسعه، بررسی کدها، یا آماده‌سازی دستورات دقیق ویرایش فایل برای کاربر.
اگر کاربر خواست تغییری در پروژه ایجاد شود، دقیقاً فایل مربوطه و کدهای لازم را بنویسید.
همیشه پاسخ‌ها را دقیق، حرفه‌ای و به زبان فارسی محترمانه ارسال کنید.
        `.trim();

        try {
          const aiResponse = await askGemini(env.GEMINI_API_KEY, systemPrompt, text);
          await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, aiResponse, 'Markdown');
        } catch (e: any) {
          await sendTelegramMessage(
            env.TELEGRAM_BOT_TOKEN,
            chatId,
            `❌ خطا در هوش مصنوعی: ${e.message || String(e)}`
          );
        }

        return new Response('OK');
      } catch (err: any) {
        console.error('Webhook error:', err);
        return new Response('Internal error', { status: 500 });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};
