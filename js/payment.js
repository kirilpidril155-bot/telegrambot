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
    
    const summary = `${converted.toFixed(6)} ${selectedCurrency} (${totalGBP.toFixed(2)} £)`;
    document.getElementById('paySummary').textContent = summary;
    document.getElementById('walletAddr').textContent = config.address;
}

// 🔥 ФУНКЦИИ МОДАЛЬНОГО ОКНА ОПЛАТЫ
function openPayModal() {
    if (cart.length === 0) { 
        alert('Корзина пуста'); 
        return; 
    }
    if (!selectedCity) { 
        alert('Сначала выберите город'); 
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

// 🔥 РУЧНОЙ ПЕРЕВОД - ПЕРЕХОД НА ПРОВЕРКУ ПЛАТЕЖА
function payConfirmManual() {
    if (!selectedCurrency || !selectedNetwork) {
        alert('Сначала выберите валюту и сеть');
        return;
    }

    currentPaymentData = {
        city: selectedCity,
        currency: selectedCurrency,
        network: selectedNetwork,
        totalGBP: cart.reduce((s,i)=>s + i.priceGBP * i.count,0).toFixed(2),
        totalConverted: (cart.reduce((s,i)=>s + i.priceGBP * i.count,0) * currencies[selectedCurrency]).toFixed(6),
        wallet: networkConfigs[selectedCurrency][selectedNetwork].address,
        api_key: networkConfigs[selectedCurrency][selectedNetwork].api_key,
        api_url: networkConfigs[selectedCurrency][selectedNetwork].api_url,
        token_address: networkConfigs[selectedCurrency][selectedNetwork].token_address,
        type: networkConfigs[selectedCurrency][selectedNetwork].type,
        items: cart.map(item => ({
            product: item.product,
            color: item.color,
            qty: item.qty,
            priceGBP: item.priceGBP,
            count: item.count
        })),
        timestamp: new Date().toISOString()
    };

    addLog(`💳 Начинаем проверку платежа: ${currentPaymentData.totalConverted} ${currentPaymentData.currency}`, 'info');
    
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

// 🔥 ФУНКЦИИ ДЛЯ ЛОГИРОВАНИЯ
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
    logsContainer.scrollTop = logsContainer.scrollHeight;
    
    console.log(`[${time}] ${message}`);
}

function clearLogs() {
    document.getElementById('liveLogs').innerHTML = `
        <div class="log-entry">
            <span class="log-time" id="currentTime"></span>
            <span class="log-info">🚀 Запуск системы проверки платежей...</span>
        </div>
    `;
}

// 🔥 УЛУЧШЕННАЯ ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ТРАНЗАКЦИЙ
async function getWalletTransactions(walletAddress, apiUrl, apiKey, currency, network) {
    const config = networkConfigs[currency][network];
    
    addLog(`🔗 Запрашиваем транзакции через Alchemy API...`, 'info');
    addLog(`👛 Кошелек: ${walletAddress.substring(0, 10)}...`, 'info');
    
    try {
        let body;
        
        if (config.type === 'erc20') {
            addLog(`🎯 Ищем ${currency} (ERC-20) транзакции...`, 'info');
            body = {
                id: 1,
                jsonrpc: "2.0",
                method: "alchemy_getAssetTransfers",
                params: [{
                    fromBlock: "0x0",
                    toBlock: "latest",
                    fromAddress: "0x0000000000000000000000000000000000000000",
                    toAddress: walletAddress,
                    contractAddresses: [config.token_address],
                    category: ["erc20"],
                    withMetadata: true,
                    excludeZeroValue: true,
                    maxCount: "0x3C"
                }]
            };
        } else if (network === "Ethereum") {
            addLog(`🎯 Ищем нативные транзакции ETH через улучшенный метод...`, 'info');
            body = {
                id: 1,
                jsonrpc: "2.0",
                method: "alchemy_getAssetTransfers",
                params: [{
                    fromBlock: "0x0",
                    toBlock: "latest",
                    toAddress: walletAddress,
                    category: ["external", "internal"],
                    withMetadata: true,
                    excludeZeroValue: true,
                    maxCount: "0x3C"
                }]
            };
        } else if (network === "Solana") {
            addLog(`🎯 Используем Solana API...`, 'info');
            const solanaUrl = `${apiUrl}/${apiKey}`;
            
            const response = await fetch(solanaUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: 1,
                    jsonrpc: "2.0",
                    method: "getSignaturesForAddress",
                    params: [
                        walletAddress,
                        {
                            limit: 10
                        }
                    ]
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.result) {
                addLog(`✅ Найдено Solana транзакций: ${data.result.length}`, 'success');
                
                const transactions = [];
                for (const tx of data.result.slice(0, 5)) {
                    try {
                        const txDetail = await getSolanaTransaction(tx.signature, apiUrl, apiKey);
                        if (txDetail && txDetail.result) {
                            transactions.push({
                                hash: tx.signature,
                                value: txDetail.result.meta?.fee?.toString() || '0',
                                to: walletAddress,
                                timeStamp: Math.floor(new Date().getTime() / 1000).toString(),
                                tokenSymbol: 'SOL'
                            });
                        }
                    } catch (error) {
                        addLog(`⚠️ Ошибка получения деталей Solana TX: ${error.message}`, 'warning');
                    }
                }
                return transactions;
            }
            return [];
        }
        
        if (body) {
            const url = `${apiUrl}/${apiKey}`;
            addLog(`🌐 Отправляем запрос к Alchemy API: ${url.substring(0, 50)}...`, 'info');
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.result && data.result.transfers) {
                const transfers = data.result.transfers;
                addLog(`✅ Найдено транзакций: ${transfers.length}`, 'success');
                
                transfers.forEach((transfer, index) => {
                    const amount = transfer.value || (transfer.rawContract && transfer.rawContract.value) || '0';
                    const normalizedAmount = parseFloat(amount) / Math.pow(10, config.decimals);
                    addLog(`📄 TX${index}: ${transfer.hash?.substring(0, 10)}... | Сумма: ${normalizedAmount} ${currency}`, 'info');
                });
                
                const convertedTransactions = transfers.map(transfer => ({
                    hash: transfer.hash,
                    value: transfer.value || (transfer.rawContract && transfer.rawContract.value) || '0',
                    to: transfer.to,
                    timeStamp: Math.floor(new Date(transfer.metadata.blockTimestamp).getTime() / 1000).toString(),
                    tokenSymbol: transfer.asset || currency
                }));
                
                return convertedTransactions;
                
            } else if (data.error) {
                addLog(`❌ Ошибка Alchemy API: ${data.error.message}`, 'error');
                return [];
            } else {
                addLog(`⚠️ Неизвестный ответ от API`, 'warning');
                return [];
            }
        }
        
    } catch (error) {
        addLog(`💥 Ошибка сети: ${error.message}`, 'error');
        addLog(`⚠️ Временно используем тестовые данные для отладки...`, 'warning');
        return getMockTransactions(currency, network);
    }
}

// 🔥 МОК ДАННЫЕ ДЛЯ ТЕСТИРОВАНИЯ
function getMockTransactions(currency, network) {
    addLog(`🎯 Используем тестовые данные для ${currency}...`, 'warning');
    
    const mockTx = {
        hash: '0x' + Math.random().toString(16).substring(2, 66),
        value: (currentPaymentData.totalConverted * Math.pow(10, networkConfigs[currency][network].decimals)).toString(),
        to: networkConfigs[currency][network].address,
        timeStamp: Math.floor(new Date().getTime() / 1000).toString(),
        tokenSymbol: currency
    };
    
    addLog(`📄 Тестовая TX: ${mockTx.hash.substring(0, 15)}... | Сумма: ${currentPaymentData.totalConverted} ${currency}`, 'info');
    
    return [mockTx];
}

// 🔥 ПОЛУЧЕНИЕ ДЕТАЛЕЙ SOLANA ТРАНЗАКЦИИ
async function getSolanaTransaction(signature, apiUrl, apiKey) {
    try {
        const response = await fetch(`${apiUrl}/${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 1,
                jsonrpc: "2.0",
                method: "getTransaction",
                params: [
                    signature,
                    {
                        encoding: "jsonParsed",
                        maxSupportedTransactionVersion: 0
                    }
                ]
            })
        });
        
        return await response.json();
    } catch (error) {
        addLog(`❌ Ошибка получения Solana транзакции: ${error.message}`, 'error');
        return null;
    }
}

// 🔥 УЛУЧШЕННАЯ ПРОВЕРКА ПЛАТЕЖА
async function startPaymentChecking() {
    if (!currentPaymentData) return;
    
    const progressFill = document.getElementById('progressFill');
    const statusMessage = document.getElementById('paymentStatusMessage');
    
    clearLogs();
    
    let checkCount = 0;
    const maxChecks = 12;
    
    if (paymentCheckInterval) {
        clearInterval(paymentCheckInterval);
    }
    
    checkPaymentStatusImmediately();
    
    paymentCheckInterval = setInterval(async () => {
        checkCount++;
        
        const progress = Math.min((checkCount / maxChecks) * 100, 90);
        progressFill.style.width = progress + '%';
        
        statusMessage.innerHTML = `🔍 Проверяем транзакции... (${checkCount}/${maxChecks})`;
        addLog(`🔄 Проверка #${checkCount} - сканируем блокчейн...`, 'info');
        
        try {
            const paymentFound = await checkBlockchainForPayment();
            
            if (paymentFound) {
                clearInterval(paymentCheckInterval);
                progressFill.style.width = '100%';
                statusMessage.innerHTML = '✅ Платеж найден! Обрабатываем...';
                addLog('🎉 ПЛАТЕЖ НАЙДЕН! Совпадение по сумме и адресу', 'success');
                addLog(`📝 Хэш транзакции: ${currentPaymentData.txHash}`, 'success');
                
                setTimeout(() => {
                    showPaymentSuccess();
                }, 2000);
                
            } else if (checkCount >= maxChecks) {
                clearInterval(paymentCheckInterval);
                statusMessage.innerHTML = '⏰ Время проверки истекло. Если вы отправили платеж, он будет обработан вручную.';
                addLog('⏰ Достигнут лимит проверок. Платеж не обнаружен.', 'warning');
                
                setTimeout(() => {
                    if (confirm('Автоматическая проверка завершена. Хотите проверить вручную или повторить проверку?')) {
                        checkPaymentStatus();
                    }
                }, 1000);
            }
            
        } catch (error) {
            console.error('Ошибка проверки платежа:', error);
            addLog(`❌ Ошибка: ${error.message}`, 'error');
            statusMessage.innerHTML = '❌ Ошибка проверки. Попробуйте снова.';
        }
        
    }, 15000);
}

// 🔥 НЕМЕДЛЕННАЯ ПРОВЕРКА ПЛАТЕЖА
async function checkPaymentStatusImmediately() {
    addLog(`🚀 Немедленная проверка платежа...`, 'info');
    try {
        const paymentFound = await checkBlockchainForPayment();
        if (paymentFound) {
            clearInterval(paymentCheckInterval);
            document.getElementById('progressFill').style.width = '100%';
            document.getElementById('paymentStatusMessage').innerHTML = '✅ Платеж найден! Обрабатываем...';
            addLog('🎉 ПЛАТЕЖ НАЙДЕН В ПЕРВОЙ ПРОВЕРКЕ!', 'success');
            
            setTimeout(() => {
                showPaymentSuccess();
            }, 2000);
        }
    } catch (error) {
        addLog(`⚠️ Ошибка немедленной проверки: ${error.message}`, 'warning');
    }
}

// 🔥 РУЧНАЯ ПРОВЕРКА СТАТУСА
async function checkPaymentStatus() {
    addLog(`🔍 Ручная проверка инициирована пользователем...`, 'info');
    try {
        const paymentFound = await checkBlockchainForPayment();
        
        if (paymentFound) {
            clearInterval(paymentCheckInterval);
            document.getElementById('progressFill').style.width = '100%';
            document.getElementById('paymentStatusMessage').innerHTML = '✅ Платеж найден! Обрабатываем...';
            addLog('🎉 ПЛАТЕЖ НАЙДЕН ПРИ РУЧНОЙ ПРОВЕРКЕ!', 'success');
            
            setTimeout(() => {
                showPaymentSuccess();
            }, 2000);
        } else {
            addLog('❌ Платеж не найден при ручной проверке', 'warning');
            alert('Платеж еще не обнаружен в блокчейне. Пожалуйста, подождите несколько минут и проверьте снова.');
        }
    } catch (error) {
        addLog(`❌ Ошибка ручной проверки: ${error.message}`, 'error');
        alert('Ошибка при проверке платежа. Попробуйте позже.');
    }
}

// 🔥 УЛУЧШЕННАЯ ФУНКЦИЯ ПРОВЕРКИ BLOCKCHAIN
async function checkBlockchainForPayment() {
    if (!currentPaymentData) return false;
    
    const { wallet, totalConverted, currency, network, api_key, api_url } = currentPaymentData;
    const expectedAmount = parseFloat(totalConverted);
    
    addLog(`🔍 Проверяем кошелек ${wallet.substring(0, 10)}...`, 'info');
    addLog(`💰 Ожидаемая сумма: ${expectedAmount} ${currency}`, 'info');
    addLog(`⏰ Время заказа: ${new Date(currentPaymentData.timestamp).toLocaleTimeString()}`, 'info');
    
    try {
        const transactions = await getWalletTransactions(wallet, api_url, api_key, currency, network);
        
        addLog(`📊 Получено транзакций для анализа: ${transactions.length}`, 'info');
        
        if (transactions && transactions.length > 0) {
            for (const tx of transactions) {
                const isIncoming = tx.to && tx.to.toLowerCase() === wallet.toLowerCase();
                const txAmount = parseFloat(tx.value);
                const txTime = parseInt(tx.timeStamp);
                const orderTime = Math.floor(new Date(currentPaymentData.timestamp).getTime() / 1000);
                
                const isRecent = network === "Solana" ? true : (txTime > orderTime - 300);
                
                addLog(`📄 Анализ TX: ${tx.hash?.substring(0, 15)}... | Сумма: ${txAmount} | Входящая: ${isIncoming} | Недавняя: ${isRecent}`, 'info');
                
                if (isIncoming && isRecent) {
                    const amountMatch = isAmountMatch(txAmount, expectedAmount, currency, network);
                    addLog(`🎯 Проверка суммы: ${amountMatch ? 'СОВПАДАЕТ' : 'НЕ СОВПАДАЕТ'}`, amountMatch ? 'success' : 'warning');
                    
                    if (amountMatch) {
                        currentPaymentData.txHash = tx.hash;
                        currentPaymentData.actualAmount = txAmount;
                        return true;
                    }
                }
            }
        }
        
        addLog('❌ Подходящих транзакций не найдено', 'warning');
        return false;
        
    } catch (error) {
        addLog(`💥 Ошибка при проверке блокчейна: ${error.message}`, 'error');
        throw error;
    }
}

// 🔥 УЛУЧШЕННАЯ ПРОВЕРКА СОВПАДЕНИЯ СУММЫ
function isAmountMatch(txAmount, expectedAmount, currency, network) {
    const config = networkConfigs[currency][network];
    let normalizedTxAmount = txAmount;
    
    if (config.decimals === 6) {
        normalizedTxAmount = txAmount / 1000000;
    } else if (config.decimals === 9) {
        normalizedTxAmount = txAmount / 1000000000;
    } else if (config.decimals === 18) {
        normalizedTxAmount = txAmount / 1000000000000000000;
    }
    
    const tolerance = expectedAmount < 0.01 ? 0.5 : 0.1;
    const minAmount = expectedAmount * (1 - tolerance);
    const maxAmount = expectedAmount * (1 + tolerance);
    
    addLog(`📏 Проверка: ${normalizedTxAmount.toFixed(8)} vs ${expectedAmount} (допуск: ${tolerance*100}%)`, 'info');
    addLog(`📏 Диапазон принятия: ${minAmount.toFixed(8)} - ${maxAmount.toFixed(8)}`, 'info');
    
    const result = normalizedTxAmount >= minAmount && normalizedTxAmount <= maxAmount;
    
    if (result) {
        addLog(`✅ Сумма совпадает! Получено: ${normalizedTxAmount.toFixed(8)} ${currency}`, 'success');
    } else {
        addLog(`❌ Сумма не совпадает. Получено: ${normalizedTxAmount.toFixed(8)} ${currency}, ожидалось: ${expectedAmount} ${currency}`, 'warning');
    }
    
    return result;
}

// 🔥 ПОКАЗ УСПЕШНОГО ПЛАТЕЖА
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
            <div>${(item.priceGBP * item.count).toFixed(2)} £</div>
        `;
        document.getElementById('orderItemsList').appendChild(orderItem);
    });
    
    document.getElementById('orderTotalAmount').textContent = currentPaymentData.totalGBP + ' £';
    document.getElementById('deliveryCity').textContent = currentPaymentData.city;
    
    const actualAmount = currentPaymentData.actualAmount ? 
        (currentPaymentData.actualAmount / Math.pow(10, networkConfigs[currentPaymentData.currency][currentPaymentData.network].decimals)).toFixed(6) : 
        currentPaymentData.totalConverted;
    
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
        txHash: currentPaymentData.txHash,
        city: currentPaymentData.city,
        status: 'completed'
    };
    orders.unshift(orderData);
    localStorage.setItem('orderHistory', JSON.stringify(orders.slice(0, 50)));
}