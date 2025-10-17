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
    "BNB": 0.0014,
    "ETH": 0.0003,
    "USDT": 1.34,
    "SOL": 0.0067,
    "USDC": 1.34
};

// 🔥 ДАННЫЕ ТОВАРОВ
const submenus = {
    "Товар 1": ["1.🍍Цвет🍍","2.🍒Цвет🍒","3.💮Цвет💮","4.🍃Цвет🍃","5.♥️Цвет♥️","6.🐘Цвет🐘","7.🍫Цвет🍫","8.🧁Цвет🧁"],
    "Товар 2": ["1.🥥Цвет🥥","2.🧊Цвет🧊","3.❄️Цвет❄️"],
    "Товар 3": ["1.💊Цвет💊","2.🍄Цвет🍄","3.👽Цвет👽"],
    "Товар 4": ["1.🌈Цвет🌈","2.🥭Цвет🥭","3.🔥Цвет🔥"],
    "Товар 5": ["1.🍏Цвет🍏","2.🍓Цвет🍓","3.🌴Цвет🌴","4.🍓Цвет🍓","5.🍋Цвет🍋","6.🍇Цвет🍇","7.💜Цвет💜"],
    "Товар 6": ["1.🍫Цвет🍫","2.🎁Цвет🎁","3.🎁🎁Цвет🎁🎁"]
};

const custom_quantity_prices = {
    "1.🍍Цвет🍍": {3.5:0.10,7:70,14:130}, "2.🍒Цвет🍒": {3.5:40,7:70,14:130},
    "3.💮Цвет💮": {3.5:40,7:70,14:130}, "4.🍃Цвет🍃": {3.5:80,7:150,14:270,28:450},
    "5.♥️Цвет♥️": {3.5:40,7:70,14:130}, "6.🐘Цвет🐘": {3.5:40,7:70,14:130},
    "7.🍫Цвет🍫": {3.5:40,7:80,14:120}, "8.🧁Цвет🧁": {1:70,2:120,3:160},
    "1.🥥Цвет🥥": {1:70,2:120,3:160}, "2.🧊Цвет🧊": {1:17,2:30,4:55,6:90},
    "3.❄️Цвет❄️": {1:25,2:45,3:60,4:80}, "1.💊Цвет💊": {1:10,2:20,3:25,6:45,12:80},
    "2.🍄Цвет🍄": {3.5:40,7:70,14:130}, "3.👽Цвет👽": {2.5:320,5:500,7.5:650},
    "1.🌈Цвет🌈": {5:30,10:55,15:100,25:170}, "2.🥭Цвет🥭": {5:30,10:55,15:100,25:170},
    "3.🔥цвет🔥": {1:35,2:60,4:100}, "🍏Цвет🍏": {5:120}, "🍓цвет🍓": {5:120},
    "🌴Цвет🌴": {5:120}, "🍓Цвет🍓": {2:80}, "🍋Цвет🍋": {2:80}, "🍇Цвет🍇": {2:80},
    "💜Цвет💜": {2:80}, "🍫Цвет🍫": {14:90}, "🎁Цвет🎁": {21:150}, "🎁🎁Цвет🎁🎁": {19:170}
};

const category_images = {
    "Товар 1":["https://i.postimg.cc/TYSLvKht/IMG-20251001-143808-938.jpg","https://i.postimg.cc/xTqJZvjh/IMG-20251001-143810-989.jpg","https://i.postimg.cc/wTPyY13G/IMG-20251001-143813-440.jpg"],
    "Товар 2":["https://i.postimg.cc/44YHLvxL/IMG-20251001-143824-749.jpg","https://i.postimg.cc/bY4DKGZ6/IMG-20251001-143827-144.jpg","https://i.postimg.cc/nVNj6sXS/IMG-20251001-143828-170.jpg"],
    "Товар 3":["https://i.postimg.cc/DfRJtWSx/IMG-20251001-143830-106.jpg","https://i.postimg.cc/Y2TGJ4vy/IMG-20251001-143832-634.jpg","https://i.postimg.cc/c1PgVKKZ/IMG-20251001-143834-526.jpg"],
    "Товар 4":["https://i.postimg.cc/KvLkFZLy/IMG-20251001-143835-844.jpg","https://i.postimg.cc/8PWJD1WS/IMG-20251001-143837-819.jpg","https://i.postimg.cc/9XsRv44X/IMG-20251001-143840-097.jpg"],
    "Товар 5":["https://i.postimg.cc/7YqXJQVD/IMG-20251001-133953-876.jpg","https://i.postimg.cc/T3w9CLFk/IMG-20251001-133909-190.jpg"],
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