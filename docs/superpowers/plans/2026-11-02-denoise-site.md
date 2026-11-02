# Denoise — AI Content Studio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Односторінковий концепт-сайт AI-агенції Denoise з телефонами, в яких відео «генеруються», editorial-типографікою і motion на 60 fps.

**Architecture:** Статичний Vite-проєкт, vanilla ES-модулі. Чиста логіка (прогрес генерації, ліміт одночасних відео, валідація форми) винесена в окремі модулі з юніт-тестами Vitest. DOM/motion-шар тонкий і перевіряється скриншотами в Chrome. Контент кейсів лежить в одному data-файлі, HTML телефонів рендериться з нього.

**Tech Stack:** Vite 6, GSAP 3.13 (ScrollTrigger, SplitText), Lenis 1.3, @fontsource-variable/anybody, @fontsource-variable/newsreader, Vitest + jsdom, ffmpeg 9 (локально).

**Spec:** `docs/superpowers/specs/2026-11-02-denoise-ai-content-studio-design.md`

## Global Constraints

- Кольори тільки з токенів: `--cobalt #2B2BFF`, `--lilac #E7E3FF`, `--midnight #14123A`, `--sun #FFD23F`, `--heliotrope #B69CFF`, `--mint #7DF0C8`, `--white #FFFFFF`. Ніякого червоного чи рожево-червоного.
- `--sun` — єдиний колір для CTA.
- Шрифти: Anybody (дисплей, лейбли), Newsreader (текст). Без моно. Без ALL-CAPS лейблів, без «→» на кнопках, нумерація тільки в Process.
- Копірайт англійською, sentence case, кнопки називають дію.
- Без підпису «concept/fictional» на сайті.
- Анімуються тільки transform/opacity (плюс `wdth` на десктопі й у hero-вордмарку).
- `prefers-reduced-motion: reduce` вимикає Lenis, parallax, автоплей і кастомний курсор, а reveal-анімації стають миттєвими.
- Відео: 720×1280 H.264, ≤ 1.5 MB, без звуку, `muted loop playsinline preload="none"`. Одночасно грає ≤ 2 на мобайлі і ≤ 3 на десктопі.
- Бюджет: LCP < 2.5 с (мобайл), стартове завантаження без відео < 600 KB, CLS < 0.05.
- Комітів немає, поки авторка не попросить.

## Review Focus

- Відео не завантажилось або повільна мережа: через 8 с показуємо постер і «Tap to retry». Тест у Task 3.
- Відео вже в кеші (`canplaythrough` спрацьовує одразу): генерація все одно триває ≥ 1.2 с. Тест у Task 2.
- Швидкий скрол повз багато телефонів: ліміт одночасних відео не перевищується, той, що вийшов з viewport, звільняє слот. Тест у Task 2.
- Reduced motion + тап по телефону: без автоплею, тап запускає відео. Тест у Task 3.
- Форма з порожнім або некоректним email не відправляється, помилка пояснює, як виправити. Тест у Task 5.

---

## File Structure

```
index.html                     розмітка всіх секцій
src/main.js                    точка входу: імпорт стилів, init модулів
src/styles/tokens.css          кольори, шрифти, шкала, відступи
src/styles/base.css            reset, типографіка, сітка, кнопки, focus
src/styles/sections.css        стилі секцій (nav…footer)
src/styles/phone.css           рамка телефона та його стани
src/data/cases.js              CASES[], HERO_CLIPS[]
src/phone/generation.js        чиста логіка прогресу
src/phone/playback-manager.js  ліміт одночасних відео
src/phone/phone-player.js      стан-машина одного телефона (DOM)
src/phone/render.js            phoneMarkup(clip) -> HTML string
src/ui/menu.js  faq.js  form.js  before-after.js  cursor.js  magnetic.js
src/motion/prefs.js  smooth-scroll.js  reveals.js  parallax.js  hero-intro.js
public/media/                  *.mp4, *.webp, storyboard/*.webp, noise.webp
scripts/process-media.sh       ffmpeg-пайплайн
tests/*.test.js
```

---

### Task 1: Каркас, токени, базові стилі

**Files:** Create `package.json` (переписати), `vite.config.js`, `index.html`, `src/main.js`, `src/styles/tokens.css`, `src/styles/base.css`, `.gitignore`, `vitest.config.js`

**Produces:** CSS custom properties з Global Constraints; утиліти `.container`, `.grid-12`, `.btn` / `.btn--sun`; `.surface--cobalt|lilac|midnight`; скрипти `npm run dev|build|test`.

