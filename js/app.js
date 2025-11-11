// 🔥 ОСНОВНЫЕ ФУНКЦИИ ПРИЛОЖЕНИЯ
function navTo(element){
    const page = element.dataset.page;
    openPage(page);
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    element.classList.add('active');
}

function openPage(id){
    // 🔥 ФИКС СКРОЛЛА - всегда скроллим наверх при смене страницы
    window.scrollTo(0, 0);
    
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const cartFloat = document.getElementById('cartFloat');
    if (id === 'page-cart') {
        cartFloat.classList.add('hidden');
    } else if (cart.length > 0 && id !== 'page-payment-check' && id !== 'page-payment-success') {
        cartFloat.classList.remove('hidden');
    }
    if (id==='page-products') renderCategories();
    if (id==='page-cart') renderCart();
}

function selectCity(city){
    selectedCity = city;
    document.getElementById('selectedCityDistricts').textContent = city;
    openPage('page-districts');
    renderDistricts(city);
}

function selectDistrict(district){
    selectedDistrict = district;
    document.getElementById('selectedCityText').textContent = selectedCity;
    document.getElementById('selectedDistrictText').textContent = district;
    document.getElementById('cartCityDistrict').textContent = `Город: ${selectedCity}, Район: ${district}`;
    openPage('page-products');
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    document.querySelector('.nav-item[data-page="page-products"]').classList.add('active');
    renderCategories();
}

function renderDistricts(city){
    const districtsGrid = document.getElementById('districtsGrid');
    districtsGrid.innerHTML = '';
    
    const cityDistricts = districts[city] || [];
    cityDistricts.forEach(district => {
        const b = document.createElement('button');
        b.className = 'district-card';
        b.textContent = district;
        b.onclick = () => selectDistrict(district);
        districtsGrid.appendChild(b);
    });
}

function goToHome(){ 
    selectedCity = null;
    selectedDistrict = null;
    openPage('page-home'); 
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active')); 
    document.querySelector('.nav-item[data-page="page-home"]').classList.add('active'); 
}

function goToDistricts(){ 
    openPage('page-districts'); 
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active')); 
}

// 🔥 ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
document.addEventListener('DOMContentLoaded', ()=>{
    // Инициализация сетки городов
    const cityGrid = document.getElementById('cityGrid');
    cityGrid.innerHTML = '';
    
    cityList.forEach(city => {
        const button = document.createElement('button');
        button.className = 'city-card';
        button.textContent = city;
        button.onclick = () => selectCity(city);
        cityGrid.appendChild(button);
    });
    
    // 🔥 ЗАПУСКАЕМ АВТООБНОВЛЕНИЕ КУРСОВ
    startAutoExchangeUpdates();
    
    // 🔥 ФИКС - скроллим наверх при загрузке
    window.scrollTo(0, 0);
    
    // Инициализация Telegram Web App
    window.Telegram?.WebApp?.ready();
    refreshCartFloat();
    
    // Обновление времени в логах
    setInterval(() => {
        document.getElementById('currentTime').textContent = new Date().toLocaleTimeString();
    }, 1000);
});