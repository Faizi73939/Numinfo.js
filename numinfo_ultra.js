/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🔥 NUMINFO ULTRA — PLAYWRIGHT EDITION 🔥
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 👨‍💻 Developer : Faizi Mods
 * 📱 WhatsApp   : 03706058550
 * 📢 Telegram   : Faizi Mods
 */

const { chromium } = require("playwright");
const fs = require("fs");
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
  white: "\x1b[37m",
  bold: "\x1b[1m",
};

// ================= BANNER =================
function banner() {
  console.clear();
  console.log(
    C.bold + C.cyan + `
███╗   ██╗██╗   ██╗███╗   ███╗██╗███╗   ██╗███████╗ ██████╗
████╗  ██║██║   ██║████╗ ████║██║████╗  ██║██╔════╝██╔═══██╗
██╔██╗ ██║██║   ██║██╔████╔██║██║██╔██╗ ██║█████╗  ██║   ██║
██║╚██╗██║██║   ██║██║╚██╔╝██║██║██║╚██╗██║██╔══╝  ██║   ██║
██║ ╚████║╚██████╔╝██║ ╚═╝ ██║██║██║ ╚████║██║     ╚██████╔╝
╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝      ╚═════╝
` +
      C.reset
  );

  console.log(
    `${C.yellow}🔥 NUMINFO ULTRA — Real Browser Tool${C.reset}\n` +
      `${C.green}👨‍💻 Developer : Faizi Mods${C.reset}\n` +
      `${C.cyan}📱 WhatsApp   : 03706058550${C.reset}\n` +
      `${C.magenta}📢 Telegram   : Faizi Mods${C.reset}\n` +
      `${C.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`
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
        const nums = answer
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean);
        resolve(nums);
      }
    );
  });
}

// ================= UTILS =================
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function ensureDirs() {
  if (!fs.existsSync("output")) fs.mkdirSync("output");
}

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
  ensureDirs();

  const numbers = await askNumbers();

  if (!numbers.length) {
    console.log(`${C.red}❌ No numbers entered. Exiting.${C.reset}`);
    process.exit(0);
  }

  console.log(
    `${C.green}📂 Loaded ${numbers.length} number(s)\n${C.reset}`
  );

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137 Mobile Safari/537.36",
  });

  const page = await context.newPage();
  await page.goto(
    "https://paksim.info/search-free-sim-database-online-2022.php",
    { waitUntil: "networkidle" }
  );

  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];
    console.log(
      `${C.cyan}🔎 [${i + 1}/${numbers.length}] Searching:${C.reset} ${C.bold}${num}${C.reset}`
    );

    try {
      await page.fill("input.form-control", num);
      await sleep(1200);
      await page.click("button, input[type=submit]");
      await page.waitForLoadState("networkidle");
      await sleep(2000);

      const rows = await extract(page);

      if (rows.length) {
        console.log(`${C.green}✅ Data Found:${C.reset}`);
        rows.forEach((r) => {
          console.log(
            `${C.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n` +
              `${C.yellow}📞 Number : ${C.white}${r.number}${C.reset}\n` +
              `${C.cyan}🧑 Name   : ${C.white}${r.name}${C.reset}\n` +
              `${C.red}🆔 CNIC   : ${C.white}${r.cnic}${C.reset}\n` +
              `${C.green}🏠 Addr   : ${C.white}${r.address}${C.reset}`
          );
        });
      } else {
        console.log(`${C.red}❌ No data found${C.reset}`);
      }
    } catch (e) {
      console.log(`${C.red}❌ Error:${C.reset}`, e.message);
    }

    console.log("");
    await sleep(2500);
  }

  await browser.close();
  console.log(
    `${C.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n` +
      `${C.green}✔ Process completed${C.reset}`
  );
})();  console.log("🔥 NUMINFO ULTRA — Playwright");
  console.log("👨‍💻 Developer : Faizi Mods");
  console.log("📱 WhatsApp   : 03706058550");
  console.log("📢 Telegram   : Faizi Mods");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

// ================= HELPERS =================

function ensureDirs() {
  if (!fs.existsSync("input")) fs.mkdirSync("input");
  if (!fs.existsSync("output")) fs.mkdirSync("output");
}

function loadNumbers() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.log("❌ input/numbers.txt not found");
    process.exit(1);
  }
  return fs
    .readFileSync(INPUT_FILE, "utf-8")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function saveTXT(block) {
  fs.appendFileSync(OUT_TXT, block + "\n");
}

function saveCSV(rows) {
  if (!fs.existsSync(OUT_CSV)) {
    fs.writeFileSync(
      OUT_CSV,
      "Number,Name,CNIC,Address,Time\n"
    );
  }
  for (const r of rows) {
    fs.appendFileSync(
      OUT_CSV,
      `"${r.number}","${r.name}","${r.cnic}","${r.address}","${r.time}"\n`
    );
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ================= SCRAPER =================

async function extract(page) {
  return await page.$$eval("tr", (rows) =>
    rows.slice(1).map((tr) => {
      const tds = tr.querySelectorAll("td");
      if (tds.length < 4) return null;
      return {
        number: tds[0].innerText.trim(),
        name: tds[1].innerText.trim(),
        cnic: tds[2].innerText.trim(),
        address: tds[3].innerText.trim(),
        time: new Date().toISOString().replace("T", " ").slice(0, 19),
      };
    }).filter(Boolean)
  );
}

// ================= MAIN =================

(async () => {
  banner();
  ensureDirs();

  const numbers = loadNumbers();
  console.log(`📂 Loaded ${numbers.length} numbers\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137 Mobile Safari/537.36",
  });

  const page = await context.newPage();
  await page.goto(TARGET_URL, { waitUntil: "networkidle" });

  let allRows = [];

  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];
    console.log(`🔎 [${i + 1}/${numbers.length}] Searching: ${num}`);

    try {
      await page.fill("input.form-control", num);
      await sleep(1200);
      await page.click("button, input[type=submit]");
      await page.waitForLoadState("networkidle");
      await sleep(2000);

      const rows = await extract(page);
      if (rows.length) {
        console.log(`✅ Found ${rows.length} record(s)\n`);
        rows.forEach((r) => {
          const block = `
📞 Number  : ${r.number}
🧑 Name    : ${r.name}
🆔 CNIC    : ${r.cnic}
🏠 Address : ${r.address}
⏰ Time    : ${r.time}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
          console.log(block);
          saveTXT(block);
        });
        saveCSV(rows);
        allRows.push(...rows);
      } else {
        console.log("❌ No data found\n");
      }
    } catch (e) {
      console.log("❌ Error:", e.message);
    }

    await sleep(2500);
  }

  await browser.close();

  console.log("\n💾 Saved output:");
  console.log("📄 output/results.txt");
  console.log("📊 output/results.csv");
})();
