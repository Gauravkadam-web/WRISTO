'use client';

import React, { useEffect, useState } from 'react';

const ANALYSIS_PHASES = [
  'Cross-referencing 40 certified horological master references...',
  'Evaluating case ergonomics and lug-to-lug wrist proportions...',
  'Scoring movement frequency, power reserve, and escapement precision...',
  'Harmonizing dial colorway against specified gala & boardroom lighting...',
  'Synthesizing editorial curator notes and provenance registry...'
];

export default function ConciergeLoadingState() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % ANALYSIS_PHASES.length);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="concierge-loading-container">
      <div className="concierge-loading-dial">
        <div className="concierge-dial-outer-ring">
          <div className="concierge-dial-hour-hand" />
          <div className="concierge-dial-minute-hand" />
          <div className="concierge-dial-center-jewel" />
        </div>
      </div>

      <h3 className="concierge-loading-title">Analyzing Horological Harmony</h3>
      <p className="concierge-loading-phase">{ANALYSIS_PHASES[phaseIndex]}</p>

      <div className="concierge-loading-subtext">
        <span>GENÈVE &bull; MUMBAI &bull; LONDON ARCHIVES</span>
      </div>
    </div>
  );
}
