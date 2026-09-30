'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import ProductGallery from './ProductGallery';
import ProductHeader from './ProductHeader';
import ProductPricing from './ProductPricing';
import ProductVariants from './ProductVariants';
import ProductActions from './ProductActions';
import AIConciergeInsight from './AIConciergeInsight';
import ProductSpecsGrid from './ProductSpecsGrid';
import ProductTrustAccordions from './ProductTrustAccordions';
import StickyMobilePurchaseBar from './StickyMobilePurchaseBar';
import CoordinatedWatches from './CoordinatedWatches';

interface ProductDetailClientProps {
  product: Product;
  similarProducts: Product[];
}

export default function ProductDetailClient({
  product,
  similarProducts
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : '#111111'
  );
  const [selectedStrap, setSelectedStrap] = useState('standard');

  return (
    <main className="pdp-main-view">
      <div className="container pdp-container">
        <div className="pdp-layout">
          {/* Left Column: Sticky Gallery & 3D Interactive Stage */}
          <div className="pdp-gallery-column">
            <ProductGallery product={product} />
          </div>

          {/* Right Column: Editorial Information, Pricing, Specs & Actions */}
          <div className="pdp-content-col">
            <ProductHeader product={product} />

            <ProductPricing product={product} />

            {/* Editorial Description Narrative */}
            <div className="pdp-editorial-description">
              <p className="pdp-desc-text">
                {product.description}
              </p>
            </div>

            {/* Variants & Sizing */}
            <ProductVariants
              product={product}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              selectedStrap={selectedStrap}
              onSelectStrap={setSelectedStrap}
            />

            {/* Purchase Action Buttons & Stepper */}
            <ProductActions
              product={product}
              quantity={quantity}
              onQuantityChange={setQuantity}
            />

            {/* AI Concierge Intelligence Insight */}
            <AIConciergeInsight product={product} />

            {/* Technical Horological Specifications Matrix */}
            <ProductSpecsGrid product={product} />

            {/* Trust, Delivery & Warranty Accordions */}
            <ProductTrustAccordions />
          </div>
        </div>
      </div>

      {/* Companion Coordinated Timepieces */}
      <CoordinatedWatches
        products={similarProducts}
        currentBrand={product.brand}
      />

      {/* Floating Bottom Sticky Bar for Mobile Thumb Ergonomics */}
      <StickyMobilePurchaseBar
        product={product}
        quantity={quantity}
      />
    </main>
  );
}
