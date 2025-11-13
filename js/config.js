// 🔥 КОНФИГУРАЦИЯ
const networkConfigs = {
    "BNB": {
        "Ethereum": { 
            address: "0xF879a1050307C2E7272CF57A9a6AF6088A307d4B", 
            chainId: "0x1", 
            decimals: 18, 
            type: "erc20",
            token_address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
            api_key: "rbCygNlrhGHmZ0DlSfpYO",
            api_url: "https://eth-mainnet.g.alchemy.com/v2"
        }
    },
    "ETH": {
        "Ethereum": { 
            address: "0xF879a1050307C2E7272CF57A9a6AF6088A307d4B", 
            chainId: "0x1", 
            decimals: 18, 
            type: "native",
            api_key: "rbCygNlrhGHmZ0DlSfpYO",
            api_url: "https://eth-mainnet.g.alchemy.com/v2"
        }
    },
    "USDT": {
        "Ethereum": { 
            address: "0xF879a1050307C2E7272CF57A9a6AF6088A307d4B", 
            chainId: "0x1", 
            decimals: 6, 
            type: "erc20",
            token_address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            api_key: "rbCygNlrhGHmZ0DlSfpYO",
            api_url: "https://eth-mainnet.g.alchemy.com/v2"
        }
    },
    "SOL": {
        "Solana": { 
            address: "9JfQ2UhDnBXkGSMceVjWEjAnfkGXFjQMkGmRkwZkBKK8", 
            chainId: "mainnet-beta", 
            decimals: 9, 
            type: "native",
            api_key: "iaEYav-wlviLtW7DjH_lV",
            api_url: "https://solana-mainnet.g.alchemy.com/v2"
        }
    },
    "USDC": {
        "Ethereum": { 
            address: "0xF879a1050307C2E7272CF57A9a6AF6088A307d4B", 
            chainId: "0x1", 
            decimals: 6, 
            type: "erc20",
            token_address: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            api_key: "rbCygNlrhGHmZ0DlSfpYO",
            api_url: "https://eth-mainnet.g.alchemy.com/v2"
        }
    }
};

// 🔥 АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ КУРСОВ
let currencies = {
    "BNB": 0.000011230127744732008,
    "ETH": 0.0000031388404012106624,
    "USDT": 0.012304526766889853,
    "SOL": 0.00006534329306738388,
    "USDC": 0.012307082532776417
};

