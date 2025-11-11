// 🔥 ФУНКЦИИ ДЛЯ ТОВАРОВ И КАТЕГОРИЙ
function renderCategories(){
    const container = document.getElementById('categoriesContainer');
    container.innerHTML = '';
    
    if (!selectedCity || !selectedDistrict) {
        container.innerHTML = `
            <div class="text-center text-muted" style="padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 16px;">📍</div>
                <div>Сначала выберите город и район</div>
                <button class="btn primary" onclick="goToDistricts()" style="margin-top: 16px;">
                    Выбрать район
                </button>
            </div>
        `;
        return;
    }
    
    Object.keys(submenus).forEach(prod=>{
        const cat = document.createElement('div'); 
        cat.className='category';
        
        const head = document.createElement('div'); 
        head.className='category-head';
        head.innerHTML = `
            <div class="category-title">${prod}</div>
            <div class="category-arrow">▾</div>
        `;
        
        const body = document.createElement('div'); 
        body.className='category-body';
        
        submenus[prod].forEach(color=>{
            const productDiv = document.createElement('div'); 
            productDiv.className='product-item';
            
            const productHeader = document.createElement('div');
            productHeader.className = 'product-header';
            
            const img = document.createElement('img'); 
            img.className='product-image'; 
            img.src = product_images[color] || '';
            img.onerror = function() { this.style.display = 'none'; };
            
            const meta = document.createElement('div'); 
            meta.className='product-info';
            meta.innerHTML = `
                <div class="product-name">${color}</div>
                <div class="product-description">Выберите количество и добавьте в корзину</div>
            `;
            
            productHeader.appendChild(img);
            productHeader.appendChild(meta);
            
            const sel = document.createElement('div'); 
            sel.className='selector';
            
            const priceKey = findPriceKey(color);
            let grads = priceKey ? Object.keys(custom_quantity_prices[priceKey]).map(x => parseFloat(x)).sort((a,b)=>a-b) : [1];
            let idx = 0;
            
            const quantitySelector = document.createElement('div');
            quantitySelector.className = 'quantity-selector';
            
            const minus = document.createElement('button'); 
            minus.className='step-btn'; 
            minus.textContent='−';
            
            const plus = document.createElement('button'); 
            plus.className='step-btn'; 
            plus.textContent='+';
            
            const qtyDisplay = document.createElement('div'); 
            qtyDisplay.className='qty-display'; 
            
            const priceSection = document.createElement('div');
            priceSection.className = 'price-section';
            
            const priceSpan = document.createElement('div'); 
            priceSpan.className='price-display'; 
            
            const addBtn = document.createElement('button'); 
            addBtn.className='add-btn'; 
            addBtn.innerHTML = '🛒 Добавить';
            
            function updateDisplay(){
                const q = grads[idx];
                qtyDisplay.textContent = (Number.isInteger(q) ? q : q) + ' g';
                const pKey = priceKey;
                const price = pKey ? custom_quantity_prices[pKey][q] : 0;
                priceSpan.textContent = price + ' ₽';
            }
            
            minus.onclick = (ev)=>{ ev.stopPropagation(); idx = Math.max(0, idx-1); updateDisplay(); };
            plus.onclick = (ev)=>{ ev.stopPropagation(); idx = Math.min(grads.length-1, idx+1); updateDisplay(); };
            
            addBtn.onclick = (ev)=>{
                ev.stopPropagation();
                const q = grads[idx];
                const pKey = priceKey;
                const price = pKey ? custom_quantity_prices[pKey][q] : 0;
                addToCart({product:prod, color:color, qty:q, priceGBP:price});
                const oldText = addBtn.innerHTML;
                addBtn.innerHTML = '✅ В корзине';
                addBtn.classList.add('in-cart');
                setTimeout(()=>{ addBtn.innerHTML = oldText; addBtn.classList.remove('in-cart'); }, 1500);
            };
            
            quantitySelector.appendChild(minus); 
            quantitySelector.appendChild(qtyDisplay); 
            quantitySelector.appendChild(plus);
            
            priceSection.appendChild(priceSpan);
            priceSection.appendChild(addBtn);
            
            sel.appendChild(quantitySelector);
            sel.appendChild(priceSection);
            
            productDiv.appendChild(productHeader);
            productDiv.appendChild(sel);
            body.appendChild(productDiv);
        });
        
        head.onclick = ()=>{ 
            const isExpanded = cat.classList.contains('expanded');
            document.querySelectorAll('.category').forEach(c=>c.classList.remove('expanded'));
            if (!isExpanded) {
                cat.classList.add('expanded');
            }
        };
        
        cat.appendChild(head); 
        cat.appendChild(body); 
        container.appendChild(cat);
    });
}