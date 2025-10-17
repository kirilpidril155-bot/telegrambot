// 🔥 ОСНОВНЫЕ ФУНКЦИИ ПРИЛОЖЕНИЯ
function navTo(element){
    const page = element.dataset.page;
    openPage(page);
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    element.classList.add('active');
}

function openPage(id){
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
    document.getElementById('selectedCityText').textContent = 'Город: ' + city;
    document.getElementById('cartCity').textContent = 'Город доставки: ' + city;
    openPage('page-products');
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    document.querySelector('.nav-item[data-page="page-products"]').classList.add('active');
    renderCategories();
}

function goToHome(){ 
    openPage('page-home'); 
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active')); 
    document.querySelector('.nav-item[data-page="page-home"]').classList.add('active'); 
}

// 🔥 ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
document.addEventListener('DOMContentLoaded', ()=>{
    // Инициализация сетки городов
    const cityGrid = document.getElementById('cityGrid');
    cityList.forEach(c=>{
        const b = document.createElement('button');
        b.className='city-card';
        b.textContent = c;
        b.onclick = ()=>selectCity(c);
        cityGrid.appendChild(b);
    });
    
    // Инициализация Telegram Web App
    window.Telegram?.WebApp?.ready();
    refreshCartFloat();
    
    // Обновление времени в логах
    setInterval(() => {
        document.getElementById('currentTime').textContent = new Date().toLocaleTimeString();
    }, 1000);
});