- [ ] `npm uninstall motion`, потім `npm i gsap lenis @fontsource-variable/anybody @fontsource-variable/newsreader` і `npm i -D vite vitest jsdom`
- [ ] Шкала типографіки: база 18px (мобайл) / 20px (≥1024px), коефіцієнт 1.333; hero-вордмарк `clamp(4rem, 18vw, 18rem)`; текст Newsreader з line-height 1.55 і `max-width: 68ch`
- [ ] Видимий `:focus-visible` (outline 3px `--sun`, offset 3px)
- [ ] Перевірка: `npm run build` завершується без помилок; `npm run dev` показує сторінку з обома шрифтами (скриншот)

### Task 2: Логіка генерації та ліміт відтворення (TDD)

**Files:** Create `src/phone/generation.js`, `src/phone/playback-manager.js`, `tests/generation.test.js`, `tests/playback-manager.test.js`

**Produces:**
- `generationProgress({ bufferedRatio: number, elapsedMs: number, minMs = 1200 }) -> number` (0–100, ціле). Повертає `min(round(bufferedRatio*100), floor(elapsedMs/minMs*100))`, тобто не більше реального буфера і не швидше за мінімальний час.
- `isTimedOut(elapsedMs, limitMs = 8000) -> boolean`
- `createPlaybackManager({ max: number }) -> { request(id): boolean, release(id): void, active(): string[] }`. Коли `request` переповнює ліміт, витісняється найстаріший активний; менеджер викликає `onEvict(id)`, переданий в опціях.

- [ ] Тести: `generationProgress({bufferedRatio:1, elapsedMs:0}) === 0`; `({bufferedRatio:1, elapsedMs:600}) === 50`; `({bufferedRatio:1, elapsedMs:1200}) === 100`; `({bufferedRatio:0.3, elapsedMs:5000}) === 30`; `isTimedOut(8000) === true`, `isTimedOut(7999) === false`; менеджер з `max:2`: request a, b, c → `active()` дорівнює `['b','c']`, `onEvict` викликано з `'a'`; `release('b')` → `['c']`; повторний `request('c')` не дублює запис
- [ ] `npx vitest run` → FAIL (модулів немає)
- [ ] Реалізація
- [ ] `npx vitest run` → PASS

### Task 3: Компонент телефона

**Files:** Create `src/data/cases.js`, `src/phone/render.js`, `src/phone/phone-player.js`, `src/styles/phone.css`, `tests/phone-player.test.js`

**Interfaces:**
- Consumes: `generationProgress`, `isTimedOut`, `createPlaybackManager` (Task 2)
- Produces: `CASES: Array<{ id, client, brief, prompt, metrics: Array<{value,label}>, tools: string[], src, poster }>` (5 шт.), `HERO_CLIPS: Array<{ id, prompt, src, poster }>` (3 шт.); `phoneMarkup(clip) -> string`; `class PhonePlayer { constructor(root: HTMLElement, { manager, reducedMotion: boolean }) ; state: 'idle'|'prompt'|'generating'|'rendered'|'paused'|'error'; enter(): void; leave(): void; toggle(): void; retry(): void }`

- [ ] Тести (jsdom, фейковий `<video>` зі стабами `load/play/pause` і ручною диспетчеризацією подій, fake timers): `enter()` → `prompt` → `generating`; подія `canplaythrough` + 1200 мс → `rendered`, `play` викликано; без подій 8000 мс → `error`, у DOM текст «Tap to retry»; `toggle()` у `rendered` → `paused`, `pause` викликано; з `reducedMotion:true` `enter()` одразу дає `paused` з постером без `play`, а `toggle()` викликає `play`; `leave()` викликає `pause` і `manager.release`
- [ ] FAIL → реалізація → PASS
- [ ] CSS-рамка: співвідношення 9:19.5, радіус 14% ширини, «острівець», шар шуму `noise.webp` з анімацією `background-position` steps(6) і opacity, кільце прогресу (SVG stroke-dashoffset), бейдж `--mint` «Rendered»
- [ ] Перевірка: dev-сторінка з одним телефоном проходить усі стани (скриншоти)

### Task 4: Розмітка і стилі всіх секцій

**Files:** Modify `index.html`; Create `src/styles/sections.css`

**Consumes:** `phoneMarkup`, `CASES`, `HERO_CLIPS` (Task 3) — `main.js` вставляє телефони в `[data-phones="hero"]`, `[data-phones="work"]`.

- [ ] Секції в порядку специфікації §5 (nav + повноекранне меню, hero, marquee, work, deep-dive, AI vs traditional, services, process, results, packages, FAQ, contact, footer), з фінальним англійським копірайтом
- [ ] Чергування поверхонь: hero cobalt → work cobalt/midnight → deep-dive lilac → compare midnight → services lilac → process cobalt → results lilac → packages midnight → FAQ lilac → contact cobalt
- [ ] Фонове слово-привид на ~25vw за медіа в work і deep-dive (референс Formula)
- [ ] Плитки послуг різних розмірів (2 великі + 3 малі), не однакові картки
- [ ] Перевірка: скриншоти на 390px і 1440px без горизонтального скролу; контраст тексту відповідає AA

