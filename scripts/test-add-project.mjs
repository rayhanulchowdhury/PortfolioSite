/**
 * Verifies the "add a project later" flow: a project added to
 * src/content/portfolio.ts renders, filters and opens in the player.
 * Dev utility only.
 */
import puppeteer from 'puppeteer-core'

const URL = 'http://localhost:5178/'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const out = []
const check = (ok, name, detail = '') => out.push({ ok, name, detail })

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
await page.setViewport({ width: 1440, height: 900 })
await page.goto(URL, { waitUntil: 'networkidle2' })
await page.waitForSelector('#video-editing')

// 1. The added projects appear.
const titles = await page.$$eval('#video-editing button p', (els) =>
  els.map((e) => e.textContent.trim()),
)
check(titles.includes('Test Cinematic Edit'), 'added project renders', titles.slice(0, 3).join(', '))

// 2. Placeholders shrink to fill the remaining slots (6 total - 2 real = 4).
const placeholders = await page.$$eval(
  '#video-editing [class*="border-dashed"]',
  (e) => e.length,
)
check(placeholders === 4, 'placeholders back-fill the grid', `${placeholders} empty frames`)

// 3. Category chips show counts.
const chipText = await page.$eval('#video-editing [role="group"]', (el) => el.textContent)
check(/Cinematic Editing\s*1/.test(chipText), 'category chip shows project count')

// 4. Filtering by category works.
await page.evaluate(() => {
  const chip = [...document.querySelectorAll('#video-editing [role="group"] button')].find(
    (b) => b.textContent.includes('Social Media & Reels'),
  )
  chip.click()
})
await new Promise((r) => setTimeout(r, 400))
const filtered = await page.$$eval('#video-editing button p', (els) =>
  els.map((e) => e.textContent.trim()),
)
check(
  filtered.includes('Test Reel') && !filtered.includes('Test Cinematic Edit'),
  'category filter narrows the grid',
)

// 5. Back to All, then open the player.
await page.evaluate(() => {
  const all = [...document.querySelectorAll('#video-editing [role="group"] button')].find(
    (b) => b.textContent.trim().startsWith('All'),
  )
  all.click()
})
await new Promise((r) => setTimeout(r, 400))
await page.evaluate(() => {
  const card = [...document.querySelectorAll('#video-editing button')].find((b) =>
    b.getAttribute('aria-label')?.startsWith('Play Test Cinematic'),
  )
  card.click()
})
await new Promise((r) => setTimeout(r, 700))

const dialog = await page.$('[role="dialog"]')
check(dialog !== null, 'video modal opens')

const iframeSrc = await page.$eval('[role="dialog"] iframe', (f) => f.src).catch(() => '')
check(
  iframeSrc.includes('youtube-nocookie.com/embed/dQw4w9WgXcQ'),
  'YouTube URL converted to privacy embed',
  iframeSrc.slice(0, 60),
)

// 6. Escape closes it.
await page.keyboard.press('Escape')
await new Promise((r) => setTimeout(r, 500))
check((await page.$('[role="dialog"]')) === null, 'modal closes on Escape')

// 7. Vimeo conversion.
await page.evaluate(() => {
  const card = [...document.querySelectorAll('#video-editing button')].find((b) =>
    b.getAttribute('aria-label')?.startsWith('Play Test Reel'),
  )
  card.click()
})
await new Promise((r) => setTimeout(r, 700))
const vimeoSrc = await page.$eval('[role="dialog"] iframe', (f) => f.src).catch(() => '')
check(vimeoSrc.includes('player.vimeo.com/video/123456789'), 'Vimeo URL converted to embed')

check(errors.length === 0, 'no runtime errors', errors.join(' | '))

await browser.close()

console.log('\n======== ADD-PROJECT FLOW ========')
for (const r of out) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  — ${r.detail}` : ''}`)
const failed = out.filter((r) => !r.ok).length
console.log('==================================')
console.log(`${out.length - failed}/${out.length} passed`)
process.exit(failed === 0 ? 0 : 1)
