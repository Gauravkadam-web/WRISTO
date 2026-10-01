'use client';

import React from 'react';

export default function JournalHeader() {
  return (
    <div className="journal-header-banner">
      <div className="journal-edition-badge">
        <span className="journal-star-emblem">&#x2726;</span>
        <span>EDITION IV &bull; WRISTO HOROLOGICAL ARCHIVES</span>
      </div>

      <h1 className="journal-masthead-title">The Horological Journal</h1>
      <p className="journal-masthead-subtitle">
        Curated essays, technical caliber breakdowns, metallurgy investigations, and collector’s guides written by master horologists and historical critics.
      </p>
    </div>
  );
}
