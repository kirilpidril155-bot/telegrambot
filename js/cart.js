function renderCart(){
    const list = document.getElementById('cartList');
    list.innerHTML = '';
    
    if (!selectedCity || !selectedDistrict){
        document.getElementById('cartCityDistrict').textContent = 'Город и район не выбраны';
    } else {
        document.getElementById('cartCityDistrict').textContent = `Город: ${selectedCity}, Район: ${selectedDistrict}`;
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
        
        const header = document.createElement('div');
        header.className = 'cart-item-header';
        
        const img = document.createElement('img'); 
        img.className='cart-item-image'; 
        img.src = product_images[it.color] || '';
        img.onerror = function() { this.style.display = 'none'; };
        
        const meta = document.createElement('div'); 
        meta.className='cart-item-info';
        meta.innerHTML = `
            <div class="cart-item-name">${it.product}</div>
            <div class="cart-item-details">${it.color} • ${it.qty} g</div>
            <div class="cart-item-details">Цена: ${it.priceGBP} ₽</div>
        `;
        
        header.appendChild(img);
        header.appendChild(meta);
        
        const controls = document.createElement('div');
        controls.className = 'cart-item-controls';
        controls.innerHTML = `
            <div class="cart-item-price">${(it.priceGBP*it.count).toFixed(2)} ₽</div>
            <div class="cart-quantity-controls">
                <button class="step-btn" onclick="decCartItem(${idx})">−</button>
                <div class="quantity-count">${it.count}</div>
                <button class="step-btn" onclick="incCartItem(${idx})">+</button>
                <button class="step-btn" onclick="removeCartItem(${idx})">✕</button>
            </div>
        `;
        
        el.appendChild(header);
        el.appendChild(controls);
        list.appendChild(el);
    });
    
    const total = cart.reduce((s,i)=>s + i.priceGBP * i.count,0);
    document.getElementById('totalGBP').textContent = total.toFixed(2);
}