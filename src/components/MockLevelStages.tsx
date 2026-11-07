import React from 'react';
import { LevelId } from '../data/levels';

interface StageProps {
  levelId: LevelId;
  foundBugIds: string[];
  hintBugId: string | null;
  onBugClick: (bugId: string, e: React.MouseEvent) => void;
}

interface BugZoneProps {
  bugId: string;
  foundBugIds: string[];
  hintBugId: string | null;
  onBugClick: (bugId: string, e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
  badgeLabel?: string;
}

const BugZone: React.FC<BugZoneProps> = ({
  bugId,
  foundBugIds,
  hintBugId,
  onBugClick,
  className = '',
  children,
  badgeLabel,
}) => {
  const isFound = foundBugIds.includes(bugId);
  const isHinted = hintBugId === bugId && !isFound;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onBugClick(bugId, e);
      }}
      className={`relative cursor-pointer transition-all ${className} ${
        isFound
          ? 'ring-2 ring-sky-600 bg-sky-500/10 rounded-md bug-found-ring'
          : isHinted
          ? 'ring-2 ring-amber-500 rounded-md bug-hint-glow'
          : ''
      }`}
    >
      {children}
      {isFound && (
        <span className="pointer-events-none absolute -top-2.5 -right-2.5 z-40 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-600 text-white shadow-md">
          ✓ {badgeLabel || 'BUG FOUND'}
        </span>
      )}
    </div>
  );
};

