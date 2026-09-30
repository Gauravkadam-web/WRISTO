import React from 'react';
import { Product } from '@/types/product';

interface AIConciergeInsightProps {
  product: Product;
}

export default function AIConciergeInsight({ product }: AIConciergeInsightProps) {
  if (!product.aiReason && (!product.occasion || product.occasion.length === 0)) {
    return null;
  }

  const matchScore = product.aiMatchScore || 96;

  return (
    <div className="pdp-ai-insight-card">
      <div className="pdp-ai-header">
        <div className="pdp-ai-badge-group">
          <div className="ai-avatar-symbol" style={{ width: '24px', height: '24px', fontSize: '12px' }}>
            W
          </div>
          <span className="pdp-ai-eyebrow">AI Style Concierge Insight</span>
        </div>
        <span className="pdp-ai-score-pill">
          {matchScore}% Style Match
        </span>
      </div>

      <p className="pdp-ai-body">
        &ldquo;{product.aiReason || product.tagline}&rdquo;
      </p>

      {product.occasion && product.occasion.length > 0 && (
        <div className="pdp-ai-occasions-row">
          <span className="pdp-ai-occ-label">Recommended Occasions:</span>
          <div className="pdp-ai-chips">
            {product.occasion.map((occ) => (
              <span key={occ} className="pill-badge pdp-occ-chip">
                {occ}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
