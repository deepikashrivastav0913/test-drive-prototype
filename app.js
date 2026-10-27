(() => {
  const form = document.querySelector('#testDriveForm');
  const status = document.querySelector('#formStatus');
  const marketToggle = document.querySelector('#marketToggle');
  const marketName = document.querySelector('#marketName');
  const dialCode = document.querySelector('#dialCode');
  const phoneHint = document.querySelector('#phoneHint');
  const consentText = document.querySelector('#consentText');
  const phone = document.querySelector('#phone');
  const date = document.querySelector('#date');
  const toast = document.querySelector('#toast');
  let market = 'India';
  let toastTimer;

  // Demo market configuration. No location detection or external market API is used.
  const markets = {
    India: { dial: '+91', digits: 10, hint: '10 digits for India', placeholder: '98765 43210', consent: 'I agree to be contacted about this test drive request and accept the privacy notice.' },
    UK: { dial: '+44', digits: 10, hint: 'Enter 10 digits after the country code', placeholder: '7700 900123', consent: 'I agree to be contacted about this test drive request and accept the privacy notice for the UK market.' },
    UAE: { dial: '+971', digits: 9, hint: 'Enter 9 digits after the country code', placeholder: '501234567', consent: 'I agree to be contacted about this test drive request and accept the privacy notice for the UAE market.' }
  };
  const fieldIds = ['model','firstName','lastName','email','phone','city','dealer','date','time','consent'];
  const labels = { model: 'Choose a model', firstName: 'First name', lastName: 'Last name', email: 'Email address', phone: 'Mobile number', city: 'City', dealer: 'Experience centre', date: 'Preferred date', time: 'Preferred time', consent: 'Consent' };
  date.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,10);

  function showToast(message) {
    toast.textContent = message; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }
  function setError(id, message) {
    const control = document.getElementById(id);
    const error = document.getElementById(id + 'Error');
    if (control && id !== 'consent') control.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message || '';
  }
  function validate() {
    let valid = true;
    const values = Object.fromEntries(new FormData(form).entries());
    for (const id of fieldIds) {
      let message = '';
      if (id === 'consent') {
        if (!form.elements.consent.checked) message = 'Please provide consent to continue.';
      } else if (!String(values[id] || '').trim()) {
        message = `${labels[id]} is required.`;
      }
      if (id === 'email' && values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) message = 'Enter a valid email address.';
      if (id === 'phone' && values.phone) {
        const digits = values.phone.replace(/\D/g, '');
        if (digits.length !== markets[market].digits) message = `Enter a ${markets[market].digits}-digit mobile number for ${market}.`;
      }
      if (id === 'date' && values.date && values.date < date.min) message = 'Choose today or a future date.';
      setError(id, message);
      if (message) valid = false;
    }
    return valid;
  }
  function setMarket(next) {
    market = next;
    const config = markets[market];
    marketName.textContent = market;
    dialCode.textContent = config.dial;
    phoneHint.textContent = config.hint;
    phone.placeholder = config.placeholder;
    consentText.textContent = config.consent;
    setError('phone', '');
    showToast(`Form adapted for ${market}. Review phone and consent requirements.`);
  }
  marketToggle.addEventListener('click', () => {
    const choices = ['India', 'UK', 'UAE'];
    const next = choices[(choices.indexOf(market) + 1) % choices.length];
    setMarket(next);
  });
  for (const id of fieldIds) {
    const control = document.getElementById(id);
    if (control && id !== 'consent') control.addEventListener('input', () => {
      const error = document.getElementById(id + 'Error');
      if (error && error.textContent) setError(id, '');
    });
    if (control && id === 'consent') control.addEventListener('change', () => setError('consent', ''));
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.hidden = true;
    if (!validate()) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]') || form.querySelector('#consent:not(:checked)');
      if (firstInvalid) firstInvalid.focus();
      status.className = 'status failure';
      status.textContent = 'Please check the highlighted fields and try again.';
      status.hidden = false;
      return;
    }
    const submit = form.querySelector('.submit-button');
    submit.disabled = true; submit.textContent = 'Submitting demo request…';
    // Mock API: local-only delay and generated reference. Nothing is transmitted or persisted.
    await new Promise(resolve => setTimeout(resolve, 650));
    const reference = 'DF-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    status.className = 'status success';
    status.innerHTML = `<strong>Request received — ${reference}</strong><br>This is a simulated confirmation. No real lead was sent or stored.`;
    status.hidden = false;
    submit.disabled = false; submit.innerHTML = 'Request my test drive <span aria-hidden="true">→</span>';
    status.scrollIntoView({behavior:'smooth', block:'nearest'});
    showToast('Demo submission successful. No data was sent.');
  });
  // Expose a small read-only test hook for browser automation.
  window.driveFlowDemo = { validate, setMarket, getMarket: () => market };
})();