export const MockLevelStages: React.FC<StageProps> = ({
  levelId,
  foundBugIds,
  hintBugId,
  onBugClick,
}) => {
  if (levelId === 'demo') {
    return (
      <div className="bg-[#faf6f0] text-stone-900 min-h-[500px] p-5 sm:p-7 select-none">
        {/* Top Cafe Navbar */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-800 text-white flex items-center justify-center font-bold">
              ☕
            </span>
            <span className="font-bold text-lg tracking-tight text-amber-950">
              Bean &amp; Byte Roasters
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-stone-600 font-medium">
            <span>Single Origin</span>
            <span>Bakery</span>
            <span>Locations</span>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
              Open Daily 7am–7pm
            </span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-gradient-to-br from-amber-900/10 to-orange-900/5 p-6 rounded-2xl border border-amber-900/15">
          <div className="md:col-span-7 space-y-4">
            <span className="inline-block text-xs uppercase tracking-widest text-amber-800 font-semibold">
              Small-Batch Roasted in Tokyo &amp; SF
            </span>

            {/* BUG DEMO-2: Crushed Line Height */}
            <BugZone
              bugId="demo-2"
              foundBugIds={foundBugIds}
              hintBugId={hintBugId}
              onBugClick={onBugClick}
              badgeLabel="BUG #2: line-height: 0.55"
              className="py-2"
            >
              <h1
                style={{ lineHeight: 0.55 }}
                className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight"
              >
                Handcrafted Pour-Over
                <br />
                For Late-Night Engineers
              </h1>
            </BugZone>

            <p className="text-sm text-stone-600 max-w-md">
              Rich chocolate notes, zero bitterness, and 200mg of clean caffeine to help you ship
              hotfixes before 5 PM.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              {/* BUG DEMO-1: Upside-down CTA button */}
              <BugZone
                bugId="demo-1"
                foundBugIds={foundBugIds}
                hintBugId={hintBugId}
                onBugClick={onBugClick}
                badgeLabel="BUG #1: rotate-180"
                className="inline-block"
              >
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-amber-800 text-white font-semibold text-sm shadow-md rotate-180"
                >
                  Order Espresso Now →
                </button>
              </BugZone>

              <span className="text-xs text-stone-500">Free oat milk upgrade today</span>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="w-full max-w-[240px] rounded-2xl bg-white border border-amber-200 text-stone-900 p-5 shadow-md">
              <div className="text-xs uppercase tracking-wider text-amber-700 font-bold">
                Barista Pick
              </div>
              <div className="text-xl font-bold mt-1">Kyoto Slow Drip</div>
              <div className="text-xs text-stone-500 mt-1">Steeped 18 hours over crystal ice</div>
              <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-sm font-semibold">
                <span>16 oz Glass</span>
                <span className="text-amber-800">$5.25</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Menu Cards */}
        <div className="mt-7">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3">
            Popular Morning Pairings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Card 1: Normal */}
            <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
              <div className="h-24 rounded-lg bg-amber-100 flex items-center justify-center text-3xl">
                🥐
              </div>
              <div className="mt-3 font-bold text-stone-800">Almond Brioche</div>
              <div className="text-xs text-stone-500 mt-0.5">Toasted flake almonds &amp; honey</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full">
                  $4.75
                </span>
                <span className="text-xs text-stone-400">In Stock</span>
              </div>
            </div>

            {/* Card 2: BUG DEMO-3 Broken Image Path */}
            <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
              <BugZone
                bugId="demo-3"
                foundBugIds={foundBugIds}
                hintBugId={hintBugId}
                onBugClick={onBugClick}
                badgeLabel="BUG #3: Broken Local Asset"
              >
                <div className="h-24 rounded-lg bg-red-50 border-2 border-dashed border-red-300 p-2 flex flex-col justify-center items-start overflow-hidden">
                  <div className="flex items-center gap-1.5 text-red-600 text-xs font-mono font-bold">
                    <span>🖼️❌</span>
                    <span>ERR_FILE_NOT_FOUND</span>
                  </div>
                  <div className="text-[10px] font-mono text-stone-600 break-all mt-1 leading-tight">
                    src=&quot;C:\Users\dev\Desktop\latte_final_v2.jpg&quot;
                  </div>
                </div>
              </BugZone>
              <div className="mt-3 font-bold text-stone-800">Matcha Croissant</div>
              <div className="text-xs text-stone-500 mt-0.5">Uji ceremonial grade custard</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full">
                  $5.50
                </span>
                <span className="text-xs text-stone-400">In Stock</span>
              </div>
            </div>

            {/* Card 3: BUG DEMO-4 Overflowing Price Badge */}
            <div className="relative bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
              <div className="h-24 rounded-lg bg-stone-100 flex items-center justify-center text-3xl">
                🧋
              </div>
              <div className="mt-3 font-bold text-stone-800">Nitro Cold Brew</div>
              <div className="text-xs text-stone-500 mt-0.5">Velvety cascading micro-foam</div>
              <div className="mt-3 flex items-center justify-between">
                <BugZone
                  bugId="demo-4"
                  foundBugIds={foundBugIds}
                  hintBugId={hintBugId}
                  onBugClick={onBugClick}
                  badgeLabel="BUG #4: Overflow & Float Precision"
                  className="-mr-10 translate-x-6"
                >
                  <span className="inline-block text-xs font-mono font-bold text-white bg-amber-800 px-3 py-1.5 rounded-md shadow-md whitespace-nowrap">
                    $6.50000000004 USD
                  </span>
                </BugZone>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (levelId === 'easy') {
    return (
      <div className="bg-slate-50 text-slate-900 min-h-[500px] p-5 sm:p-7 select-none">
        {/* Header & Billing Switch */}
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            PulseCloud Infrastructure
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Predictable Pricing for Modern Teams
          </h2>

          {/* Billing Toggle with BUG EASY-1 Z-index collision */}
          <div className="mt-5 inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm relative">
            <span className="text-xs font-medium text-slate-600">Monthly</span>
            <div className="w-10 h-5 rounded-full bg-indigo-600 relative flex items-center px-0.5">
              <span className="w-4 h-4 rounded-full bg-white translate-x-5" />
            </div>
            <span className="text-xs font-semibold text-slate-900">Annual Billing</span>

            {/* BUG EASY-1: Overlapping badge obscuring toggle */}
            <BugZone
              bugId="easy-1"
              foundBugIds={foundBugIds}
              hintBugId={hintBugId}
              onBugClick={onBugClick}
              badgeLabel="BUG #1: Z-Index Collision"
              className="absolute -top-1 left-14 z-20"
            >
              <span className="inline-block bg-amber-400 text-slate-950 font-extrabold text-[11px] px-2.5 py-1 rounded shadow-md border border-slate-900 -rotate-6">
                SAVE 20% YEARLY!!
              </span>
            </BugZone>
          </div>
        </div>

        {/* 3 Pricing Tiers */}
        <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Starter Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-slate-700">Starter Node</div>
              <div className="text-xs text-slate-400 mt-0.5">For hobbyists &amp; side projects</div>

              {/* BUG EASY-2: Raw JS Template string */}
              <BugZone
                bugId="easy-2"
                foundBugIds={foundBugIds}
                hintBugId={hintBugId}
                onBugClick={onBugClick}
                badgeLabel="BUG #2: Template Literal Leak"
                className="mt-4 inline-block"
              >
                <div className="text-2xl font-mono font-extrabold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                  {'${plan.starterPrice}/mo'}
                </div>
              </BugZone>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> 2 vCPU Shared Cores
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> 50 GB NVMe Storage
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Community Discord Support
                </li>
              </ul>
            </div>

            <button
              type="button"
              className="mt-5 w-full py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-semibold"
            >
              Deploy Starter
            </button>
          </div>

          {/* Pro Card (Highlighted Light Indigo Theme) */}
          <div className="bg-indigo-50/70 text-slate-900 rounded-2xl p-5 border-2 border-indigo-500 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-950">Pro Cluster</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white font-semibold">
                  Popular
                </span>
              </div>
              <div className="text-xs text-indigo-700 mt-0.5">For scaling production workloads</div>
              <div className="mt-4 text-3xl font-extrabold text-indigo-950">
                $49<span className="text-sm font-normal text-indigo-600">/mo</span>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600 font-bold">✓</span> 8 Dedicated vCPU Cores
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600 font-bold">✓</span> 500 GB NVMe + Auto-Backups
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600 font-bold">✓</span> Global Edge CDN Included
                </li>
              </ul>
            </div>

            {/* BUG EASY-3: White text on pale yellow background (WCAG contrast fail) */}
            <BugZone
              bugId="easy-3"
              foundBugIds={foundBugIds}
              hintBugId={hintBugId}
              onBugClick={onBugClick}
              badgeLabel="BUG #3: 1.12:1 Contrast Fail"
              className="mt-5"
            >
              <button
                type="button"
                className="w-full py-2.5 rounded-xl bg-[#fef9c3] text-[#ffffff] text-xs font-bold border border-yellow-200"
              >
                Upgrade to Pro Trial
              </button>
            </BugZone>
          </div>

          {/* Enterprise Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-slate-700">Enterprise Mesh</div>
              <div className="text-xs text-slate-400 mt-0.5">Custom compliance &amp; dedicated hardware</div>
              <div className="mt-4 text-3xl font-extrabold text-slate-900">
                $199<span className="text-sm font-normal text-slate-400">/mo</span>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Unlimited Bandwidth
                </li>

                {/* BUG EASY-5: Misaligned feature list item */}
                <BugZone
                  bugId="easy-5"
                  foundBugIds={foundBugIds}
                  hintBugId={hintBugId}
                  onBugClick={onBugClick}
                  badgeLabel="BUG #5: Broken Flex Alignment"
                >
                  <li className="flex flex-col items-end -mt-1 bg-slate-50 px-2 py-1 rounded border border-dashed border-slate-200">
                    <span className="text-emerald-600 font-bold self-start">✓</span>
                    <span className="-mt-3 mr-4">99.99% Dedicated SLA</span>
                  </li>
                </BugZone>

                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> SOC2 &amp; HIPAA BAA
                </li>
              </ul>
            </div>

            <button
              type="button"
              className="mt-5 w-full py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-semibold"
            >
              Contact Sales
            </button>
          </div>
        </div>

        {/* Customer Testimonial Footer Bar */}
        <div className="mt-6 bg-white rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* BUG EASY-4: Stretched & squished avatar */}
            <BugZone
              bugId="easy-4"
              foundBugIds={foundBugIds}
              hintBugId={hintBugId}
              onBugClick={onBugClick}
              badgeLabel="BUG #4: Missing object-fit: cover"
            >
              <img
                src="/assets/compass-logo.jpeg"
                alt="CTO Avatar"
                className="w-24 h-6 rounded-full border border-indigo-300"
                style={{ objectFit: 'fill' }}
              />
            </BugZone>
            <div className="text-xs">
              <span className="font-semibold text-slate-800">
                &ldquo;PulseCloud cut our CI/CD cold starts in half!&rdquo;
              </span>
              <span className="text-slate-400 ml-2">— Elena Rostova, VP Eng</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">Trusted by 4,200+ startups</span>
        </div>
      </div>
    );
  }

  if (levelId === 'medium') {
    return (
      <div className="bg-[#f8f9fa] text-zinc-900 min-h-[500px] p-5 sm:p-7 select-none flex flex-col justify-between">
        <div>
          {/* Store Top Bar (Light Streetwear Theme) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-lime-400 text-zinc-950 font-black text-xs border border-black/15">
                KV
              </span>
              <span className="font-extrabold tracking-tight text-lg text-zinc-900">
                KICKSVAULT // DROP 04
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* BUG MEDIUM-1: Search icon overlapping input text */}
              <BugZone
                bugId="medium-1"
                foundBugIds={foundBugIds}
                hintBugId={hintBugId}
                onBugClick={onBugClick}
                badgeLabel="BUG #1: Missing padding-left"
              >
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs pointer-events-none">
                    🔍
                  </span>
                  <input
                    type="text"
                    readOnly
                    value="Search Cyber-Runner..."
                    className="w-44 px-2 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-800 pointer-events-none"
                  />
                </div>
              </BugZone>

              {/* BUG MEDIUM-2: Negative Cart Count (-1) */}
              <BugZone
                bugId="medium-2"
                foundBugIds={foundBugIds}
                hintBugId={hintBugId}
                onBugClick={onBugClick}
                badgeLabel="BUG #2: Negative Cart State (-1)"
              >
                <div className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs font-medium text-zinc-800">
                  <span>🛍️ Bag</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-mono font-bold text-[11px]">
                    -1
                  </span>
                </div>
              </BugZone>
            </div>
          </div>

          {/* Product Main Content */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Sneaker Showcase (Clean Light Studio Card) */}
            <div className="md:col-span-6 bg-gradient-to-br from-white via-lime-50/50 to-sky-50/50 rounded-2xl p-6 border border-zinc-200 shadow-sm relative">
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-lime-200 text-zinc-900">
                Limited Edition • 250 Pairs
              </span>
              <div className="my-8 flex flex-col items-center justify-center text-center">
                <div className="text-7xl transform -rotate-12 select-none">👟</div>
                <div className="mt-3 text-xs font-mono text-zinc-500">
                  COLORWAY: NEON LIME / SKY CYAN
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-200">
                <span>SKU: KV-CR4-2026</span>
                <span className="text-emerald-700 font-semibold">✓ Verified Authentic</span>
              </div>
            </div>

            {/* Right Product Details */}
            <div className="md:col-span-6 space-y-4">
              {/* BUG MEDIUM-3: 6 out of 5 stars */}
              <BugZone
                bugId="medium-3"
                foundBugIds={foundBugIds}
                hintBugId={hintBugId}
                onBugClick={onBugClick}
                badgeLabel="BUG #3: 6/5 Stars Loop Bug"
                className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-zinc-200 shadow-sm"
              >
                <span className="text-amber-500 tracking-widest text-sm">★★★★★★</span>
                <span className="text-xs text-zinc-600">4.9 / 5.0 (128 Reviews)</span>
              </BugZone>

              <div>
                <h1 className="text-2xl font-black tracking-tight text-zinc-900">
                  Nexa-Runner V4 &ldquo;Volt Carbon&rdquo;
                </h1>
                <div className="text-xl font-mono font-bold text-emerald-700 mt-1">$220.00 USD</div>
              </div>

              {/* Size Selector Grid */}
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                  <span>Select US Shoe Size</span>
                  <span className="underline">Size Guide</span>
                </div>
                <div className="grid grid-cols-4 gap-2 items-start">
                  <div className="h-10 rounded-lg bg-white border border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-800">
                    US 8.5
                  </div>
                  <div className="h-10 rounded-lg bg-white border border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-800">
                    US 9.0
                  </div>
                  <div className="h-10 rounded-lg bg-lime-400 border border-black/15 text-zinc-950 font-bold flex items-center justify-center text-xs">
                    US 10.0
                  </div>

                  {/* BUG MEDIUM-5: Broken Size Tile Wrapping */}
                  <BugZone
                    bugId="medium-5"
                    foundBugIds={foundBugIds}
                    hintBugId={hintBugId}
                    onBugClick={onBugClick}
                    badgeLabel="BUG #5: Broken Grid Width / Wrap"
                  >
                    <div className="w-9 py-2 rounded-lg bg-white border border-zinc-300 text-[11px] leading-tight text-center font-medium text-zinc-800 mx-auto">
                      US
                      <br />
                      10.5
                    </div>
                  </BugZone>
                </div>
              </div>

              {/* BUG MEDIUM-4: Clipped Add to Bag Button Text */}
              <BugZone
                bugId="medium-4"
                foundBugIds={foundBugIds}
                hintBugId={hintBugId}
                onBugClick={onBugClick}
                badgeLabel="BUG #4: Fixed Height Text Clipping"
              >
                <button
                  type="button"
                  className="w-full h-6 pt-3 overflow-hidden rounded-xl bg-lime-400 border border-black/15 text-zinc-950 font-black text-sm tracking-wide"
                >
                  ADD TO BAG — $220.00 INSTANT CHECKOUT
                </button>
              </BugZone>
            </div>
          </div>
        </div>

        {/* Store Footer with BUG MEDIUM-6 NaN Year */}
        <div className="mt-8 pt-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <BugZone
            bugId="medium-6"
            foundBugIds={foundBugIds}
            hintBugId={hintBugId}
            onBugClick={onBugClick}
            badgeLabel="BUG #6: © NaN Date Parsing"
          >
            <span className="font-mono text-zinc-700 font-semibold">
              © NaN KicksVault Streetwear Inc. All rights reserved.
            </span>
          </BugZone>
          <span>Free Express Worldwide Shipping</span>
        </div>
      </div>
    );
  }

  if (levelId === 'hard') {
    return (
      <div className="bg-slate-50 text-slate-900 min-h-[500px] p-5 sm:p-6 select-none">
        {/* Top FinTech Header (Clean Light Institutional Theme) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-sm bg-sky-600 rotate-45" />
            <span className="font-mono font-bold tracking-wider text-sm text-slate-900">
              QUANTPAY // INSTITUTIONAL DESK
            </span>
          </div>

          {/* Timeframe Selector with BUG HARD-3 Unstyled Square Tab */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-slate-200 shadow-sm">
            <span className="px-3 py-1 rounded-full text-xs text-slate-500">1D</span>
            <span className="px-3 py-1 rounded-full text-xs bg-sky-100 text-sky-800 font-semibold">
              1W
            </span>
            <BugZone
              bugId="hard-3"
              foundBugIds={foundBugIds}
              hintBugId={hintBugId}
              onBugClick={onBugClick}
              badgeLabel="BUG #3: Square Border Token"
            >
              <span className="px-3 py-1 rounded-none border-2 border-fuchsia-600 text-xs text-fuchsia-700 font-mono font-bold">
                1M
              </span>
            </BugZone>
            <span className="px-3 py-1 rounded-full text-xs text-slate-500">1Y</span>
          </div>
        </div>

        {/* KPI Metric Row */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Metric 1: BUG HARD-1 Negative PnL in Emerald Green */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500">Net Treasury NAV</div>
            <div className="text-xl font-mono font-bold mt-1 text-slate-900">$1,842,910.00</div>
            <BugZone
              bugId="hard-1"
              foundBugIds={foundBugIds}
              hintBugId={hintBugId}
              onBugClick={onBugClick}
              badgeLabel="BUG #1: Semantic Color Inversion"
              className="mt-2 inline-block"
            >
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-mono font-semibold">
                ▲ -14.82% (24h Loss)
              </span>
            </BugZone>
          </div>

          {/* Metric 2: BUG HARD-2 Premature Ellipsis Truncation */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500">Available Instant Liquidity</div>
            <BugZone
              bugId="hard-2"
              foundBugIds={foundBugIds}
              hintBugId={hintBugId}
              onBugClick={onBugClick}
              badgeLabel="BUG #2: Premature max-w-[68px] truncate"
              className="mt-1"
            >
              <div className="max-w-[68px] truncate text-xl font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                $482,910.00
              </div>
            </BugZone>
            <div className="text-[11px] text-slate-400 mt-2">Settled in USDC / Treasury Bills</div>
          </div>

          {/* Metric 3: Security Notice with BUG HARD-6 Displaced Close Button */}
          <div className="relative bg-amber-50 rounded-xl p-4 border border-amber-300 shadow-sm">
            <BugZone
              bugId="hard-6"
              foundBugIds={foundBugIds}
              hintBugId={hintBugId}
              onBugClick={onBugClick}
              badgeLabel="BUG #6: Negative Offset Close Icon"
              className="absolute -top-3.5 -right-3.5"
            >
              <button
                type="button"
                className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow"
              >
                ×
              </button>
            </BugZone>
            <div className="text-xs font-bold text-amber-900">Hardware Key Re-Auth</div>
            <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
              Multi-sig cold vault rotation scheduled in 4 hours. Verify YubiKey signature.
            </p>
          </div>
        </div>

        {/* Chart & Ledger Row */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Chart Box with BUG HARD-4 Clipped Tooltip */}
          <div className="md:col-span-5 bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Intraday Volume</span>
              <span className="relative z-20 px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600">
                LIVE FEED
              </span>
            </div>

            {/* BUG HARD-4: Clipped / occluded tooltip */}
            <BugZone
              bugId="hard-4"
              foundBugIds={foundBugIds}
              hintBugId={hintBugId}
              onBugClick={onBugClick}
              badgeLabel="BUG #4: Z-Index Clipped Tooltip"
              className="mt-2"
            >
              <div className="bg-sky-50 border border-sky-300 rounded p-2 text-[11px] font-mono text-sky-900 -mr-10">
                Peak Spike: $94,120.00 [CLIPPED_STACK]
              </div>
            </BugZone>

            <div className="mt-5 flex items-end gap-2 h-24 pt-4">
              {[40, 65, 50, 85, 95, 60, 78].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="flex-1 rounded-t bg-gradient-to-t from-sky-200 to-sky-500"
                />
              ))}
            </div>
          </div>

          {/* Recent Wire Ledger with BUG HARD-5 Currency Symbol Mismatch */}
          <div className="md:col-span-7 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-700 mb-3">
              Recent Settlement Ledger
            </div>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">TX-9081 • Anchorage Custody</span>
                <span className="text-slate-900 font-semibold">$250,000.00 USD</span>
              </div>

              {/* BUG HARD-5: $ + € + EUR mismatch */}
              <BugZone
                bugId="hard-5"
                foundBugIds={foundBugIds}
                hintBugId={hintBugId}
                onBugClick={onBugClick}
                badgeLabel="BUG #5: Currency Format Collision"
              >
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-amber-50/70 border border-amber-200">
                  <span className="text-slate-700">TX-9082 • SEPA Frankfurt Wire</span>
                  <span className="text-amber-900 font-bold">$€12.450,00 EUR</span>
                </div>
              </BugZone>

              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">TX-9083 • Stripe Treasury Sweep</span>
                <span className="text-slate-900 font-semibold">$84,120.00 USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NIGHTMARE LEVEL: NexaSoul AI Cluster OS (Clean Light Cloud Console)
  return (
    <div className="bg-[#f6f8fa] text-slate-900 min-h-[500px] p-5 sm:p-6 select-none font-sans">
      {/* Top Breadcrumb & Cluster Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3.5 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-mono">
          <img
            src="/assets/compass-logo.jpeg"
            alt="NS"
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-slate-500">Clusters</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-500">Production</span>
          <span className="text-slate-400">/</span>

          {/* BUG NIGHTMARE-1: 5px Vertical Baseline Misalignment */}
          <BugZone
            bugId="nightmare-1"
            foundBugIds={foundBugIds}
            hintBugId={hintBugId}
            onBugClick={onBugClick}
            badgeLabel="BUG #1: 5px Baseline Offset"
          >
            <span className="inline-block translate-y-[5px] text-sky-800 font-semibold bg-sky-100 px-2 py-0.5 rounded border border-sky-200">
              ns-prod-09
            </span>
          </BugZone>
        </div>

        {/* BUG NIGHTMARE-2: Contradictory Toggle Switch State */}
        <BugZone
          bugId="nightmare-2"
          foundBugIds={foundBugIds}
          hintBugId={hintBugId}
          onBugClick={onBugClick}
          badgeLabel="BUG #2: ON Track with OFF Knob"
        >
          <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-[11px] font-mono text-slate-700">Auto-Scale Shards:</span>
            <span className="text-[10px] font-mono font-bold text-emerald-700">ENABLED</span>
            <div className="w-9 h-4 rounded-full bg-emerald-500 flex items-center px-0.5">
              {/* Knob stuck on the left (OFF) while track is green (ON) */}
              <span className="w-3 h-3 rounded-full bg-white translate-x-0 shadow" />
            </div>
          </div>
        </BugZone>
      </div>

      {/* Main Console Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Sidebar Nav */}
        <div className="md:col-span-3 space-y-1.5">
          <div className="px-3 py-2 rounded-lg bg-sky-100 text-sky-900 text-xs font-semibold border border-sky-200">
            ⚡ Neural Mesh Nodes
          </div>
          <div className="px-3 py-2 rounded-lg bg-white border border-slate-200/70 text-slate-600 text-xs font-medium">
            📊 Tensor Telemetry
          </div>
          <div className="px-3 py-2 rounded-lg bg-white border border-slate-200/70 text-slate-600 text-xs font-medium">
            🔐 Vault Secrets
          </div>

          {/* BUG NIGHTMARE-5: Stuck focus ring on disabled sidebar item */}
          <BugZone
            bugId="nightmare-5"
            foundBugIds={foundBugIds}
            hintBugId={hintBugId}
            onBugClick={onBugClick}
            badgeLabel="BUG #5: Stuck Focus Ring on Disabled Item"
          >
            <div className="px-3 py-2 rounded-lg bg-slate-100 text-slate-400 opacity-60 ring-2 ring-sky-500 text-xs font-medium">
              🚫 Legacy v1 (Disabled)
            </div>
          </BugZone>
        </div>

        {/* Right Telemetry Content */}
        <div className="md:col-span-9 space-y-4">
          {/* Telemetry Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: BUG NIGHTMARE-3 108% Progress Bar Bleed */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-500">H100 VRAM Allocation</span>
                <span className="font-mono font-bold text-sky-700">86.4 / 80.0 GB (108%)</span>
              </div>
              <BugZone
                bugId="nightmare-3"
                foundBugIds={foundBugIds}
                hintBugId={hintBugId}
                onBugClick={onBugClick}
                badgeLabel="BUG #3: 108% Bar Overflow"
              >
                <div className="w-full h-3 rounded-full bg-slate-200">
                  <div
                    style={{ width: '107%' }}
                    className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-rose-500 shadow"
                  />
                </div>
              </BugZone>
            </div>

            {/* Card 2: BUG NIGHTMARE-4 Serif Font Leak */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">P99 Token Inference Latency</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Target SLA &lt; 25.0 ms</div>
              </div>
              <BugZone
                bugId="nightmare-4"
                foundBugIds={foundBugIds}
                hintBugId={hintBugId}
                onBugClick={onBugClick}
                badgeLabel="BUG #4: Times New Roman Serif Leak"
              >
                <span
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  className="text-2xl font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200"
                >
                  14.28 ms
                </span>
              </BugZone>
            </div>
          </div>

          {/* Live Kernel Stream Log Box */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm font-mono text-xs space-y-2">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
              Live Kernel Stream // ns-prod-09
            </div>
            <div className="py-1.5 text-slate-700">
              [02:14:01] Initializing quantized weight shards (FP8)...{' '}
              <span className="text-emerald-700 font-bold">[OK]</span>
            </div>

            {/* BUG NIGHTMARE-6: Double border + raw &amp;nbsp; entity leak */}
            <BugZone
              bugId="nightmare-6"
              foundBugIds={foundBugIds}
              hintBugId={hintBugId}
              onBugClick={onBugClick}
              badgeLabel="BUG #6: Double Border & HTML Entity Leak"
            >
              <div className="py-2 border-t-4 border-double border-slate-400 text-amber-900 bg-amber-50/50 px-2 rounded">
                [02:14:04] Syncing tensor replica &amp;amp;nbsp;mesh_node_04... [OK]
              </div>
            </BugZone>

            <div className="py-1.5 border-t border-slate-200 text-slate-700">
              [02:14:08] Health check passed across 64 GPU workers.{' '}
              <span className="text-emerald-700 font-bold">[READY]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
