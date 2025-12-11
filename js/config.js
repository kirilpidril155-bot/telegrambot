// 🔥 КОНФИГУРАЦИЯ
const networkConfigs = {
    "BNB": {
        "Ethereum": { 
            address: "0xd699bD1dDED8fc07C71cA3E8d14FB619877D6f46", 
            chainId: "0x1", 
            decimals: 18, 
            type: "erc20",
            token_address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
            api_key: "aVi4_WTrobYoB_Nk-iRqB",
            api_url: "https://eth-mainnet.g.alchemy.com/v2"
        }
    },
    "ETH": {
        "Ethereum": { 
            address: "0xd699bD1dDED8fc07C71cA3E8d14FB619877D6f46", 
            chainId: "0x1", 
            decimals: 18, 
            type: "native",
            api_key: "aVi4_WTrobYoB_Nk-iRqB",
            api_url: "https://eth-mainnet.g.alchemy.com/v2"
        }
    },
    "USDT": {
        "Ethereum": { 
            address: "0xd699bD1dDED8fc07C71cA3E8d14FB619877D6f46", 
            chainId: "0x1", 
            decimals: 6, 
            type: "erc20",
            token_address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            api_key: "aVi4_WTrobYoB_Nk-iRqB",
            api_url: "https://eth-mainnet.g.alchemy.com/v2"
        },
        "BNB": { 
            address: "0xd699bD1dDED8fc07C71cA3E8d14FB619877D6f46", 
            chainId: "0x38", 
            decimals: 18, 
            type: "bep20",
            token_address: "0x55d398326f99059fF775485246999027B3197955",
            api_key: "aVi4_WTrobYoB_Nk-iRqB",
            api_url: "https://eth-mainnet.g.alchemy.com/v2"
        },
        "Solana": { 
            address: "4cm2juwWBYMeojpAusSc23gVinQtRqECiowTxnqq46zg", 
            chainId: "mainnet-beta", 
            decimals: 6, 
            type: "spl",
            token_address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
            api_key: "15288533-b225-49f2-8113-f8709f69fc37",
            api_url: "https://solana-mainnet.g.alchemy.com/v2"
        },
        "TRON": { 
            address: "TE38XYV24FfCiFQGGS2ydT2MaCUpoUYEnK", 
            chainId: "tron", 
            decimals: 6, 
            type: "trc20",
            token_address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
            api_key: "b1dec944-c5d9-4271-b35b-53dd07fe3441",
            api_url: "https://api.trongrid.io"
        }
    },
    "USDC": {
        "Ethereum": { 
            address: "0xd699bD1dDED8fc07C71cA3E8d14FB619877D6f46", 
            chainId: "0x1", 
            decimals: 6, 
            type: "erc20",
            token_address: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            api_key: "aVi4_WTrobYoB_Nk-iRqB",
            api_url: "https://eth-mainnet.g.alchemy.com/v2"
        },
        "BNB": { 
            address: "0xd699bD1dDED8fc07C71cA3E8d14FB619877D6f46", 
            chainId: "0x38", 
            decimals: 18, 
            type: "bep20",
            token_address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
            api_key: "aVi4_WTrobYoB_Nk-iRqB",
            api_url: "https://eth-mainnet.g.alchemy.com/v2"
        },
        "Solana": { 
            address: "4cm2juwWBYMeojpAusSc23gVinQtRqECiowTxnqq46zg", 
            chainId: "mainnet-beta", 
            decimals: 6, 
            type: "spl",
            token_address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            api_key: "15288533-b225-49f2-8113-f8709f69fc37",
            api_url: "https://solana-mainnet.g.alchemy.com/v2"
        }
    },
    "SOL": {
        "Solana": { 
            address: "4cm2juwWBYMeojpAusSc23gVinQtRqECiowTxnqq46zg", 
            chainId: "mainnet-beta", 
            decimals: 9, 
            type: "native",
            api_key: "15288533-b225-49f2-8113-f8709f69fc37",
            api_url: "https://solana-mainnet.g.alchemy.com/v2"
        }
    },
    "BTC": {
        "Bitcoin": { 
            address: "bc1qppqgf82wquwexqmd3vdcavzvc4a6q5f86uuz0y", 
            chainId: "main", 
            decimals: 8, 
            type: "native",
            api_key: "6a5ef465160041f2b04d0544741736b2",
            api_url: "https://blockstream.info/api"
        }
    },
    "LTC": {
        "Litecoin": { 
            address: "ltc1ql9s6gm4gm66v00e9fu8g4ufzhychku7m0zeqw7", 
            chainId: "main", 
            decimals: 8, 
            type: "native",
            api_key: "6a5ef465160041f2b04d0544741736b2",
            api_url: "https://blockchair.com/litecoin"
        }
    }
};

