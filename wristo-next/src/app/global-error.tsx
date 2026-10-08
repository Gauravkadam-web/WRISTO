'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root Layout Horological Exception:', error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>System Variance | WRISTO Haute Horlogerie</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#0A0A0C',
          color: '#F5F5F7',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '560px',
            margin: '24px',
            padding: '48px 36px',
            background: 'rgba(22, 22, 26, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(222, 192, 149, 0.25)',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(222, 192, 149, 0.12)',
              border: '1px solid rgba(222, 192, 149, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              color: '#DEC095',
              fontSize: '28px',
            }}
          >
            ⚙
          </div>

          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#DEC095',
              marginBottom: '12px',
              fontWeight: 600,
            }}
          >
            SYSTEM VARIANCE
          </span>

          <h1
            style={{
              fontSize: '28px',
              fontWeight: 600,
              margin: '0 0 16px 0',
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}
          >
            Escapement Disengaged
          </h1>

          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: '#A1A1AA',
              margin: '0 0 32px 0',
            }}
          >
            A high-level variance occurred in the horological rendering engine. The core subsystem has paused to maintain registry integrity.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                backgroundColor: '#DEC095',
                color: '#0A0A0C',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Re-engage Movement
            </button>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/';
                }
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#DEC095',
                border: '1px solid rgba(222, 192, 149, 0.4)',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Return to Salon Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
