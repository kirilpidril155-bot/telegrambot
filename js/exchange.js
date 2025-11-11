// 🔥 ФУНКЦИИ ДЛЯ ОБНОВЛЕНИЯ КУРСОВ ВАЛЮТ

// Получение курса рубля к доллару
async function getUSDRate() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        return data.rates.RUB || 90; // fallback к 90 если API не работает
    } catch (error) {
        console.error('Ошибка получения курса USD:', error);
        return 90; // fallback значение
    }
}

// Получение актуальных курсов криптовалют
async function updateCryptoRates() {
    try {
        const usdRate = await getUSDRate();
        const cryptoIds = Object.values(CURRENCY_IDS).join(',');
        
        const response = await fetch(`${EXCHANGE_API_URL}?ids=${cryptoIds}&vs_currencies=usd`);
        const data = await response.json();
        
        // Обновляем курсы в рублях
        Object.keys(CURRENCY_IDS).forEach(currency => {
            const cryptoId = CURRENCY_IDS[currency];
            if (data[cryptoId] && data[cryptoId].usd) {
                const rateInUSD = data[cryptoId].usd;
                currencies[currency] = (1 / rateInUSD) * usdRate;
            }
        });
        
        console.log('✅ Курсы обновлены:', currencies);
        showExchangeRateNotification('✅ Курсы валют обновлены');
        
    } catch (error) {
        console.error('❌ Ошибка обновления курсов:', error);
        showExchangeRateNotification('❌ Ошибка обновления курсов, используем кэш');
    }
}

// Уведомление об обновлении курсов
function showExchangeRateNotification(message) {
    // Создаем временное уведомление
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Показ актуальных курсов в интерфейсе
function displayCurrentRates() {
    const ratesContainer = document.getElementById('exchangeRates');
    if (!ratesContainer) return;
    
    ratesContainer.innerHTML = Object.keys(currencies)
        .map(currency => {
            const rate = (1 / currencies[currency]).toFixed(2);
            return `<div class="rate-item">${currency}: ${rate} ₽</div>`;
        })
        .join('');
}

// Автоматическое обновление курсов каждые 5 минут
function startAutoExchangeUpdates() {
    // Первое обновление при загрузке
    updateCryptoRates();
    
    // Обновление каждые 5 минут
    currencyUpdateInterval = setInterval(updateCryptoRates, 5 * 60 * 1000);
}

// Ручное обновление курсов
function manualUpdateRates() {
    updateCryptoRates();
    showExchangeRateNotification('🔄 Обновляем курсы...');
}

// Получение суммы в выбранной валюте
function getAmountInCurrency(amountRUB, currency) {
    const rate = currencies[currency];
    return rate ? (amountRUB * rate).toFixed(6) : '0';
}

// Форматирование суммы с валютой
function formatCurrencyAmount(amount, currency) {
    return `${amount} ${currency}`;
}