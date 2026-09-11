(function () {
  const status = $('#status');
  const details = $('#details');
  const code = $('#code');
  const qr = $('#qr');
  const reset = $('#reset');
  const qrWrap = $('#qr-wrap');
  const qrImage = $('#qr-image');
  const floodlightCard = $('#floodlight-card');
  const floodlightStatus = $('#floodlight-status');
  const brightness = $('#floodlight-brightness');
  const brightnessValue = $('#floodlight-brightness-value');
  const floodlightOn = $('#floodlight-on');
  const floodlightOff = $('#floodlight-off');
  let homekit;

  function showHomeKit(value) {
    homekit = value;
    status.textContent = value.paired ? 'Paired' : 'Ready to pair';
    status.className = 'badge ' + (value.paired ? 'text-bg-success' : 'text-bg-primary');
    details.textContent = value.paired ? 'Paired controllers: ' + value.paired : 'The primary camera feed is ready for Apple Home.';
    code.textContent = 'Pairing code: ' + value.setup_code;
  }

  function showFloodlight(value) {
    floodlightCard.classList.remove('d-none');
    floodlightCard.hidden = false;
    floodlightStatus.textContent = value.state === 'ON' ? 'On' : 'Off';
    floodlightStatus.className = 'badge ' + (value.state === 'ON' ? 'text-bg-warning' : 'text-bg-secondary');
    brightness.value = String(value.brightness);
    brightnessValue.textContent = value.brightness + '%';
    const enabled = value.available === true;
    [brightness, floodlightOn, floodlightOff].forEach(function (control) { control.disabled = !enabled; });
  }

  async function refreshFloodlight() {
    try {
      const response = await fetch('/x/json-config-floodlight.cgi');
      if (!response.ok) return;
      const value = await response.json();
      if (value.available !== undefined) showFloodlight(value);
    } catch (_) {}
  }

  async function floodlightCommand(action) {
    const response = await fetch('/x/json-config-floodlight.cgi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: action, brightness: Number(brightness.value) })
    });
    const value = await response.json();
    if (!response.ok || value.error) throw new Error(value.error && value.error.message || 'Floodlight command failed');
    showFloodlight(value);
  }

  async function load() {
    const response = await fetch('/x/json-config-homekit.cgi');
    if (!response.ok) throw new Error();
    showHomeKit(await response.json());
    refreshFloodlight();
  }

  qr.addEventListener('click', function () {
    qrImage.src = '/x/homekit-qr.cgi?setup_code=' + encodeURIComponent(homekit.setup_code) + '&setup_id=' + encodeURIComponent(homekit.setup_id);
    qrWrap.classList.remove('d-none');
  });
  reset.addEventListener('click', async function () {
    if (!confirm('Reset HomeKit pairing and QR code?')) return;
    const response = await fetch('/x/json-config-homekit.cgi', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"action":"reset"}'
    });
    if (!response.ok) throw new Error('Reset failed');
    qrWrap.classList.add('d-none');
    showHomeKit(await response.json());
  });
  brightness.addEventListener('input', function () { brightnessValue.textContent = brightness.value + '%'; });
  floodlightOn.addEventListener('click', function () { floodlightCommand('on').catch(function (err) { window.showAlert && showAlert('danger', err.message); }); });
  floodlightOff.addEventListener('click', function () { floodlightCommand('off').catch(function (err) { window.showAlert && showAlert('danger', err.message); }); });
  load().catch(function () {
    status.textContent = 'Unavailable';
    status.className = 'badge text-bg-danger';
    qr.disabled = reset.disabled = true;
  });
})();
