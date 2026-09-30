import React from 'react';
import { Product } from '@/types/product';

interface ProductPricingProps {
  product: Product;
}

export default function ProductPricing({ product }: ProductPricingProps) {
  const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);
  const savingsAmount = product.originalPrice - product.price;

  return (
    <div className="pdp-pricing-wrap">
      <div className="pdp-price-row">
        <span className="pdp-price-current">
          ₹{product.price.toLocaleString('en-IN')}
        </span>
        <span className="pdp-price-original">
          ₹{product.originalPrice.toLocaleString('en-IN')}
        </span>
        {discountPercent > 0 && (
          <span className="pdp-discount-badge">
            SAVE ₹{savingsAmount.toLocaleString('en-IN')} ({discountPercent}% OFF)
          </span>
        )}
      </div>

      <div className="pdp-price-subtext">
        <span>Inclusive of all luxury duties &amp; GST</span>
        <span className="pdp-dot-divider">&bull;</span>
        <span className="pdp-accent-note">Complimentary insured courier delivery</span>
      </div>
    </div>
  );
}
