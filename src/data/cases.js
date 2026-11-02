const media = (name) => ({ src: `/media/${name}.mp4`, poster: `/media/${name}.webp` });

export const CASES = [
  // Ordered as a cool-to-warm gradient, evening to morning: the list ends on
  // Lumea, the brightest clip, which leads into the Lumea deep dive below.
  {
    id: 'northline',
    client: 'Northline',
    category: 'Fashion',
    brief: 'Twelve ad variants for a winter drop across four markets.',
    description:
      'One walk, four cities. We generated a single hero look on a blue-hour street, then changed the street, the weather and the voiceover language for each market instead of flying a crew to each one. The Oslo cut had the highest click-through.',
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
    id: 'pulse',
    client: 'Pulse Audio',
    category: 'Tech',
    brief: 'Show noise cancelling without a single spec sheet.',
    description:
      'Noise cancelling is invisible, so we made the noise visible: a storm of particles that clears the moment the earbuds switch on. Silence became the product shot. The ad ran with no numbers on screen and halved the cost per sale.',
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
    description:
      'New Year resolutions fade by week two, so we sold the feeling of the first morning instead. A boxer, a heavy bag and dawn light, cut into six-second ads that led straight to booking a free trial.',
    prompt: 'boxer training at dawn, dust in the light, handheld',
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
 * Cut order for the hero showreel. Opens on Pulse, whose particle storm
 * clearing into silence is the brand name made literal; then alternates
 * warm and cool so neighbouring cuts never blur together.
 */
export const REEL_ORDER = ['pulse', 'lumea', 'northline', 'oro', 'kinetic'];
