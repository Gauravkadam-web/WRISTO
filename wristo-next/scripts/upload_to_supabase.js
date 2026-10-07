/**
 * WRISTO — Supabase Storage Watch Batch Uploader
 * 
 * Safely supports:
 * 1. Native .env loader (no npm dependencies needed)
 * 2. Interactive masked terminal prompt
 * 3. Command-line arguments
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Native zero-dependency .env parser
function loadEnvFile(envPath) {
  try {
    if (!fs.existsSync(envPath)) return;
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  } catch (e) {}
}

// Load both root .env and wristo-next .env.local if present
loadEnvFile(path.join(__dirname, '..', '..', '.env'));
loadEnvFile(path.join(__dirname, '..', '.env.local'));
loadEnvFile(path.join(__dirname, '..', '.env'));

async function askQuestion(query, hidden = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    if (!hidden) {
      rl.question(query, ans => {
        rl.close();
        resolve(ans.trim());
      });
    } else {
      process.stdout.write(query);
      let input = '';
      const onData = char => {
        char = char.toString();
        if (char === '\n' || char === '\r' || char === '\u0004') {
          process.stdin.removeListener('data', onData);
          process.stdin.setRawMode(false);
          process.stdin.pause();
          rl.close();
          console.log('');
          resolve(input.trim());
        } else if (char === '\u0003') {
          process.exit();
        } else if (char === '\b' || char === '\x7f') {
          if (input.length > 0) {
            input = input.slice(0, -1);
            process.stdout.write('\b \b');
          }
        } else {
          input += char;
          process.stdout.write('*');
        }
      };

      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', onData);
      } else {
        rl.question('', ans => {
          rl.close();
          resolve(ans.trim());
        });
      }
    }
  });
}

async function run() {
  console.log('================================================================');
  console.log('       WRISTO — Supabase Storage Watch Batch Uploader');
  console.log('================================================================\n');

  let supabaseUrl = process.argv[2] || process.env.SUPABASE_URL || 'https://wfdiidyruqflbdkaysjo.supabase.co';
  let supabaseKey = process.argv[3] || process.env.SUPABASE_SERVICE_ROLE_KEY;
  let bucketName = process.argv[4] || process.env.SUPABASE_BUCKET_NAME || 'wristo-products';

  if (!supabaseUrl) {
    supabaseUrl = await askQuestion('Enter Supabase URL (e.g. https://wfdiidyruqflbdkaysjo.supabase.co): ');
  }

  if (!supabaseKey) {
    console.log('Enter your Supabase service_role secret key (input will be masked with *):');
    supabaseKey = await askQuestion('Secret Key: ', true);
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase URL and Service Role Key are required.');
    process.exit(1);
  }

  const productsDir = path.join(__dirname, '..', 'public', 'assets', 'products');
  if (!fs.existsSync(productsDir)) {
    console.error('Products directory not found at:', productsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(productsDir).filter(f => f.startsWith('watch-') && f.endsWith('.png'));
  console.log(`Found ${files.length} watch images in ${productsDir}`);
  console.log(`Target Bucket: "${bucketName}" on ${supabaseUrl}\n`);

  let successCount = 0;

  for (const file of files) {
    const filePath = path.join(productsDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const uploadEndpoint = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/${bucketName}/${file}`;

    try {
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'image/png',
          'x-upsert': 'true'
        },
        body: fileBuffer
      });

      if (response.ok) {
        successCount++;
        console.log(`  ✓ Uploaded: ${file}`);
      } else {
        const errorText = await response.text();
        console.error(`  ✗ Failed ${file}: [HTTP ${response.status}] ${errorText}`);
      }
    } catch (err) {
      console.error(`  ✗ Network error on ${file}:`, err.message);
    }
  }

  console.log('\n================================================================');
  console.log(`  Done! Successfully uploaded ${successCount}/${files.length} watches.`);
  console.log(`  Base URL: ${supabaseUrl}/storage/v1/object/public/${bucketName}`);
  console.log('================================================================\n');
}

run();
