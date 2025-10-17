// 🔥 ФУНКЦИИ ДЛЯ ТОВАРОВ И КАТЕГОРИЙ
function selectCity(city){
    selectedCity = city;
    document.getElementById('selectedCityText').textContent = city;
    document.getElementById('cartCity').textContent = 'Город доставки: ' + city;
    openPage('page-products');
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    document.querySelector('.nav-item[data-page="page-products"]').classList.add('active');
    renderCategories();
}

function renderCategories(){
    const container = document.getElementById('categoriesContainer');
    container.innerHTML = '';
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
            const row = document.createElement('div'); 
            row.className='product-item';
            
            const img = document.createElement('img'); 
            img.className='product-image'; 
            img.src = (category_images[prod] && category_images[prod][0]) || '';
            img.onerror = function() { this.style.display = 'none'; };
            
            const meta = document.createElement('div'); 
            meta.className='product-info';
            meta.innerHTML = `
                <div class="product-name">${color}</div>
                <div class="product-description">Выберите количество и добавьте в корзину</div>
            `;
            
            const sel = document.createElement('div'); 
            sel.className='selector';
            
            const priceKey = findPriceKey(color);
            let grads = priceKey ? Object.keys(custom_quantity_prices[priceKey]).map(x => parseFloat(x)).sort((a,b)=>a-b) : [1];
            let idx = 0;
            
            const minus = document.createElement('button'); 
            minus.className='step-btn'; 
            minus.textContent='−';
            
            const plus = document.createElement('button'); 
            plus.className='step-btn'; 
            plus.textContent='+';
            
            const qtyDisplay = document.createElement('div'); 
            qtyDisplay.className='qty-display'; 
            
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
                priceSpan.textContent = price + ' £';
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
            
            sel.appendChild(minus); 
            sel.appendChild(qtyDisplay); 
            sel.appendChild(plus); 
            sel.appendChild(priceSpan); 
            sel.appendChild(addBtn);
            
            updateDisplay();
            
            row.appendChild(img); 
            row.appendChild(meta); 
            row.appendChild(sel);
            body.appendChild(row);
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

function normalizeKey(s){ 
    return String(s||'').toLowerCase().replace(/[\s\._]/g,'').normalize('NFKD'); 
}

function findPriceKey(color){
    if (custom_quantity_prices[color]) return color;
    const norm = normalizeKey(color);
    for (const k of Object.keys(custom_quantity_prices)){
        if (normalizeKey(k) === norm) return k;
    }
    const m = color.match(/^(\d)(.*)/);
    if (m){
        const try1 = m[1]+'.'+m[2];
        if (custom_quantity_prices[try1]) return try1;
    }
    return null;
}