// 🔥 ФЛАГ ОТЛАДКИ - ВСЕГДА ОШИБКА ПЛАТЕЖА
const DEBUG_ALWAYS_FAIL = true;
const DEBUG_FAIL_MINUTES_MIN = 2;
const DEBUG_FAIL_MINUTES_MAX = 10;

// 🔥 АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ КУРСОВ
let currencies = {
    "BNB": 0.000011230127744732008,
    "ETH": 0.0000031388404012106624,
    "USDT": 0.012304526766889853,
    "SOL": 0.00006534329306738388,
    "USDC": 0.012307082532776417,
    "BTC": 0.0000001,
    "LTC": 0.00001
};

// 🔥 ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ КУРСОВ
async function updateExchangeRates() {
    try {
        console.log('🔄 Обновляем курсы криптовалют...');
        
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,tether,solana,usd-coin,litecoin&vs_currencies=rub');
        
        if (!response.ok) {
            throw new Error('Ошибка при получении курсов');
        }
        
        const data = await response.json();
        
        if (data.ethereum) {
            currencies.ETH = 1 / data.ethereum.rub;
        }
        if (data.binancecoin) {
            currencies.BNB = 1 / data.binancecoin.rub;
        }
        if (data.tether) {
            currencies.USDT = 1 / data.tether.rub;
        }
        if (data.solana) {
            currencies.SOL = 1 / data.solana.rub;
        }
        if (data['usd-coin']) {
            currencies.USDC = 1 / data['usd-coin'].rub;
        }
        if (data.bitcoin) {
            currencies.BTC = 1 / data.bitcoin.rub;
        }
        if (data.litecoin) {
            currencies.LTC = 1 / data.litecoin.rub;
        }
        
        console.log('✅ Курсы обновлены:', currencies);
        
        localStorage.setItem('lastRateUpdate', Date.now());
        localStorage.setItem('exchangeRates', JSON.stringify(currencies));
        
        if (document.getElementById('payModal').style.display === 'block') {
            updatePaymentSummary();
        }
        
    } catch (error) {
        console.error('⚠️ Ошибка обновления курсов:', error);
        const savedRates = localStorage.getItem('exchangeRates');
        if (savedRates) {
            currencies = JSON.parse(savedRates);
        }
    }
}

// 🔥 ПРОВЕРКА И ОБНОВЛЕНИЕ КУРСОВ ПРИ ЗАГРУЗКЕ
function initializeExchangeRates() {
    const lastUpdate = localStorage.getItem('lastRateUpdate');
    const now = Date.now();
    
    if (!lastUpdate || (now - lastUpdate) > 5 * 60 * 1000) {
        updateExchangeRates();
    } else {
        const savedRates = localStorage.getItem('exchangeRates');
        if (savedRates) {
            currencies = JSON.parse(savedRates);
            console.log('📊 Используем сохраненные курсы:', currencies);
        }
    }
    
    setInterval(updateExchangeRates, 5 * 60 * 1000);
}

