// Membership form shared by the AGL BB and LDMCF pages.
// Answers are sent to a Google Apps Script web app that writes them
// into the private "Members Register" Google Sheet (one tab per organisation).

// Paste the Apps Script web app URL (ends in /exec) between the quotes:
const ENDPOINT = '';

const ORGS = {
  aglbb: {
    short: 'AGL BB',
    name: 'Assemblies of God Lesotho — Butha-Buthe District',
  },
  ldmcf: {
    short: 'LDMCF',
    name: 'LDMCF',
  },
};

const orgKey = document.body.dataset.org;
const org = ORGS[orgKey];
const thisYear = new Date().getFullYear();
const today = new Date().toISOString().split('T')[0];

document.title = `${org.short} Membership Form | Letlotlo Hlaoli`;
document.getElementById('org-name').textContent = org.name;
document.getElementById('consent-text').textContent =
  `I agree that ${org.short} may keep these details in its membership register and use them to contact me. They will not be shared outside ${org.short}.`;
document.querySelectorAll('input[type="number"]').forEach(i => (i.max = thisYear));
document.getElementById('date-of-birth').max = today;

const form = document.getElementById('member-form');
const msg = document.getElementById('form-msg');
const submitBtn = form.querySelector('button[type="submit"]');

if (!ENDPOINT) {
  msg.textContent = 'This form is not connected yet, so it cannot be submitted.';
  msg.className = 'msg warn';
  submitBtn.disabled = true;
}

// Show "Year baptised" only when "Yes" is chosen
const baptismRow = document.getElementById('baptism-year-row');
form.querySelectorAll('input[name="water-baptism"]').forEach(r =>
  r.addEventListener('change', () => {
    baptismRow.hidden = form['water-baptism'].value !== 'yes';
  })
);

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!form.reportValidity() || !ENDPOINT) return;

  const data = new URLSearchParams(new FormData(form));
  data.set('org', orgKey);
  if (data.get('water-baptism') !== 'yes') data.set('baptism-year', '');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  msg.className = 'msg';
  msg.textContent = '';

  try {
    // Apps Script does not send CORS headers, so the reply cannot be read;
    // a network failure still throws and is reported below.
    await fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: data });
    form.hidden = true;
    document.getElementById('thanks').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    msg.textContent = 'Your form could not be sent. Please check your connection and try again.';
    msg.className = 'msg error';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit membership form';
  }
});
