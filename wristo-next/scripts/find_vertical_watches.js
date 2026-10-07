const fs = require('fs');

async function search() {
  const queries = [
    'watch white background',
    'wristwatch white background',
    'luxury watch isolated',
    'watch studio photography',
    'chronograph white background',
    'analog watch isolated'
  ];

  const seen = new Set();
  const candidates = [];

  for (const q of queries) {
    for (let page = 1; page <= 3; page++) {
      const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(q)}&page=${page}&per_page=30`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        for (const item of (data.results || [])) {
          if (seen.has(item.id)) continue;
          seen.add(item.id);
          const desc = (item.description || item.alt_description || '').toLowerCase();
          // Filter out people, hands, lifestyle, unrelated objects
          if (desc.includes('hand') || desc.includes('person') || desc.includes('woman') || desc.includes('man') || desc.includes('wearing') || desc.includes('holding') || desc.includes('bed') || desc.includes('table') || desc.includes('lens') || desc.includes('camera') || desc.includes('shoe') || desc.includes('knife') || desc.includes('scissors') || desc.includes('makeup')) {
            continue;
          }
          if (desc.includes('watch') || desc.includes('clock') || desc.includes('timepiece') || desc.includes('chronograph')) {
            candidates.push({
              id: item.id,
              desc: desc.substring(0, 70),
              w: item.width,
              h: item.height,
              url: item.urls.raw
            });
          }
        }
      } catch (e) {
        console.error(e.message);
      }
    }
  }

  console.log(`Found ${candidates.length} filtered candidate watch photos!`);
  candidates.slice(0, 40).forEach((c, idx) => {
    console.log(`${idx + 1}. [${c.id}] (ratio: ${(c.w / c.h).toFixed(2)}) ${c.desc}`);
  });
}

search();
