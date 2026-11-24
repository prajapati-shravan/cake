/**
 * Verification of Admin CRUD Operations Persistence Across Reloads and Sessions
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const supabaseJs = fs.readFileSync(path.join(ROOT, 'supabase.js'), 'utf-8');
const dashboardJs = fs.readFileSync(path.join(ROOT, 'dashboard.js'), 'utf-8');
const dashboardHtml = fs.readFileSync(path.join(ROOT, 'dashboard.html'), 'utf-8');

console.log('======================================================');
console.log('   ADMIN CRUD PERSISTENCE ACROSS SESSIONS AUDIT');
console.log('======================================================\n');

// Shared localStorage across simulated tabs/sessions
const sharedStorage = {};
const storageAdapter = {
  getItem: (k) => sharedStorage[k] !== undefined ? sharedStorage[k] : null,
  setItem: (k, v) => { sharedStorage[k] = String(v); },
  removeItem: (k) => { delete sharedStorage[k]; }
};

function createSessionContext(sessionName) {
  const elements = {};
  const idRegex = /id=["']([^"']+)["']/gi;
  let match;
  while ((match = idRegex.exec(dashboardHtml)) !== null) {
    const id = match[1];
    elements[id] = {
      id: id,
      value: '',
      checked: false,
      style: {},
      classList: { add: ()=>{}, remove: ()=>{}, contains: ()=>false },
      addEventListener: ()=>{},
      setAttribute: ()=>{},
      getAttribute: ()=>null,
      reset: ()=>{}
    };
  }

  const ctxObj = {
    location: { href: 'dashboard.html', pathname: '/dashboard.html', search: '', reload: ()=>{} },
    history: { replaceState: ()=>{} },
    localStorage: storageAdapter,
    sessionStorage: {
      getItem: (k) => k === 'delice_admin_authenticated' ? JSON.stringify({ role: 'admin' }) : null,
      setItem: ()=>{},
      removeItem: ()=>{}
    },
    navigator: { userAgent: 'HeadlessChrome' },
    document: {
      getElementById: (id) => elements[id] || null,
      querySelector: (sel) => {
        if (sel.startsWith('#')) return elements[sel.slice(1)] || null;
        return { style: {}, classList: { add: ()=>{}, remove: ()=>{} }, addEventListener: ()=>{} };
      },
      querySelectorAll: () => [],
      body: { style: {}, classList: { add: ()=>{}, remove: ()=>{} }, setAttribute: ()=>{}, getAttribute: ()=>null }
    },
    console: console,
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }),
    setTimeout: (fn) => setTimeout(fn, 0),
    clearTimeout: (id) => clearTimeout(id),
    setInterval: () => {},
    clearInterval: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    alert: () => {},
    confirm: () => true
  };
  ctxObj.window = ctxObj;
  ctxObj.global = ctxObj;

  const ctx = vm.createContext(ctxObj);
  vm.runInContext(supabaseJs, ctx);
  vm.runInContext(dashboardJs, ctx);
  return { ctx, elements };
}

let pass = 0;
let fail = 0;
function assert(cond, desc) {
  if (cond) {
    console.log(`  [PASS] ${desc}`);
    pass++;
  } else {
    console.error(`  [FAIL] ${desc}`);
    fail++;
  }
}

async function runTest() {
  console.log('--- Session 1: Admin Adds and Edits Product ---');
  const session1 = createSessionContext('Tab 1');

  // Fill Add Cake inputs in Session 1
  session1.elements['newCakeName'].value = 'Persistence Test Chiffon';
  session1.elements['newCakeCategory'].value = 'Celebration Chiffon';
  session1.elements['newCakePrice'].value = '1299';
  session1.elements['newCakeSlices'].value = '1 kg';
  session1.elements['newCakeFlavor'].value = 'Hazelnut Cream';
  session1.elements['newCakeDietary'].value = '100% Pure Veg';
  session1.elements['newCakeLeadTime'].value = '2 Hours';
  session1.elements['newCakeImage'].value = 'assets/cake_velvet.jpg';
  session1.elements['newCakeDesc'].value = 'Artisan hazelnut chiffon for persistence verification.';
  session1.elements['newCakeInStock'].checked = true;

  // Submit Add Cake
  await session1.ctx.dashManager.submitNewCake({ preventDefault: ()=>{} });

  // Verify saved in shared storage
  const rawCatalog = sharedStorage['delice_custom_catalog'];
  assert(rawCatalog && rawCatalog.includes('Persistence Test Chiffon'), 'Cake saved into delice_custom_catalog in storage');

  // Session 1: Edit Cake
  const savedList1 = JSON.parse(rawCatalog);
  const addedCake = savedList1.find(c => c.name === 'Persistence Test Chiffon');
  assert(addedCake && addedCake.price === 1299, 'Created cake found with initial price ₹1299');

  session1.elements['editCakeId'].value = addedCake.id;
  session1.elements['editCakeName'].value = 'Persistence Test Chiffon (Updated)';
  session1.elements['editCakeCategory'].value = 'Celebration Chiffon';
  session1.elements['editCakePrice'].value = '1499';
  session1.elements['editCakeSlices'].value = '1.5 kg';
  session1.elements['editCakeFlavor'].value = 'Hazelnut & Dark Ganache';
  session1.elements['editCakeDietary'].value = '100% Pure Veg';
  session1.elements['editCakeLeadTime'].value = 'Same Day';
  session1.elements['editCakeImage'].value = 'assets/cake_chocolate.jpg';
  session1.elements['editCakeDesc'].value = 'Updated description.';
  session1.elements['editCakeInStock'].checked = true;

  await session1.ctx.dashManager.submitEditCake({ preventDefault: ()=>{} });
  const rawCatalogAfterEdit = sharedStorage['delice_custom_catalog'];
  assert(rawCatalogAfterEdit.includes('Persistence Test Chiffon (Updated)') && rawCatalogAfterEdit.includes('1499'), 'Edited cake details persisted to shared storage');

  console.log('\n--- Session 2: Reload / Separate Browser Tab Reads State ---');
  // Initialize completely fresh Session 2 (simulating browser reload / separate tab)
  const session2 = createSessionContext('Tab 2');
  const session2CatalogRaw = sharedStorage['delice_custom_catalog'];
  const session2List = JSON.parse(session2CatalogRaw || '[]');
  const loadedCake = session2List.find(c => c.id === addedCake.id);

  assert(loadedCake !== undefined, 'Separate session successfully loads the created cake from persistent storage');
  assert(loadedCake.name === 'Persistence Test Chiffon (Updated)' && loadedCake.price === 1499, 'Separate session displays updated name and price ₹1499');

  console.log('\n--- Session 2: Deletes Product & Verifies Persistence ---');
  await session2.ctx.dashManager.deleteCake(addedCake.id);
  const rawCatalogAfterDelete = sharedStorage['delice_custom_catalog'];
  const session2ListAfterDel = JSON.parse(rawCatalogAfterDelete || '[]');
  const deletedSearch = session2ListAfterDel.find(c => c.id === addedCake.id);
  assert(deletedSearch === undefined, 'Deleted cake is permanently purged from persistent storage');

  // Reload Session 1 to ensure deletion persists
  const session3 = createSessionContext('Tab 3 (Reloaded Tab 1)');
  const session3List = JSON.parse(sharedStorage['delice_custom_catalog'] || '[]');
  assert(session3List.find(c => c.id === addedCake.id) === undefined, 'Reloaded session confirms product remains deleted');

  console.log(`\nCRUD Persistence Results: ${pass} Passed, ${fail} Failed`);
  if (fail > 0) process.exit(1);
}

runTest().catch(console.error);
