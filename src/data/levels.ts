export type LevelId = 'demo' | 'easy' | 'medium' | 'hard' | 'nightmare';

export interface BugSpec {
  id: string;
  number: number;
  title: string;
  category:
    | 'CSS Transform'
    | 'Typography'
    | 'Asset / DOM'
    | 'Box Model / Overflow'
    | 'Z-Index / Stacking'
    | 'WCAG Contrast'
    | 'State / Template'
    | 'Flex / Grid Alignment'
    | 'Design Token';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  brokenCode: string;
  fixedCode: string;
  hint: string;
}

export interface LevelConfig {
  id: LevelId;
  index: number;
  label: string;
  badgeColor: string;
  caseCode: string;
  title: string;
  subtitle: string;
  mockUrl: string;
  maxClicks: number;
  timeLimitSeconds: number;
  basePointsPerBug: number;
  clickBonusPoints: number;
  timeBonusPoints: number;
  briefing: string;
  bugs: BugSpec[];
}

export const LEVELS: LevelConfig[] = [
  {
    id: 'demo',
    index: 1,
    label: 'DEMO',
    badgeColor: '#00d4ff',
    caseCode: 'CASE #00 // TRAINING',
    title: 'Bean & Byte Artisanal Café',
    subtitle: 'Local Coffee Roaster Landing Page',
    mockUrl: 'https://bean-and-byte.cafe/order-now',
    maxClicks: 10,
    timeLimitSeconds: 120,
    basePointsPerBug: 100,
    clickBonusPoints: 50,
    timeBonusPoints: 10,
    briefing:
      'Welcome to NexaSoul Forensics! This café landing page was deployed on a Friday afternoon without a PR review. Find all 4 obvious UI bugs by clicking directly on the broken elements.',
    bugs: [
      {
        id: 'demo-1',
        number: 1,
        title: 'Upside-Down Primary CTA Button',
        category: 'CSS Transform',
        severity: 'High',
        description:
          'A stray rotate-180 utility class left over from an icon spinner test inverted the primary "Order Espresso" button completely upside down.',
        brokenCode: '<button className="bg-amber-700 text-white rotate-180">Order Espresso</button>',
        fixedCode: '<button className="bg-amber-700 text-white">Order Espresso</button>',
        hint: 'Check the primary call-to-action button in the hero banner.',
      },
      {
        id: 'demo-2',
        number: 2,
        title: 'Crushed Hero Line-Height Collision',
        category: 'Typography',
        severity: 'Medium',
        description:
          'Setting line-height: 0.55 on a multi-line display heading causes the descenders of the first line to crash directly into the second line.',
        brokenCode: 'h1.hero-title {\n  font-size: 2.25rem;\n  line-height: 0.55; /* Crushed lines */\n}',
        fixedCode: 'h1.hero-title {\n  font-size: 2.25rem;\n  line-height: 1.15;\n}',
        hint: 'Look closely at the main headline text in the hero section.',
      },
      {
        id: 'demo-3',
        number: 3,
        title: 'Broken Image Asset Path & Raw Alt Leak',
        category: 'Asset / DOM',
        severity: 'High',
        description:
          'A relative local file path (C:\\Users\\dev\\latte_final_v2.jpg) was committed to production instead of a public asset URL, rendering a broken image box.',
        brokenCode: '<img src="C:\\Users\\dev\\Desktop\\latte_final_v2.jpg" alt="IMG_ERR_404_CROISSANT_RAW" />',
        fixedCode: '<img src="/assets/menu/matcha-croissant.webp" alt="Fresh Matcha Croissant" />',
        hint: 'Inspect the middle pastry card image in the featured menu row.',
      },
      {
        id: 'demo-4',
        number: 4,
        title: 'Price Badge Overflowing Card Container',
        category: 'Box Model / Overflow',
        severity: 'Medium',
        description:
          'Negative right margin (-mr-10) with absolute positioning pushes the "$6.50" price tag outside the boundary of the Cold Brew product card.',
        brokenCode: '<span className="absolute -right-8 -bottom-4 bg-amber-900">$6.5000000001</span>',
        fixedCode: '<span className="inline-flex items-center px-2.5 py-1 rounded-full">$6.50</span>',
        hint: 'Check the price tag on the rightmost Cold Brew menu card.',
      },
    ],
  },
  {
    id: 'easy',
    index: 2,
    label: 'EASY',
    badgeColor: '#a3e635',
    caseCode: 'CASE #01 // JUNIOR AUDIT',
    title: 'PulseCloud SaaS Pricing',
    subtitle: 'Cloud Infrastructure Subscription Portal',
    mockUrl: 'https://app.pulsecloud.io/billing/plans',
    maxClicks: 9,
    timeLimitSeconds: 90,
    basePointsPerBug: 150,
    clickBonusPoints: 75,
    timeBonusPoints: 15,
    briefing:
      'PulseCloud noticed a 42% drop in Pro plan conversions after their latest CSS refactor. Spot all 5 frontend errors across the pricing tier view.',
    bugs: [
      {
        id: 'easy-1',
        number: 1,
        title: 'Z-Index Badge Collision Over Billing Toggle',
        category: 'Z-Index / Stacking',
        severity: 'High',
        description:
          'The "SAVE 20% YEARLY" floating pill has a negative top offset without proper positioning context, obscuring the Monthly/Annual toggle switch.',
        brokenCode: '<span className="absolute -top-2 left-12 z-50 scale-110">SAVE 20% OVERLAP</span>',
        fixedCode: '<span className="ml-2 inline-flex items-center rounded-full px-2.5 py-0.5">Save 20%</span>',
        hint: 'Look at the Monthly / Annual billing switch near the top header.',
      },
      {
        id: 'easy-2',
        number: 2,
        title: 'Unresolved JS Template Literal in Price Tag',
        category: 'State / Template',
        severity: 'Critical',
        description:
          'Single quotes were used instead of backticks in JSX, causing the literal string "${plan.starterPrice}/mo" to render to customers.',
        brokenCode: '<div className="text-3xl font-bold">{"${plan.starterPrice}/mo"}</div>',
        fixedCode: '<div className="text-3xl font-bold">{`$${plan.starterPrice}/mo`}</div>',
        hint: 'Check the price display on the Starter tier card on the left.',
      },
      {
        id: 'easy-3',
        number: 3,
        title: 'Severe WCAG Contrast Failure (1.12:1 Ratio)',
        category: 'WCAG Contrast',
        severity: 'High',
        description:
          'Pure white text (#FFFFFF) placed on a pale pastel yellow button (#FEF9C3) makes the Pro plan CTA nearly invisible to users.',
        brokenCode: '<button className="bg-yellow-100 text-white">Upgrade to Pro</button>',
        fixedCode: '<button className="bg-indigo-600 text-white hover:bg-indigo-700">Upgrade to Pro</button>',
        hint: 'Look at the CTA button inside the highlighted middle Pro plan card.',
      },
      {
        id: 'easy-4',
        number: 4,
        title: 'Stretched & Squished Customer Avatar',
        category: 'CSS Transform',
        severity: 'Medium',
        description:
          'Setting fixed non-square dimensions (w-20 h-7) on a portrait photo without object-fit: cover severely distorts the testimonial avatar.',
        brokenCode: '<img className="w-24 h-6 rounded-full" src={avatar} />',
        fixedCode: '<img className="w-10 h-10 rounded-full object-cover" src={avatar} />',
        hint: 'Inspect the customer testimonial bar at the bottom of the pricing page.',
      },
      {
        id: 'easy-5',
        number: 5,
        title: 'Misaligned Feature List Checkmark Icons',
        category: 'Flex / Grid Alignment',
        severity: 'Medium',
        description:
          'A rogue flex-col and negative margin on the Enterprise feature list item pushes the checkmark icon above and right of the text baseline.',
        brokenCode: '<li className="flex flex-col items-end -mt-3">✓ Dedicated SLA</li>',
        fixedCode: '<li className="flex items-center gap-2">✓ Dedicated SLA</li>',
        hint: 'Examine the bullet points inside the Enterprise card on the right.',
      },
    ],
  },
  {
    id: 'medium',
    index: 3,
    label: 'MEDIUM',
    badgeColor: '#facc15',
    caseCode: 'CASE #02 // MID-LEVEL AUDIT',
    title: 'KicksVault Streetwear Drop',
    subtitle: 'E-Commerce Limited Edition Checkout',
    mockUrl: 'https://kicksvault.store/drops/cyber-runner-v4',
    maxClicks: 9,
    timeLimitSeconds: 75,
    basePointsPerBug: 250,
    clickBonusPoints: 90,
    timeBonusPoints: 20,
    briefing:
      'Sneakerheads are furious: the limited Cyber-Runner V4 drop page has 6 subtle layout, state, and overflow bugs. Spot all 6 before the drop timer expires!',
    bugs: [
      {
        id: 'medium-1',
        number: 1,
        title: 'Search Icon Overlapping Input Text',
        category: 'Box Model / Overflow',
        severity: 'Medium',
        description:
          'An absolutely positioned magnifying glass icon at left-3 was added without adding pl-9 to the input element, making placeholder text collide with the icon.',
        brokenCode: '<input className="px-2 py-1.5" placeholder="Search sneakers..." />',
        fixedCode: '<input className="pl-9 pr-3 py-1.5" placeholder="Search sneakers..." />',
        hint: 'Check the search bar in the top store navigation.',
      },
      {
        id: 'medium-2',
        number: 2,
        title: 'Negative Cart Item Badge (-1 Items)',
        category: 'State / Template',
        severity: 'High',
        description:
          'Decrementing cart quantity lacked a Math.max(0, count - 1) guard, resulting in a "-1" badge rendered on the shopping bag icon.',
        brokenCode: 'setCartCount(prev => prev - 1); // Can go negative!',
        fixedCode: 'setCartCount(prev => Math.max(0, prev - 1));',
        hint: 'Look at the Cart counter badge in the top-right corner of the store navbar.',
      },
      {
        id: 'medium-3',
        number: 3,
        title: '6-Out-Of-5 Stars Rating Overflow',
        category: 'State / Template',
        severity: 'Medium',
        description:
          'An off-by-one loop condition (i <= 5 instead of i < 5) renders 6 gold stars next to the "4.9 / 5.0" review label.',
        brokenCode: 'Array.from({ length: 6 }).map((_, i) => <StarIcon key={i} />)',
        fixedCode: 'Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)',
        hint: 'Count the gold review stars right above the sneaker title.',
      },
      {
        id: 'medium-4',
        number: 4,
        title: 'Clipped "Add to Bag" Button Text',
        category: 'Box Model / Overflow',
        severity: 'High',
        description:
          'A fixed height of h-6 combined with py-4 and overflow-hidden slices the bottom half of the "ADD TO BAG — $220" label.',
        brokenCode: '<button className="h-6 pt-3 overflow-hidden">ADD TO BAG — $220</button>',
        fixedCode: '<button className="h-11 px-6 inline-flex items-center justify-center">ADD TO BAG — $220</button>',
        hint: 'Inspect the main black "ADD TO BAG" button under the shoe sizes.',
      },
      {
        id: 'medium-5',
        number: 5,
        title: 'Size Selector Grid Wrap / Aspect Break',
        category: 'Flex / Grid Alignment',
        severity: 'Medium',
        description:
          'One shoe size tile ("US 10.5") has whitespace-normal and w-8 inside a strict grid, causing the text to wrap vertically and stretch the row height.',
        brokenCode: '<button className="w-8 py-3 leading-none">US\n10.5</button>',
        fixedCode: '<button className="h-10 px-3 whitespace-nowrap">US 10.5</button>',
        hint: 'Look at the US shoe size selector grid on the right panel.',
      },
      {
        id: 'medium-6',
        number: 6,
        title: 'NaN Footer Copyright Year Calculation',
        category: 'State / Template',
        severity: 'Low',
        description:
          'Calling new Date("invalid").getFullYear() in the footer template outputs "© NaN KicksVault Inc." in production.',
        brokenCode: '<footer>© {new Date("2026-13-99").getFullYear()} KicksVault Inc.</footer>',
        fixedCode: '<footer>© {new Date().getFullYear()} KicksVault Inc.</footer>',
        hint: 'Check the copyright notice in the bottom footer bar.',
      },
    ],
  },
  {
    id: 'hard',
    index: 4,
    label: 'HARD',
    badgeColor: '#fb923c',
    caseCode: 'CASE #03 // SENIOR AUDIT',
    title: 'QuantPay FinTech Terminal',
    subtitle: 'Institutional Treasury & Crypto Ledger',
    mockUrl: 'https://terminal.quantpay.finance/treasury',
    maxClicks: 8,
    timeLimitSeconds: 60,
    basePointsPerBug: 350,
    clickBonusPoints: 120,
    timeBonusPoints: 25,
    briefing:
      'High-frequency traders reported subtle UI glitches in the QuantPay Terminal. You have 60 seconds and only 8 clicks to pinpoint all 6 senior-level frontend defects.',
    bugs: [
      {
        id: 'hard-1',
        number: 1,
        title: 'Semantic Color Inversion on Negative PnL Badge',
        category: 'Design Token',
        severity: 'High',
        description:
          'A -14.82% portfolio loss is styled with emerald green (text-emerald-400 bg-emerald-500/10) and an upward arrow instead of danger red.',
        brokenCode: '<span className="text-emerald-400">▲ -14.82% (24h)</span>',
        fixedCode: '<span className="text-rose-400">▼ -14.82% (24h)</span>',
        hint: 'Inspect the 24h percentage change pill next to the Total Portfolio Value.',
      },
      {
        id: 'hard-2',
        number: 2,
        title: 'Premature Text Ellipsis on Wide Metric Card',
        category: 'Typography',
        severity: 'Medium',
        description:
          'An accidental max-w-[68px] truncate class on the "Available Liquidity" value cuts off "$482,910.00" as "$48..." despite 200px of empty space.',
        brokenCode: '<p className="max-w-[68px] truncate text-xl font-mono">$482,910.00</p>',
        fixedCode: '<p className="text-xl font-mono">$482,910.00</p>',
        hint: 'Check the numerical balance inside the middle "Available Liquidity" stat card.',
      },
      {
        id: 'hard-3',
        number: 3,
        title: 'Unstyled Square Tab Token in Pill Group',
        category: 'Design Token',
        severity: 'Medium',
        description:
          'In the timeframe segmented control (1D, 1W, 1M, 1Y), the "1M" button has rounded-none and a harsh 2px magenta border instead of rounded-full.',
        brokenCode: '<button className="rounded-none border-2 border-fuchsia-500">1M</button>',
        fixedCode: '<button className="rounded-full px-3 py-1">1M</button>',
        hint: 'Look at the chart timeframe selector buttons (1D / 1W / 1M / 1Y).',
      },
      {
        id: 'hard-4',
        number: 4,
        title: 'Chart Tooltip Clipped by Stacking Context',
        category: 'Z-Index / Stacking',
        severity: 'High',
        description:
          'The floating chart hover tooltip has z-index: 1 while the adjacent card badge sits higher, slicing off half of the tooltip readout.',
        brokenCode: '<div className="absolute top-2 right-0 z-0 opacity-45">Peak: $94,120 (CLIPPED)</div>',
        fixedCode: '<div className="absolute top-2 right-4 z-30 shadow-xl">Peak: $94,120</div>',
        hint: 'Examine the floating tooltip box in the upper-right area of the revenue bar chart.',
      },
      {
        id: 'hard-5',
        number: 5,
        title: 'Currency Symbol / ISO Code Mismatch ($ EUR)',
        category: 'State / Template',
        severity: 'High',
        description:
          'Hardcoding a "$" prefix before an Intl.NumberFormat("de-DE", { currency: "EUR" }) output produces a contradictory "$€12.450,00 EUR" string.',
        brokenCode: '<td>${formatEUR(tx.amount)} EUR</td>',
        fixedCode: '<td>{formatCurrency(tx.amount, tx.currency)}</td>',
        hint: 'Check the amount column of the Wire Transfer row in the recent transactions list.',
      },
      {
        id: 'hard-6',
        number: 6,
        title: 'Displaced Alert Close (×) Button Outside Box',
        category: 'Box Model / Overflow',
        severity: 'Medium',
        description:
          'Using -top-4 -right-4 on the security banner close button pushes the "×" icon floating outside the alert container border.',
        brokenCode: '<button className="absolute -top-3.5 -right-3.5">×</button>',
        fixedCode: '<button className="absolute top-2.5 right-2.5">×</button>',
        hint: 'Look at the top-right corner of the KYC Security Notice box on the right side.',
      },
    ],
  },
  {
    id: 'nightmare',
    index: 5,
    label: 'NIGHTMARE',
    badgeColor: '#f43f5e',
    caseCode: 'CASE #04 // PRINCIPAL ARCHITECT',
    title: 'NexaSoul AI Cluster OS',
    subtitle: 'Neural Mesh Deployment & Telemetry Console',
    mockUrl: 'https://console.nexasoul.ai/clusters/ns-prod-09',
    maxClicks: 7,
    timeLimitSeconds: 45,
    basePointsPerBug: 500,
    clickBonusPoints: 200,
    timeBonusPoints: 40,
    briefing:
      'NIGHTMARE MODE: Only Principal Frontend Architects survive this audit. 6 micro-defects (sub-pixel baseline shift, inverted toggle state, font-family leak, 108% progress bleed, stuck focus ring, double border). 45 seconds. 7 clicks.',
    bugs: [
      {
        id: 'nightmare-1',
        number: 1,
        title: 'Breadcrumb Baseline Shift (5px Vertical Offset)',
        category: 'Flex / Grid Alignment',
        severity: 'Medium',
        description:
          'The final breadcrumb segment ("ns-prod-09") has an accidental pt-2.5 self-end class, dropping its baseline 5px below the slash separator.',
        brokenCode: '<span className="pt-2.5 inline-block translate-y-1.5">ns-prod-09</span>',
        fixedCode: '<span className="inline-flex items-center">ns-prod-09</span>',
        hint: 'Inspect the top breadcrumb path: Clusters / Production / ns-prod-09.',
      },
      {
        id: 'nightmare-2',
        number: 2,
        title: 'Contradictory Toggle Switch State (ON Track, OFF Knob)',
        category: 'State / Template',
        severity: 'High',
        description:
          'The "Auto-Scale Shards" switch displays an active emerald-green background and "ENABLED" badge, yet the circular thumb knob is translated left (OFF position).',
        brokenCode: '<div className="bg-emerald-500"><span className="translate-x-0" /></div>',
        fixedCode: '<div className="bg-emerald-500"><span className="translate-x-5" /></div>',
        hint: 'Look closely at the "Auto-Scale Shards" toggle switch in the cluster controls.',
      },
      {
        id: 'nightmare-3',
        number: 3,
        title: '108% GPU Memory Bar Bleeding Past Track',
        category: 'Box Model / Overflow',
        severity: 'High',
        description:
          'Percentage width was not clamped to 100%, and the progress track lacks overflow-hidden, causing the cyan fill bar to jut 14px out of its container.',
        brokenCode: '<div className="w-full bg-slate-800"><div style={{ width: "108%" }} /></div>',
        fixedCode: '<div className="w-full bg-slate-800 overflow-hidden"><div style={{ width: "100%" }} /></div>',
        hint: 'Check the right edge of the "VRAM Allocation" progress bar.',
      },
      {
        id: 'nightmare-4',
        number: 4,
        title: 'Times New Roman Serif Font Fallback Leak',
        category: 'Typography',
        severity: 'Medium',
        description:
          'A typo in the inline font-family declaration (fontFamily: "JetBrainsMono, serif") causes the Latency metric to render in Times New Roman serif.',
        brokenCode: '<span style={{ fontFamily: "Times New Roman, serif" }}>14.2 ms</span>',
        fixedCode: '<span className="font-mono">14.2 ms</span>',
        hint: 'Compare the typography of the numerical values across the telemetry cards.',
      },
      {
        id: 'nightmare-5',
        number: 5,
        title: 'Stuck Focus Ring on Disabled Sidebar Item',
        category: 'WCAG Contrast',
        severity: 'Medium',
        description:
          'A hardcoded ring-2 ring-cyan-400 outline remains permanently visible on the disabled "Legacy v1 Nodes (Deprecated)" navigation button.',
        brokenCode: '<button disabled className="opacity-40 ring-2 ring-cyan-400">Legacy v1</button>',
        fixedCode: '<button disabled className="opacity-40 pointer-events-none">Legacy v1</button>',
        hint: 'Check the left sidebar navigation items, specifically the disabled item.',
      },
      {
        id: 'nightmare-6',
        number: 6,
        title: 'Double Border Seam + Raw HTML Entity (&amp;) Leak',
        category: 'Asset / DOM',
        severity: 'Medium',
        description:
          'Double-escaping a string in the deployment log outputs literal "&amp;nbsp;" text alongside a 4px double border-t collision.',
        brokenCode: '<div className="border-t-4 border-double">Syncing weight shards &amp;nbsp; [OK]</div>',
        fixedCode: '<div className="border-t border-slate-800">Syncing weight shards [OK]</div>',
        hint: 'Inspect the middle log line inside the Live Kernel Stream terminal at the bottom.',
      },
    ],
  },
];
