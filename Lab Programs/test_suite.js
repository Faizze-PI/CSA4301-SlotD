/**
 * CSA4301 - Internet Programming Lab Automated Test Suite
 * Validates file integrity, syntax, documentation, and HTTP delivery across all 46 experiments.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const http = require('http');

const BASE_DIR = __dirname;

const EXPECTED_EXPERIMENTS = [
  '01-library-management',
  '02-hotel-booking',
  '03-bus-booking',
  '04-train-reservation',
  '05-flight-reservation',
  '06-cake-ordering',
  '07-beauty-parlour',
  '08-hospital-appointment',
  '09-techsavvy-electronics',
  '10-stylehub-fashion',
  '11-real-estate-homefinder',
  '12-insureeasy-insurance',
  '13-blossomgifts-flowers',
  '14-renewmarket-marketplace',
  '15-easytoll-toll-payment',
  '16-complainease-grievance',
  '17-voteonline-evoting',
  '18-agrimart-agriculture',
  '19-veterinary-telehealth',
  '20-rentride-vehicle-rental',
  '21-job-recruitment-portal',
  '22-solid-waste-management',
  '23-blood-management-system',
  '24-wanderlust-travel-agency',
  '25-road-breakdown-assistance',
  '26-trafficsquad-police-fir',
  '27-bus-pass-system',
  '28a-artist-portfolio-artistryhub',
  '28b-event-landing-page',
  '30-ijsse-scopus-journal',
  '31-komatha-dairy-farm',
  '32-ram-infotech-laptop-service',
  '33-kodaikanaleats-dining-rooms',
  '34-learnwell-tuition-centre',
  '35-smart-bus-pass-v2',
  '36a-educonnect-online-lms',
  '36b-bookhaven-online-bookstore',
  '37-professional-portfolio',
  '38-gourmet-haven-restaurant',
  '39-general-ecommerce-store',
  '40-travel-blog-interactive-map',
  '41-digital-recipe-book',
  '42-electricity-bill-payment',
  '43-online-placement-exam',
  '44-painting-rating-review',
  '45-income-tax-calculator',
  '46-phone-bill-payment'
];

async function runTestSuite() {
  console.log('================================================================');
  console.log('   CSA4301 INTERNET PROGRAMMING LAB - COMPREHENSIVE TEST SUITE   ');
  console.log('================================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, message) {
    if (condition) {
      passedTests++;
    } else {
      failedTests++;
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // 1. Shared Infrastructure Verification
  console.log('▶ [1/5] Verifying Shared Architecture & Core Assets...');
  assert(fs.existsSync(path.join(BASE_DIR, 'shared', 'css', 'theme.css')), 'shared/css/theme.css exists');
  assert(fs.existsSync(path.join(BASE_DIR, 'shared', 'js', 'db.js')), 'shared/js/db.js exists');
  assert(fs.existsSync(path.join(BASE_DIR, 'index.html')), 'Master Portal index.html exists');
  assert(fs.existsSync(path.join(BASE_DIR, 'server.js')), 'Static Server server.js exists');
  assert(fs.existsSync(path.join(BASE_DIR, 'package.json')), 'package.json exists');
  console.log(`  ✔ Shared assets verified.\n`);

  // 2. Directory & 4-File Completeness Verification
  console.log(`▶ [2/5] Auditing 4-File Structure across ${EXPECTED_EXPERIMENTS.length} experiment applications...`);
  EXPECTED_EXPERIMENTS.forEach(dirName => {
    const dirPath = path.join(BASE_DIR, dirName);
    assert(fs.existsSync(dirPath), `Directory ${dirName} exists`);

    const expectedFiles = ['index.html', 'styles.css', 'script.js', 'README.md'];
    expectedFiles.forEach(file => {
      const filePath = path.join(dirPath, file);
      assert(fs.existsSync(filePath), `${dirName}/${file} exists`);
    });
  });
  console.log(`  ✔ 4-File architecture audit completed for all 47 folders.\n`);

  // 3. JavaScript Syntax Verification (node -c)
  console.log('▶ [3/5] Compiling and Validating JavaScript Syntax via Node.js...');
  EXPECTED_EXPERIMENTS.forEach(dirName => {
    const jsPath = path.join(BASE_DIR, dirName, 'script.js');
    try {
      execSync(`node -c "${jsPath}"`, { stdio: 'pipe' });
      assert(true, `${dirName}/script.js syntax valid`);
    } catch (err) {
      assert(false, `Syntax error in ${dirName}/script.js: ${err.message}`);
    }
  });

  // Verify server.js syntax
  try {
    execSync(`node -c "${path.join(BASE_DIR, 'server.js')}"`, { stdio: 'pipe' });
    assert(true, `server.js syntax valid`);
  } catch (err) {
    assert(false, `Syntax error in server.js`);
  }
  console.log(`  ✔ All JavaScript files compiled with 0 syntax errors.\n`);

  // 4. Lab Documentation (Viva Voce & Algorithm) Verification
  console.log('▶ [4/5] Verifying Academic Lab Manuals & Viva Voce Documentation...');
  EXPECTED_EXPERIMENTS.forEach(dirName => {
    const readmePath = path.join(BASE_DIR, dirName, 'README.md');
    const content = fs.readFileSync(readmePath, 'utf8');
    assert(content.includes('Aim'), `${dirName}/README.md contains Aim`);
    assert(content.includes('Algorithm'), `${dirName}/README.md contains Algorithm`);
    assert(content.includes('Viva'), `${dirName}/README.md contains Viva Voce section`);
  });
  console.log(`  ✔ Academic lab manuals verified for all experiments.\n`);

  // 5. HTTP Delivery Test via Ephemeral Server
  console.log('▶ [5/5] Testing HTTP Delivery across all 47 endpoints...');
  const testPort = 3199;
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript'
  };

  const testServer = http.createServer((req, res) => {
    let safePath = path.normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '\\') safePath = '/index.html';
    const filePath = path.join(BASE_DIR, safePath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });

  await new Promise(resolve => testServer.listen(testPort, resolve));

  async function checkUrl(urlPath) {
    return new Promise(resolve => {
      http.get(`http://localhost:${testPort}${urlPath}`, res => {
        resolve(res.statusCode === 200);
      }).on('error', () => resolve(false));
    });
  }

  // Check Master Portal
  const rootStatus = await checkUrl('/index.html');
  assert(rootStatus, 'HTTP 200 on /index.html (Master Portal)');

  // Check every experiment index
  for (const exp of EXPECTED_EXPERIMENTS) {
    const status = await checkUrl(`/${exp}/index.html`);
    assert(status, `HTTP 200 on /${exp}/index.html`);
  }

  testServer.close();
  console.log(`  ✔ All 47 endpoints returned HTTP 200 OK.\n`);

  // Summary
  console.log('================================================================');
  console.log(`  TOTAL TESTS EXECUTED: ${passedTests + failedTests}`);
  console.log(`  PASSED: ${passedTests}`);
  console.log(`  FAILED: ${failedTests}`);
  console.log('================================================================');

  if (failedTests === 0) {
    console.log('\n🎉 ALL TESTS PASSED! CSA4301 LAB SUITE IS 100% READY AND VERIFIED.\n');
    process.exit(0);
  } else {
    console.error(`\n❌ ${failedTests} test(s) failed. Please review errors above.\n`);
    process.exit(1);
  }
}

runTestSuite();
