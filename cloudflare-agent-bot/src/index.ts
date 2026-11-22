export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  ALLOWED_USER_ID: string;
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string;
  GEMINI_API_KEY?: string;
  AI?: any;
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
): Promise<{ ok: boolean; error?: string; commitSha?: string }> {
  try {
    if (!sha) {
      const existing = await getGithubFile(token, repo, filePath);
      if (existing) {
        sha = existing.sha;
      }
    }

    const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
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
    const data = (await res.json()) as any;
    if (res.ok) {
      return { ok: true, commitSha: data.commit?.sha };
    }
    return { ok: false, error: data.message || res.statusText };
  } catch (err: any) {
    return { ok: false, error: err.message || String(err) };
  }
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
    type: item.type,
  }));
}

// Unified Multi-Model AI: Google Gemini + Cloudflare Workers AI Fallback
async function askAI(
  env: Env,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  let lastError = '';

  // 1. Try Google Generative Language with verified active models
  if (env.GEMINI_API_KEY) {
    const models = [
      'gemini-3.1-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3-flash-preview',
      'gemini-3.5-flash',
      'gemma-4-26b-a4b-it',
    ];
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nدرخواست کاربر:\n${userPrompt}` }],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 2048,
            },
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as any;
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return reply;
        } else {
          const errData = (await res.json().catch(() => ({}))) as any;
          lastError = `${model}: ${errData?.error?.message || res.statusText}`;
        }
      } catch (e: any) {
        lastError = `${model}: ${e.message || String(e)}`;
      }
    }
  }

  // 2. Cloudflare Workers AI Built-in Fallback
  if (env.AI) {
    const cfModels = [
      '@cf/meta/llama-3.1-8b-instruct',
      '@cf/meta/llama-3-8b-instruct',
      '@cf/meta/llama-3.3-70b-instruct',
    ];
    for (const cfModel of cfModels) {
      try {
        const aiRes = await env.AI.run(cfModel, {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 2048,
          temperature: 0.3,
        });
        if (aiRes && aiRes.response) {
          return aiRes.response;
        }
      } catch (e: any) {
        lastError = `WorkersAI(${cfModel}): ${e.message || String(e)}`;
      }
    }
  }

  return `پوزش، پاسخی از هسته هوش مصنوعی دریافت نشد.\n\nعلت: ${lastError || 'خطای ناشناخته'}`;
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
💻 <b>مستقل از کامپیوتر:</b> حتی وقتی کامپیوترت خاموش باشه، هر درخواستی بدی من مستقیماً روی مخزن <code>${repo}</code> اعمال و کامیت می‌کنم!

🛠 <b>دستورات سریع:</b>
• <code>/status</code> — بررسی وضعیت پروژه و دامنه‌های زنده
• <code>/files [path]</code> — مشاهده فایل‌های مخزن
• <code>/read &lt;مسیر فایل&gt;</code> — خواندن محتوای یک فایل
• <code>/write &lt;مسیر فایل&gt;</code> (در خط بعد محتوا) — نوشتن مستقیم فایل روی گیت‌هاب
• یا هر درخواستی داری به زبان فارسی بنویس تا هوش مصنوعی انجام بده و خودکار کامیت بزنه!
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
• <b>سرور ابری:</b> bot.danshyar.ir (Cloudflare Worker ۲۴/۷)
• <b>اتصال گیت‌هاب:</b> ${env.GITHUB_TOKEN ? '✅ متصل (دارای حق کامیت)' : '❌ نامشخص'}
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
              '⚠️ توکن گیت‌هاب (GITHUB_TOKEN) برای خواندن فایل‌ها هنوز تنظیم نشده است.'
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

        // Command: /write <filepath>\n<content>
        if (text.startsWith('/write ')) {
          if (!env.GITHUB_TOKEN) {
            await sendTelegramMessage(
              env.TELEGRAM_BOT_TOKEN,
              chatId,
              '⚠️ توکن گیت‌هاب تنظیم نشده است.'
            );
            return new Response('OK');
          }
          const firstLineBreak = text.indexOf('\n');
          if (firstLineBreak === -1) {
            await sendTelegramMessage(
              env.TELEGRAM_BOT_TOKEN,
              chatId,
              'فرمت صحیح دستور:\n<code>/write &lt;مسیر فایل&gt;</code>\n&lt;محتوای فایل در خط جدید&gt;'
            );
            return new Response('OK');
          }
          const targetPath = text.slice('/write '.length, firstLineBreak).trim();
          const targetContent = text.slice(firstLineBreak + 1);
          await sendTelegramMessage(
            env.TELEGRAM_BOT_TOKEN,
            chatId,
            `⏳ در حال کامیت مستقیم فایل <code>${targetPath}</code> روی گیت‌هاب...`
          );
          const putResult = await putGithubFile(
            env.GITHUB_TOKEN,
            repo,
            targetPath,
            targetContent,
            `Update ${targetPath} via Telegram Agent`
          );
          if (putResult.ok) {
            await sendTelegramMessage(
              env.TELEGRAM_BOT_TOKEN,
              chatId,
              `✅ <b>فایل با موفقیت ثبت شد!</b>\n\n📄 <b>فایل:</b> <code>${targetPath}</code>\n🔗 <b>کامیت:</b> <code>${putResult.commitSha?.slice(
                0,
                7
              )}</code>\n🚀 انتشار خودکار روی هاستینگ فعال شد.`
            );
          } else {
            await sendTelegramMessage(
              env.TELEGRAM_BOT_TOKEN,
              chatId,
              `❌ خطا در ذخیره فایل: ${putResult.error}`
            );
          }
          return new Response('OK');
        }

        // Natural Language AI Processing
        await sendTelegramMessage(
          env.TELEGRAM_BOT_TOKEN,
          chatId,
          '🧠 در حال تحلیل درخواست با هوش مصنوعی دانشیار...'
        );

        const systemPrompt = `
شما دستیار هوش مصنوعی توسعه‌دهنده پلتفرم دانشیار هستید.
پروژه دانشیار یک وب‌اپلیکیشن مهندسی و دانشگاهی بر پایه React + Vite + TypeScript است.
مخزن پروژه: ${repo}
شما روی سرور ابری ۲۴ ساعته Cloudflare Worker فعال هستید و به تلگرام کاربر متصل شده‌اید.
وظیفه شما: پاسخ به سوالات توسعه، بررسی کدها، و اعمال مستقیم تغییرات در فایل‌های پروژه بر اساس درخواست کاربر است.

اگر کاربر از شما خواست تغییری در فایل‌های پروژه بدهید، کدی بنویسید یا فایلی بسازید:
ابتدا پاسخ و توضیح لازم را به زبان فارسی ارائه دهید.
سپس برای اعمال خودکار تغییرات روی مخزن گیت‌هاب، دستور کامیت را در انتهای پاسخ خود دقیقاً در قالب زیر بیاورید:
\`\`\`COMMIT_ACTION
{
  "path": "مسیر فایل نسبت به ریشه مثلا src/App.tsx یا public/robots.txt",
  "content": "محتوای کامل و جدید فایل",
  "message": "پیام کامیت به انگلیسی مثلا update App.tsx"
}
\`\`\`
`.trim();

        try {
          const aiResponse = await askAI(env, systemPrompt, text);

          let cleanReply = aiResponse;
          const actionMatch = aiResponse.match(/```COMMIT_ACTION\s*([\s\S]*?)\s*```/);
          let actionData: any = null;
          if (actionMatch) {
            cleanReply = aiResponse.replace(/```COMMIT_ACTION[\s\S]*?```/, '').trim();
            try {
              actionData = JSON.parse(actionMatch[1]);
            } catch (e) {
              console.error('Failed to parse COMMIT_ACTION JSON', e);
            }
          }

          if (cleanReply) {
            await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, cleanReply, 'Markdown');
          }

          if (actionData && actionData.path && actionData.content && env.GITHUB_TOKEN) {
            await sendTelegramMessage(
              env.TELEGRAM_BOT_TOKEN,
              chatId,
              `⏳ در حال ثبت و کامیت خودکار تغییرات روی مخزن: <code>${actionData.path}</code>...`
            );
            const putRes = await putGithubFile(
              env.GITHUB_TOKEN,
              repo,
              actionData.path,
              actionData.content,
              actionData.message || `Update ${actionData.path} via DaneshYar AI Agent`
            );
            if (putRes.ok) {
              await sendTelegramMessage(
                env.TELEGRAM_BOT_TOKEN,
                chatId,
                `✅ <b>تغییرات با موفقیت روی گیت‌هاب اعمال و کامیت شد!</b>\n\n📄 <b>فایل:</b> <code>${actionData.path}</code>\n🔗 <b>کامیت:</b> <code>${putRes.commitSha?.slice(
                  0,
                  7
                )}</code>\n🚀 پایپ‌لاین بیلد و انتشار خودکار روی وب‌سایت فعال شد.`
              );
            } else {
              await sendTelegramMessage(
                env.TELEGRAM_BOT_TOKEN,
                chatId,
                `❌ خطا در ثبت کامیت گیت‌هاب: ${putRes.error}`
              );
            }
          }
        } catch (e: any) {
          await sendTelegramMessage(
            env.TELEGRAM_BOT_TOKEN,
            chatId,
            `❌ خطا در پردازش هوش مصنوعی: ${e.message || String(e)}`
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
