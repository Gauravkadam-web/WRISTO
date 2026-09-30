import React from 'react';
import { Product } from '@/types/product';

interface ProductSpecsGridProps {
  product: Product;
}

export default function ProductSpecsGrid({ product }: ProductSpecsGridProps) {
  const specs = [
    { label: 'Caliber Movement', value: product.movement, desc: product.movement === 'Automatic' ? 'Self-winding mechanical' : 'High-precision quartz' },
    { label: 'Case Diameter', value: product.caseSize, desc: 'Measurement across dial excluding crown' },
    { label: 'Case Material', value: product.material, desc: 'Corrosion-resistant 316L finish' },
    { label: 'Dial & Finish', value: product.dial, desc: 'Anti-reflective sapphire crystal glass' },
    { label: 'Strap & Clasp', value: product.strap, desc: 'Quick-release ergonomic clasp' },
    { label: 'Water Resistance', value: product.waterResistance, desc: 'Pressure tested sealed gasket' }
  ];

  return (
    <div className="pdp-specs-section">
      <div className="pdp-section-eyebrow">
        <span>TECHNICAL HOROLOGY MATRIX</span>
      </div>

      <div className="pdp-specs-grid">
        {specs.map((item, idx) => (
          <div className="spec-cell" key={item.label + idx}>
            <div className="spec-label">{item.label}</div>
            <div className="spec-val">{item.value}</div>
            <div className="spec-desc">{item.desc}</div>
          </div>
        ))}
      </div>

      <div className="pdp-horology-notes">
        <div className="pdp-note-item">
          <strong>Reference Identifier:</strong> {product.id}
        </div>
        <div className="pdp-note-item">
          <strong>Horological Category:</strong> {product.gender} &bull; {product.style} Style
        </div>
      </div>
    </div>
  );
}