// 🔥 ДАННЫЕ ГОРОДОВ И РАЙОНОВ
const cityDistricts = {
    "Москва": ["Центральный", "Северный", "Южный", "Восточный", "Западный", "Северо-Восточный", "Юго-Восточный", "Юго-Западный", "Северо-Западный", "Зеленоградский"],
    "Санкт-Петербург": ["Адмиралтейский", "Василеостровский", "Выборгский", "Калининский", "Кировский", "Колпинский", "Красногвардейский", "Красносельский", "Кронштадтский", "Курортный", "Московский", "Невский", "Петроградский", "Петродворцовый", "Приморский", "Пушкинский", "Фрунзенский", "Центральный"],
    "Казань": ["Авиастроительный", "Вахитовский", "Кировский", "Московский", "Ново-Савиновский", "Приволжский", "Советский"],
    "Екатеринбург": ["Верх-Исетский", "Железнодорожный", "Кировский", "Ленинский", "Октябрьский", "Орджоникидзевский", "Чкаловский"],
    "Новосибирск": ["Дзержинский", "Железнодорожный", "Заельцовский", "Калининский", "Кировский", "Ленинский", "Октябрьский", "Первомайский", "Советский", "Центральный"],
    "Нижний Новгород": ["Автозаводский", "Канавинский", "Ленинский", "Московский", "Нижегородский", "Приокский", "Советский", "Сормовский"],
    "Ростов-на-Дону": ["Ворошиловский", "Железнодорожный", "Кировский", "Ленинский", "Октябрьский", "Первомайский", "Пролетарский", "Советский"],
    "Краснодар": ["Западный", "Карасунский", "Прикубанный", "Центральный"],
    "Самара": ["Железнодорожный", "Кировский", "Красноглинский", "Куйбышевский", "Ленинский", "Октябрьский", "Промышленный", "Советский"],
    "Челябинск": ["Калининский", "Курчатовский", "Ленинский", "Металлургический", "Советский", "Тракторозаводский", "Центральный"]
};

// 🔥 ДАННЫЕ ТОВАРОВ
const submenus = {
    "Марихуана": ["🥦Шишки ИНДИКА ГИДРОПОН🥦","🍫Ice-o-Lator “Mousse PREMIER “ гашиш🍫","🍌Banana Punch🍌",],
    "Стимуляторы": ["🥥Кокаин HD VHQ 98.5%🥥","🥥VHQ Кокаин (Колумбия)🥥","⚡️Амфетамин⚡️","🔮A-PVP Белый Кристалл LUX🔮", "💧Альфа-PVP Мука💧"],
    "Эйфоретики": ["🌀Мефедрон🌀","🌈Экстази MIX(1шт - 1г)🌈","💊MDMA Pills(1шт - 1г)💊",],
    "Психоделики": ["🍄‍🟫Псилоцибиновые грибы Golden Teacher🍄‍🟫","🍄Грибы Natalensis🍄","🌈LSD-25🌈"],
    "Опиаты": ["💉Героин💉","💉Метадон💉",],
    "Вейпы THC": ["🍎Sour Apple  Bubble🍎","🥭🍓Strawberry Mango Haze🥭🍓","🌴Hawaiian Sexpot Gelato🌴"]
};

