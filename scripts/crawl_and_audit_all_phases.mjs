/**
 * WRISTO Full-Platform Autonomous Crawler & Health Auditor
 * Audits all completed phases (Phases 1-4 Backend + Core Commerce & Desktop Parity Frontend).
 */

const FRONTEND_BASE = 'http://localhost:3000';
const BACKEND_BASE = 'http://localhost:8080/api/v1';

const results = {
  timestamp: new Date().toISOString(),
  frontend: [],
  backend: [],
  summary: { total: 0, passed: 0, failed: 0 }
};

function recordResult(category, name, passed, details, latencyMs) {
  results.summary.total++;
  if (passed) results.summary.passed++;
  else results.summary.failed++;

  const entry = { name, passed, details, latencyMs: `${latencyMs}ms` };
  if (category === 'frontend') results.frontend.push(entry);
  else results.backend.push(entry);

  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${category.toUpperCase()}] ${name} (${latencyMs}ms) - ${passed ? 'PASS' : 'FAIL: ' + details}`);
}

async function testFrontendRoute(path, name, assertions = []) {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    const res = await fetch(`${FRONTEND_BASE}${path}`, { signal: controller.signal });
    clearTimeout(timeout);
    const latency = Date.now() - start;

    if (!res.ok) {
      recordResult('frontend', `${name} (${path})`, false, `HTTP ${res.status} ${res.statusText}`, latency);
      return;
    }

    const html = await res.text();
    let passed = true;
    let failedReason = '';

    for (const assertion of assertions) {
      if (typeof assertion === 'string') {
        if (!html.toLowerCase().includes(assertion.toLowerCase())) {
          passed = false;
          failedReason = `Missing expected content: "${assertion}"`;
          break;
        }
      } else if (typeof assertion === 'function') {
        const result = assertion(html);
        if (!result.passed) {
          passed = false;
          failedReason = result.reason;
          break;
        }
      }
    }

    recordResult('frontend', `${name} (${path})`, passed, passed ? 'OK' : failedReason, latency);
  } catch (err) {
    const latency = Date.now() - start;
    recordResult('frontend', `${name} (${path})`, false, err.message, latency);
  }
}

async function testBackendEndpoint(path, name, options = {}, assertions = []) {
  const start = Date.now();
  try {
    const url = path.startsWith('http') ? path : `${BACKEND_BASE}${path}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    const latency = Date.now() - start;

    let json = null;
    try {
      json = await res.json();
    } catch {
      // Non-json response
    }

    let passed = res.ok;
    let failedReason = passed ? 'OK' : `HTTP ${res.status}`;

    if (passed && assertions.length > 0 && json) {
      for (const assertion of assertions) {
        const result = assertion(json, res);
        if (!result.passed) {
          passed = false;
          failedReason = result.reason;
          break;
        }
      }
    }

    recordResult('backend', `${name} (${path})`, passed, passed ? 'OK' : failedReason, latency);
    return { res, json };
  } catch (err) {
    const latency = Date.now() - start;
    recordResult('backend', `${name} (${path})`, false, err.message, latency);
    return { res: null, json: null };
  }
}

