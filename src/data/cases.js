const media = (name) => ({ src: `/media/${name}.mp4`, poster: `/media/${name}.webp` });

export const CASES = [
  // Dark to light, one warm palette: the walnut café and the charcoal gym,
  // then Sable's cream lamplight, Hush's sand and Lumea's peach morning last,
  // which leads into the Lumea deep dive below. The list opens on a calm
  // product shot rather than the boxing clip.
  {
    id: 'oro',
    client: 'Oro Coffee',
    category: 'Food & drink',
    brief: 'Make a new espresso blend feel worth crossing town for.',
    description:
      'Every coffee ad shows the same pour, so we slowed ours down until the crema became the story. Eight seconds, no logo until the end card, posted as a loop. People watched it an average of three times before scrolling on.',
    prompt: 'espresso pouring in slow motion, crema swirl, side light',
    metrics: [
      { value: '1.1M', label: 'views in two weeks' },
      { value: '+38%', label: 'store visits' },
      { value: '5 days', label: 'brief to launch' },
    ],
    tools: ['PixVerse', 'DaVinci Resolve'],
    label: 'Oro Coffee espresso reel',
    ...media('case-oro'),
  },
  {
    id: 'kinetic',
    client: 'Kinetic Club',
    category: 'Fitness',
    brief: 'Fill January trial slots for a new boxing studio.',
    description:
      'New Year resolutions fade by week two, so we sold the feeling of the first morning instead. A boxer, a heavy bag and dawn light, cut into six-second ads that led straight to booking a free trial.',
    prompt: 'boxer at dawn, breath in the backlight, handheld',
    metrics: [
      { value: '860K', label: 'views' },
      { value: '1,900', label: 'trial sign-ups' },
      { value: '10 days', label: 'brief to launch' },
    ],
    tools: ['Kling', 'DaVinci Resolve'],
    label: 'Kinetic Club boxing studio reel',
    ...media('case-kinetic'),
  },
  {
    id: 'sable',
    client: 'Sable',
    category: 'Fashion',
    brief: 'Sell a heavy knit in late August, when nobody wants a sweater.',
    description:
      'Nobody shops for wool in a heatwave, so we sold the first cool evening instead: lamplight on a terracotta wall, a breeze through a linen curtain, a sweater pulled close. One look, twelve cuts, each with a different first second. Pre-orders sold out before September.',
    prompt: 'woman in oat knit sweater by an open window, lamplight, linen curtain',
    metrics: [
      { value: '12', label: 'ad variants' },
      { value: '2.8%', label: 'click-through rate' },
      { value: '9 days', label: 'brief to launch' },
    ],
    tools: ['Kling', 'Midjourney', 'DaVinci Resolve'],
    label: 'Sable knitwear autumn drop ad',
    ...media('case-sable'),
  },
  {
    id: 'hush',
    client: 'Hush Audio',
    category: 'Tech',
    brief: 'Show noise cancelling without a single spec sheet.',
    description:
      'Noise cancelling is invisible, so we made the noise visible: wind-blown sand burying a pair of headphones on a dune. They switch on, the wind dies and the sand settles. Silence became the product shot. The ad ran with no numbers on screen and halved the cost per sale.',
    prompt: 'headphones on a sand dune, the wind dies down, golden hour',
    metrics: [
      { value: '4.6%', label: 'click-through rate' },
      { value: '−41%', label: 'cost per acquisition' },
      { value: '7 days', label: 'brief to launch' },
    ],
    tools: ['Veo', 'Midjourney', 'DaVinci Resolve'],
    label: 'Hush Audio headphones ad',
    ...media('case-hush'),
  },
  {
    id: 'lumea',
    client: 'Lumea Skin',
    category: 'Beauty',
    brief: 'Launch a vitamin C serum to Gen Z without booking a studio.',
    description:
      'Gen Z scrolls past anything that looks like an ad, so we didn’t make one. The serum became morning light: one drop, one slow reveal, no voiceover. We kept 11 of 42 generations and tested a different first second in each.',
    prompt: 'golden serum drop on a dropper, macro, warm morning light',
    metrics: [
      { value: '2.4M', label: 'organic views' },
      { value: '3.1×', label: 'return on ad spend' },
      { value: '6 days', label: 'brief to launch' },
    ],
    tools: ['Veo', 'DaVinci Resolve'],
    label: 'Lumea Skin serum launch reel',
    ...media('case-lumea'),
  },
];

/** The case the deep-dive section tells in full. */
export const FLAGSHIP_ID = 'lumea';

/**
 * Cut order for the hero showreel. Opens on Hush, whose sandstorm settling
 * into silence is the brand name made literal. Every cut flips light ↔ dark
 * so neighbouring clips never blur together. Boxing is the loudest clip, so
 * it comes last, well after the calm opening, and its dark gym cuts back to
 * Hush's bright sand when the loop restarts:
 *   Hush (sand) → Oro (walnut) → Sable (cream lamplight) → Lumea (peach)
 *   → Kinetic (charcoal) → Hush …
 */
export const REEL_ORDER = ['hush', 'oro', 'sable', 'lumea', 'kinetic'];
