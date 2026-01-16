/**
 * 🔥 NUMINFO ULTRA — PROOT SAFE (HEADLESS) 🔥
 *
 * 👨‍💻 Developer : Faizi Mods
 * 📱 WhatsApp   : 03706058550
 * 📢 Telegram   : Faizi Mods
 */

const { chromium } = require("playwright");
const readline = require("readline");

// ================= COLORS =================
const C = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

// ================= BANNER =================
function banner() {
  console.clear();
  console.log(
    C.bold + C.cyan + `
███╗   ██╗██╗   ██╗███╗   ███╗██╗███╗   ██╗███████╗
████╗  ██║██║   ██║████╗ ████║██║████╗  ██║██╔════╝
██╔██╗ ██║██║   ██║██╔████╔██║██║██╔██╗ ██║█████╗
██║╚██╗██║██║   ██║██║╚██╔╝██║██║██║╚██╗██║██╔══╝
██║ ╚████║╚██████╔╝██║ ╚═╝ ██║██║██║ ╚████║██║
╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝
` + C.reset
  );

  console.log(
    `${C.yellow}🔥 NUMINFO ULTRA — Headless Proot Mode${C.reset}\n` +
    `${C.green}👨‍💻 Developer : Faizi Mods${C.reset}\n` +
    `${C.cyan}📱 WhatsApp   : 03706058550${C.reset}\n` +
    `${C.magenta}📢 Telegram   : Faizi Mods${C.reset}\n` +
    `${C.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`
  );
}

// ================= INPUT =================
function askNumbers() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      `${C.yellow}📲 Enter number(s) (comma separated): ${C.reset}`,
      (answer) => {
        rl.close();
        resolve(
          answer
            .split(",")
            .map((n) => n.trim())
            .filter(Boolean)
        );
      }
    );
  });
}

// ================= UTILS =================
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ================= SCRAPER =================
async function extract(page) {
  return await page.$$eval("tr", (rows) =>
    rows
      .slice(1)
      .map((tr) => {
        const tds = tr.querySelectorAll("td");
        if (tds.length < 4) return null;
        return {
          number: tds[0].innerText.trim(),
          name: tds[1].innerText.trim(),
          cnic: tds[2].innerText.trim(),
          address: tds[3].innerText.trim(),
        };
      })
      .filter(Boolean)
  );
}

// ================= MAIN =================
(async () => {
  banner();
  const numbers = await askNumbers();

  if (!numbers.length) {
    console.log(`${C.red}❌ No numbers entered${C.reset}`);
    process.exit(0);
  }

  console.log(`${C.green}📂 Loaded ${numbers.length} number(s)\n${C.reset}`);

  // ✅ PROOT SAFE HEADLESS BROWSER
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137 Mobile Safari/537.36",
  });

  const page = await context.newPage();

  // SAFE GOTO
  await page.goto(
    "https://paksim.info/search-free-sim-database-online-2022.php",
    {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    }
  );

  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];
    console.log(
      `${C.cyan}🔎 [${i + 1}/${numbers.length}] Searching:${C.reset} ${C.bold}${num}${C.reset}`
    );

    try {
      await page.fill("input.form-control", num);
      await sleep(1500);

      await page.click("button, input[type=submit]");
      await sleep(3000);

      const rows = await extract(page);

      if (rows.length) {
        console.log(`${C.green}✅ Data Found:${C.reset}`);
        for (const r of rows) {
          console.log(
            `${C.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n` +
            `${C.yellow}📞 Number : ${r.number}${C.reset}\n` +
            `${C.cyan}🧑 Name   : ${r.name}${C.reset}\n` +
            `${C.red}🆔 CNIC   : ${r.cnic}${C.reset}\n` +
            `${C.green}🏠 Addr   : ${r.address}${C.reset}`
          );
        }
      } else {
        console.log(`${C.red}❌ No data found${C.reset}`);
      }
    } catch (err) {
      console.log(`${C.red}❌ Error:${C.reset} ${err.message}`);
    }

    console.log("");
    await sleep(2000);
  }

  await browser.close();
  console.log(`${C.green}✔ Process completed${C.reset}`);
})();
