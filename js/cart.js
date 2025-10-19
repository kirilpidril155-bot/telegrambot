// 🔥 ФУНКЦИИ КОРЗИНЫ
function addToCart(item){
    const idx = cart.findIndex(it => it.product===item.product && it.color===item.color && it.qty===item.qty && it.priceGBP===item.priceGBP);
    if (idx>=0){ cart[idx].count += 1; } else { item.count = 1; cart.push(item); }
    refreshCartFloat();
}

function refreshCartFloat(){
    const count = cart.reduce((s,i)=>s+i.count,0);
    const sum = cart.reduce((s,i)=>s + i.priceGBP * i.count,0);
    document.getElementById('cartCount').textContent = count;
    document.getElementById('cartSum').textContent = sum.toFixed(2) + ' ₽';
    const cf = document.getElementById('cartFloat');
    const isCartPage = document.getElementById('page-cart').classList.contains('active');
    cf.classList.toggle('hidden', count===0 || isCartPage);
}

function renderCart(){
    const list = document.getElementById('cartList');
    list.innerHTML = '';
    if (!selectedCity){
        document.getElementById('cartCity').textContent = 'Город доставки: —';
    } else {
        document.getElementById('cartCity').textContent = 'Город доставки: ' + selectedCity;
    }
    if (cart.length===0) { 
        list.innerHTML = '<div class="text-center text-muted" style="padding: 40px;">Корзина пуста</div>'; 
        document.getElementById('totalGBP').textContent = '0.00'; 
        document.getElementById('totalConverted').textContent = ''; 
        return; 
    }
    cart.forEach((it, idx)=>{
        const el = document.createElement('div'); 
        el.className='cart-item';
        
        const img = document.createElement('img'); 
        img.className='cart-item-image'; 
        img.src = (category_images[it.product] && category_images[it.product][0]) || '';
        img.onerror = function() { this.style.display = 'none'; };
        
        const meta = document.createElement('div'); 
        meta.className='cart-item-info';
        meta.innerHTML = `
            <div class="cart-item-name">${it.product}</div>
            <div class="cart-item-details">${it.color} • ${it.qty} g</div>
            <div class="cart-item-details">Цена: ${it.priceGBP} ₽ • Кол-во: ${it.count}</div>
        `;
        
        const controls = document.createElement('div');
        controls.className = 'cart-item-controls';
        controls.innerHTML = `
            <div style="text-align:right;font-weight:800;font-size:18px;margin-bottom:8px;">${(it.priceGBP*it.count).toFixed(2)} ₽</div>
            <div style="display:flex;gap:6px;align-items:center;justify-content:flex-end">
                <button class="step-btn" onclick="decCartItem(${idx})">−</button>
                <div style="min-width:24px;text-align:center;font-weight:700;">${it.count}</div>
                <button class="step-btn" onclick="incCartItem(${idx})">+</button>
                <button class="step-btn" style="background:var(--danger)" onclick="removeCartItem(${idx})">✕</button>
            </div>
        `;
        
        el.appendChild(img); 
        el.appendChild(meta); 
        el.appendChild(controls);
        list.appendChild(el);
    });
    const total = cart.reduce((s,i)=>s + i.priceGBP * i.count,0);
    document.getElementById('totalGBP').textContent = total.toFixed(2);
}

function incCartItem(i){ cart[i].count += 1; renderCart(); refreshCartFloat(); }
function decCartItem(i){ cart[i].count = Math.max(1, cart[i].count - 1); renderCart(); refreshCartFloat(); }
function removeCartItem(i){ cart.splice(i,1); renderCart(); refreshCartFloat(); }
function clearCart(){ cart = []; renderCart(); refreshCartFloat(); }