/**
 * Automated smoke test for the site.
 * Run the dev server first, then: node scripts/verify.mjs
 *
 * This is a development utility — it is not part of the shipped site.
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = process.env.VERIFY_URL ?? 'http://localhost:5178/'
const CHROME =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const OUT = 'scripts/screens'
mkdirSync(OUT, { recursive: true })

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'mobile', width: 390, height: 844 },
]

const results = []
const pass = (n, d = '') => results.push({ ok: true, n, d })
const fail = (n, d = '') => results.push({ ok: false, n, d })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

const consoleErrors = []
const page = await browser.newPage()
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text())
})
page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`))

await page.setViewport(viewports[0])
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 45000 })
await page.waitForSelector('#main', { timeout: 15000 })

/* ---------------------------------------------------------------- sections */
const requiredSections = [
  'home',
  'about',
  'services',
  'portfolio',
  'video-editing',
  'photography',
  'videography',
  'clients',
  'contact',
]
for (const id of requiredSections) {
  const found = await page.$(`#${id}`)
  found ? pass(`section #${id}`) : fail(`section #${id} MISSING`)
}

/* ------------------------------------------------------------ nav anchors */
const navTargets = await page.$$eval('header nav a[href^="#"]', (as) =>
  as.map((a) => a.getAttribute('href')),
)
const broken = []
for (const href of navTargets) {
  const exists = await page.$(href)
  if (!exists) broken.push(href)
}
broken.length === 0
  ? pass(`nav anchors resolve (${navTargets.length} links)`)
  : fail('nav anchors broken', broken.join(', '))

/* ------------------------------------------------------- hero requirements */
const heroHasMedia = await page.$eval(
  '#home',
  (el) => el.querySelector('img, video, picture, canvas') !== null,
)
heroHasMedia ? fail('hero contains media (should be typography only)') : pass('hero is typography-only')

const h1Count = await page.$$eval('h1', (els) => els.length)
h1Count === 1 ? pass('exactly one <h1>') : fail(`found ${h1Count} <h1> elements`)

/* ----------------------------------------------------- portfolio emptiness */
const placeholders = await page.$$eval(
  '[class*="border-dashed"]',
  (els) => els.length,
)
placeholders > 0
  ? pass(`portfolio placeholder frames rendered (${placeholders})`)
  : fail('no portfolio placeholders found')

const portfolioImages = await page.$$eval('#portfolio img', (els) =>
  els.map((e) => e.getAttribute('src')),
)
portfolioImages.length === 0
  ? pass('portfolio contains zero images (empty as required)')
  : fail('portfolio contains images', portfolioImages.join(', '))

const clientImages = await page.$$eval('#clients img', (e) => e.length)
clientImages === 0 ? pass('clients grid has no logos') : fail(`clients grid has ${clientImages} logos`)

/* ------------------------------------------------- service -> form linkage */
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('#services button')].find((b) =>
    b.textContent.includes('Enquire About This Service'),
  )
  btn?.click()
})
await new Promise((r) => setTimeout(r, 900))
const selected = await page.$eval('#contact select', (s) => s.value)
selected === 'Video Editing'
  ? pass('service card pre-selects dropdown', selected)
  : fail('service preselect failed', `got "${selected}"`)

/* ------------------------------------------------------- form validation */
await page.evaluate(() => {
  document.querySelector('#contact form button[type="submit"]').click()
})
await new Promise((r) => setTimeout(r, 500))

const errorTexts = await page.$$eval('#contact .text-red-400', (els) =>
  els.map((e) => e.textContent.trim()),
)
errorTexts.length >= 3
  ? pass(`validation blocks empty submit (${errorTexts.length} errors)`)
  : fail('validation did not block empty submit', JSON.stringify(errorTexts))

const falseSuccess = await page.$$eval('#contact', (el) =>
  /your enquiry has been sent/i.test(el[0]?.textContent ?? ''),
)
falseSuccess ? fail('shows success without submitting') : pass('no false success message')

/* -------------------------------------------- valid submit -> honest notice */
await page.type('#contact input[type="text"]', 'Test Person')
await page.type('#contact input[type="email"]', 'test@example.com')
await page.type('#contact textarea', 'This is a test project description that is long enough.')
await page.evaluate(() =>
  document.querySelector('#contact form button[type="submit"]').click(),
)
await new Promise((r) => setTimeout(r, 900))

const notice = await page.$eval('#contact [role="status"]', (el) => el.textContent.trim())
if (/not connected to a provider/i.test(notice)) {
  pass('unconfigured provider reported honestly')
} else if (/has been sent/i.test(notice)) {
  fail('claims success with no provider configured', notice)
} else {
  fail('unexpected status notice', notice.slice(0, 120))
}

/* ----------------------------------------------------------- accessibility */
const unlabelled = await page.$$eval('#contact input, #contact select, #contact textarea', (els) =>
  els
    .filter((el) => {
      const id = el.getAttribute('id')
      return !id || !document.querySelector(`label[for="${CSS.escape(id)}"]`)
    })
    .map((el) => el.outerHTML.slice(0, 60)),
)
unlabelled.length === 0
  ? pass('every form control has a <label>')
  : fail(`${unlabelled.length} unlabelled controls`, unlabelled.join(' | '))

const imgsNoAlt = await page.$$eval('img', (els) =>
  els.filter((e) => !e.hasAttribute('alt')).length,
)
imgsNoAlt === 0 ? pass('all images have alt attributes') : fail(`${imgsNoAlt} images missing alt`)

/* --------------------------------------------------------------- metadata */
const title = await page.title()
title.includes('The Editing Plug') ? pass('page title', title) : fail('bad title', title)

const desc = await page.$eval('meta[name="description"]', (m) => m.content).catch(() => '')
desc.length > 50 ? pass('meta description present') : fail('meta description missing/short')

const favicon = await page.$('link[rel="icon"]')
favicon ? pass('favicon linked') : fail('no favicon')

/* ------------------------------------------------------------- responsive */
for (const vp of viewports) {
  await page.setViewport(vp)
  await new Promise((r) => setTimeout(r, 450))

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  overflow <= 1
    ? pass(`${vp.name} (${vp.width}px) no horizontal overflow`)
    : fail(`${vp.name} overflows by ${overflow}px`)

  await page.screenshot({ path: `${OUT}/${vp.name}.png`, fullPage: true })
}

/* ----------------------------------------------------------- mobile menu */
await page.setViewport(viewports[2])
await new Promise((r) => setTimeout(r, 300))
await page.click('button[aria-controls="mobile-menu"]')
await new Promise((r) => setTimeout(r, 400))
const menuOpen = await page.$eval('#mobile-menu', (el) => !el.hasAttribute('hidden'))
menuOpen ? pass('mobile menu opens') : fail('mobile menu did not open')

await page.keyboard.press('Escape')
await new Promise((r) => setTimeout(r, 400))
const menuClosed = await page.$eval('#mobile-menu', (el) => el.hasAttribute('hidden'))
menuClosed ? pass('mobile menu closes on Escape') : fail('mobile menu did not close on Escape')

/* ------------------------------------------------------------------ done */
consoleErrors.length === 0
  ? pass('no console errors')
  : fail(`${consoleErrors.length} console errors`, consoleErrors.slice(0, 3).join(' | '))

await browser.close()

console.log('\n================ VERIFICATION ================')
for (const r of results) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.n}${r.d ? `  — ${r.d}` : ''}`)
}
const failed = results.filter((r) => !r.ok)
console.log('==============================================')
console.log(`${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length === 0 ? 0 : 1)