// 🔥 ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ КУРСОВ
async function updateExchangeRates() {
    try {
        console.log('🔄 Обновляем курсы криптовалют...');
        
        // Используем CoinGecko API для получения актуальных курсов
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,tether,solana,usd-coin&vs_currencies=rub');
        
        if (!response.ok) {
            throw new Error('Ошибка при получении курсов');
        }
        
        const data = await response.json();
        
        // Обновляем курсы (переводим из RUB в GBP)
        const gbpToRub = 1; // Если цены уже в рублях
        
        if (data.ethereum) {
            currencies.ETH = gbpToRub / data.ethereum.rub;
        }
        if (data.binancecoin) {
            currencies.BNB = gbpToRub / data.binancecoin.rub;
        }
        if (data.tether) {
            currencies.USDT = gbpToRub / data.tether.rub;
        }
        if (data.solana) {
            currencies.SOL = gbpToRub / data.solana.rub;
        }
        if (data['usd-coin']) {
            currencies.USDC = gbpToRub / data['usd-coin'].rub;
        }
        
        console.log('✅ Курсы обновлены:', currencies);
        
        // Сохраняем время последнего обновления
        localStorage.setItem('lastRateUpdate', Date.now());
        localStorage.setItem('exchangeRates', JSON.stringify(currencies));
        
        // Обновляем интерфейс если открыта страница оплаты
        if (document.getElementById('payModal').style.display === 'block') {
            updatePaymentSummary();
        }
        
    } catch (error) {
        console.error('❌ Ошибка обновления курсов:', error);
        // Используем сохраненные курсы как fallback
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
    
    // Обновляем курсы если прошло больше 5 минут или нет сохраненных данных
    if (!lastUpdate || (now - lastUpdate) > 5 * 60 * 1000) {
        updateExchangeRates();
    } else {
        // Используем сохраненные курсы
        const savedRates = localStorage.getItem('exchangeRates');
        if (savedRates) {
            currencies = JSON.parse(savedRates);
            console.log('📊 Используем сохраненные курсы:', currencies);
        }
    }
    
    // Обновляем курсы каждые 5 минут
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
    "Краснодар": ["Западный", "Карасунский", "Прикубанский", "Центральный"],
    "Самара": ["Железнодорожный", "Кировский", "Красноглинский", "Куйбышевский", "Ленинский", "Октябрьский", "Промышленный", "Советский"],
    "Челябинск": ["Калининский", "Курчатовский", "Ленинский", "Металлургический", "Советский", "Тракторозаводский", "Центральный"]
};

// 🔥 ДАННЫЕ ТОВАРОВ
const submenus = {
    "Марихуана": ["🥦Шишки ИНДИКА ГИДРОПОН🥦","🍫Ice-o-Lator “Mousse PREMIER “ гашиш🍫","🍌Banana Punch🍌",],
    "Стимуляторы": ["🥥Кокаин HD VHQ 98.5%🥥","🥥VHQ Кокаин (Колумбия)🥥","❄️Амфетамин❄️","💎A-PVP Белый Кристалл LUX💎", "🧂Альфа-PVP Мука🧂"],
    "Эйфоретики": ["🔥Мефедрон🔥","💊Экстази MIX(1шт - 1г)💊","💊MDMA Pills(1шт - 1г)💊",],
    "Психоделики": ["🍄Псилоцибиновые грибы Golden Teacher🍄","🍄Грибы Natalensis🍄","🎆LSD-25🎆"],
    "Опиаты": ["💉Героин💉","💉Метадон💉",],
    "Вейпы THC": ["🍎Sour Apple  Bubble🍎","🥭🍓Strawberry Mango Haze🥭🍓","🌴Hawaiian Sexpot Gelato🌴"]
};

const custom_quantity_prices = {
    "🥦Шишки ИНДИКА ГИДРОПОН🥦": {1:2500,2:4400,3:6300,4:8000}, "🍫Ice-o-Lator “Mousse PREMIER “ гашиш🍫": {1:2500,3:7000,5:10500},
    "🍌Banana Punch🍌": {1:4000,2:6500,3:10000},
    "🥥Кокаин HD VHQ 98.5%🥥": {1:9000,3:19000,5:36000,10:66000}, "🥥VHQ Кокаин (Колумбия)🥥": {1:11000,2:16500,3:31000}, "❄️Амфетамин❄️": {1:1800,2:2800,3:4200,5:6000},
    "💎A-PVP Белый Кристалл LUX💎": {1:2700,3:7500,5:9800}, "🧂Альфа-PVP Мука🧂": {1:2700,2:4600,5:11000}, "🔥Мефедрон🔥": {2:3700,5:7500,10:14000},
    "💊Экстази MIX(1шт - 1г)💊": {1:2000,2:3000,5:7500}, "💊MDMA Pills(1шт - 1г)💊": {1:500,2:900,5:1900,10:3500},
    "🍄Псилоцибиновые грибы Golden Teacher🍄": {3:3200,8:7000,15:13500}, "🍄Грибы Natalensis🍄": {5:7000,10:12000},
    "🎆LSD-25🎆": {1:500,2:900,5:1900,10:3500}, "💉Героин💉": {2:4700,3:7100,10:20000}, "💉Метадон💉": {1:6300,3:15500,5:26000},
     "🍎Sour Apple  Bubble🍎": {5:7000}, "🥭🍓Strawberry Mango Haze🥭🍓": {5:7000}, "🌴Hawaiian Sexpot Gelato🌴": {5:7000}
};

const product_images = {
    "🥦Шишки ИНДИКА ГИДРОПОН🥦": "https://i.postimg.cc/Hk8GxPQT/1.webp",
    "🍫Ice-o-Lator “Mousse PREMIER “ гашиш🍫": "https://i.postimg.cc/KcdJnBp1/Dark-Maroccian-hash.jpg", 
    "🍌Banana Punch🍌": "https://i.postimg.cc/ncbyS1mR/4.jpg",
    "🥥Кокаин HD VHQ 98.5%🥥": "https://i.postimg.cc/SNfvTbkM/3.jpg",
    "🥥VHQ Кокаин (Колумбия)🥥": "https://i.postimg.cc/YqzsnBMC/11.webp",
    "❄️Амфетамин❄️": "https://i.postimg.cc/5NVrS2d4/5.jpg",
    "💎A-PVP Белый Кристалл LUX💎": "https://i.postimg.cc/Wbvyw1LV/7.webp",
    "🧂Альфа-PVP Мука🧂": "https://i.postimg.cc/VL8hWkQk/8.jpg",
    "🔥Мефедрон🔥": "https://i.postimg.cc/hPBY1tW4/6.jpg",
    "💊Экстази MIX(1шт - 1г)💊": "https://i.postimg.cc/8PSYmzQj/12.webp",
    "💊MDMA Pills(1шт - 1г)💊": "https://i.postimg.cc/ZKSQx5tB/13.jpg",
    "🍄Псилоцибиновые грибы Golden Teacher🍄": "https://i.postimg.cc/HsgN9kDn/9.webp",
    "🍄Грибы Natalensis🍄": "https://i.postimg.cc/wTprQj8v/10.webp",
    "🎆LSD-25🎆": "https://i.postimg.cc/MKSLmp2n/14.webp",
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