const custom_quantity_prices = {
    "🥦Шишки ИНДИКА ГИДРОПОН🥦": {1:2500,2:4400,3:6300,4:8000}, "🍫Ice-o-Lator “Mousse PREMIER “ гашиш🍫": {1:2500,3:7000,5:10500},
    "🍌Banana Punch🍌": {1:4000,2:6500,3:10000},
    "🥥Кокаин HD VHQ 98.5%🥥": {1:9000,3:19000,5:36000,10:66000}, "🥥VHQ Кокаин (Колумбия)🥥": {1:11000,2:16500,3:31000}, "⚡️Амфетамин⚡️": {1:1800,2:2800,3:4200,5:6000},
    "🔮A-PVP Белый Кристалл LUX🔮": {1:2700,3:7500,5:9800}, "💧Альфа-PVP Мука💧": {1:2700,2:4600,5:11000}, "🌀Мефедрон🌀": {2:3700,5:7500,10:14000},
    "🌈Экстази MIX(1шт - 1г)🌈": {1:2000,2:3000,5:7500}, "💊MDMA Pills(1шт - 1г)💊": {1:500,2:900,5:1900,10:3500},
    "🍄‍🟫Псилоцибиновые грибы Golden Teacher🍄‍🟫": {3:3200,8:7000,15:13500}, "🍄Грибы Natalensis🍄": {5:7000,10:12000},
    "🌈LSD-25🌈": {1:500,2:900,5:1900,10:3500}, "💉Героин💉": {2:4700,3:7100,10:20000}, "💉Метадон💉": {1:6300,3:15500,5:26000},
     "🍎Sour Apple  Bubble🍎": {5:7000}, "🥭🍓Strawberry Mango Haze🥭🍓": {5:7000}, "🌴Hawaiian Sexpot Gelato🌴": {5:7000}
};

const product_images = {
    "🥦Шишки ИНДИКА ГИДРОПОН🥦": "https://i.postimg.cc/Hk8GxPQT/1.webp",
    "🍫Ice-o-Lator “Mousse PREMIER “ гашиш🍫": "https://i.postimg.cc/KcdJnBp1/Dark-Maroccian-hash.jpg", 
    "🍌Banana Punch🍌": "https://i.postimg.cc/ncbyS1mR/4.jpg",
    "🥥Кокаин HD VHQ 98.5%🥥": "https://i.postimg.cc/SNfvTbkM/3.jpg",
    "🥥VHQ Кокаин (Колумбия)🥥": "https://i.postimg.cc/YqzsnBMC/11.webp",
    "⚡️Амфетамин⚡️": "https://i.postimg.cc/5NVrS2d4/5.jpg",
    "🔮A-PVP Белый Кристалл LUX🔮": "https://i.postimg.cc/Wbvyw1LV/7.webp",
    "💧Альфа-PVP Мука💧": "https://i.postimg.cc/VL8hWkQk/8.jpg",
    "🌀Мефедрон🌀": "https://i.postimg.cc/hPBY1tW4/6.jpg",
    "🌈Экстази MIX(1шт - 1г)🌈": "https://i.postimg.cc/8PSYmzQj/12.webp",
    "💊MDMA Pills(1шт - 1г)💊": "https://i.postimg.cc/ZKSQx5tB/13.jpg",
    "🍄‍🟫Псилоцибиновые грибы Golden Teacher🍄‍🟫": "https://i.postimg.cc/HsgN9kDn/9.webp",
    "🍄Грибы Natalensis🍄": "https://i.postimg.cc/wTprQj8v/10.webp",
    "🌈LSD-25🌈": "https://i.postimg.cc/MKSLmp2n/14.webp",
    "💉Героин💉": "https://i.postimg.cc/65fmjxtR/15.webp",
    "💉Метадон💉": "https://i.postimg.cc/J4526CMh/16.webp",
    "🍎Sour Apple  Bubble🍎": "https://i.postimg.cc/K8rxDHHG/applebuble.png",
    "🥭🍓Strawberry Mango Haze🥭🍓": "https://i.postimg.cc/JzcM5221/mangohaze.png",
    "🌴Hawaiian Sexpot Gelato🌴": "https://i.postimg.cc/fRjDfrrQ/sexpot.png",
};

// 🔥 ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
let selectedCity = null;
let selectedDistrict = null;
let cart = [];
let selectedCurrency = null;
let selectedNetwork = null;
let currentPaymentData = null;
let paymentCheckInterval = null;
const cityList = ["Москва","Санкт-Петербург","Казань","Екатеринбург","Новосибирск","Нижний Новгород","Ростов-на-Дону","Краснодар","Самара","Челябинск"];