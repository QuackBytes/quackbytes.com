"use client";

import { useState } from "react";
import Link from "next/link";
import { Arrow } from "./brand";

type Bite = {
  name: string;
  title: string;
  description: string;
  example: string;
  before: string;
  after: string;
  items: string[];
  label: string;
  type: string;
};

type BitesCopy = {
  sectionLabel: string;
  panelEyebrow: string;
  illustrative: string;
  cta: string;
  items: Bite[];
};

export function Bites({ lang, copy }: { lang: string; copy: BitesCopy }) {
  const bites = copy.items;
  const [active, setActive] = useState(0);
  const bite = bites[active];
  return (
    <div className="bites">
      <div className="bite-tabs" role="tablist" aria-label={copy.sectionLabel}>
        {bites.map((item, index) => (
          <button
            key={item.name}
            id={`bite-tab-${index}`}
            role="tab"
            aria-selected={active === index}
            aria-controls="bite-panel"
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight"
                  ? (index + 1) % bites.length
                  : event.key === "ArrowLeft"
                    ? (index + bites.length - 1) % bites.length
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? bites.length - 1
                        : -1;
              if (next >= 0) {
                event.preventDefault();
                setActive(next);
                document.getElementById(`bite-tab-${next}`)?.focus();
              }
            }}
          >
            <span className="tab-number">0{index + 1}</span>
            {item.name}
            <Arrow diagonal />
          </button>
        ))}
      </div>
      <div
        className="bite-panel"
        id="bite-panel"
        role="tabpanel"
        aria-labelledby={`bite-tab-${active}`}
        tabIndex={0}
      >
        <div className="bite-copy" key={bite.title}>
          <span className="eyebrow">{copy.panelEyebrow}</span>
          <h3>{bite.title}</h3>
          <p>{bite.description}</p>
          <Link className="text-link" href={`/${lang}/contact?type=${bite.type}`}>
            {copy.cta} <Arrow />
          </Link>
        </div>
        <div className="workflow" key={bite.label}>
          <div className="workflow-caption">
            <span className="eyebrow">{bite.label}</span>
            <span className="example-label">{copy.illustrative}</span>
          </div>
          <div className="workflow-steps">
            {bite.items.map((item, index) => (
              <div className="workflow-step" key={item}>
                <span className="workflow-check">
                  {index === 2 ? "↗" : "✓"}
                </span>
                <span>{item}</span>
                <span className="workflow-step-number">0{index + 1}</span>
              </div>
            ))}
          </div>
          <p>{bite.example}</p>
          <div className="workflow-outcome">
            <span>{bite.before}</span>
            <Arrow />
            <strong>{bite.after}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
