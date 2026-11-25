// Receives the membership forms from Letlotlo's website
// and adds each one as a new row in the right tab.

const TABS = { aglbb: 'AGL BB', ldmcf: 'LDMCF' };

// Column headings, in the same order as the row written below.
const HEADERS = [
  'Submitted', 'Name', 'Surname', 'Gender', 'Date of birth', 'Marital status',
  'Contact number', 'Email', 'Village', 'City / Town', 'Country', 'Year saved',
  'Water baptism', 'Year baptised', 'Local church',
  'Emergency contact name', 'Emergency contact number', 'Consent',
];

function doPost(e) {
  const p = e.parameter;
  if (p.action === 'admin') return admin(p);    // admin page asking for the register
  if (p.website) return reply('ok');            // spam trap filled in: ignore
  const tabName = TABS[p.org];
  if (!tabName) return reply('unknown organisation');

  // Keep everything as plain text (stops formulas and keeps +266 numbers intact)
  const t = name => {
    const v = String(p[name] || '').trim().slice(0, 200);
    return v ? "'" + v : '';
  };

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);                         // one row at a time
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tabName);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);   // keep headings up to date
    sheet.appendRow([
      new Date(),
      t('first-name'), t('last-name'), t('gender'), t('date-of-birth'),
      t('marital-status'), t('phone'), t('email'), t('village'), t('city'),
      t('country'), t('year-saved'), t('water-baptism'), t('baptism-year'),
      t('local-church'),
      t('emergency-name'), t('emergency-phone'),
      p.consent === 'yes' ? 'Yes' : 'No',
    ]);
  } finally {
    lock.releaseLock();
  }
  return reply('ok');
}

function reply(text) {
  return ContentService.createTextOutput(text);
}

// ---------- Admin page ----------
// Each organisation has its own admin password, kept in
// Project Settings › Script properties:  ADMIN_AGLBB  and  ADMIN_LDMCF
// An admin can only open their own organisation's tab.
function admin(p) {
  const org = String(p.org || '');
  const tabName = TABS[org];
  if (!tabName) return json({ error: 'Unknown organisation.' });

  const cache = CacheService.getScriptCache();
  const failKey = 'fail_' + org;
  const fails = Number(cache.get(failKey) || 0);
  if (fails >= 5) return json({ error: 'Too many wrong passwords. Try again in 15 minutes.' });

  const password = PropertiesService.getScriptProperties().getProperty('ADMIN_' + org.toUpperCase());
  if (!password) return json({ error: 'No admin password has been set for this organisation yet.' });
  if (String(p.password || '') !== password) {
    cache.put(failKey, String(fails + 1), 15 * 60);
    Utilities.sleep(1000);
    return json({ error: 'Wrong password.' });
  }
  cache.remove(failKey);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tabName);
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values.shift() || HEADERS;
  const rows = values
    .filter(r => r.some(c => c !== ''))
    .map(r => r.map(c => String(c).replace(/^'/, '')));
  return json({ org: tabName, headers: headers, rows: rows });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Opening the web app address in a browser just confirms it is running.
function doGet() {
  return reply('Membership register is running.');
}
