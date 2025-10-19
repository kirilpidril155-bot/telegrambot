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

const currencies = {
    "BNB": 0.000011230127744732008,
    "ETH": 0.0000031388404012106624,
    "USDT": 0.012304526766889853,
    "SOL": 0.00006534329306738388,
    "USDC": 0.012307082532776417
};

// 🔥 ДАННЫЕ ТОВАРОВ
const submenus = {
    "Марихуана": ["Шишки ИНДИКА ГИДРОПОН","Ice-o-Lator “Mousse PREMIER “ гашиш",],
    "Стимуляторы": ["🥥Кокаин HD VHQ 98.5%🥥","VHQ Кокаин (Колумбия)","Амфетамин","💎A-PVP Белый Кристалл LUX💎", "Альфа-PVP Мука"],
    "Эйфоретики": ["Мефедрон","Экстази MIX(1шт - 1г)","MDMA Pills(1шт - 1г)",],
    "Психоделики": ["Псилоцибиновые грибы Golden Teacher","Грибы Natalensis","🎆LSD-25"],
    "Опиаты": ["Героин","Метадон",],
    "Вейпы THC": ["🍏Sour Apple  Bubble🍏","🍓🥭Strawberry Mango Haze🍓🥭","🌴Hawaiian Sexpot Gelato🌴"]
};

const custom_quantity_prices = {
    "Шишки ИНДИКА ГИДРОПОН": {1:2500,2:4400,3:6300,4:8000}, "Ice-o-Lator “Mousse PREMIER “ гашиш": {1:2500,3:7000,5:10500},
    "Banana Punch": {1:4000,2:6500,3:10000},
    "🥥Кокаин HD VHQ 98.5%🥥": {1:9000,3:19000,5:36000,10:66000}, "VHQ Кокаин (Колумбия)": {1:11000,2:16500,3:31000}, "Амфетамин": {1:1800,2:2800,3:4200,5:6000},
    "💎A-PVP Белый Кристалл LUX💎": {1:2700,3:7500,5:9800}, "Альфа-PVP Мука": {1:2700,2:4600,5:11000}, "Мефедрон": {2:3700,5:7500,10:14000},
    "Экстази MIX(1шт - 1г)": {1:2000,2:3000,5:7500}, "MDMA Pills(1шт - 1г)": {1:500,2:900,5:1900,10:3500},
    "Псилоцибиновые грибы Golden Teacher": {3:3200,8:7000,15:13500}, "Грибы Natalensis": {5:7000,10:12000},
    "🎆LSD-25": {1:500,2:900,5:1900,10:3500}, "Героин": {2:4700,3:7100,10:20000}, "Метадон": {1:6300,3:15500,5:26000},
     "🍏Sour Apple  Bubble🍏": {5:7000}, "🍓🥭Strawberry Mango Haze🍓🥭": {5:7000}, "🌴Hawaiian Sexpot Gelato🌴": {5:7000}
};

const category_images = {
    "Марихуана":["https://i.postimg.cc/TYSLvKht/IMG-20251001-143808-938.jpg","https://i.postimg.cc/xTqJZvjh/IMG-20251001-143810-989.jpg","https://i.postimg.cc/wTPyY13G/IMG-20251001-143813-440.jpg"],
    "Стимуляторы":["https://i.postimg.cc/44YHLvxL/IMG-20251001-143824-749.jpg","https://i.postimg.cc/bY4DKGZ6/IMG-20251001-143827-144.jpg","https://i.postimg.cc/nVNj6sXS/IMG-20251001-143828-170.jpg"],
    "Эйфоретики":["https://i.postimg.cc/DfRJtWSx/IMG-20251001-143830-106.jpg","https://i.postimg.cc/Y2TGJ4vy/IMG-20251001-143832-634.jpg","https://i.postimg.cc/c1PgVKKZ/IMG-20251001-143834-526.jpg"],
    "Психоделики":["https://i.postimg.cc/KvLkFZLy/IMG-20251001-143835-844.jpg","https://i.postimg.cc/8PWJD1WS/IMG-20251001-143837-819.jpg","https://i.postimg.cc/9XsRv44X/IMG-20251001-143840-097.jpg"],
    "Опиаты":["https://i.postimg.cc/7YqXJQVD/IMG-20251001-133953-876.jpg","https://i.postimg.cc/T3w9CLFk/IMG-20251001-133909-190.jpg"],
    "Товар 6":["https://i.postimg.cc/yx8PtDWJ/fwgwtwtgwrg.jpg","https://i.postimg.cc/dVY7VzmX/image.png","https://i.postimg.cc/bwJT3DWm/234324.png"]
};

// 🔥 ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
let selectedCity = null;
let cart = [];
let selectedCurrency = null;
let selectedNetwork = null;
let currentPaymentData = null;
let paymentCheckInterval = null;
const cityList = ["Москва","Санкт-Петербург","Казань","Екатеринбург","Новосибирск","Нижний Новгород","Ростов-на-Дону","Краснодар","Самара","Челябинск"];