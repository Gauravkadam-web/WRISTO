const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = 'e:\\WRISTO\\screenshots';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function capture() {
  console.log('Launching headless Chrome...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    'about:blank'
  ]);

  // Wait for DevTools port to be ready
  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    await wait(400);
    try {
      const res = await fetch('http://127.0.0.1:9222/json/version');
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch {}
  }

  if (!wsUrl) {
    console.error('Failed to get WebSocket debugger URL');
    chromeProc.kill();
    process.exit(1);
  }

  console.log('Connected to CDP at:', wsUrl);
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => (ws.onopen = r));

  let msgId = 1;
  const callbacks = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
  };

  function send(method, params = {}, sessionId = null) {
    return new Promise((resolve) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });
  }

  // Attach to target
  const createRes = await send('Target.createTarget', { url: 'http://localhost:3000' });
  const targetId = createRes.result.targetId;
  const attachRes = await send('Target.attachToTarget', { targetId, flatten: true });
  const sessionId = attachRes.result.sessionId;

  await send('Page.enable', {}, sessionId);
  await send('DOM.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true }, sessionId);
    return res.result?.result?.value;
  }

  async function setViewport(width, height) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768
    }, sessionId);
  }

  async function takeScreenshot(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    const buffer = Buffer.from(res.result.data, 'base64');
    const outPath = path.join(SCREENSHOTS_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved screenshot: ${outPath} (${buffer.length} bytes)`);
  }

  // 1. Wait for page load
  console.log('Navigating to http://localhost:3000 ...');
  await send('Page.navigate', { url: 'http://localhost:3000' }, sessionId);
  await wait(2500);

  // 2. Desktop Capture (1440x900) - Open Search Modal (Idle State with Recents, Popular, Trending)
  console.log('Capturing Desktop Search Idle State (1440x900)...');
  await setViewport(1440, 900);
  await wait(500);

  // Click search trigger button
  await evaluate(`document.querySelector('.search-trigger-btn')?.click()`);
  await wait(600);

  // Verify modal is open
  const isModalOpen = await evaluate(`!!document.querySelector('.search-modal-container')`);
  console.log('Is search modal open on Desktop:', isModalOpen);
  await takeScreenshot('search_desktop_1440.png');

  // 3. Search Suggestions (Type 'AUREN')
  console.log('Typing "AUREN" into search input...');
  await evaluate(`(() => {
    const input = document.querySelector('.search-input-field');
    if (input) {
      // Trigger React controlled input change
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeInputValueSetter.call(input, "AUREN");
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  })()`);
  await wait(800); // Debounce delay 150ms + render

  const suggestionsCount = await evaluate(`document.querySelectorAll('.search-product-item').length`);
  const brandsCount = await evaluate(`document.querySelectorAll('.search-brand-match-pill').length`);
  console.log(`Found ${suggestionsCount} product suggestions and ${brandsCount} matching brands`);
  await takeScreenshot('search_suggestions_1440.png');

  // 4. Search Empty State (Type 'XYZNONEXISTENT')
  console.log('Typing "XYZNONEXISTENT" into search input...');
  await evaluate(`(() => {
    const input = document.querySelector('.search-input-field');
    if (input) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeInputValueSetter.call(input, "XYZNONEXISTENT");
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  })()`);
  await wait(800);

  const emptyTitle = await evaluate(`document.querySelector('.search-empty-title')?.textContent`);
  console.log('Empty state title:', emptyTitle);
  await takeScreenshot('search_empty_1440.png');

  // 5. Mobile Capture (375x812) - iPhone style
  console.log('Capturing Mobile Search Modal (375x812)...');
  await setViewport(375, 812);
  // Reset input to show idle state on mobile
  await evaluate(`(() => {
    const input = document.querySelector('.search-input-field');
    if (input) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeInputValueSetter.call(input, "");
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  })()`);
  await wait(600);
  await takeScreenshot('search_mobile_375.png');

  // 6. Mobile Suggestions Capture (375x812)
  console.log('Capturing Mobile Search Suggestions (375x812)...');
  await evaluate(`(() => {
    const input = document.querySelector('.search-input-field');
    if (input) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeInputValueSetter.call(input, "AUREN");
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  })()`);
  await wait(800);
  await takeScreenshot('search_mobile_suggestions_375.png');

  console.log('All QA captures completed successfully!');
  ws.close();
  chromeProc.kill();
  process.exit(0);
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
