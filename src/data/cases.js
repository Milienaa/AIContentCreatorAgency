const media = (name) => ({ src: `/media/${name}.mp4`, poster: `/media/${name}.webp` });

export const HERO_CLIPS = [
  {
    id: 'hero-ink',
    prompt: 'violet ink blooming in water, macro, slow motion',
    label: 'Generated clip: violet ink blooming in water',
    ...media('hero-ink'),
  },
  {
    id: 'hero-perfume',
    prompt: 'glass perfume bottle on sand, golden hour, soft wind',
    label: 'Generated clip: perfume bottle on sand at golden hour',
    ...media('hero-perfume'),
  },
  {
    id: 'hero-dancer',
    prompt: 'dancer spinning under neon light, 50mm, film grain',
    label: 'Generated clip: dancer spinning under neon light',
    ...media('hero-dancer'),
  },
];

export const CASES = [
  {
    id: 'lumea',
    client: 'Lumea Skin',
    category: 'Beauty',
    brief: 'Launch a vitamin C serum to Gen Z without booking a studio.',
    prompt: 'serum drop falling on skin, macro, warm morning light',
    metrics: [
      { value: '2.4M', label: 'organic views' },
      { value: '3.1×', label: 'return on ad spend' },
      { value: '6 days', label: 'brief to launch' },
    ],
    tools: ['Midjourney', 'Runway', 'DaVinci Resolve'],
    label: 'Lumea Skin serum launch reel',
    ...media('case-lumea'),
  },
  {
    id: 'northline',
    client: 'Northline',
    category: 'Fashion',
    brief: 'Twelve ad variants for a winter drop across four markets.',
    prompt: 'model in wool coat walking at blue hour, slow motion',
    metrics: [
      { value: '12', label: 'ad variants' },
      { value: '2.8%', label: 'click-through rate' },
      { value: '9 days', label: 'brief to launch' },
    ],
    tools: ['Kling', 'Midjourney', 'ElevenLabs'],
    label: 'Northline winter drop ad',
    ...media('case-northline'),
  },
  {
    id: 'oro',
    client: 'Oro Coffee',
    category: 'Food & drink',
    brief: 'Make a new espresso blend feel worth crossing town for.',
    prompt: 'espresso pouring in slow motion, crema swirl, side light',
    metrics: [
      { value: '1.1M', label: 'views in two weeks' },
      { value: '+38%', label: 'store visits' },
      { value: '5 days', label: 'brief to launch' },
    ],
    tools: ['Veo', 'Runway', 'DaVinci Resolve'],
    label: 'Oro Coffee espresso reel',
    ...media('case-oro'),
  },
  {
    id: 'pulse',
    client: 'Pulse Audio',
    category: 'Tech',
    brief: 'Show noise cancelling without a single spec sheet.',
    prompt: 'earbuds floating in a dark studio, rim light, slow orbit',
    metrics: [
      { value: '4.6%', label: 'click-through rate' },
      { value: '−41%', label: 'cost per acquisition' },
      { value: '7 days', label: 'brief to launch' },
    ],
    tools: ['Veo', 'Midjourney', 'ElevenLabs'],
    label: 'Pulse Audio earbuds ad',
    ...media('case-pulse'),
  },
  {
    id: 'kinetic',
    client: 'Kinetic Club',
    category: 'Fitness',
    brief: 'Fill January trial slots for a new boxing studio.',
    prompt: 'boxer training at dawn, dust in the light, handheld',
    metrics: [
      { value: '860K', label: 'views' },
      { value: '1,900', label: 'trial sign-ups' },
      { value: '10 days', label: 'brief to launch' },
    ],
    tools: ['Kling', 'Runway', 'DaVinci Resolve'],
    label: 'Kinetic Club boxing studio reel',
    ...media('case-kinetic'),
  },
];

/** The case the deep-dive section tells in full. */
export const FLAGSHIP_ID = 'lumea';
