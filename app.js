document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const statusBadge = document.getElementById('statusBadge');
  const statusMessage = document.getElementById('statusMessage');
  const btnRequestPermission = document.getElementById('btnRequestPermission');

  const paymentMethod = document.getElementById('paymentMethod');
  const ticketValue = document.getElementById('ticketValue');
  const initialOrder = document.getElementById('initialOrder');
  const toggleMultiProducts = document.getElementById('toggleMultiProducts');
  const orderIncrementType = document.getElementById('orderIncrementType');

  const dispatchQuantity = document.getElementById('dispatchQuantity');
  const dispatchInterval = document.getElementById('dispatchInterval');

  const progressContainer = document.getElementById('progressContainer');
  const progressText = document.getElementById('progressText');
  const progressPercent = document.getElementById('progressPercent');
  const progressFill = document.getElementById('progressFill');

  const previewBody = document.getElementById('previewBody');

  const btnTestSingle = document.getElementById('btnTestSingle');
  const btnStartDispatch = document.getElementById('btnStartDispatch');
  const btnStopDispatch = document.getElementById('btnStopDispatch');

  let dispatchTimer = null;
  let isDispatching = false;
  let currentOrderNumber = 4488821;

  // Audio MP3 oficial (som.mp3)
  const notificationAudio = new Audio('som.mp3');
  notificationAudio.volume = 1.0;

  document.addEventListener('click', () => {
    notificationAudio.load();
  }, { once: true });

  const ticketPresets = [34.74, 60.04, 60.04, 34.74, 97.00, 197.00];

  function checkPermissionStatus() {
    statusBadge.className = 'status-badge granted';
    statusBadge.textContent = 'APP TICTO ATIVO ✅';
    statusMessage.innerHTML = '✨ <strong>App Nativo iOS Ativo!</strong> As notificações de vendas deslizarão no topo do iPhone com o áudio oficial <code>som.mp3</code>!';
    btnRequestPermission.style.display = 'none';
  }

  checkPermissionStatus();

  function playNotificationSound() {
    try {
      notificationAudio.currentTime = 0;
      const playPromise = notificationAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('[AUDIO] Autoplay aguardando clique:', err);
        });
      }
    } catch (e) {}
  }

  function formatCurrency(val) {
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function updatePreview() {
    const val = parseFloat(ticketValue.value) || 34.74;
    const order = initialOrder.value || 4488821;
    const pay = paymentMethod.value;

    let text = `Venda aprovada no ${pay}! Comissão: R$ ${formatCurrency(val)} | Pedido: ${order}`;
    if (pay === 'Boleto') {
      text = `Boleto gerado! Comissão: R$ ${formatCurrency(val)} | Pedido: ${order}`;
    }
    previewBody.textContent = text;
  }

  [paymentMethod, ticketValue, initialOrder].forEach(el => {
    el.addEventListener('input', updatePreview);
  });
  updatePreview();

  function showiOSFloatingBanner(bodyText) {
    let banner = document.getElementById('iosFloatingBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'iosFloatingBanner';
      banner.className = 'ios-banner-container';
      banner.innerHTML = `
        <img src="logo_padded.png" class="preview-app-icon-img" alt="Ticto Logo">
        <div class="preview-content">
          <div class="preview-header">
            <span class="preview-app-name">Ticto</span>
            <span class="preview-time">agora</span>
          </div>
          <div class="preview-body" id="iosBannerBody"></div>
        </div>
      `;
      document.body.appendChild(banner);
    }

    const iosBannerBody = document.getElementById('iosBannerBody');
    if (iosBannerBody) iosBannerBody.textContent = bodyText;

    banner.classList.remove('show');
    void banner.offsetWidth;
    banner.classList.add('show');

    setTimeout(() => {
      banner.classList.remove('show');
    }, 4500);
  }

  function sendNativeNotification(data) {
    const pay = data.pagamento || 'Pix';
    let messageText = `Venda aprovada no ${pay}! Comissão: R$ ${data.comissao} | Pedido: ${data.pedido}`;
    if (pay === 'Boleto') {
      messageText = `Boleto gerado! Comissão: R$ ${data.comissao} | Pedido: ${data.pedido}`;
    }

    playNotificationSound();
    showiOSFloatingBanner(messageText);
  }

  function getNextNotificationData(stepIndex) {
    let orderNum = parseInt(initialOrder.value) || 4488821;
    
    if (stepIndex > 0) {
      if (orderIncrementType.value === 'random') {
        const stepIncrements = [1, 2, 3];
        const randomInc = stepIncrements[Math.floor(Math.random() * stepIncrements.length)];
        currentOrderNumber += randomInc;
      } else {
        currentOrderNumber += 1;
      }
      orderNum = currentOrderNumber;
    } else {
      currentOrderNumber = orderNum;
    }

    let val = parseFloat(ticketValue.value) || 34.74;
    if (toggleMultiProducts.checked) {
      const preset = ticketPresets[stepIndex % ticketPresets.length];
      val = preset;
    }

    return {
      comissao: formatCurrency(val),
      pedido: orderNum,
      pagamento: paymentMethod.value
    };
  }

  btnTestSingle.addEventListener('click', () => {
    const data = getNextNotificationData(0);
    sendNativeNotification(data);
  });

  btnStartDispatch.addEventListener('click', () => {
    startSequence();
  });

  btnStopDispatch.addEventListener('click', () => {
    stopSequence();
  });

  function startSequence() {
    if (isDispatching) return;

    isDispatching = true;
    btnStartDispatch.style.display = 'none';
    btnStopDispatch.style.display = 'block';
    progressContainer.style.display = 'flex';

    const totalQty = parseInt(dispatchQuantity.value) || 10;
    const intervalSec = parseFloat(dispatchInterval.value) || 2;
    let currentStep = 0;

    currentOrderNumber = parseInt(initialOrder.value) || 4488821;

    function dispatchStep() {
      if (!isDispatching || currentStep >= totalQty) {
        stopSequence();
        return;
      }

      const data = getNextNotificationData(currentStep);
      sendNativeNotification(data);

      currentStep++;
      const percent = Math.round((currentStep / totalQty) * 100);
      progressText.textContent = `Disparando ${currentStep} de ${totalQty}...`;
      progressPercent.textContent = `${percent}%`;
      progressFill.style.width = `${percent}%`;

      if (currentStep < totalQty) {
        dispatchTimer = setTimeout(dispatchStep, intervalSec * 1000);
      } else {
        setTimeout(() => {
          stopSequence();
        }, 1500);
      }
    }

    dispatchStep();
  }

  function stopSequence() {
    isDispatching = false;
    if (dispatchTimer) clearTimeout(dispatchTimer);

    btnStartDispatch.style.display = 'block';
    btnStopDispatch.style.display = 'none';

    setTimeout(() => {
      progressContainer.style.display = 'none';
      progressFill.style.width = '0%';
    }, 2000);
  }
});