### Task 5: Інтерактив (меню, FAQ, форма, before/after)

**Files:** Create `src/ui/menu.js`, `src/ui/faq.js`, `src/ui/form.js`, `src/ui/before-after.js`, `tests/form.test.js`

**Produces:** `validateContact({ name, email, brand, budget, message }) -> Record<string,string>` (порожній об'єкт означає «валідно»); `initMenu()`, `initFaq()`, `initForm()`, `initBeforeAfter()`

- [ ] Тести: порожнє ім'я → `{ name: 'Add your name so we know who to reply to.' }`; email `'abc'` → `email: 'Enter an email like name@brand.com.'`; без бюджету → `budget: 'Pick a budget range.'`; повністю валідні дані → `{}`
- [ ] FAIL → реалізація → PASS
- [ ] Меню: `aria-expanded`, Esc закриває, фокус утримується всередині меню. FAQ: `<details>` з анімацією висоти. Форма після успіху показує «Thanks — we'll reply within 24 hours». Before/after: перетягування pointer-подіями + `input[type=range]` для клавіатури
- [ ] Перевірка: проходження всього з клавіатури (Tab / Enter / Esc)

### Task 6: Motion-шар

**Files:** Create `src/motion/prefs.js`, `smooth-scroll.js`, `reveals.js`, `parallax.js`, `hero-intro.js`, `src/ui/cursor.js`, `src/ui/magnetic.js`; Modify `src/main.js`

**Produces:** `prefersReducedMotion(): boolean`, `isTouch(): boolean` (`matchMedia('(pointer: coarse)')`), `initSmoothScroll()` (повертає `null` на touch або при reduced motion), `initReveals()`, `initParallax()`, `playHeroIntro()`, `initCursor()`, `initMagnetic()`

- [ ] Hero-інтро, єдиний оркестрований момент: промпт друкується (~40 мс/символ), далі 3 телефони стартують генерацію зі stagger 0.15 с, далі SplitText-слова заголовка з `wdth` 50→100 (на десктопі) або transform/opacity (на мобайлі)
- [ ] «Denoise»-reveal: шар `noise.webp` над медіа, opacity 1→0 + scale 1.04→1, 0.9 с, `power3.out`
- [ ] Parallax `yPercent` ±12 на десктопі, ±5 на мобайлі; stagger 0.08 с для послуг, кейсів і пакетів
- [ ] Телефони: IntersectionObserver (`threshold 0.4`) викликає `enter()`/`leave()`; менеджер `max` = 2 на мобайлі і 3 на десктопі
- [ ] Курсор «Play/Pause» над відео і магнітні кнопки тільки для `pointer: fine`; press-scale 0.97 на `:active`
- [ ] `ScrollTrigger.refresh()` після `document.fonts.ready`
- [ ] Перевірка: DevTools Performance з 4× CPU throttle на 390px, скрол усієї сторінки без long frames > 50 мс у скрол-фазі; емуляція reduced motion: ніщо не рухається саме, відео не стартують

### Task 7: Медіа

**Files:** Create `scripts/process-media.sh`, `public/media/*`

- [ ] Підібрати 8 вертикальних кліпів Pexels (3 hero + 5 кейсів: beauty, fashion, food, tech, fitness, product) і **показати авторці список перед завантаженням**
- [ ] `process-media.sh`: `ffmpeg -i in -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" -t 8 -an -c:v libx264 -crf 28 -preset slow -movflags +faststart out.mp4`; постер — перший кадр у WebP q70; storyboard — 8 кадрів кліпу кейсу через `edgedetect,negate,format=gray` у WebP; `noise.webp` 256×256 через `geq=random(1)*255`
- [ ] Перевірка: кожен mp4 ≤ 1.5 MB (`ls -l`), постери ≤ 60 KB

### Task 8: Метадані і фінальний QA

**Files:** Modify `index.html`; Create `public/favicon.svg`, `public/og.jpg`

- [ ] title, description, OG/Twitter-теги, favicon (літера D в Anybody на cobalt)
- [ ] Lighthouse mobile на `npm run preview`: Performance ≥ 90, Accessibility ≥ 95, LCP < 2.5 с, CLS < 0.05
- [ ] Скриншоти 390 / 768 / 1440 кожної секції; самокритика за принципами специфікації, зайві «аксесуари» прибрати
- [ ] `npx vitest run` → усе PASS; `npm run build` без попереджень
