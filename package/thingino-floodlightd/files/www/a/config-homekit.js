(function () {
  const status = $('#homekit-status');
  const message = $('#homekit-message');
  const reset = $('#homekit-reset');

  function showStatus(data) {
    if (data.paired) {
      status.textContent = 'Paired';
      status.className = 'badge text-bg-success';
      message.textContent = 'This floodlight is paired with Apple Home.';
    } else {
      status.textContent = 'Not paired';
      status.className = 'badge text-bg-secondary';
      message.textContent = 'This floodlight is ready to be paired with Apple Home.';
    }
  }

  async function refresh() {
    try {
      const response = await fetch('/x/json-config-homekit.cgi', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Unable to read HomeKit status');
      showStatus(await response.json());
    } catch (err) {
      status.textContent = 'Unavailable';
      status.className = 'badge text-bg-danger';
      message.textContent = 'HomeKit status is unavailable.';
      reset.disabled = true;
    }
  }

  reset.addEventListener('click', async function () {
    if (!window.confirm('Reset HomeKit pairing? You will need to pair this camera again.')) return;
    reset.disabled = true;
    try {
      const response = await fetch('/x/json-config-homekit.cgi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error && data.error.message || 'Unable to reset HomeKit pairing');
      showStatus(data);
      if (window.showAlert) showAlert('success', 'HomeKit pairing has been reset.');
    } catch (err) {
      if (window.showAlert) showAlert('danger', err.message);
    } finally {
      reset.disabled = false;
    }
  });

  refresh();
})();