async function runAudit() {
  console.log('================================================================');
  console.log('🚀 WRISTO FULL-PLATFORM CRAWLER & HEALTH AUDIT');
  console.log(`Frontend: ${FRONTEND_BASE}`);
  console.log(`Backend:  ${BACKEND_BASE}`);
  console.log('================================================================\n');

  // --- 1. FRONTEND CRAWL & ASSERTIONS ---
  console.log('--- 1. CRAWLING FRONTEND ROUTES ---');
  await testFrontendRoute('/', 'Home & Hero Showcase', [
    'WRISTO',
    'Trending Timepieces',
    'HOROLOGICAL EXCELLENCE',
    'AUREN'
  ]);

  await testFrontendRoute('/watches', 'Catalog PLP (Product Listing Page)', [
    'AUREN',
    'VELA',
    'NORDEN',
    'Filter',
    'Movement'
  ]);

  await testFrontendRoute('/product/WRT-001', 'Product Detail PDP (Atlas Black)', [
    'Atlas Black',
    'AUREN',
    'Specifications'
  ]);

  await testFrontendRoute('/product/WRT-002', 'Product Detail PDP (Meridian Silver)', [
    'Meridian Silver',
    'AUREN',
    'Specifications'
  ]);

  await testFrontendRoute('/product/WRT-005', 'Product Detail PDP (Regent Green)', [
    'Regent Green',
    'Automatic',
    'Specifications'
  ]);

  await testFrontendRoute('/compare', '9-Axis Horological Comparison Matrix', [
    'Comparison Matrix',
    'Caliber',
    'Diameter'
  ]);

  await testFrontendRoute('/journal', 'Editorial Journal', [
    'Journal',
    'Horology'
  ]);

  await testFrontendRoute('/account', 'Client Account & Provenance Vault', [
    'Account',
    'Vault'
  ]);

  await testFrontendRoute('/sitemap.xml', 'Dynamic 58-Route Sitemap', [
    '<urlset',
    '<loc>'
  ]);

  await testFrontendRoute('/robots.txt', 'SEO Robots Config', [
    'User-agent',
    'Sitemap'
  ]);

  console.log('\n--- 2. CRAWLING & TESTING BACKEND APIS ---');

  // Phase 1: Core Domain
  await testBackendEndpoint('/actuator/health', 'Actuator Health Probe', {}, [
    (j) => ({ passed: j.status === 'UP', reason: `Health status is ${j.status}` })
  ]);

  await testBackendEndpoint('/v3/api-docs', 'Springdoc OpenAPI Schema', {}, [
    (j) => ({ passed: !!j.openapi && !!j.paths, reason: 'Invalid OpenAPI schema structure' })
  ]);

  await testBackendEndpoint('/watches?size=10', 'Catalog Timepieces (Phase 1)', {}, [
    (j) => ({ passed: j.success && j.data.products.length > 0 && j.data.total === 40, reason: `Total watches mismatch: ${j.data?.total}` }),
    (j) => ({ passed: !!j.data.facets && j.data.facets.brands.length > 0, reason: 'Missing category/brand facets' })
  ]);

  await testBackendEndpoint('/watches/WRT-001', 'Single Watch Detail (Phase 1)', {}, [
    (j) => ({ passed: j.success && j.data.model === 'Atlas Black', reason: `Model name mismatch: ${j.data?.model}` })
  ]);

  await testBackendEndpoint('/brands', 'Brands Catalog (Phase 1)', {}, [
    (j) => ({ passed: j.success && Array.isArray(j.data) && j.data.length >= 6, reason: 'Brands count below expected' })
  ]);

  await testBackendEndpoint('/categories', 'Categories Taxonomy (Phase 1)', {}, [
    (j) => ({ passed: j.success && Array.isArray(j.data) && j.data.length >= 2, reason: 'Categories count below expected' })
  ]);

  // Phase 2: Auth & Security
  const loginRes = await testBackendEndpoint('/auth/login', 'Admin User Authentication (Phase 2)', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@wristo.com', password: 'Password@123' })
  }, [
    (j) => ({ passed: j.success && !!j.data.accessToken, reason: 'Failed to retrieve accessToken' })
  ]);

  const adminToken = loginRes.json?.data?.accessToken;

  const demoUserLogin = await testBackendEndpoint('/auth/login', 'Collector User Authentication (Phase 2)', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'gauravkadam@gmail.com', password: 'Password@123' })
  }, [
    (j) => ({ passed: j.success && !!j.data.accessToken, reason: 'Failed to retrieve collector accessToken' })
  ]);

  const userToken = demoUserLogin.json?.data?.accessToken;

  const sellerLogin = await testBackendEndpoint('/auth/login', 'Seller User Authentication (Phase 2)', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'seller.auren@wristo.com', password: 'Password@123' })
  }, [
    (j) => ({ passed: j.success && !!j.data.accessToken, reason: 'Failed to retrieve seller accessToken' })
  ]);

  const sellerToken = sellerLogin.json?.data?.accessToken;

  // Phase 3: Seller Marketplace & Moderation
  if (sellerToken) {
    await testBackendEndpoint('/seller/listings', 'Seller Listings Fetch (Phase 3)', {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    }, [
      (j) => ({ passed: j.success, reason: 'Seller listings failed' })
    ]);

    await testBackendEndpoint('/seller/inventory', 'Seller Inventory Fetch (Phase 3)', {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    }, [
      (j) => ({ passed: j.success, reason: 'Seller inventory fetch failed' })
    ]);
  }

  if (adminToken) {
    await testBackendEndpoint('/admin/listings', 'Admin Listing Moderation Queue (Phase 3)', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    }, [
      (j) => ({ passed: j.success, reason: 'Admin listings fetch failed' })
    ]);
  }

  // Phase 4: Promotional Coupon Engine
  await testBackendEndpoint('/coupons/active', 'Active Promotional Coupons (Phase 4)', {}, [
    (j) => ({ passed: j.success && j.data.length >= 4, reason: `Active coupons count: ${j.data?.length}` })
  ]);

  await testBackendEndpoint('/coupons/validate', 'Validate Coupon WRISTO10 (Phase 4)', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'WRISTO10', subtotal: 10000.00 })
  }, [
    (j) => ({ passed: j.success && j.data.isValid && j.data.calculatedDiscount === 1000.00, reason: `Calculated discount mismatch: ${j.data?.calculatedDiscount}` })
  ]);

  // Phase 4: 9-Axis Horological Comparison Matrix
  await testBackendEndpoint('/compare?watchIds=WRT-001,WRT-002,WRT-003', '9-Axis Horological Matrix Engine (Phase 4)', {}, [
    (j) => ({ passed: j.success && j.data.watches.length === 3 && j.data.specs.length === 9, reason: `Specs count mismatch: ${j.data?.specs?.length}` })
  ]);

  // Phase 4: Stateless Totals & Shopping Cart
  await testBackendEndpoint('/cart/calculate-totals', 'Stateless Cart Totals Calculation (Phase 4)', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ watchId: 'WRT-001', quantity: 1 }],
      couponCode: 'WRISTO10',
      isGiftWrapped: true,
      deliveryTier: 'white_glove'
    })
  }, [
    (j) => ({ passed: j.success && j.data.subtotal === 4999.00 && j.data.discount === 499.90, reason: `Subtotal/discount mismatch: ${j.data?.subtotal}/${j.data?.discount}` }),
    (j) => ({ passed: j.data.giftWrapFee === 500.00 && j.data.shippingFee === 1500.00, reason: 'Gift or shipping fee mismatch' })
  ]);

  // Phase 4: Collector Vault Wishlist
  if (userToken) {
    await testBackendEndpoint('/wishlist', 'Authenticated Wishlist Retrieval (Phase 4)', {
      headers: { 'Authorization': `Bearer ${userToken}` }
    }, [
      (j) => ({ passed: j.success, reason: 'Wishlist retrieval failed' })
    ]);

    await testBackendEndpoint('/wishlist/toggle/WRT-001', 'Toggle Watch in Wishlist (Phase 4)', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` }
    }, [
      (j) => ({ passed: j.success, reason: 'Toggle wishlist failed' })
    ]);
  }

  console.log('\n================================================================');
  console.log(`🏁 AUDIT COMPLETE: ${results.summary.passed}/${results.summary.total} Checks Passed (${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${results.summary.failed}`);
  console.log('================================================================\n');

  return results;
}

runAudit();
