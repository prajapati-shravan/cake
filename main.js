/**
 * =====================================================================
 * DÉLICE & CO. — ARTISAN PATISSERIE & CAKE STUDIO
 * Complete Full-Stack E-Commerce Engine
 * Features:
 *   - Secure Checkout & Razorpay Payment Integration (Server HMAC Verification)
 *   - Direct Gmail Receipt Dispatch Engine & Printable PDF Invoices
 *   - Customer "My Orders" Portal with Real-Time Milestone Tracking
 *   - Persistent Cart Drawer & Synchronized Badges
 *   - Bespoke Custom Cake Studio Calculator
 *   - 100% Pure Veg & Eggless Artisan Patisserie Catalog
 * =====================================================================
 */

(function () {
    'use strict';

    const STORE_PHONE = '+91 99094 44882';
    const STORE_EMAIL = 'orders@deliceandcake.in';
    const $ = id => document.getElementById(id);
    const $$ = sel => document.querySelectorAll(sel);

    // Toast Utility with luxury thumbnail support
    window.showToast = function (msg, imgUrl) {
        const toast = $('deliceToast');
        const text = $('toastMsg');
        if (!toast) return;

        let thumb = toast.querySelector('.toast-thumb');
        let iconBadge = toast.querySelector('.toast-icon-badge');

        if (imgUrl) {
            if (iconBadge) iconBadge.remove();
            if (!thumb) {
                thumb = document.createElement('img');
                thumb.className = 'toast-thumb';
                toast.prepend(thumb);
            }
            thumb.src = imgUrl;
            thumb.alt = 'Cake';
            thumb.style.display = 'block';
        } else {
            if (thumb) thumb.remove();
            if (!iconBadge) {
                iconBadge = document.createElement('span');
                iconBadge.className = 'toast-icon-badge';
                iconBadge.textContent = '🎂';
                toast.prepend(iconBadge);
            }
        }

        if (text) text.textContent = msg;
        toast.classList.add('show');
        clearTimeout(window._toastTimer);
        window._toastTimer = setTimeout(() => toast.classList.remove('show'), 3400);
    };

    // Default Fallback Artisan Patisserie Catalog
    const ALL_MENU_CAKES = [
        {
            id: 'velvet-rose',
            name: 'The Velvet Rose & Raspberry Chiffon',
            cat: 'chiffon',
            price: 899,
            price1kg: 1699,
            weight1: '500 Gm',
            weight2: '1 Kg',
            img: 'assets/cake_velvet.jpg',
            desc: 'Vanilla bean chiffon layered with tart wild raspberry compote, whipped French ganache, and edible organic rose petals.',
            diet: '100% Pure Veg (Eggless)'
        },
        {
            id: 'valrhona-truffle',
            name: 'Valrhona Noir Dark Truffle Mud Cake',
            cat: 'chiffon',
            price: 849,
            price1kg: 1599,
            weight1: '500 Gm',
            weight2: '1 Kg',
            img: 'assets/cake_chocolate.jpg',
            desc: 'Ultra-moist Belgian dark chocolate sponge drenched in silky chocolate truffle ganache, roasted hazelnuts, and sea salt.',
            diet: '100% Pure Veg (Eggless)'
        },
        {
            id: 'korean-bento',
            name: 'Pastel Petal Korean Bento Lunchbox Cake',
            cat: 'bento',
            price: 399,
            price1kg: 599,
            weight1: '250 Gm',
            weight2: '500 Gm',
            img: 'assets/cake_bento.jpg',
            desc: 'Aesthetic Korean viral bento cake packaged in an eco sugarcane box with pastel piping and custom chocolate lettering.',
            diet: '100% Pure Veg (Eggless)'
        },
        {
            id: 'strawberry-cloud',
            name: 'Kyoto Fresh Strawberry Cloud Chiffon',
            cat: 'chiffon',
            price: 799,
            price1kg: 1499,
            weight1: '500 Gm',
            weight2: '1 Kg',
            img: 'assets/cake_strawberry.jpg',
            desc: 'Cloud-like Japanese sponge filled with fresh Mahabaleshwar strawberries and light-as-air whipped dairy cream.',
            diet: '100% Pure Veg (Eggless)'
        },
        {
            id: 'black-forest',
            name: 'Classic German Black Forest Gateau',
            cat: 'chiffon',
            price: 599,
            price1kg: 1149,
            weight1: '500 Gm',
            weight2: '1 Kg',
            img: 'assets/cake_blackforest.jpg',
            desc: 'Traditional chocolate sponge layered with whipped cream, imported sour cherry compote, and dark chocolate shavings.',
            diet: '100% Pure Veg (Eggless)'
        },
        {
            id: 'fresh-pineapple',
            name: 'Classic Golden Pineapple & Cream Gateau',
            cat: 'chiffon',
            price: 549,
            price1kg: 1049,
            weight1: '500 Gm',
            weight2: '1 Kg',
            img: 'assets/cake_pineapple.jpg',
            desc: 'Moist vanilla sponge soaked in real pineapple nectar, layered with slow-cooked pineapple tidbits and red cherries.',
            diet: '100% Pure Veg (Eggless)'
        },
        {
            id: 'pistachio-rose',
            name: 'Sicilian Pistachio & Wild Blackberry',
            cat: 'dietary',
            price: 949,
            price1kg: 1799,
            weight1: '500 Gm',
            weight2: '1 Kg',
            img: 'assets/cake_pistachio.jpg',
            desc: 'Finely ground green Bronte pistachio sponge layered with tart wild blackberry puree and vanilla mascarpone frosting.',
            diet: 'Gluten-Free Nut Flour'
        },
        {
            id: 'wedding-tower',
            name: 'The Royal Three-Tier Celebration Tower',
            cat: 'wedding',
            price: 4999,
            price1kg: 4999,
            weight1: '3 Kg',
            weight2: '5 Kg',
            img: 'assets/cake_wedding.jpg',
            desc: 'Breathtaking 3-tier grand centerpiece draped with hand-sculpted sugar petals, gold leaf ribbon, and champagne buttercream.',
            diet: 'Bespoke Multi-Tier (3 Kg)'
        }
    ];
    window.ALL_MENU_CAKES = ALL_MENU_CAKES;

    // Synchronize with authoritative products.json
    try {
        fetch('products.json')
            .then(res => res.ok ? res.json() : null)
            .then(items => {
                if (Array.isArray(items) && items.length > 0) {
                    items.forEach(newItem => {
                        const idx = ALL_MENU_CAKES.findIndex(c => c.id === newItem.id);
                        if (idx >= 0) {
                            ALL_MENU_CAKES[idx] = Object.assign({}, ALL_MENU_CAKES[idx], newItem);
                        } else {
                            ALL_MENU_CAKES.push(newItem);
                        }
                    });
                    window.ALL_MENU_CAKES = ALL_MENU_CAKES;
                }
            })
            .catch(() => {});
    } catch (e) {}

    // Synchronize with database and admin custom catalog cache
    try {
        const customCat = localStorage.getItem('delice_custom_catalog');
        if (customCat) {
            const parsed = JSON.parse(customCat);
            if (Array.isArray(parsed) && parsed.length > 0) {
                parsed.forEach(c => {
                    const idx = ALL_MENU_CAKES.findIndex(existing => existing.id === c.id);
                    const formatted = {
                        id: c.id,
                        name: c.name,
                        category: c.category,
                        flavor: c.flavor || c.name,
                        price: c.price,
                        price1: c.price,
                        price2: Math.round(c.price * 1.8),
                        weight: c.slices || '1/2 kg',
                        weight1: c.slices || '1/2 kg',
                        weight2: '1 kg',
                        img: c.image || 'assets/cake_velvet.jpg',
                        desc: c.description || '',
                        diet: c.dietary || '100% Pure Veg (Eggless)'
                    };
                    if (idx >= 0) {
                        ALL_MENU_CAKES[idx] = Object.assign({}, ALL_MENU_CAKES[idx], formatted);
                    } else {
                        ALL_MENU_CAKES.push(formatted);
                    }
                });
                window.ALL_MENU_CAKES = ALL_MENU_CAKES;
            }
        }
    } catch (e) {}

    /* =====================================================================
       1. DIRECT ARTISAN ORDERING & INSTANT CHECKOUT ENGINE (NO CART FRICTION)
       ===================================================================== */
    let cart = [];
    try {
        const saved = localStorage.getItem('delice_cart');
        if (saved) cart = JSON.parse(saved);
    } catch (e) {
        cart = [];
    }

    function saveCart() {
        try {
            localStorage.setItem('delice_cart', JSON.stringify(cart));
        } catch (e) {}
        updateCartUI();
    }

    function updateCartUI() {
        const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        const deskBadge = $('cartBadgeCount');
        const mobBadge = $('mobCartBadge');
        if (deskBadge) deskBadge.textContent = totalCount > 0 ? totalCount : '0';
        if (mobBadge) mobBadge.textContent = totalCount > 0 ? totalCount : '0';
        syncProductCardButtons();
    }

    function syncProductCardButtons() {
        document.querySelectorAll('.product-card').forEach(card => {
            const id = card.getAttribute('data-id');
            if (!id) return;
            const actionContainer = card.querySelector('.card-actions');
            if (!actionContainer) return;

            const existingAddBtn = actionContainer.querySelector('.btn-add, .card-in-cart-ctrl');
            if (existingAddBtn && !existingAddBtn.classList.contains('btn-add')) {
                existingAddBtn.outerHTML = `<button type="button" class="btn-add btn-cut1" onclick="window.addToCart('${id}')">+ Order</button>`;
            }
        });
    }

    // =====================================================================
    // ADD-TO-BAG MICRO-FEEDBACK ENGINE
    // Tactile button reaction, flying cake physics, haptic bounce, and chimes
    // =====================================================================
    window.triggerAddToBagMicroFeedback = function (options) {
        options = options || {};
        const sourceEl = options.sourceEl;
        const imgUrl = options.imgUrl;
        const name = options.name || 'Artisan Cake';
        const weight = options.weight || '';
        const callback = options.callback;

        // 1. Mobile Physical Haptic Vibration (Tactile pulse)
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
            try { navigator.vibrate([25, 40, 25]); } catch (e) {}
        }

        // 2. Synthesized luxury audio chime
        if (typeof window.playAudioTone === 'function') {
            window.playAudioTone('add');
        }

        // 3. Tactile button feedback (micro-depression & Added checkmark)
        if (sourceEl && sourceEl.classList) {
            const originalHtml = sourceEl.innerHTML;
            sourceEl.classList.add('btn-just-added');
            if (sourceEl.textContent.trim().length > 0 && !sourceEl.querySelector('svg')) {
                sourceEl.innerHTML = '✓ Added';
            }
            setTimeout(() => {
                sourceEl.classList.remove('btn-just-added');
                sourceEl.innerHTML = originalHtml;
            }, 650);
        }

        // 4. Parabolic Flying Cake Thumbnail Animation
        const targetEl = $('cartBadgeCount') ||
                         document.querySelector('.cart-link') ||
                         document.querySelector('.mobile-bottom-bar [onclick*="openInstantCheckout"]');

        if (targetEl) {
            let startRect = null;
            if (sourceEl && typeof sourceEl.getBoundingClientRect === 'function') {
                startRect = sourceEl.getBoundingClientRect();
            } else if (options.card && typeof options.card.getBoundingClientRect === 'function') {
                const cardImg = options.card.querySelector('img');
                startRect = cardImg ? cardImg.getBoundingClientRect() : options.card.getBoundingClientRect();
            }

            if (!startRect || (startRect.left === 0 && startRect.top === 0)) {
                startRect = {
                    left: (window.innerWidth / 2) - 26,
                    top: (window.innerHeight / 2) - 26,
                    width: 52,
                    height: 52
                };
            }

            const endRect = targetEl.getBoundingClientRect();

            const particle = document.createElement('div');
            particle.className = 'flying-cake-particle';
            if (imgUrl) {
                particle.innerHTML = `<img src="${imgUrl}" alt="Cake" onerror="this.remove();">`;
            } else {
                particle.innerHTML = `<span class="cake-emoji">🎂</span>`;
            }

            const startX = startRect.left + (startRect.width / 2) - 26;
            const startY = startRect.top + (startRect.height / 2) - 26;
            const targetX = endRect.left + (endRect.width / 2) - 26;
            const targetY = endRect.top + (endRect.height / 2) - 26;

            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            particle.style.transform = 'scale(0.7) rotate(0deg)';
            particle.style.opacity = '1';
            document.body.appendChild(particle);

            // Trigger reflow then launch parabolic translation
            void particle.offsetWidth;

            requestAnimationFrame(() => {
                particle.style.transform = `translate(${targetX - startX}px, ${targetY - startY}px) scale(0.22) rotate(360deg)`;
                particle.style.opacity = '0.35';
            });

            setTimeout(() => {
                particle.remove();

                // 5. Elastic Cart Bounce & Golden Ripple
                const badge = $('cartBadgeCount');
                const cartLink = document.querySelector('.cart-link');
                if (badge) {
                    badge.classList.remove('cart-badge-bounce');
                    void badge.offsetWidth;
                    badge.classList.add('cart-badge-bounce');
                    setTimeout(() => badge.classList.remove('cart-badge-bounce'), 700);
                }
                if (cartLink) {
                    cartLink.classList.remove('cart-ripple-active');
                    void cartLink.offsetWidth;
                    cartLink.classList.add('cart-ripple-active');
                    setTimeout(() => cartLink.classList.remove('cart-ripple-active'), 800);
                }
            }, 550);
        }

        // 6. Enhanced Toast notification with thumbnail
        window.showToast(`Added ${name} ${weight ? '(' + weight + ')' : ''} to order! 🎂`, imgUrl);

        // 7. Open checkout sheet after smooth micro-interaction flight
        setTimeout(() => {
            if (typeof callback === 'function') callback();
        }, 440);
    };

    // =========================================================================
    // AUTHENTICATION & LOGIN GATE CONTROLLER
    // =========================================================================
    window.isUserLoggedIn = function () {
        try {
            const u = window.DeliceDB?.auth?.getCurrentUserSync();
            if (u && (u.id || u.email || u.phone)) return true;
            const raw = localStorage.getItem('delice_user');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && (parsed.id || parsed.email || parsed.phone)) return true;
            }
            if (sessionStorage.getItem('delice_guest_checkout') === 'true') {
                return true;
            }
        } catch (e) {}
        return false;
    };

    window.proceedWithGuestCheckout = function () {
        try {
            sessionStorage.setItem('delice_guest_checkout', 'true');
        } catch (e) {}
        window.closeLoginPromptModal();
        window.openOrderModalForCart();
    };

    window.ensureAuthPromptModal = function () {
        let modal = $('deliceAuthPromptModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'deliceAuthPromptModal';
            modal.className = 'auth-prompt-modal-overlay';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.onclick = function (e) {
                if (e.target === modal) window.closeLoginPromptModal();
            };
            modal.innerHTML = `
                <div class="auth-prompt-modal-card" onclick="event.stopPropagation()">
                    <button type="button" class="auth-prompt-close-btn" onclick="window.closeLoginPromptModal()" aria-label="Close modal">&times;</button>
                    <div class="auth-prompt-emblem">👑</div>
                    <span class="auth-prompt-tag">Connoisseur Club</span>
                    <h3 class="auth-prompt-heading">Sign In to Complete Your Order</h3>
                    <p class="auth-prompt-desc">
                        Please sign in with your email or create an account to order from Délice &amp; Co. Your celebration cake has been safely preserved in your basket!
                    </p>
                    <div id="authPromptCakePreview" class="auth-prompt-item-box" style="display:none;">
                        <img id="authPromptCakeImg" src="assets/cake_velvet.jpg" alt="Selected Cake" class="auth-prompt-thumb">
                        <div class="auth-prompt-item-info">
                            <strong id="authPromptCakeName" class="auth-prompt-cake-title">The Velvet Rose &amp; Raspberry Chiffon</strong>
                            <span id="authPromptCakeMeta" class="auth-prompt-cake-meta">500 Gm • ₹899 • 100% Pure Veg</span>
                        </div>
                        <span class="auth-prompt-saved-pill">✓ Saved in Bag</span>
                    </div>
                    <div class="auth-prompt-actions">
                        <a id="authPromptLoginBtn" href="login.html?redirect=checkout" class="auth-prompt-btn-primary">
                            <span>Sign In / Create Account to Order</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </a>
                        <button type="button" class="auth-prompt-btn-secondary" style="background:rgba(203,164,107,0.15); color:#855324; border:1px solid rgba(203,164,107,0.4); font-weight:700; padding:12px; margin-top:4px;" onclick="window.proceedWithGuestCheckout()">
                            Continue as Guest &amp; Checkout ➔
                        </button>
                    </div>
                    <div class="auth-prompt-perks" style="margin-top:16px; font-size:12px; color:#64748B; display:flex; justify-content:center; gap:8px;">
                        <span>✨ Direct Order Access</span>
                        <span>•</span>
                        <span>🎂 Fresh Artisan Bakes</span>
                        <span>•</span>
                        <span>📍 Live Tracking</span>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        return modal;
    };

    window.askLoginToOrder = function (item) {
        const modal = window.ensureAuthPromptModal();
        const prevBox = $('authPromptCakePreview');
        const imgEl = $('authPromptCakeImg');
        const nameEl = $('authPromptCakeName');
        const metaEl = $('authPromptCakeMeta');
        const loginBtn = $('authPromptLoginBtn');

        if (item && item.name) {
            if (prevBox) prevBox.style.display = 'flex';
            if (imgEl) imgEl.src = item.img || 'assets/cake_velvet.jpg';
            if (nameEl) nameEl.textContent = item.name;
            if (metaEl) {
                const wt = item.weight || '500 Gm';
                const pr = item.price ? `₹${item.price.toLocaleString('en-IN')}` : '';
                metaEl.textContent = `${wt} ${pr ? '• ' + pr : ''} • 100% Pure Veg & Eggless`;
            }
        } else if (cart && cart.length > 0) {
            const first = cart[0];
            if (prevBox) prevBox.style.display = 'flex';
            if (imgEl) imgEl.src = first.img || 'assets/cake_velvet.jpg';
            if (nameEl) nameEl.textContent = first.name;
            if (metaEl) metaEl.textContent = `${first.weight || '500 Gm'} • ₹${(first.price || 899).toLocaleString('en-IN')} • 100% Pure Veg & Eggless`;
        } else {
            if (prevBox) prevBox.style.display = 'none';
        }

        if (loginBtn) {
            loginBtn.href = 'login.html?redirect=checkout';
        }

        modal.style.display = 'flex';
        void modal.offsetWidth;
        modal.classList.add('active');
        document.body.classList.add('modal-locked');
    };

    window.closeLoginPromptModal = function () {
        const modal = $('deliceAuthPromptModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.classList.remove('modal-locked');
            }, 250);
        }
    };

    // Direct Order Now / Add to Basket -> Adds cake to cart and triggers order gate / modal
    window.addToCart = function (id) {
        const card = document.querySelector(`.product-card[data-id="${id}"]`);
        let name = 'Artisan Celebration Cake';
        let weight = '500 Gm';
        let price = 899;
        let img = 'assets/cake_velvet.jpg';

        if (card) {
            name = card.getAttribute('data-name') || name;
            weight = card.dataset.currentWeight || weight;
            price = parseInt(card.dataset.currentPrice || card.getAttribute('data-price') || String(price), 10);
            img = card.getAttribute('data-img') || img;
        } else {
            const cake = ALL_MENU_CAKES.find(c => c.id === id);
            if (cake) {
                name = cake.name;
                weight = cake.weight1 || '500 Gm';
                price = cake.price;
                img = cake.img;
            }
        }

        const existingIdx = cart.findIndex(item => item.id === id && item.weight === weight && !item.isCustom);
        if (existingIdx > -1) {
            cart[existingIdx].qty = (cart[existingIdx].qty || 1) + 1;
        } else {
            cart.push({ id, name, weight, price, img, qty: 1, message: '' });
        }

        saveCart();

        const triggerBtn = (document.activeElement && (document.activeElement.tagName === 'BUTTON' || document.activeElement.tagName === 'A')) 
            ? document.activeElement 
            : (card ? card.querySelector('.btn-add, .btn-buy-now') : null);

        window.triggerAddToBagMicroFeedback({
            sourceEl: triggerBtn,
            card: card,
            imgUrl: img,
            name: name,
            weight: weight,
            callback: () => {
                if (!window.isUserLoggedIn()) {
                    window.askLoginToOrder({ name, weight, price, img });
                } else {
                    window.openOrderModalForCart();
                }
            }
        });
    };

    window.openOrderModalForCard = window.addToCart;
    window.addToCartFromCard = window.addToCart;

    // Add Bespoke Custom Cake Studio design directly to Checkout
    window.addCustomCakeToBasket = function () {
        const activeFlav = document.querySelector('#flavorSelector .studio-chip-btn.active');
        const flavour = activeFlav?.getAttribute('data-title') || $('studioCakeTitle')?.textContent || 'Belgian Dark Truffle';
        const activeSize = document.querySelector('#sizeSelector .studio-chip-btn.active');
        const weight = activeSize?.getAttribute('data-label') || $('studioTierBadge')?.textContent || '1/2 kg (Serves 4–6)';
        const activeDiet = document.querySelector('#dietSelector .studio-chip-btn.active');
        const diet = activeDiet?.getAttribute('data-diet') || '100% Pure Veg (Eggless)';
        const message = ($('cakeMessageInput')?.value || '').trim();
        const notes = ($('customThemeInput')?.value || '').trim();
        const price = window.calcCustomPrice();
        const img = $('studioCakeImg')?.getAttribute('src') || 'assets/cake_chocolate.jpg';

        let designState = null;
        if (typeof window.getCustomCakeDesignState === 'function') {
            try { designState = window.getCustomCakeDesignState(); } catch (e) {}
        }
        const customItem = {
            id: 'custom-' + Date.now(),
            name: `Bespoke: ${flavour}${designState && designState.tiers ? ' (' + designState.tiers + ' Tier' + (designState.tiers > 1 ? 's' : '') + ')' : ''}`,
            weight: weight,
            price: price,
            img: img,
            qty: 1,
            isCustom: true,
            dietary: diet,
            message: message,
            notes: (designState ? `[Drip: ${designState.dripStyle || 'Classic'}, Toppings: ${(designState.toppings || []).join(', ') || 'Fresh Berries'}, Calligraphy: ${designState.pipingColor || 'Gold'}] ` : '') + (notes || '')
        };

        cart.push(customItem);
        saveCart();

        const triggerBtn = $('btnAddToBagStudio') || $('btnOrderNowStudio') || document.activeElement;

        window.triggerAddToBagMicroFeedback({
            sourceEl: triggerBtn,
            imgUrl: img,
            name: `Bespoke: ${flavour}`,
            weight: weight,
            callback: () => {
                if (!window.isUserLoggedIn()) {
                    window.askLoginToOrder({ name: `Bespoke: ${flavour}`, weight, price: price, img });
                } else {
                    window.openOrderModalForCart();
                }
            }
        });
    };

    // Bespoke Custom Cake Inquiry Handler
    window.submitCustomCakeInquiry = function () {
        window.addCustomCakeToBasket();
    };

    window.openCartDrawer = function () {
        window.openInstantCheckout();
    };

    window.closeCartDrawer = function () {
        const drawer = $('cartDrawer');
        const overlay = $('cartOverlay');
        if (drawer) drawer.classList.remove('open', 'active');
        if (overlay) overlay.classList.remove('open', 'active');
        document.body.style.overflow = '';
    };

    window.toggleCart = function () {
        window.openInstantCheckout();
    };

    window.clearCart = function () {
        cart = [];
        saveCart();
    };

    window.removeFromCart = function (index) {
        if (typeof index !== 'number' || !cart[index]) return;
        const removed = cart.splice(index, 1);
        saveCart();
        if (appliedCoupon) {
            window.recalculateAppliedCoupon();
        }
        window.renderOrderSummaryInModal();
        window.showToast(`Removed ${removed[0]?.name || 'cake'} from order`);
    };

    window.changeCartQty = function (index, delta) {
        if (!cart[index]) return;
        const newQty = (cart[index].qty || 1) + delta;
        if (newQty <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].qty = newQty;
        }
        saveCart();
        if (appliedCoupon) {
            window.recalculateAppliedCoupon();
        }
        window.renderOrderSummaryInModal();
    };
    window.updateCartQty = window.changeCartQty;

    window.setModalItemWeight = function (weight, price, index = 0) {
        if (!cart || !cart[index]) return;
        cart[index].weight = weight;
        cart[index].price = price;
        saveCart();
        if (appliedCoupon) {
            window.recalculateAppliedCoupon();
        }
        window.renderOrderSummaryInModal();
    };

    window.updateModalItemMessage = function (indexOrMsg, maybeMsg) {
        if (!cart || cart.length === 0) return;
        if (typeof indexOrMsg === 'number' && typeof maybeMsg === 'string') {
            if (cart[indexOrMsg]) cart[indexOrMsg].message = maybeMsg;
        } else if (typeof indexOrMsg === 'string') {
            cart[0].message = indexOrMsg;
        }
        saveCart();
    };

    /* =====================================================================
       2. PRODUCT CARD WEIGHT SELECTOR CHIPS
       ===================================================================== */
    window.setCardWeight = function (chipEl, price, weight) {
        const card = chipEl.closest('.product-card');
        if (!card) return;

        const chips = card.querySelectorAll('.weight-chip');
        chips.forEach(c => c.classList.remove('active'));
        chipEl.classList.add('active');

        card.dataset.currentWeight = weight;
        card.dataset.currentPrice = price;

        const priceEl = card.querySelector('.price');
        const weightLabel = card.querySelector('.weight-label');

        if (priceEl) {
            priceEl.textContent = `₹${price.toLocaleString('en-IN')}`;
            priceEl.classList.add('pulse');
            setTimeout(() => priceEl.classList.remove('pulse'), 250);
        }
        if (weightLabel) {
            weightLabel.textContent = weight;
        }
    };

    /* =====================================================================
       3. ORDER CHECKOUT MODAL — FULL-STACK RAZORPAY & SUPABASE FLOW
       ===================================================================== */
    let selectedDeliveryArea = 'Akota';
    let selectedPaymentMethod = 'RAZORPAY'; // 'RAZORPAY' or 'COD'
    let appliedCoupon = null;

    function setDefaultOrderDate() {
        const dateInput = $('custDate');
        if (!dateInput) return;
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const minDate = `${yyyy}-${mm}-${dd}`;
        dateInput.min = minDate;
        if (!dateInput.value) {
            dateInput.value = minDate;
        }
        window.loadDeliverySlotsForDate(dateInput.value);
    }

    // Dynamically load delivery slots for a selected date
    window.loadDeliverySlotsForDate = async function (dateStr) {
        const slotSelect = $('custSlot');
        if (!slotSelect) return;

        if (window.DeliceDB && typeof window.DeliceDB.fetchDeliverySlots === 'function') {
            try {
                const slots = await window.DeliceDB.fetchDeliverySlots(dateStr);
                if (slots && slots.length > 0) {
                    slotSelect.innerHTML = slots.map(s => {
                        const start = s.start_time.substring(0, 5);
                        const end = s.end_time.substring(0, 5);
                        const capacityText = s.current_orders >= s.maximum_orders ? ' (Full - Next Available)' : ' (Available)';
                        return `<option value="${s.id || start}|${start} – ${end}">${start} – ${end}${capacityText}</option>`;
                    }).join('');
                    return;
                }
            } catch (e) {
                console.warn('Slot load fallback:', e);
            }
        }

        // Standard default slot fallback
        slotSelect.innerHTML = `
            <option value="Express 2-Hour Delivery">Express (Within 2 Hours) - Available</option>
            <option value="Morning (10:00 AM – 1:00 PM)">Morning (10:00 AM – 1:00 PM)</option>
            <option value="Afternoon (1:00 PM – 4:00 PM)">Afternoon (1:00 PM – 4:00 PM)</option>
            <option value="Evening (4:00 PM – 7:00 PM)" selected>Evening (4:00 PM – 7:00 PM)</option>
            <option value="Night (7:00 PM – 10:00 PM)">Night (7:00 PM – 10:00 PM)</option>
        `;
    };

    // Toggle Payment Method in Checkout Modal (Razorpay & COD only)
    window.selectPaymentMethod = function (method) {
        selectedPaymentMethod = method;
        const rzpCard = $('payMethodRazorpay');
        const codCard = $('payMethodCOD');
        const btnText = $('btnSubmitOrderText');
        const btn = $('btnSubmitOrder');

        if (rzpCard) rzpCard.classList.toggle('active', method === 'RAZORPAY');
        if (codCard) codCard.classList.toggle('active', method === 'COD');

        if (btnText && btn) {
            if (method === 'RAZORPAY') {
                btnText.textContent = 'Pay Securely via Razorpay (Test Mode)';
                btn.className = 'btn-razorpay-pay';
            } else {
                btnText.textContent = 'Confirm Order (Pay on Delivery)';
                btn.className = 'btn-cod-confirm';
            }
        }
    };

    // Dynamic Recalculation of Applied Coupon
    window.recalculateAppliedCoupon = async function () {
        if (!appliedCoupon || !appliedCoupon.code) return;
        let subtotal = 0;
        cart.forEach(item => { subtotal += (Number(item.price) || 0) * (Number(item.qty) || 1); });
        if (subtotal === 0) {
            appliedCoupon = null;
            const discountNote = $('modalDiscountNote');
            if (discountNote) discountNote.style.display = 'none';
            return;
        }
        try {
            const res = await window.DeliceDB.validateCoupon(appliedCoupon.code, subtotal);
            const statusMsg = $('couponStatusMsg');
            const discountNote = $('modalDiscountNote');
            if (res && res.valid) {
                appliedCoupon = {
                    code: res.code,
                    discount: res.discount,
                    discount_type: res.discount_type,
                    discount_value: res.discount_value
                };
                if (statusMsg) {
                    statusMsg.style.display = 'block';
                    statusMsg.className = 'coupon-status-msg success';
                    statusMsg.textContent = `✓ ${res.message || 'Coupon active!'} Saved ₹${res.discount}`;
                }
                if (discountNote) {
                    discountNote.style.display = 'block';
                    discountNote.textContent = `Coupon ${res.code} Applied (-₹${res.discount})`;
                }
            } else {
                appliedCoupon = null;
                if (statusMsg) {
                    statusMsg.style.display = 'block';
                    statusMsg.className = 'coupon-status-msg error';
                    statusMsg.textContent = res.message || 'Coupon requirement no longer met.';
                }
                if (discountNote) discountNote.style.display = 'none';
            }
        } catch(e) {}
    };

    // Apply Coupon Code
    window.applyOrderCoupon = async function () {
        const input = $('custCoupon');
        const statusMsg = $('couponStatusMsg');
        const discountNote = $('modalDiscountNote');
        const code = (input?.value || '').trim();

        if (!code) {
            if (statusMsg) {
                statusMsg.style.display = 'block';
                statusMsg.className = 'coupon-status-msg error';
                statusMsg.textContent = 'Please enter a coupon code.';
            }
            return;
        }

        let subtotal = 0;
        cart.forEach(item => { subtotal += (Number(item.price) || 0) * (Number(item.qty) || 1); });

        if (statusMsg) {
            statusMsg.style.display = 'block';
            statusMsg.className = 'coupon-status-msg';
            statusMsg.textContent = 'Verifying promo coupon...';
        }

        try {
            const res = await window.DeliceDB.validateCoupon(code, subtotal);
            if (res && res.valid) {
                appliedCoupon = {
                    code: res.code,
                    discount: res.discount,
                    discount_type: res.discount_type,
                    discount_value: res.discount_value
                };
                if (statusMsg) {
                    statusMsg.className = 'coupon-status-msg success';
                    statusMsg.textContent = `✓ ${res.message || 'Coupon applied!'} Saved ₹${res.discount}`;
                }
                if (discountNote) {
                    discountNote.style.display = 'block';
                    discountNote.textContent = `Coupon ${res.code} Applied (-₹${res.discount})`;
                }
                window.renderOrderSummaryInModal();
                window.playAudioTone('success');
            } else {
                appliedCoupon = null;
                if (statusMsg) {
                    statusMsg.className = 'coupon-status-msg error';
                    statusMsg.textContent = res.message || 'Invalid or expired coupon code.';
                }
                if (discountNote) discountNote.style.display = 'none';
                window.renderOrderSummaryInModal();
            }
        } catch (e) {
            appliedCoupon = null;
            if (statusMsg) {
                statusMsg.className = 'coupon-status-msg error';
                statusMsg.textContent = 'Error verifying coupon. Please try again.';
            }
        }
    };

    // Render Clean Itemized Summary directly inside Order Checkout Modal (Supports Multiple Cakes)
    window.renderOrderSummaryInModal = function () {
        const container = $('modalOrderSummaryBox') || $('modalOrderItemsList');
        const finalPriceEl = $('orderFinalPrice');
        const submitBtn = $('btnSubmitOrder');
        if (!container) return;

        if (!cart || cart.length === 0) {
            container.innerHTML = `
                <div style="background:#F8FAFC; border:1.5px dashed #CBD5E1; border-radius:14px; padding:24px 16px; text-align:center; margin-bottom:14px;">
                    <div style="font-size:36px; margin-bottom:8px;">🛒</div>
                    <h4 style="margin:0 0 6px; color:var(--navy); font-size:15px; font-weight:700;">Your Basket is Currently Empty</h4>
                    <p style="margin:0 0 14px; font-size:12.5px; color:var(--text-muted);">Please select one or more handcrafted artisan cakes from our menu to place your order.</p>
                    <button type="button" onclick="window.closeOrderModal(); const el = $('cakes') || $('menuCatalogGrid') || $('bestsellers'); if (el) el.scrollIntoView({behavior:'smooth'});" style="background:var(--rust); color:#fff; border:none; padding:8px 16px; border-radius:8px; font-weight:700; font-size:12.5px; cursor:pointer;">
                        Explore Cakes Menu 🎂
                    </button>
                </div>
            `;
            if (finalPriceEl) finalPriceEl.textContent = '₹0';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.5';
                submitBtn.style.cursor = 'not-allowed';
            }
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }

        let subtotal = 0;
        let totalCount = 0;
        let itemsHtml = '';

        cart.forEach((item, idx) => {
            const itemTotal = (Number(item.price) || 0) * (Number(item.qty) || 1);
            subtotal += itemTotal;
            totalCount += (Number(item.qty) || 1);

            itemsHtml += `
                <div style="display:flex; gap:12px; align-items:flex-start; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:10px 12px; margin-bottom:10px; position:relative;">
                    <img src="${(item.img || 'assets/cake_velvet.jpg').replace(/\.jpg$/i, '.webp')}" onerror="this.src='${item.img || 'assets/cake_velvet.jpg'}'" alt="${item.name}" loading="lazy" decoding="async" style="width:58px; height:58px; border-radius:8px; object-fit:cover; border:1px solid #E2E8F0; flex-shrink:0; margin-top:2px;">
                    <div style="flex:1; min-width:0;">
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:6px; padding-right:20px;">
                            <strong style="font-size:13.5px; color:var(--navy); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;">${item.name}</strong>
                            <span style="font-size:14px; font-weight:800; color:var(--rust); white-space:nowrap;">₹${itemTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:6px; margin-top:3px; flex-wrap:wrap;">
                            <span style="background:#E2E8F0; color:#334155; font-size:11px; font-weight:700; padding:2px 6px; border-radius:4px;">Size: ${item.weight || '500 Gm'}</span>
                            <span style="background:#F0FDF4; color:#166534; font-size:11px; font-weight:700; padding:2px 6px; border-radius:4px;">🌱 ${item.dietary || '100% Pure Veg'}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:8px; margin-top:8px; flex-wrap:wrap;">
                            <div style="display:inline-flex; align-items:center; border:1px solid #CBD5E1; border-radius:6px; background:#F8FAFC; overflow:hidden; height:26px;">
                                <button type="button" onclick="window.changeCartQty(${idx}, -1)" style="width:24px; height:100%; border:none; background:none; font-weight:800; font-size:14px; cursor:pointer; color:var(--navy);" title="Decrease quantity">−</button>
                                <span style="min-width:22px; text-align:center; font-size:12px; font-weight:800; color:var(--navy);">${item.qty || 1}</span>
                                <button type="button" onclick="window.changeCartQty(${idx}, 1)" style="width:24px; height:100%; border:none; background:none; font-weight:800; font-size:14px; cursor:pointer; color:var(--navy);" title="Increase quantity">+</button>
                            </div>
                            <input type="text" placeholder="Message on cake" value="${item.message || ''}" oninput="window.updateModalItemMessage(${idx}, this.value)" style="flex:1; min-width:120px; padding:4px 8px; font-size:11.5px; border:1px solid #CBD5E1; border-radius:6px; background:#FAFAFA; outline:none;" aria-label="Message on cake">
                        </div>
                    </div>
                    <button type="button" onclick="window.removeFromCart(${idx})" style="position:absolute; top:8px; right:8px; border:none; background:none; color:#94A3B8; cursor:pointer; font-size:14px; padding:2px 4px; line-height:1; border-radius:4px;" title="Remove this cake">✕</button>
                </div>
            `;
        });

        const discount = appliedCoupon ? Number(appliedCoupon.discount) || 0 : 0;
        const totalPayable = Math.max(subtotal - discount, 0);

        container.innerHTML = `
            <div class="order-summary-compact-card" style="background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:14px; padding:12px 14px; margin-bottom:14px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #EDF2F7; padding-bottom:6px;">
                    <div style="font-size:13px; font-weight:800; color:var(--navy); display:flex; align-items:center; gap:6px;">
                        <span>🎂</span> Selected Cakes for Order (${totalCount} item${totalCount > 1 ? 's' : ''})
                    </div>
                    <button type="button" onclick="window.closeOrderModal(); const el = $('cakes') || $('menuCatalogGrid') || $('bestsellers'); if (el) el.scrollIntoView({behavior:'smooth'});" style="background:none; border:none; color:var(--rust); font-size:12px; font-weight:700; cursor:pointer; text-decoration:underline;">
                        + Add More Cakes
                    </button>
                </div>
                <div>
                    ${itemsHtml}
                </div>
                <div style="margin-top:10px; padding-top:8px; border-top:1px dashed #CBD5E1; font-size:13px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span style="color:var(--text-muted);">Cakes Subtotal:</span>
                        <strong>₹${subtotal.toLocaleString('en-IN')}</strong>
                    </div>
                    ${discount > 0 ? `
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:#15803D; font-weight:700;">
                        <span>Coupon Discount (${appliedCoupon.code}):</span>
                        <span>-₹${discount.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                        <span style="color:var(--text-muted);">Vadodara Express Delivery:</span>
                        <span style="color:#2E7D32; font-weight:700;">FREE (All Orders)</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:15px; font-weight:800; color:var(--navy); padding-top:6px; border-top:1px solid #E2E8F0;">
                        <span>Total Payable:</span>
                        <strong style="color:var(--rust); font-size:17px;">₹${totalPayable.toLocaleString('en-IN')}</strong>
                    </div>
                </div>
            </div>
        `;

        if (finalPriceEl) finalPriceEl.textContent = `₹${totalPayable.toLocaleString('en-IN')}`;
    };

    window.openOrderModalForCart = function () {
        // Close any legacy cart drawer
        const drawer = $('cartDrawer');
        const cartOverlay = $('cartOverlay');
        if (drawer) drawer.classList.remove('open', 'active');
        if (cartOverlay) cartOverlay.classList.remove('open', 'active');

        // Reset checkout modal view
        const form = $('orderForm');
        const modalBody = $('orderModalBody');
        const confirmScreen = $('orderConfirmationScreen');
        const modalFooter = $('orderModalFooter');
        
        if (form) {
            form.hidden = false;
            form.style.display = 'block';
            form.style.removeProperty('display');
        }
        if (modalBody) {
            modalBody.style.display = 'block';
            modalBody.style.removeProperty('display');
        }
        if (confirmScreen) {
            confirmScreen.style.display = 'none';
        }
        if (modalFooter) {
            modalFooter.style.display = 'flex';
            modalFooter.style.removeProperty('display');
        }

        const modal = $('orderModal');
        const overlay = $('orderModalOverlay');
        const titleEl = $('orderModalTitle');

        if (titleEl) titleEl.textContent = 'Instant Cake Checkout & Delivery';
        if (typeof window.renderOrderSummaryInModal === 'function') {
            window.renderOrderSummaryInModal();
        }
        if (typeof setDefaultOrderDate === 'function') {
            setDefaultOrderDate();
        }

        // Auto prefill customer details if logged into Connoisseur Club
        try {
            const loggedUser = window.DeliceDB?.auth?.getCurrentUserSync();
            if (loggedUser) {
                const nameEl = $('custName');
                const phoneEl = $('custPhone');
                const emailEl = $('custEmail');
                if (nameEl && !nameEl.value && loggedUser.full_name) nameEl.value = loggedUser.full_name;
                if (phoneEl && !phoneEl.value && loggedUser.phone) phoneEl.value = loggedUser.phone;
                if (emailEl && !emailEl.value && loggedUser.email) emailEl.value = loggedUser.email;
            }
        } catch (e) {}

        if (modal && overlay) {
            modal.style.display = 'flex';
            overlay.style.display = 'block';
            modal.classList.add('open', 'active');
            overlay.classList.add('open', 'active');
            document.body.classList.add('modal-locked');
            document.documentElement.classList.add('modal-locked');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
    };

    window.openInstantCheckout = function () {
        if (!cart || cart.length === 0) {
            window.showToast('Your basket is empty. Tap "+ Basket" or "Order Now ⚡" on any cake to order.');
            const cakesSec = $('cakes') || $('menuCatalogGrid') || $('bestsellers');
            if (cakesSec) cakesSec.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        if (!window.isUserLoggedIn()) {
            window.askLoginToOrder();
            return;
        }
        window.openOrderModalForCart();
    };

    window.closeOrderModal = function () {
        const modal = $('orderModal');
        const overlay = $('orderModalOverlay');
        if (modal) {
            modal.classList.remove('open', 'active');
            modal.style.display = 'none';
        }
        if (overlay) {
            overlay.classList.remove('open', 'active');
            overlay.style.display = 'none';
        }
        const confirmScreen = $('orderConfirmationScreen');
        if (confirmScreen) {
            confirmScreen.style.display = 'none';
            confirmScreen.innerHTML = '';
        }
        const orderProfileOverlay = $('orderProfileModalOverlay');
        if (orderProfileOverlay) {
            orderProfileOverlay.classList.remove('open', 'active');
            orderProfileOverlay.style.display = 'none';
        }
        document.body.classList.remove('modal-locked');
        document.documentElement.classList.remove('modal-locked');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.style.removeProperty('overflow');
        document.documentElement.style.removeProperty('overflow');
    };

    window.selectArea = function (btn, area) {
        selectedDeliveryArea = area;
        $$('.area-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');

        const addrInput = $('custAddress');
        if (addrInput && !addrInput.value.includes(area)) {
            addrInput.value = (addrInput.value.trim() ? addrInput.value.trim() + ', ' : '') + area + ', Vadodara';
        }
    };

    /* =====================================================================
       FULL-STACK CHECKOUT HANDLER (DATABASE FIRST -> SECURE RAZORPAY / COD)
       ===================================================================== */
    window.submitOrderCheckout = async function () {
        if (!cart || cart.length === 0) {
            alert('Your basket is empty. Please select a cake from the menu to place an order.');
            return;
        }

        const name = ($('custName')?.value || '').trim();
        const phone = ($('custPhone')?.value || '').trim();
        const email = ($('custEmail')?.value || '').trim();
        const address = ($('custAddress')?.value || '').trim();
        const date = $('custDate')?.value || '';
        const slotRaw = $('custSlot')?.value || 'Express (Within 2 Hours)';
        const specialNotes = ($('custNotes')?.value || '').trim();

        if (!name) {
            alert('Please enter your full name for cake delivery.');
            $('custName')?.focus();
            return;
        }
        if (!phone || phone.replace(/\D/g, '').length < 10) {
            alert('Please enter a valid 10-digit mobile number for order delivery coordination.');
            $('custPhone')?.focus();
            return;
        }
        if (!email || !email.includes('@') || !email.includes('.')) {
            alert('Please enter a valid email address (e.g. your Gmail) so we can dispatch your official patisserie receipt.');
            $('custEmail')?.focus();
            return;
        }
        if (!address) {
            alert('Please enter your full delivery address in Vadodara.');
            $('custAddress')?.focus();
            return;
        }
        if (!date) {
            alert('Please select a delivery date.');
            $('custDate')?.focus();
            return;
        }

        // Parse slot text and slot ID
        let slotId = null;
        let slotText = slotRaw;
        if (slotRaw.includes('|')) {
            const parts = slotRaw.split('|');
            slotId = parts[0];
            slotText = parts[1];
        }

        // Prepare items array
        const items = cart.map(item => ({
            productId: item.id && item.id.length === 36 ? item.id : null,
            variantId: item.variantId || null,
            name: item.name,
            weight: item.weight,
            price: item.price,
            qty: item.qty || 1,
            img: item.img || 'assets/cake_velvet.jpg',
            message: item.message || '',
            isCustom: Boolean(item.isCustom)
        }));

        let subtotal = 0;
        cart.forEach(i => { subtotal += i.price * (i.qty || 1); });
        const discount = appliedCoupon ? appliedCoupon.discount : 0;
        const total = Math.max(subtotal - discount, 0);

        const orderNum = 'DL-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);

        const orderPayload = {
            order_number: orderNum,
            customer: { name, phone, email, address },
            items,
            deliveryDate: date,
            deliverySlotId: slotId,
            deliverySlotText: slotText,
            couponCode: appliedCoupon ? appliedCoupon.code : null,
            specialInstructions: specialNotes,
            paymentMethod: selectedPaymentMethod,
            subtotal,
            discount,
            total,
            status: 'CONFIRMED',
            placedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            createdAt: new Date().toISOString()
        };

        const submitBtn = $('btnSubmitOrder');
        const submitText = $('btnSubmitOrderText');
        if (submitBtn) submitBtn.disabled = true;
        if (submitText) submitText.textContent = '⏳ Processing Your Order Securely...';

        // Dual-tier Order Persistence (Local Storage + Supabase Direct Sync)
        const saveOrderToClientStore = (ordData, payStatus) => {
            try {
                ordData.payment_status = payStatus;
                ordData.status = ordData.status || 'CONFIRMED';
                ordData.createdAt = ordData.createdAt || new Date().toISOString();

                // 1. Save latest order & order history to local storage
                localStorage.setItem('delice_latest_order', JSON.stringify(ordData));

                const localOrders = JSON.parse(localStorage.getItem('delice_orders') || '[]');
                localOrders.unshift(ordData);
                localStorage.setItem('delice_orders', JSON.stringify(localOrders.slice(0, 50)));

                const recentOrders = JSON.parse(localStorage.getItem('delice_recent_orders') || '[]');
                recentOrders.unshift(ordData);
                localStorage.setItem('delice_recent_orders', JSON.stringify(recentOrders.slice(0, 50)));

                // 2. Direct Supabase insert if client available
                if (window.DeliceDB && typeof window.DeliceDB.getClient === 'function') {
                    const db = window.DeliceDB.getClient();
                    if (db) {
                        db.from('orders').insert([{
                            order_number: ordData.order_number,
                            customer_name: ordData.customer?.name || 'Customer',
                            customer_phone: ordData.customer?.phone || '',
                            customer_email: ordData.customer?.email || '',
                            delivery_address: ordData.customer?.address || 'Vadodara',
                            delivery_date: ordData.deliveryDate || new Date().toISOString().split('T')[0],
                            delivery_slot_text: ordData.deliverySlotText || 'Express 2-Hour',
                            subtotal: Number(ordData.subtotal || ordData.total || 0),
                            discount: Number(ordData.discount || 0),
                            total: Number(ordData.total || 0),
                            payment_method: ordData.paymentMethod || 'RAZORPAY',
                            payment_status: payStatus,
                            status: 'CONFIRMED',
                            special_instructions: ordData.specialInstructions || ''
                        }]).select().then(({ data: insOrders, error }) => {
                            if (!error && insOrders && insOrders.length > 0) {
                                const newOrderId = insOrders[0].id;
                                console.log('✅ Order synced to Supabase from client:', insOrders[0].order_number);

                                // Insert Line Items into order_items
                                if (Array.isArray(ordData.items) && ordData.items.length > 0) {
                                    const itemRows = ordData.items.map(it => ({
                                        order_id: newOrderId,
                                        product_name_snapshot: it.name || 'Artisan Cake',
                                        variant_snapshot: it.weight || 'Standard',
                                        quantity: Number(it.qty || it.quantity || 1),
                                        unit_price: Number(it.price || 0),
                                        total_price: Number(it.price || 0) * Number(it.qty || it.quantity || 1),
                                        cake_message: it.message || ''
                                    }));
                                    db.from('order_items').insert(itemRows).catch(e => console.warn('Order items insert notice:', e));
                                }

                                // Insert Payment row if online payment
                                if (payStatus === 'PAID') {
                                    db.from('payments').insert([{
                                        order_id: newOrderId,
                                        provider: 'razorpay',
                                        razorpay_payment_id: ordData.paymentId || ('pay_' + Date.now()),
                                        amount: Number(ordData.total || 0),
                                        currency: 'INR',
                                        status: 'captured'
                                    }]).catch(e => console.warn('Payment record notice:', e));
                                }
                            } else if (error) {
                                console.warn('Supabase direct insert notice:', error.message);
                            }
                        }).catch(e => {
                            console.log('Supabase direct insert notice:', e);
                        });
                    }
                }

                // 3. Central broadcast to API so all devices receive the new order
                try {
                    fetch('/api/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'create', order: ordData })
                    }).catch(() => {});
                } catch (e) {}
            } catch (e) {
                console.warn('Local order storage note:', e);
            }
        };

        // Universal Razorpay Launcher (Supports both Server Orders and Client-Side Standalone on Netlify)
        const launchPaymentGateway = async (payload) => {
            const { order, customer, onPaymentSuccess, onPaymentFailure } = payload;
            let activeKey = 'rzp_test_ThjQ4tQgJYio7w';
            let rzpOrderId = null;
            let isSimulated = false;
            let rzpAmount = Math.round(Number(order.total) * 100);

            // Attempt backend order creation if server is running
            try {
                const createRes = await fetch('/api/create-razorpay-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: Number(order.total),
                        currency: 'INR',
                        receipt: order.order_number,
                        notes: {
                            order_number: order.order_number,
                            customer_name: customer?.name || 'Customer',
                            customer_email: customer?.email || '',
                            customer_phone: customer?.phone || ''
                        }
                    })
                });

                if (createRes.ok) {
                    const rzpData = await createRes.json();
                    if (rzpData && rzpData.key_id) activeKey = rzpData.key_id;
                    if (rzpData && rzpData.is_simulated) isSimulated = true;
                    // Only use genuine Razorpay API order ID (must start with order_ and not be simulated)
                    if (rzpData && rzpData.order_id && !rzpData.is_simulated && !rzpData.order_id.startsWith('order_test_')) {
                        rzpOrderId = rzpData.order_id;
                    }
                    if (rzpData && rzpData.amount) rzpAmount = rzpData.amount;
                }
            } catch (err) {
                console.log('Static hosting mode: Proceeding with client-side Razorpay Gateway');
            }

            // Ensure Razorpay SDK is loaded
            if (!window.Razorpay) {
                try {
                    await new Promise((resolve) => {
                        const script = document.createElement('script');
                        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                        script.onload = () => resolve(true);
                        script.onerror = () => resolve(false);
                        document.head.appendChild(script);
                        setTimeout(() => resolve(false), 2500);
                    });
                } catch (e) {}
            }

            if (!window.Razorpay) {
                throw new Error('Razorpay Checkout SDK is still loading or blocked by an ad-blocker. Please check your internet connection or switch to Cash / UPI on Delivery.');
            }

            const options = {
                key: activeKey,
                amount: rzpAmount,
                currency: 'INR',
                name: 'DÉLICE & CO.',
                description: `Artisan Cake Order #${order.order_number}`,
                image: 'assets/cake_velvet.jpg',
                prefill: {
                    name: customer?.name || 'Customer',
                    contact: customer?.phone || '',
                    email: customer?.email || ''
                },
                theme: { color: '#C25E34' },
                handler: async function (response) {
                    // Try backend verification if server exists
                    try {
                        await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id || rzpOrderId || '',
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature || '',
                                order_data: order
                            })
                        });
                    } catch (e) {}

                    if (onPaymentSuccess) {
                        onPaymentSuccess({
                            orderNumber: order.order_number,
                            paymentId: response.razorpay_payment_id || 'pay_' + Date.now(),
                            total: order.total,
                            customerEmail: customer?.email
                        });
                    }
                },
                modal: {
                    ondismiss: function () {
                        const submitBtn = $('btnSubmitOrder');
                        const submitText = $('btnSubmitOrderText');
                        if (submitBtn) submitBtn.disabled = false;
                        if (submitText) submitText.textContent = 'Pay Securely via Razorpay (Test Mode)';
                        if (onPaymentFailure) {
                            onPaymentFailure({ message: 'Payment was cancelled. You can retry or select Cash/UPI on Delivery.' });
                        }
                    }
                }
            };

            // Only attach order_id if it's a real order ID created on Razorpay servers
            if (rzpOrderId && rzpOrderId.startsWith('order_') && !rzpOrderId.startsWith('order_test_') && !isSimulated) {
                options.order_id = rzpOrderId;
            }

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (errResp) {
                const submitBtn = $('btnSubmitOrder');
                const submitText = $('btnSubmitOrderText');
                if (submitBtn) submitBtn.disabled = false;
                if (submitText) submitText.textContent = 'Pay Securely via Razorpay (Test Mode)';
                if (onPaymentFailure) {
                    onPaymentFailure({ message: errResp.error?.description || 'Payment was declined by bank.' });
                }
            });
            rzp.open();
        };

        // Complete Order, Clear Cart & Basket, and Show Success Confirmation
        const finalizeAndRedirectToMain = (ordData, payStatus) => {
            ordData.payment_status = payStatus;
            saveOrderToClientStore(ordData, payStatus);

            // 1. Clear cart / order list completely
            cart = [];
            saveCart();
            updateCartUI();
            try { localStorage.removeItem('delice_cart'); } catch(e){}
            appliedCoupon = null;

            const couponInput = $('custCoupon');
            if (couponInput) couponInput.value = '';
            const couponMsg = $('couponStatusMsg');
            if (couponMsg) { couponMsg.style.display = 'none'; couponMsg.textContent = ''; }
            const sumBox = $('modalOrderSummaryBox');
            if (sumBox) sumBox.innerHTML = '';
            const orderForm = $('orderForm');
            if (orderForm) orderForm.reset();

            // 2. Launch celebration feedback & toast
            window.launchConfetti();
            window.playAudioTone('success');
            window.showToast(`🎉 Order #${ordData.order_number} Confirmed & Placed! Thank you for choosing Délice & Co. 🎂`);

            // 3. Render rich order confirmation screen inside modal
            window.renderOrderConfirmationScreen(ordData);

            // 4. Clean URL history
            try {
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch(e) {}
        };

        // Dedicated non-blocking helper for serverless email receipt dispatch
        const triggerOrderEmailReceipt = async (ordPayload) => {
            const custEmail = (ordPayload.customer?.email || '').trim();
            if (!custEmail) {
                console.warn('[ORDER EMAIL] No customer email provided; skipping email receipt dispatch.');
                return;
            }

            console.log(`[ORDER EMAIL] Requesting email receipt for order #${ordPayload.order_number} to ${custEmail}...`);
            try {
                const response = await fetch('/api/send-email-receipt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ order_data: ordPayload })
                });

                const contentType = response.headers.get('content-type') || '';
                let result = null;
                if (contentType.includes('application/json')) {
                    result = await response.json();
                } else {
                    const rawText = await response.text();
                    console.warn('[ORDER EMAIL] Warning: Non-JSON response from /api/send-email-receipt:', rawText.slice(0, 120));
                    return;
                }

                if (response.ok && result && result.success) {
                    console.log(`[ORDER EMAIL] ✅ Email successfully accepted by Resend (ID: ${result.email_id || 'OK'})`);
                } else {
                    console.warn(`[ORDER EMAIL] ⚠️ Email delivery notice (${response.status}):`, result?.error || result?.message || 'Email dispatch failed.');
                }
            } catch (networkErr) {
                console.warn('[ORDER EMAIL] ⚠️ Network error while dispatching receipt email:', networkErr.message || networkErr);
            }
        };

        try {
            if (selectedPaymentMethod === 'RAZORPAY') {
                await launchPaymentGateway({
                    order: orderPayload,
                    customer: orderPayload.customer,
                    onPaymentSuccess: async function (payRes) {
                        orderPayload.payment_status = 'PAID';
                        orderPayload.paymentId = payRes?.paymentId || payRes?.razorpay_payment_id || ('pay_' + Math.floor(10000000 + Math.random() * 90000000));

                        // Dispatch email receipt notice via Netlify Serverless Function
                        triggerOrderEmailReceipt(orderPayload);

                        finalizeAndRedirectToMain(orderPayload, 'PAID');
                    },
                    onPaymentFailure: function (err) {
                        alert(err.message || 'Payment was not completed. You can retry or choose Cash on Delivery.');
                        if (submitBtn) submitBtn.disabled = false;
                        if (submitText) submitText.textContent = 'Pay Securely via Razorpay (Test Mode)';
                    }
                });
            } else {
                // Cash / UPI on Delivery - Dispatch email receipt via Netlify Serverless Function
                triggerOrderEmailReceipt(orderPayload);

                orderPayload.payment_status = 'PENDING';
                orderPayload.paymentId = 'COD-' + Math.floor(100000 + Math.random() * 900000);
                finalizeAndRedirectToMain(orderPayload, 'PENDING');
            }
        } catch (err) {
            alert('Order notice: ' + (err.message || 'Please check order details.'));
            if (submitBtn) submitBtn.disabled = false;
            if (submitText) {
                submitText.textContent = selectedPaymentMethod === 'RAZORPAY' 
                    ? 'Pay Securely via Razorpay (Test Mode)' 
                    : 'Confirm Order (Pay on Delivery)';
            }
        }
    };

    /* =====================================================================
       4. ORDER COMPLETION HANDLERS (CLEAN CONFIRMATION)
       ===================================================================== */
    window.showOrderCompletionProfile = function () {};
    window.closeOrderProfileModal = function () {
        const overlay = $('orderProfileModalOverlay');
        if (overlay) overlay.classList.remove('open', 'active');
        document.body.style.overflow = '';
    };
    window.renderOrderConfirmationScreen = function (ordData) {
        if (!ordData) return;
        const modal = $('orderModal');
        const overlay = $('orderModalOverlay');
        const form = $('orderForm');
        const modalBody = $('orderModalBody');
        const confirmScreen = $('orderConfirmationScreen');
        const modalFooter = $('orderModalFooter');
        const titleEl = $('orderModalTitle');

        if (form) form.style.display = 'none';
        if (modalBody) modalBody.style.display = 'none';
        if (modalFooter) modalFooter.style.display = 'none';
        if (titleEl) titleEl.textContent = '🎉 Order Confirmed & Dispatched';

        const cust = ordData.customer || {};
        const custName = (cust.name || 'Valued Guest').trim();
        const custPhone = (cust.phone || '').trim();
        const custEmail = (cust.email || '').trim();
        const custAddress = (cust.address || 'Vadodara').trim();
        const deliveryDate = ordData.deliveryDate || 'Scheduled Date';
        const deliverySlot = ordData.deliverySlotText || ordData.deliverySlot || 'Express 2-Hour Delivery';
        const isPaid = ordData.payment_status === 'PAID';
        const totalAmount = Number(ordData.total || ordData.amount || 0);

        const items = ordData.items || [];
        const itemsHtml = items.map(item => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px dashed #E2E8F0; font-size:13px;">
                <div>
                    <strong style="color:var(--navy); font-size:13.5px;">${item.name || 'Artisan Cake'}</strong>
                    <div style="font-size:11.5px; color:#64748B;">${item.weight || 'Standard'} • Qty: ${item.qty || 1}${item.message ? ` • "${item.message}"` : ''}</div>
                </div>
                <div style="font-weight:700; color:var(--navy); font-size:14px;">₹${((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</div>
            </div>
        `).join('');

        const gmailReceiptUrl = window.generateGmailReceiptUrl ? window.generateGmailReceiptUrl(ordData) : null;

        if (confirmScreen) {
            confirmScreen.innerHTML = `
                <div style="padding:16px 20px 24px; text-align:center;">
                    <div style="width:64px; height:64px; margin:0 auto 12px; background:#ECFDF5; border:2px solid #6EE7B7; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:32px;">
                        ✨
                    </div>
                    <span style="display:inline-block; background:#ECFDF5; color:#047857; font-weight:700; font-size:12px; padding:3px 12px; border-radius:20px; border:1px solid #A7F3D0; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">
                        ✓ Baked with Passion in Vadodara
                    </span>
                    <h2 style="font-family:var(--font-heading, serif); font-size:22px; color:var(--navy); margin:4px 0 6px;">
                        Order #${ordData.order_number}
                    </h2>
                    <p style="font-size:13.5px; color:#64748B; margin:0 0 16px; line-height:1.5;">
                        Thank you, <strong>${custName}</strong>! Your artisanal cake order has been received and queued at our Akota Pâtisserie kitchen.
                    </p>

                    <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:14px 16px; text-align:left; font-size:13px; line-height:1.6; margin-bottom:16px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px; border-bottom:1px solid #E2E8F0; padding-bottom:6px;">
                            <span style="color:#64748B;">Delivery Schedule:</span>
                            <strong style="color:var(--navy);">${deliveryDate} • ${deliverySlot}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px; border-bottom:1px solid #E2E8F0; padding-bottom:6px;">
                            <span style="color:#64748B;">Recipient:</span>
                            <strong style="color:var(--navy);">${custName} (${custPhone})</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px; border-bottom:1px solid #E2E8F0; padding-bottom:6px;">
                            <span style="color:#64748B;">Address:</span>
                            <strong style="color:var(--navy); text-align:right; max-width:240px; word-break:break-word;">${custAddress}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px; border-bottom:1px solid #E2E8F0; padding-bottom:6px;">
                            <span style="color:#64748B;">Payment Status:</span>
                            <strong style="color:${isPaid ? '#047857' : '#D97706'};">
                                ${isPaid ? '✓ Paid Online (Razorpay Test Mode)' : '💵 Pay on Delivery (Cash / UPI)'}
                            </strong>
                        </div>
                        ${ordData.paymentId ? `
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px; border-bottom:1px solid #E2E8F0; padding-bottom:6px;">
                            <span style="color:#64748B;">Payment Ref:</span>
                            <code style="font-size:11.5px; color:#475569; background:#EDF2F7; padding:1px 6px; border-radius:4px;">${ordData.paymentId}</code>
                        </div>` : ''}

                        <div style="margin-top:10px;">
                            <div style="font-weight:700; color:var(--navy); margin-bottom:6px;">Cake Items Ordered:</div>
                            ${itemsHtml}
                        </div>

                        <div style="display:flex; justify-content:space-between; margin-top:12px; padding-top:10px; border-top:2px solid #CBD5E1; font-size:15px; font-weight:800; color:var(--navy);">
                            <span>Total Payable:</span>
                            <span style="color:var(--rust); font-size:17px;">₹${totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <a href="track.html?order=${ordData.order_number}" class="btn-cut" style="display:flex; align-items:center; justify-content:center; gap:8px; background:var(--navy); color:#FFFFFF; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:700; font-size:14px;">
                            <span>📍</span> Track Live Baking &amp; Delivery
                        </a>
                        <div style="display:flex; gap:8px; flex-wrap:wrap;">
                            <button type="button" onclick="window.print()" style="flex:1; min-width:130px; background:#F1F5F9; border:1px solid #CBD5E1; color:var(--navy); padding:10px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">
                                🖨️ Print Receipt
                            </button>
                            ${gmailReceiptUrl ? `
                            <a href="${gmailReceiptUrl}" target="_blank" rel="noopener" style="flex:1; min-width:130px; display:flex; align-items:center; justify-content:center; gap:6px; background:#F8FAFC; border:1px solid #CBD5E1; color:var(--navy); text-decoration:none; padding:10px; border-radius:8px; font-size:13px; font-weight:600;">
                                ✉️ Email Copy
                            </a>` : ''}
                            <button type="button" onclick="window.closeOrderModal()" style="flex:1; min-width:130px; background:var(--rust); border:none; color:#FFFFFF; padding:10px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">
                                🎂 Close &amp; Shop More
                            </button>
                        </div>
                    </div>
                </div>
            `;
            confirmScreen.style.display = 'block';
        }

        if (modal && overlay) {
            modal.style.display = 'flex';
            overlay.style.display = 'block';
            modal.classList.add('open', 'active');
            overlay.classList.add('open', 'active');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
    };

    // Generate formatted Gmail compose receipt URL
    window.generateGmailReceiptUrl = function (orderData) {
        const orderNum = orderData.order_number;
        const total = orderData.total;
        const customer = orderData.customer || {};
        const custName = (customer.name || 'Valued Customer').trim();
        const custEmail = (customer.email || '').trim();
        const address = (customer.address || 'Vadodara').trim();
        const date = orderData.deliveryDate || 'Scheduled Date';
        const slot = orderData.deliverySlotText || orderData.deliverySlot || 'Express 2-Hour Delivery';
        const payStatus = orderData.payment_status === 'PAID' 
            ? 'PAID via Razorpay Checkout ✓' 
            : 'Cash / UPI on Delivery (Pending)';

        const items = orderData.items || [];
        const itemsList = items.map((it, idx) => `  ${idx + 1}. ${it.name} (${it.weight || 'Standard'}) x${it.qty || 1} — ₹${(it.price * (it.qty || 1)).toLocaleString('en-IN')}`).join('\n');

        const emailSubject = `Official Patisserie Receipt: Order #${orderNum} — Délice & Co.`;
        const emailBody = 
`DÉLICE & CO. — ARTISAN PATISSERIE & CAKE STUDIO
Akota, Vadodara, Gujarat | Customer Care: +91 99094 44882
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OFFICIAL ORDER CONFIRMATION & RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear ${custName},

Thank you for choosing Délice & Co.! Your 100% pure veg & eggless artisan creation has been confirmed and scheduled in our kitchen.

ORDER SUMMARY:
• Order Number:    #${orderNum}
• Customer Name:   ${custName}
• Delivery Email:  ${custEmail}
• Delivery Phone:  ${customer.phone || 'N/A'}
• Delivery Date:   ${date}
• Delivery Slot:   ${slot}
• Delivery City:   Vadodara (Free Express Delivery)
• Delivery Address:
  ${address}

ORDERED ITEMS:
${itemsList || '  Artisan Celebration Cake'}

PAYMENT DETAILS:
• Subtotal:        ₹${Number(orderData.subtotal || total).toLocaleString('en-IN')}
• Discount:        ₹${Number(orderData.discount || 0).toLocaleString('en-IN')}
• Delivery Charge: ₹0 (FREE Express Vadodara)
• Total Paid:      ₹${Number(total).toLocaleString('en-IN')}
• Payment Method:  ${orderData.paymentMethod || 'Razorpay'}
• Payment Status:  ${payStatus}
${orderData.paymentId ? `• Razorpay Ref:    ${orderData.paymentId}\n` : ''}
DIETARY COMMITMENT:
All items prepared in our certified 100% Pure Veg (Eggless) artisan bakery with pure dairy butter and premium Belgian chocolate.

Warm regards,
Head Chef & The Délice Patisserie Team
Akota • Alkapuri • Vasna-Bhayli • Vadodara
Customer Support: +91 99094 44882 | orders@deliceandcake.in`;

        return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(custEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    };

    // Printable A4 Invoice Engine
    window.printOrderReceipt = function (orderData) {
        const orderNum = orderData.order_number || 'DL-RECEIPT';
        const total = orderData.total || 0;
        const subtotal = orderData.subtotal || total;
        const discount = orderData.discount || 0;
        const customer = orderData.customer || {};
        const items = orderData.items || [];
        const payStatus = orderData.payment_status === 'PAID' ? 'PAID via Razorpay ✓' : 'Pay on Delivery';

        const printWin = window.open('', '_blank', 'width=800,height=900');
        if (!printWin) {
            alert('Please allow popups to view and print the official PDF receipt.');
            return;
        }

        const itemsRows = items.map((it, idx) => `
            <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 10px 8px; font-size: 13px; color: #1E293B;">${idx + 1}</td>
                <td style="padding: 10px 8px; font-size: 13px; color: #1E293B;">
                    <strong>${it.name}</strong>
                    <div style="font-size: 11px; color: #64748B;">Weight: ${it.weight || 'Standard'} • 100% Pure Veg & Eggless</div>
                    ${it.message ? `<div style="font-size: 11px; color: #C25E34;">Piped Message: "${it.message}"</div>` : ''}
                </td>
                <td style="padding: 10px 8px; font-size: 13px; text-align: center; color: #1E293B;">${it.qty || 1}</td>
                <td style="padding: 10px 8px; font-size: 13px; text-align: right; color: #1E293B;">₹${Number(it.price).toLocaleString('en-IN')}</td>
                <td style="padding: 10px 8px; font-size: 13px; text-align: right; font-weight: 700; color: #0F172A;">₹${Number(it.price * (it.qty || 1)).toLocaleString('en-IN')}</td>
            </tr>
        `).join('');

        printWin.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Receipt #${orderNum} — Délice & Co.</title>
                <meta charset="utf-8">
                <style>
                    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; margin: 0; padding: 30px; color: #0F172A; background: #fff; }
                    .invoice-box { max-width: 720px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; padding: 30px; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #CBA46B; padding-bottom: 18px; margin-bottom: 20px; }
                    .brand { font-family: 'Georgia', serif; font-size: 26px; color: #1B3358; font-weight: 800; }
                    .badge-veg { display: inline-block; background: #DCFCE7; color: #15803D; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; margin-top: 4px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th { background: #F8FAFC; padding: 10px 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #475569; text-align: left; border-bottom: 1.5px solid #CBD5E1; }
                    .totals-table { width: 280px; margin-left: auto; margin-top: 15px; }
                    .totals-table td { padding: 6px 0; font-size: 13px; }
                    .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #E2E8F0; font-size: 11.5px; color: #64748B; text-align: center; }
                    @media print {
                        body { padding: 0; }
                        .invoice-box { border: none; padding: 0; }
                        .no-print { display: none !important; }
                    }
                </style>
            </head>
            <body>
                <div class="no-print" style="max-width:720px; margin:0 auto 15px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:13px; color:#64748B;">Official Délice &amp; Co. Tax Invoice</span>
                    <div>
                        <button onclick="window.print()" style="background:#1B3358; color:#fff; border:none; padding:8px 18px; border-radius:6px; font-weight:700; cursor:pointer;">🖨️ Print / Save PDF</button>
                    </div>
                </div>

                <div class="invoice-box">
                    <div class="header">
                        <div>
                            <div class="brand">DÉLICE &amp; CO.</div>
                            <div style="font-size:12px; color:#64748B; margin-top:2px;">Artisan Patisserie &amp; Cake Studio</div>
                            <div class="badge-veg">✓ 100% PURE VEG &amp; EGGLESS</div>
                            <div style="font-size:11.5px; color:#64748B; margin-top:4px;">Akota • Alkapuri • Vadodara, Gujarat</div>
                            <div style="font-size:11.5px; color:#64748B;">Support: +91 99094 44882 • orders@deliceandcake.in</div>
                        </div>
                        <div style="text-align: right;">
                            <h2 style="margin: 0 0 4px; font-size: 20px; color: #1B3358;">TAX INVOICE</h2>
                            <div style="font-size: 13px; font-weight: 700; color: #0B72E7;">#${orderNum}</div>
                            <div style="font-size: 12px; color: #64748B; margin-top: 4px;">Date: ${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</div>
                            <div style="font-size: 12px; font-weight: 700; color: ${orderData.payment_status === 'PAID' ? '#15803D' : '#D97706'}; margin-top: 4px;">${payStatus}</div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px;">
                        <div>
                            <div style="font-weight: 700; color: #475569; text-transform: uppercase; font-size: 11px; margin-bottom: 4px;">Billed To:</div>
                            <div style="font-weight: 700; color: #0F172A; font-size: 14px;">${customer.name || 'Valued Customer'}</div>
                            <div style="color: #475569;">Email: ${customer.email || 'N/A'}</div>
                            <div style="color: #475569;">Phone: ${customer.phone || 'N/A'}</div>
                        </div>
                        <div style="text-align: right; max-width: 280px;">
                            <div style="font-weight: 700; color: #475569; text-transform: uppercase; font-size: 11px; margin-bottom: 4px;">Delivery Destination:</div>
                            <div style="color: #0F172A;">${customer.address || 'Akota, Vadodara'}</div>
                            <div style="color: #475569; margin-top: 2px;">Slot: ${orderData.deliverySlotText || 'Express 2-Hour'}</div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style="width: 30px;">#</th>
                                <th>Item Description</th>
                                <th style="text-align: center; width: 60px;">Qty</th>
                                <th style="text-align: right; width: 90px;">Rate</th>
                                <th style="text-align: right; width: 100px;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsRows || '<tr><td colspan="5" style="text-align:center; padding:15px;">Artisan Cake Order</td></tr>'}
                        </tbody>
                    </table>

                    <div class="totals-table">
                        <table style="margin: 0;">
                            <tr>
                                <td style="color: #64748B;">Subtotal:</td>
                                <td style="text-align: right; font-weight: 600;">₹${Number(subtotal).toLocaleString('en-IN')}</td>
                            </tr>
                            ${discount > 0 ? `
                            <tr>
                                <td style="color: #15803D;">Discount:</td>
                                <td style="text-align: right; font-weight: 600; color: #15803D;">-₹${Number(discount).toLocaleString('en-IN')}</td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td style="color: #64748B;">Vadodara Delivery:</td>
                                <td style="text-align: right; font-weight: 600; color: #15803D;">FREE (₹0)</td>
                            </tr>
                            <tr style="border-top: 1.5px solid #0F172A; font-size: 15px;">
                                <td style="font-weight: 800; color: #1B3358; padding-top: 8px;">Grand Total:</td>
                                <td style="text-align: right; font-weight: 800; color: #1B3358; padding-top: 8px;">₹${Number(total).toLocaleString('en-IN')}</td>
                            </tr>
                        </table>
                    </div>

                    <div class="footer">
                        <p style="margin: 0 0 4px;">Thank you for ordering with <strong>Délice &amp; Co. Artisan Patisserie</strong>!</p>
                        <p style="margin: 0;">Certified 100% Pure Veg (Eggless) Kitchen • Freshly Baked with Pure Dairy Butter • Akota, Vadodara</p>
                    </div>
                </div>
            </body>
            </html>
        `);
        printWin.document.close();
    };

    // Customer Portal: "My Orders" Modal
    window.openMyOrdersModal = async function () {
        let modal = $('myOrdersModal');
        let overlay = $('myOrdersOverlay');

        if (!modal) {
            overlay = document.createElement('div');
            overlay.id = 'myOrdersOverlay';
            overlay.style.cssText = `
                position: fixed; inset: 0; background: rgba(15, 23, 42, 0.78);
                backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
                z-index: 100010; display: flex; align-items: center; justify-content: center;
                padding: 16px; font-family: 'Inter', system-ui, -apple-system, sans-serif;
            `;

            modal = document.createElement('div');
            modal.id = 'myOrdersModal';
            modal.style.cssText = `
                background: #ffffff; border-radius: 16px; max-width: 580px; width: 100%;
                max-height: 88vh; display: flex; flex-direction: column; overflow: hidden;
                box-shadow: 0 25px 60px rgba(0,0,0,0.35); border: 1px solid #E2E8F0;
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }

        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        const renderPortal = async (searchQuery = '') => {
            modal.innerHTML = `
                <div style="background:linear-gradient(135deg, #1B3358 0%, #0F172A 100%); color:#fff; padding:18px 22px; display:flex; align-items:center; justify-content:space-between;">
                    <div>
                        <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.5px; color:#CBA46B; font-weight:700;">Customer Portal</span>
                        <h3 style="margin:2px 0 0; color:#fff; font-size:18px;">My Artisan Orders</h3>
                    </div>
                    <button type="button" id="closeMyOrdersBtn" style="background:rgba(255,255,255,0.15); border:none; color:#fff; padding:6px 10px; border-radius:6px; font-size:14px; cursor:pointer;">✕</button>
                </div>

                <div style="padding:16px 20px; border-bottom:1px solid #E2E8F0; background:#F8FAFC;">
                    <div style="display:flex; gap:8px;">
                        <input type="text" id="myOrdersSearchInput" placeholder="Enter your 10-digit mobile number or Gmail..." value="${searchQuery}" style="flex:1; padding:10px 14px; border:1px solid #CBD5E1; border-radius:8px; font-size:13.5px; outline:none;">
                        <button type="button" id="myOrdersSearchBtn" style="background:#1B3358; color:#fff; border:none; border-radius:8px; padding:10px 16px; font-weight:700; font-size:13px; cursor:pointer;">Search</button>
                    </div>
                </div>

                <div id="myOrdersListContainer" style="padding:20px; overflow-y:auto; flex:1;">
                    <div style="text-align:center; padding:30px 10px; color:#64748B;">
                        <div style="font-size:36px; margin-bottom:8px;">⏳</div>
                        <div>Loading your patisserie orders from Supabase database...</div>
                    </div>
                </div>
            `;

            $('closeMyOrdersBtn')?.addEventListener('click', () => {
                overlay.style.display = 'none';
                document.body.style.overflow = '';
            });

            $('myOrdersSearchBtn')?.addEventListener('click', () => {
                const val = ($('myOrdersSearchInput')?.value || '').trim();
                renderPortal(val);
            });

            $('myOrdersSearchInput')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const val = ($('myOrdersSearchInput')?.value || '').trim();
                    renderPortal(val);
                }
            });

            // Fetch orders
            try {
                let allOrders = [];
                const res = await fetch('/api/orders').catch(() => null);
                if (res && res.ok) {
                    const data = await res.json();
                    if (data && data.orders) allOrders = data.orders;
                }

                if (allOrders.length === 0) {
                    allOrders = JSON.parse(localStorage.getItem('delice_orders') || '[]');
                }

                const listEl = $('myOrdersListContainer');
                if (!listEl) return;

                const q = searchQuery.toLowerCase().trim();
                let filtered = allOrders;
                if (q) {
                    filtered = allOrders.filter(o => 
                        (o.order_number && o.order_number.toLowerCase().includes(q)) ||
                        (o.customer_phone && o.customer_phone.includes(q)) ||
                        (o.customer_email && o.customer_email.toLowerCase().includes(q)) ||
                        (o.customer?.phone && o.customer.phone.includes(q)) ||
                        (o.customer?.email && o.customer.email.toLowerCase().includes(q))
                    );
                }

                if (filtered.length === 0) {
                    listEl.innerHTML = `
                        <div style="text-align:center; padding:40px 10px; color:#64748B;">
                            <div style="font-size:42px; margin-bottom:10px;">🍰</div>
                            <h4 style="color:#0F172A; margin:0 0 6px;">No Orders Found</h4>
                            <p style="font-size:13px; margin:0 0 16px;">${q ? 'No orders matched your search criteria.' : 'You have not placed any orders yet on this device.'}</p>
                            <button type="button" onclick="document.getElementById('myOrdersOverlay').style.display='none'; window.location.href='menu.html';" style="background:#1B3358; color:#fff; border:none; padding:10px 18px; border-radius:8px; font-weight:700; cursor:pointer;">
                                Explore Patisserie Menu
                            </button>
                        </div>
                    `;
                    return;
                }

                listEl.innerHTML = filtered.map(ord => {
                    const ordNum = ord.order_number;
                    const total = ord.total || 0;
                    const status = ord.status || 'CONFIRMED';
                    const payStatus = ord.payment_status || 'PENDING';
                    const items = ord.items || [];
                    const itemsText = items.map(i => `${i.quantity || i.qty || 1}x ${i.product_name_snapshot || i.name}`).join(', ');

                    return `
                        <div style="background:#fff; border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                                <div>
                                    <span style="font-weight:800; color:#1B3358; font-size:15px;">#${ordNum}</span>
                                    <div style="font-size:12px; color:#64748B;">${ord.created_at ? new Date(ord.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : 'Recent'}</div>
                                </div>
                                <div style="text-align:right;">
                                    <span style="font-weight:800; color:#0F172A; font-size:16px;">₹${Number(total).toLocaleString('en-IN')}</span>
                                    <div>
                                        <span style="font-size:11px; font-weight:700; color:${payStatus === 'PAID' ? '#15803D' : '#0369A1'}; background:${payStatus === 'PAID' ? '#DCFCE7' : '#E0F2FE'}; padding:2px 8px; border-radius:4px;">
                                            ${payStatus === 'PAID' ? 'PAID ✓' : 'Pay on Delivery'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style="font-size:13px; color:#475569; margin-bottom:10px;">
                                <strong>Items:</strong> ${itemsText || 'Artisan Celebration Cake'}
                            </div>

                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:10px;">
                                <span style="font-size:12.5px; font-weight:700; color:#15803D;">Milestone: ${(status).replace(/_/g, ' ')}</span>
                                <div style="display:flex; gap:8px;">
                                    <button type="button" onclick="window.printOrderReceipt(${JSON.stringify(ord).replace(/"/g, '&quot;')})" style="background:#1B3358; border:none; color:#fff; padding:6px 14px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">
                                        📄 View Receipt
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

            } catch (e) {
                console.warn('Orders fetch error:', e);
            }
        };

        renderPortal();
    };

    // Embedded in-page Live Order Milestone Tracker Modal (Guarantees no 404 on any page)
    window.openLiveTrackerModal = async function (orderNum) {
        if (!orderNum) return;
        if (window.location.pathname.includes('track.html')) return;

        let overlay = $('liveTrackerModalOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'liveTrackerModalOverlay';
            overlay.style.cssText = `
                position: fixed; inset: 0; background: rgba(15, 23, 42, 0.78);
                backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
                z-index: 100005; display: flex; align-items: center; justify-content: center;
                padding: 16px; font-family: 'Inter', system-ui, -apple-system, sans-serif;
            `;
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div style="background:#fff; border-radius:16px; max-width:540px; width:100%; box-shadow:0 25px 60px rgba(0,0,0,0.3); border:1px solid #E2E8F0; padding:28px; text-align:center;">
                <div style="font-size:36px; margin-bottom:10px;">⏳</div>
                <h3 style="color:#0F172A; margin:0 0 6px;">Loading Order #${orderNum}...</h3>
                <p style="color:#64748B; font-size:14px; margin:0;">Connecting to Délice &amp; Co. Kitchen Database...</p>
            </div>
        `;

        try {
            const res = await window.DeliceDB.trackOrder(orderNum);
            if (!res.success) {
                overlay.innerHTML = `
                    <div style="background:#fff; border-radius:16px; max-width:480px; width:100%; box-shadow:0 25px 60px rgba(0,0,0,0.3); border:1px solid #E2E8F0; padding:28px; text-align:center;">
                        <div style="font-size:42px; margin-bottom:12px;">🍰</div>
                        <h3 style="color:#0F172A; margin:0 0 8px;">Order Reference Not Found</h3>
                        <p style="color:#64748B; font-size:14px; margin:0 0 20px;">We couldn't locate order #${orderNum}. Please check the reference number or contact our kitchen directly.</p>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <a href="tel:+919909444882" style="background:var(--navy, #1B3358); color:#fff; text-decoration:none; padding:12px; border-radius:8px; font-weight:700; font-size:14px; text-align:center;">
                                📞 Call Kitchen Support (+91 99094 44882)
                            </a>
                            <button type="button" onclick="document.getElementById('liveTrackerModalOverlay').style.display='none'" style="background:#F1F5F9; border:none; color:#475569; padding:10px; border-radius:8px; font-weight:600; cursor:pointer;">
                                Close
                            </button>
                        </div>
                    </div>
                `;
                return;
            }

            const ord = res.order;
            const items = res.items || [];
            const MILESTONES = [
                { key: 'PLACED', label: 'Placed' },
                { key: 'CONFIRMED', label: 'Confirmed' },
                { key: 'PREPARING', label: 'Kitchen Prep' },
                { key: 'BAKING', label: 'Baking' },
                { key: 'READY', label: 'Ready' },
                { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
                { key: 'DELIVERED', label: 'Delivered' }
            ];

            const curIdx = MILESTONES.findIndex(m => m.key === ord.status);
            const activeIdx = curIdx > -1 ? curIdx : 1;

            const itemsHtml = items.map(it => `
                <div style="display:flex; justify-content:space-between; font-size:13.5px; padding:6px 0; border-bottom:1px solid #F1F5F9;">
                    <span><strong>${it.qty}x</strong> ${it.name} <small style="color:#64748B;">(${it.weight})</small></span>
                    <strong style="color:#0F172A;">₹${Number(it.total || it.price).toLocaleString('en-IN')}</strong>
                </div>
            `).join('');

            overlay.innerHTML = `
                <div style="background:#fff; border-radius:16px; max-width:540px; width:100%; max-height:90vh; overflow-y:auto; box-shadow:0 25px 60px rgba(0,0,0,0.3); border:1px solid #E2E8F0; text-align:left;">
                    <div style="background:linear-gradient(135deg, #1B3358 0%, #0F172A 100%); color:#fff; padding:18px 22px; display:flex; align-items:center; justify-content:space-between; border-radius:16px 16px 0 0;">
                        <div>
                            <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.5px; color:#CBA46B; font-weight:700;">Live Kitchen Tracking</span>
                            <h3 style="margin:2px 0 0; color:#fff; font-size:18px;">Order #${ord.order_number}</h3>
                        </div>
                        <button type="button" onclick="document.getElementById('liveTrackerModalOverlay').style.display='none'" style="background:rgba(255,255,255,0.15); border:none; color:#fff; padding:6px 10px; border-radius:6px; font-size:14px; cursor:pointer;">✕</button>
                    </div>

                    <div style="padding:20px 22px;">
                        <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:10px; padding:12px 14px; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between;">
                            <div>
                                <span style="font-size:11.5px; color:#166534; font-weight:600; text-transform:uppercase;">Current Milestone:</span>
                                <div style="font-size:16px; font-weight:800; color:#15803D;">${(ord.status || 'CONFIRMED').replace(/_/g, ' ')}</div>
                            </div>
                            <span style="font-size:24px;">🎂</span>
                        </div>

                        <div style="display:flex; justify-content:space-between; position:relative; margin-bottom:22px; padding:0 6px;">
                            ${MILESTONES.map((m, idx) => {
                                const isDone = idx <= activeIdx;
                                const isCurrent = idx === activeIdx;
                                return `
                                    <div style="text-align:center; flex:1; position:relative;">
                                        <div style="width:24px; height:24px; border-radius:50%; background:${isDone ? '#1B3358' : '#E2E8F0'}; color:${isDone ? '#fff' : '#94A3B8'}; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; margin:0 auto 4px; ${isCurrent ? 'box-shadow:0 0 0 3px rgba(27,51,88,0.25);' : ''}">
                                            ${isDone ? '✓' : idx + 1}
                                        </div>
                                        <div style="font-size:9.5px; color:${isDone ? '#0F172A' : '#94A3B8'}; font-weight:${isCurrent ? '800' : '600'}; line-height:1.1;">
                                            ${m.label}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>

                        <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:14px; margin-bottom:18px;">
                            <div style="font-size:12px; font-weight:700; color:#64748B; text-transform:uppercase; margin-bottom:6px;">Items in Preparation:</div>
                            ${itemsHtml || '<div style="font-size:13px; color:#64748B;">Artisan Cake Selection</div>'}
                            <div style="display:flex; justify-content:space-between; margin-top:8px; padding-top:8px; border-top:1px dashed #CBD5E1; font-weight:800; font-size:15px; color:#1B3358;">
                                <span>Total Payable:</span>
                                <span>₹${Number(ord.total).toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <a href="tel:+919909444882" style="background:var(--navy, #1B3358); color:#fff; text-decoration:none; padding:12px; border-radius:8px; font-weight:700; font-size:14px; text-align:center; display:flex; align-items:center; justify-content:center; gap:8px;">
                                <span>📞 Call Kitchen Directly (+91 99094 44882)</span>
                            </a>
                            <button type="button" onclick="document.getElementById('liveTrackerModalOverlay').style.display='none'" style="background:#F1F5F9; border:none; color:#475569; padding:10px; border-radius:8px; font-weight:600; cursor:pointer;">
                                Close Tracker
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } catch (err) {
            overlay.innerHTML = `
                <div style="background:#fff; border-radius:16px; max-width:480px; width:100%; padding:24px; text-align:center;">
                    <p style="color:#DC2626;">Error loading tracking details: ${err.message}</p>
                    <button type="button" onclick="document.getElementById('liveTrackerModalOverlay').style.display='none'" style="padding:8px 16px; background:#E2E8F0; border:none; border-radius:6px; cursor:pointer;">Close</button>
                </div>
            `;
        }
    };

    /* =====================================================================
       4. BESPOKE CUSTOM CAKE STUDIO (CAPTURES INQUIRY & SYNCS TO DASHBOARD)
       ===================================================================== */
    window.calcCustomPrice = function () {
        // Check for index.html selects
        const flavourSel = $('cFlavour');
        const weightSel = $('cWeight');
        const priceDisp = $('customPriceDisplay');
        if (flavourSel && weightSel && priceDisp) {
            const optF = (flavourSel.options && flavourSel.selectedIndex >= 0) ? flavourSel.options[flavourSel.selectedIndex] : null;
            const optW = (weightSel.options && weightSel.selectedIndex >= 0) ? weightSel.options[weightSel.selectedIndex] : null;
            const rate = parseInt(optF?.getAttribute('data-rate') || '900', 10);
            const mult = parseFloat(optW?.getAttribute('data-mult') || '1.85');
            const total = Math.round(rate * mult);
            priceDisp.textContent = `₹${total.toLocaleString('en-IN')}`;

            // Sync visual preview on index.html
            const previewImg = $('customPreviewImg');
            if (previewImg && flavourSel.value) {
                const fVal = flavourSel.value.toLowerCase();
                if (fVal.includes('truffle') || fVal.includes('chocolate')) previewImg.src = 'assets/cake_chocolate.jpg';
                else if (fVal.includes('velvet') || fVal.includes('rose')) previewImg.src = 'assets/cake_velvet.jpg';
                else if (fVal.includes('strawberry')) previewImg.src = 'assets/cake_strawberry.jpg';
                else if (fVal.includes('pistachio')) previewImg.src = 'assets/cake_pistachio.jpg';
                else if (fVal.includes('pineapple')) previewImg.src = 'assets/cake_pineapple.jpg';
                else if (fVal.includes('bento')) previewImg.src = 'assets/cake_bento.jpg';
            }
            return total;
        }

        // Check for custom.html 2.5D visualizer state
        if (typeof window.getCustomCakeDesignState === 'function') {
            try {
                const design = window.getCustomCakeDesignState();
                if (design && design.price) return design.price;
            } catch (e) {}
        }

        // Check for custom.html studio chips
        const activeSize = document.querySelector('#sizeSelector .studio-chip-btn.active');
        const activeFlav = document.querySelector('#flavorSelector .studio-chip-btn.active');
        const studioPriceEl = $('studioPrice');
        if (activeSize && activeFlav && studioPriceEl) {
            const base = parseInt(activeFlav.getAttribute('data-base') || '849', 10);
            const mult = parseFloat(activeSize.getAttribute('data-mult') || '1');
            const total = Math.round(base * mult);
            studioPriceEl.textContent = `₹${total.toLocaleString('en-IN')}`;
            return total;
        }

        return 1665;
    };

    window.submitCustomCake = function () {
        // Collect from custom.html or index.html
        let name = '';
        let phone = '';
        let flavour = '';
        let weight = '';
        let diet = '100% Pure Veg (Eggless)';
        let date = 'Next Available Slot';
        let message = '';
        let notes = '';
        let total = 0;

        if ($('customCustName') || $('sizeSelector')) {
            // custom.html page
            name = ($('customCustName')?.value || '').trim();
            phone = ($('customCustPhone')?.value || '').trim();
            const activeFlav = document.querySelector('#flavorSelector .studio-chip-btn.active');
            flavour = activeFlav?.getAttribute('data-title') || $('studioCakeTitle')?.textContent || 'Belgian Dark Truffle';
            const activeSize = document.querySelector('#sizeSelector .studio-chip-btn.active');
            weight = activeSize?.getAttribute('data-label') || $('studioTierBadge')?.textContent || '1/2 kg (Serves 4–6)';
            const activeDiet = document.querySelector('#dietSelector .studio-chip-btn.active');
            diet = activeDiet?.getAttribute('data-diet') || '100% Pure Veg (Eggless)';
            date = $('customDeliveryDate')?.value || 'Next Available Slot';
            message = ($('cakeMessageInput')?.value || '').trim();
            notes = ($('customThemeInput')?.value || '').trim();
            total = window.calcCustomPrice();
        } else {
            // index.html form
            name = ($('cCustName')?.value || '').trim();
            phone = ($('cCustPhone')?.value || '').trim();
            flavour = $('cFlavour')?.value || 'Velvet Rose & Wild Berry';
            weight = $('cWeight')?.value || '1 kg (Serves 8–12)';
            diet = $('cDiet')?.value || '100% Eggless';
            date = $('cDate')?.value || 'Next Available Slot';
            message = ($('cMessage')?.value || '').trim();
            notes = ($('cNotes')?.value || '').trim();
            total = window.calcCustomPrice();
        }

        // Validate Customer Detail
        if (!name) {
            name = prompt('Please enter your full name for this custom cake inquiry:');
            if (!name) return;
        }
        if (!phone) {
            phone = prompt('Please enter your mobile phone number so our chef can connect:');
            if (!phone) return;
        }

        // 1. SAVE CUSTOM CAKE REQUEST FOR ADMIN DASHBOARD
        const customReqId = 'CC-' + Math.floor(100000 + Math.random() * 900000);
        const customReq = {
            id: customReqId,
            customer: {
                name: name,
                phone: phone
            },
            flavour: flavour,
            weight: weight,
            dietary: diet,
            deliveryDate: date,
            cakeMessage: message || 'None',
            notes: notes || 'None',
            estimatedPrice: total,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        try {
            const existingCustom = JSON.parse(localStorage.getItem('delice_custom_cakes') || '[]');
            existingCustom.unshift(customReq);
            localStorage.setItem('delice_custom_cakes', JSON.stringify(existingCustom));
        } catch (e) {
            console.warn('Storage save notice:', e);
        }

        // Also sync to Supabase custom_cake_orders table via backend
        try {
            fetch('/api/custom-cakes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: name,
                    customer_phone: phone,
                    flavour: flavour,
                    weight: weight,
                    dietary_requirement: diet,
                    cake_message: message || 'None',
                    delivery_date: date || null,
                    delivery_slot: 'Custom Studio Request',
                    estimated_price: total,
                    status: 'PENDING'
                })
            }).catch(err => console.warn('Custom cake backend sync notice:', err));
        } catch (e) {}

        window.showToast('🎂 Custom cake request submitted to kitchen!');

        // Display customer inquiry confirmation modal
        let overlay = $('customCakeConfirmModal');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'customCakeConfirmModal';
            overlay.style.cssText = `
                position: fixed; inset: 0; background: rgba(15, 23, 42, 0.78);
                backdrop-filter: blur(6px); z-index: 100015; display: flex;
                align-items: center; justify-content: center; padding: 16px;
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
            `;
            document.body.appendChild(overlay);
        }

        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div style="background:#fff; border-radius:16px; max-width:480px; width:100%; padding:28px; text-align:center; box-shadow:0 25px 60px rgba(0,0,0,0.3); border:1px solid #E2E8F0;">
                <div style="font-size:44px; margin-bottom:12px;">🎨</div>
                <h3 style="font-family:'Playfair Display', serif; color:#1B3358; margin:0 0 8px; font-size:22px;">Custom Cake Request Received!</h3>
                <p style="color:#64748B; font-size:14px; margin:0 0 16px;">Our head chef has received your bespoke cake specifications (<strong>${flavour}</strong>, ${weight}). We will contact you at <strong>${phone}</strong> shortly to review decoration details.</p>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:12px; font-size:13px; margin-bottom:18px; text-align:left;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span style="color:#64748B;">Estimated Quote:</span>
                        <strong style="color:#1B3358;">₹${total.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:#64748B;">Dietary:</span>
                        <span style="font-weight:600; color:#166534;">${diet}</span>
                    </div>
                </div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <a href="tel:+919909444882" style="background:var(--navy, #1B3358); color:#fff; text-decoration:none; padding:12px; border-radius:8px; font-weight:700; font-size:14px;">
                        📞 Call Chef Directly (+91 99094 44882)
                    </a>
                    <button type="button" onclick="document.getElementById('customCakeConfirmModal').style.display='none'" style="background:#F1F5F9; border:none; color:#475569; padding:10px; border-radius:8px; font-weight:600; cursor:pointer;">
                        Back to Cake Studio
                    </button>
                </div>
            </div>
        `;
    };

    /* =====================================================================
       5. HERO CAROUSEL AUTO-SLIDER
       ===================================================================== */
    const heroTrack = $('heroTrack');
    const heroDots = $$('#heroDots span');
    let currentSlide = 0;
    const totalSlides = heroDots.length || 3;
    let slideTimer = null;

    function goToSlide(idx) {
        if (!heroTrack) return;
        currentSlide = (idx + totalSlides) % totalSlides;
        heroTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        heroDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function startSlider() {
        stopSlider();
        slideTimer = setInterval(() => goToSlide(currentSlide + 1), 4800);
    }

    function stopSlider() {
        if (slideTimer) clearInterval(slideTimer);
    }

    if (heroTrack && totalSlides > 0) {
        heroDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                goToSlide(idx);
                startSlider();
            });
        });

        heroTrack.addEventListener('mouseenter', stopSlider);
        heroTrack.addEventListener('mouseleave', startSlider);

        // Mobile touch swipe
        let touchStartX = 0;
        heroTrack.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            stopSlider();
        }, { passive: true });

        heroTrack.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (diff > 45) goToSlide(currentSlide + 1);
            else if (diff < -45) goToSlide(currentSlide - 1);
            startSlider();
        });

        startSlider();
    }

    /* =====================================================================
       6. LIVE SEARCH & FILTERING
       ===================================================================== */
    const searchInput = $('searchInput');
    const searchSuggest = $('searchSuggest');
    const searchInputMobile = $('searchInputMobile');

    function executeLiveSearch(query) {
        const q = (query || '').trim().toLowerCase();
        if (!q) {
            if (searchSuggest) searchSuggest.hidden = true;
            $$('.product-card').forEach(c => c.style.display = '');
            return;
        }

        const cards = $$('.product-card');
        const matches = [];

        cards.forEach(card => {
            const name = (card.getAttribute('data-name') || '').toLowerCase();
            const desc = (card.querySelector('.product-desc-short')?.textContent || '').toLowerCase();
            const matched = name.includes(q) || desc.includes(q);
            card.style.display = matched ? '' : 'none';

            if (matched) {
                matches.push({
                    id: card.getAttribute('data-id'),
                    name: card.getAttribute('data-name'),
                    price: card.getAttribute('data-price'),
                    img: card.getAttribute('data-img')
                });
            }
        });

        if (searchSuggest) {
            if (matches.length > 0) {
                searchSuggest.hidden = false;
                searchSuggest.innerHTML = matches.slice(0, 5).map(m => `
                    <div class="search-suggest-item" onclick="window.selectSearchResult('${m.id}')" style="display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;">
                        <img src="${m.img}" alt="${m.name}" style="width:36px;height:36px;border-radius:4px;object-fit:cover;">
                        <div>
                            <div style="font-weight:600;font-size:13px;color:var(--navy);">${m.name}</div>
                            <div style="font-size:12px;color:var(--rust);font-weight:700;">₹${m.price} onwards</div>
                        </div>
                    </div>
                `).join('');
            } else {
                searchSuggest.hidden = false;
                searchSuggest.innerHTML = `
                    <div style="padding:10px 12px;font-size:12.5px;color:var(--text-muted);">
                        No cakes found for "${query}". Try "truffle", "velvet", or "bento".
                    </div>
                `;
            }
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', e => executeLiveSearch(e.target.value));
        searchInput.addEventListener('blur', () => {
            setTimeout(() => { if (searchSuggest) searchSuggest.hidden = true; }, 250);
        });
    }

    if (searchInputMobile) {
        searchInputMobile.addEventListener('input', e => executeLiveSearch(e.target.value));
    }

    window.selectSearchResult = function (id) {
        const card = document.querySelector(`.product-card[data-id="${id}"]`);
        if (!card) return;
        if (searchSuggest) searchSuggest.hidden = true;
        $$('.product-card').forEach(c => c.style.display = '');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('pulse');
        setTimeout(() => card.classList.remove('pulse'), 1500);
    };

    window.searchCakes = function () {
        const q = (searchInput?.value || searchInputMobile?.value || '').trim();
        executeLiveSearch(q);
        const cakesSec = $('cakes');
        if (cakesSec) cakesSec.scrollIntoView({ behavior: 'smooth' });
    };

    window.filterCategory = function (category) {
        const cards = $$('.product-card');
        cards.forEach(card => {
            if (category === 'all') {
                card.style.display = '';
            } else {
                const name = (card.getAttribute('data-name') || '').toLowerCase();
                const isMatch = name.includes(category);
                card.style.display = isMatch ? '' : 'none';
            }
        });
        const cakesSec = $('cakes');
        if (cakesSec) cakesSec.scrollIntoView({ behavior: 'smooth' });
    };

    /* =====================================================================
       8. CUSTOMER CARE FAB & MOBILE NAVIGATION / DRAWER BINDINGS
       ===================================================================== */
    const jbHelpFab = $('jbHelpFab');
    const jbHelpPanel = $('jbHelpPanel');

    if (jbHelpFab && jbHelpPanel) {
        jbHelpFab.addEventListener('click', e => {
            e.stopPropagation();
            const isOpen = jbHelpPanel.classList.contains('open');
            jbHelpPanel.classList.toggle('open', !isOpen);
            jbHelpFab.setAttribute('aria-expanded', !isOpen);
        });

        document.addEventListener('click', e => {
            if (!jbHelpPanel.contains(e.target) && e.target !== jbHelpFab) {
                jbHelpPanel.classList.remove('open');
                jbHelpFab.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Hamburger button binding for storefront pages
    const hamburgerBtn = $('hamburgerBtn');
    const headerBottom = document.querySelector('.header-bottom');

    if (hamburgerBtn && headerBottom) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = headerBottom.classList.toggle('open');
            hamburgerBtn.textContent = isOpen ? '✕' : '☰';
            hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        headerBottom.querySelectorAll('a, button').forEach(link => {
            link.addEventListener('click', () => {
                headerBottom.classList.remove('open');
                if (hamburgerBtn) {
                    hamburgerBtn.textContent = '☰';
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (headerBottom.classList.contains('open') && !headerBottom.contains(e.target) && e.target !== hamburgerBtn && !hamburgerBtn.contains(e.target)) {
                headerBottom.classList.remove('open');
                if (hamburgerBtn) {
                    hamburgerBtn.textContent = '☰';
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && headerBottom.classList.contains('open')) {
                headerBottom.classList.remove('open');
                if (hamburgerBtn) {
                    hamburgerBtn.textContent = '☰';
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    // Burger button binding for other pages (menu.html, custom.html, about.html)
    const burger = $('burger');
    const navList = $('navList');
    if (burger && navList) {
        burger.addEventListener('click', e => {
            e.stopPropagation();
            const isOpen = navList.classList.contains('show') || navList.classList.contains('open');
            navList.classList.toggle('show', !isOpen);
            navList.classList.toggle('open', !isOpen);
            burger.setAttribute('aria-expanded', !isOpen);
        });

        document.addEventListener('click', e => {
            if (!navList.contains(e.target) && e.target !== burger) {
                navList.classList.remove('show', 'open');
                burger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Cart trigger buttons (Desktop Header & Mobile Bottom Bar)
    $$('#cartTriggerBtn, .cart-trigger, #mobCartBtn, .cart-link').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            window.toggleCart();
        });
    });

    // Cart close button
    const cartCloseBtn = $('cartCloseBtn');
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', () => window.toggleCart());
    }

    // Cart Checkout button in Cart Drawer -> Opens Order Modal with Customer Details
    $$('#cartCheckoutBtn, .btn-checkout-wa').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            window.openOrderModalForCart();
        });
    });

    // Cart drawer overlay
    const cartOverlay = $('cartOverlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => window.toggleCart());
    }

    /* =====================================================================
       9. BESPOKE CUSTOM STUDIO CHIPS INTERACTION (custom.html)
       ===================================================================== */
    function initCustomStudio() {
        // Size Selector
        $$('#sizeSelector .studio-chip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('#sizeSelector .studio-chip-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const tierBadge = $('studioTierBadge');
                if (tierBadge) {
                    const label = btn.getAttribute('data-label') || btn.textContent.trim();
                    tierBadge.textContent = label;
                }
                window.calcCustomPrice();
            });
        });

        // Flavor Selector
        $$('#flavorSelector .studio-chip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('#flavorSelector .studio-chip-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const cakeImg = $('studioCakeImg');
                const cakeTitle = $('studioCakeTitle');

                const img = btn.getAttribute('data-img');
                const title = btn.getAttribute('data-title');

                if (cakeImg && img) cakeImg.src = img;
                if (cakeTitle && title) cakeTitle.textContent = title;

                window.calcCustomPrice();
            });
        });

        // Dietary Selector
        $$('#dietSelector .studio-chip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('#dietSelector .studio-chip-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const cakeDesc = $('studioCakeDesc');
                const diet = btn.getAttribute('data-diet') || btn.textContent.trim();
                if (cakeDesc) cakeDesc.textContent = `${diet} • Pure Dairy Butter`;
            });
        });

        // Message input live sync to preview
        const cakeMsgInput = $('cakeMessageInput');
        const studioPiping = $('studioPipingText');
        if (cakeMsgInput && studioPiping) {
            cakeMsgInput.addEventListener('input', () => {
                const text = cakeMsgInput.value.trim();
                studioPiping.textContent = text ? `"${text}"` : '"Happy Birthday"';
            });
        }

        // Submit Order button on custom.html
        const customOrderBtn = $('customOrderSubmitBtn') || $('customOrderWhatsAppBtn');
        if (customOrderBtn) {
            customOrderBtn.addEventListener('click', () => {
                window.submitCustomCake();
            });
        }
    }

    /* =====================================================================
       10. CAKE MENU CATALOG RENDERING (menu.html)
       ===================================================================== */
    async function renderMenuCatalog() {
        const grid = $('menuGrid');
        const chipsContainer = $('chips');
        if (!grid) return;

        let cakesList = ALL_MENU_CAKES;
        if (window.DeliceDB && typeof window.DeliceDB.fetchProducts === 'function') {
            try {
                const dbProducts = await window.DeliceDB.fetchProducts();
                if (dbProducts && dbProducts.length > 0) {
                    cakesList = dbProducts.map(p => {
                        const vars = p.variants || [];
                        const var1 = vars[0] || { weight: '500 Gm', price: p.base_price };
                        const var2 = vars[1] || { weight: '1 Kg', price: Math.round(p.base_price * 1.85) };
                        return {
                            id: p.slug || p.id,
                            dbId: p.id,
                            name: p.name,
                            cat: (p.category || 'chiffon').toLowerCase().includes('bento') ? 'bento' :
                                 (p.category || '').toLowerCase().includes('diet') ? 'dietary' :
                                 (p.category || '').toLowerCase().includes('wedding') ? 'wedding' : 'chiffon',
                            price: Number(var1.price),
                            price1kg: Number(var2.price),
                            weight1: var1.weight,
                            weight2: var2.weight,
                            variantId1: var1.id,
                            variantId2: var2.id,
                            img: p.image_url || p.image || 'assets/cake_velvet.jpg',
                            desc: p.description || '',
                            diet: p.dietary_info || '100% Pure Veg (Eggless)'
                        };
                    });
                }
            } catch (e) {
                console.warn('Dynamic catalog note:', e);
            }
        }

        if (chipsContainer) {
            chipsContainer.innerHTML = `
                <button type="button" class="chip active" onclick="window.filterMenuCat('all', this)">All Cakes (${cakesList.length})</button>
                <button type="button" class="chip" onclick="window.filterMenuCat('chiffon', this)">Celebration Chiffon</button>
                <button type="button" class="chip" onclick="window.filterMenuCat('bento', this)">Korean Bento</button>
                <button type="button" class="chip" onclick="window.filterMenuCat('dietary', this)">Dietary / Nut Flour</button>
                <button type="button" class="chip" onclick="window.filterMenuCat('wedding', this)">Grand Towers</button>
            `;
        }

        window.filterMenuCat = function (cat, chipEl) {
            if (chipEl) {
                $$('#chips .chip').forEach(c => c.classList.remove('active'));
                chipEl.classList.add('active');
            }
            const filtered = cat === 'all' ? cakesList : cakesList.filter(c => c.cat === cat);
            renderMenuCards(filtered);
        };

        function renderMenuCards(items) {
            grid.innerHTML = items.map(c => `
                <div class="product-card" data-id="${c.id}" data-db-id="${c.dbId || ''}" data-name="${c.name}" data-price="${c.price}" data-img="${c.img}" data-current-weight="${c.weight1 || '500 Gm'}" data-current-price="${c.price}">
                    <div class="product-img">
                        <picture>
                            <source srcset="${(c.img || '').replace(/\.jpg$/i, '.webp')}" type="image/webp">
                            <img src="${c.img}" alt="${c.name}" loading="lazy" decoding="async">
                        </picture>
                        <button type="button" class="quickview-btn-overlay" onclick="window.openQuickView('${c.id}')" title="Quick View ${c.name}">👁️ Quick View</button>
                        <div class="veg-tag-icon"><span class="veg-tag-dot"></span>Pure Veg</div>
                    </div>
                    <div class="product-body">
                        <div class="product-name-row">
                            <h3 class="product-name">${c.name}</h3>
                            <span class="product-rating">★ 4.9</span>
                        </div>
                        <p class="product-desc-short">${c.desc}</p>
                        <div class="weight-selector-row">
                            <button type="button" class="weight-chip active" onclick="window.setCardWeight(this, ${c.price}, '${c.weight1 || '500 Gm'}')">${c.weight1 || '500 Gm'}</button>
                            <button type="button" class="weight-chip" onclick="window.setCardWeight(this, ${c.price1kg}, '${c.weight2 || '1 Kg'}')">${c.weight2 || '1 Kg'}</button>
                        </div>
                        <div class="price-row">
                            <div class="price-wrap">
                                <span class="price">₹${c.price.toLocaleString('en-IN')}</span>
                                <span class="weight-label">${c.weight1 || '500 Gm'}</span>
                            </div>
                            <div class="card-actions">
                                <button type="button" class="btn-add btn-cut1" onclick="window.addToCart('${c.id}')">+ Basket</button>
                                <button type="button" class="btn-buy-now btn-cut1" onclick="window.openOrderModalForCard('${c.id}')">Buy Now ⚡</button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            syncProductCardButtons();
        }

        renderMenuCards(cakesList);

        // Search in menu.html
        const searchInputMenu = $('q');
        if (searchInputMenu) {
            searchInputMenu.addEventListener('input', e => {
                const val = (e.target.value || '').trim().toLowerCase();
                const matched = cakesList.filter(c => c.name.toLowerCase().includes(val) || c.desc.toLowerCase().includes(val));
                renderMenuCards(matched);
            });
        }
    }

    function updateWishlistUI() {}
    window.toggleWishlist = function () {};
    window.toggleWishlistItem = function () {};
    window.toggleWishlistDrawer = function () {};
    window.removeWishlistItem = function () {};
    window.moveWishlistToCart = function () {};

    /* =====================================================================
       PINCODE / VADODARA AREA SELECTOR MODAL
       ===================================================================== */
    const VADODARA_AREAS = [
        { name: 'Akota', pincode: '390020', eta: '45–60 min' },
        { name: 'Alkapuri', pincode: '390007', eta: '40–50 min' },
        { name: 'Vasna Road', pincode: '390015', eta: '45–60 min' },
        { name: 'Gotri', pincode: '390021', eta: '50–60 min' },
        { name: 'Old Padra Road', pincode: '390020', eta: '45–55 min' },
        { name: 'Manjalpur', pincode: '390011', eta: '55–70 min' },
        { name: 'Fatehgunj', pincode: '390002', eta: '50–60 min' },
        { name: 'Karelibaug', pincode: '390018', eta: '55–65 min' },
        { name: 'Sama / Harni', pincode: '390024', eta: '60–75 min' },
        { name: 'Bhayli / Sevasi', pincode: '391410', eta: '65–80 min' },
        { name: 'Subhanpura', pincode: '390023', eta: '45–55 min' },
        { name: 'Waghodia Road', pincode: '390019', eta: '70–90 min' }
    ];

    window.openPincodeModal = function () {
        window.playAudioTone('click');
        let modal = $('pincodeModalOverlay');
        if (!modal) {
            const wrap = document.createElement('div');
            wrap.id = 'pincodeModalOverlay';
            wrap.className = 'pincode-modal-overlay';
            wrap.onclick = function (e) {
                if (e.target === wrap) window.closePincodeModal();
            };
            wrap.innerHTML = `
                <div class="pincode-modal">
                    <div class="pincode-modal-header">
                        <h3>📍 Select Your Vadodara Delivery Area</h3>
                        <button type="button" class="wishlist-close-btn" onclick="window.closePincodeModal()">✕</button>
                    </div>
                    <div class="pincode-modal-body">
                        <p style="font-size:13.5px; color:var(--text-muted); margin:0 0 12px;">We deliver freshly baked pure veg &amp; eggless artisan cakes across all locations in Vadodara with 2-hour express delivery.</p>
                        <div class="pincode-grid" id="pincodeGridContainer">
                            ${VADODARA_AREAS.map(a => `
                                <div class="pincode-chip" onclick="window.selectPincodeArea('${a.name}', '${a.pincode}', '${a.eta}')">
                                    <span class="pincode-chip-name">${a.name}</span>
                                    <span style="font-size:11.5px; color:#64748B;">Pin: ${a.pincode}</span>
                                    <span class="pincode-chip-eta">⚡ ${a.eta}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(wrap);
            modal = wrap;
        }
        modal.classList.add('active', 'open');
        document.body.style.overflow = 'hidden';
    };

    window.closePincodeModal = function () {
        const modal = $('pincodeModalOverlay');
        if (modal) {
            modal.classList.remove('active', 'open');
            document.body.style.overflow = '';
        }
    };

    window.selectPincodeArea = function (area, pincode, eta) {
        window.playAudioTone('success');
        const pinInput = $('hdrPincode');
        if (pinInput) {
            pinInput.value = `${area}, ${pincode}`;
        }
        const addressField = $('custAddress');
        if (addressField && !addressField.value) {
            addressField.value = `${area}, Vadodara - ${pincode}`;
        }
        window.showToast(`Delivery area set to ${area} (ETA: ${eta}) 🚀`);
        window.closePincodeModal();
    };

    /* =====================================================================
       QUICK VIEW PRODUCT MODAL ENGINE
       ===================================================================== */
    let currentQuickViewCake = null;
    let quickViewSelectedWeight = '500 Gm';
    let quickViewSelectedPrice = 899;

    window.openQuickView = function (id) {
        window.playAudioTone('click');
        const cake = ALL_MENU_CAKES.find(c => c.id === id) || ALL_MENU_CAKES[0];
        currentQuickViewCake = cake;
        quickViewSelectedWeight = cake.weight1 || '500 Gm';
        quickViewSelectedPrice = cake.price;

        let qvOverlay = $('quickViewOverlay');
        if (!qvOverlay) {
            const wrap = document.createElement('div');
            wrap.id = 'quickViewOverlay';
            wrap.className = 'quick-view-overlay';
            wrap.onclick = function (e) {
                if (e.target === wrap) window.closeQuickView();
            };
            wrap.innerHTML = `
                <div class="quick-view-modal">
                    <button type="button" class="qv-close-btn" onclick="window.closeQuickView()" title="Close">✕</button>
                    <div class="qv-grid">
                        <div class="qv-image-side">
                            <img id="qvImg" src="${cake.img}" alt="${cake.name}">
                        </div>
                        <div class="qv-content-side">
                            <span class="qv-tag" id="qvDiet">🟢 100% Pure Veg &amp; Eggless</span>
                            <h2 class="qv-title" id="qvTitle">${cake.name}</h2>
                            <p class="qv-desc" id="qvDesc">${cake.desc}</p>
                            <div class="qv-weight-label">Select Weight / Size:</div>
                            <div class="qv-weight-options" id="qvWeightGroup">
                                <button type="button" class="qv-weight-btn active" onclick="window.selectQuickViewWeight('${cake.weight1 || '500 Gm'}', ${cake.price}, this)">${cake.weight1 || '500 Gm'}</button>
                                <button type="button" class="qv-weight-btn" onclick="window.selectQuickViewWeight('${cake.weight2 || '1 Kg'}', ${cake.price1kg || Math.round(cake.price * 1.85)}, this)">${cake.weight2 || '1 Kg'}</button>
                            </div>
                            <div class="qv-price-row">
                                <span class="qv-price" id="qvPriceText">₹${cake.price.toLocaleString('en-IN')}</span>
                                <span class="qv-price-original" id="qvOrigPriceText">₹${Math.round(cake.price * 1.25).toLocaleString('en-IN')}</span>
                            </div>
                            <div class="qv-message-box">
                                <label for="qvMessageInput">Custom Piping Message on Cake (Optional):</label>
                                <input type="text" id="qvMessageInput" placeholder="e.g. Happy Birthday Sahil! 🎂" maxlength="35">
                            </div>
                            <div class="qv-cta-group">
                                <button type="button" class="btn-qv-cart" onclick="window.addQuickViewToCart()">🛒 Add to Basket</button>
                                <button type="button" class="btn-qv-buy" onclick="window.buyQuickViewNow()">⚡ Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(wrap);
            qvOverlay = wrap;
        } else {
            $('qvImg').src = cake.img;
            $('qvTitle').textContent = cake.name;
            $('qvDesc').textContent = cake.desc;
            $('qvDiet').textContent = cake.diet || '🟢 100% Pure Veg & Eggless';
            $('qvPriceText').textContent = `₹${cake.price.toLocaleString('en-IN')}`;
            $('qvOrigPriceText').textContent = `₹${Math.round(cake.price * 1.25).toLocaleString('en-IN')}`;
            $('qvWeightGroup').innerHTML = `
                <button type="button" class="qv-weight-btn active" onclick="window.selectQuickViewWeight('${cake.weight1 || '500 Gm'}', ${cake.price}, this)">${cake.weight1 || '500 Gm'}</button>
                <button type="button" class="qv-weight-btn" onclick="window.selectQuickViewWeight('${cake.weight2 || '1 Kg'}', ${cake.price1kg || Math.round(cake.price * 1.85)}, this)">${cake.weight2 || '1 Kg'}</button>
            `;
            $('qvMessageInput').value = '';
        }

        qvOverlay.classList.add('active', 'open');
        document.body.style.overflow = 'hidden';
    };

    window.closeQuickView = function () {
        const qvOverlay = $('quickViewOverlay');
        if (qvOverlay) {
            qvOverlay.classList.remove('active', 'open');
            document.body.style.overflow = '';
        }
    };

    window.selectQuickViewWeight = function (weight, price, btnEl) {
        window.playAudioTone('click');
        quickViewSelectedWeight = weight;
        quickViewSelectedPrice = price;
        $$('#qvWeightGroup .qv-weight-btn').forEach(b => b.classList.remove('active'));
        if (btnEl) btnEl.classList.add('active');
        $('qvPriceText').textContent = `₹${price.toLocaleString('en-IN')}`;
        $('qvOrigPriceText').textContent = `₹${Math.round(price * 1.25).toLocaleString('en-IN')}`;
    };

    window.addQuickViewToCart = function () {
        if (!currentQuickViewCake) return;
        const msg = ($('qvMessageInput')?.value || '').trim();
        cart = [{
            id: currentQuickViewCake.id,
            name: currentQuickViewCake.name,
            weight: quickViewSelectedWeight,
            price: quickViewSelectedPrice,
            img: currentQuickViewCake.img,
            message: msg,
            qty: 1
        }];
        window.playAudioTone('add');
        saveCart();
        window.showToast(`Selected ${currentQuickViewCake.name} (${quickViewSelectedWeight}) — Opening Checkout! 🎂`);
        window.closeQuickView();
        if (!window.isUserLoggedIn()) {
            window.askLoginToOrder(currentQuickViewCake);
        } else {
            window.openOrderModalForCart();
        }
    };

    window.buyQuickViewNow = function () {
        window.addQuickViewToCart();
    };

    /* =====================================================================
       WEB AUDIO API TONE SYNTHESIZER (HAPTIC AUDIO EXPERIENCE)
       ===================================================================== */
    let audioContext = null;
    let isSoundEnabled = true;

    function getAudioContext() {
        if (!audioContext && (window.AudioContext || window.webkitAudioContext)) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioCtx();
        }
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        return audioContext;
    }

    window.playAudioTone = function (type) {
        if (!isSoundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            if (type === 'add') {
                // Pleasant luxury double chime (880Hz -> 1174.66Hz)
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.12);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'success') {
                // Celebratory C-Major chord (C5, E5, G5, C6)
                const freqs = [523.25, 659.25, 783.99, 1046.50];
                freqs.forEach((f, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(f, now + idx * 0.06);
                    gain.gain.setValueAtTime(0.08, now + idx * 0.06);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + idx * 0.06);
                    osc.stop(now + idx * 0.06 + 0.45);
                });
            } else if (type === 'click') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.06);
            } else if (type === 'delete') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.15);
            }
        } catch (e) {}
    };

    window.toggleAudioTone = function () {
        isSoundEnabled = !isSoundEnabled;
        const btn = $('floatSoundBtn');
        if (btn) {
            btn.innerHTML = isSoundEnabled ? '🔔' : '🔕';
            btn.title = isSoundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects';
        }
        window.showToast(isSoundEnabled ? 'Sound feedback enabled 🔔' : 'Sound feedback muted 🔕');
    };

    /* =====================================================================
       CONFETTI CANNON ENGINE (PURE CANVAS CELEBRATION)
       ===================================================================== */
    window.launchConfetti = function () {
        let canvas = $('confettiCanvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'confettiCanvas';
            canvas.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; pointer-events:none; z-index:100000; display:block;';
            document.body.appendChild(canvas);
        }
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#CBA46B', '#1B3358', '#FFD6A8', '#E8A588', '#22C55E', '#EC4899', '#F59E0B'];
        for (let i = 0; i < 120; i++) {
            pieces.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                w: Math.random() * 10 + 6,
                h: Math.random() * 6 + 4,
                vx: (Math.random() - 0.5) * 18,
                vy: (Math.random() - 0.7) * 18,
                rot: Math.random() * 360,
                vrot: (Math.random() - 0.5) * 12,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: 1,
                decay: Math.random() * 0.015 + 0.008
            });
        }

        let animId;
        function update() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let activeCount = 0;
            pieces.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.35; // gravity
                p.rot += p.vrot;
                p.opacity -= p.decay;
                if (p.opacity > 0) {
                    activeCount++;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rot * Math.PI) / 180);
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                    ctx.restore();
                }
            });

            if (activeCount > 0) {
                animId = requestAnimationFrame(update);
            } else {
                cancelAnimationFrame(animId);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (canvas && canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            }
        }
        update();

        // Safety cleanup after 3.5 seconds
        setTimeout(() => {
            const el = $('confettiCanvas');
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }, 3500);
    };

    /* =====================================================================
       CUSTOM STUDIO INTERACTION INITIALIZER
       ===================================================================== */
    function initCustomStudio() {
        const messageInput = $('cakeMessageInput');
        const customThemeInput = $('customThemeInput');

        if (messageInput) {
            messageInput.addEventListener('input', () => {
                const previewText = $('studioCustomTextPreview');
                if (previewText) {
                    previewText.textContent = messageInput.value.trim() || 'Your Name / Message Here';
                }
            });
        }

        // Setup Floating Back to Top Button
        window.addEventListener('scroll', () => {
            const topBtn = $('floatTopBtn');
            if (topBtn) {
                if (window.scrollY > 400) {
                    topBtn.classList.add('visible');
                } else {
                    topBtn.classList.remove('visible');
                }
            }
        }, { passive: true });

        // Bind pincode header click
        const pinLabel = document.querySelector('.search-bar label.pin, #hdrPincode');
        if (pinLabel) {
            pinLabel.style.cursor = 'pointer';
            pinLabel.addEventListener('click', (e) => {
                e.preventDefault();
                window.openPincodeModal();
            });
        }
    }

    function syncAuthStateUI() {
        try {
            const user = window.DeliceDB?.auth?.getCurrentUserSync();
            const authText = $('headerAuthText');
            const authLink = $('headerAuthLink');
            const mobLabel = $('mobBottomAuthLabel');
            const logoutBtns = document.querySelectorAll('.header-logout-btn, #headerLogoutBtn, #mobLogoutLink');

            if (user && (user.id || user.phone || user.email || user.full_name)) {
                const firstName = (user.full_name || 'Member').trim().split(' ')[0] || 'Member';
                if (authText) authText.textContent = firstName;
                if (authLink) {
                    authLink.href = 'track.html';
                    authLink.title = `Welcome, ${user.full_name || 'Member'} — Track Your Orders`;
                    authLink.classList.add('logged-in');
                }
                if (mobLabel) {
                    mobLabel.textContent = firstName;
                    const mobAuthAnchor = mobLabel.closest('a');
                    if (mobAuthAnchor) mobAuthAnchor.href = 'track.html';
                }
                logoutBtns.forEach(btn => {
                    btn.style.display = 'inline-flex';
                });
            } else {
                if (authText) authText.textContent = 'Sign In';
                if (authLink) {
                    authLink.href = 'login.html';
                    authLink.title = 'Connoisseur Club Sign In / Register';
                    authLink.classList.remove('logged-in');
                }
                if (mobLabel) {
                    mobLabel.textContent = 'Sign In';
                    const mobAuthAnchor = mobLabel.closest('a');
                    if (mobAuthAnchor) mobAuthAnchor.href = 'login.html';
                }
                logoutBtns.forEach(btn => {
                    btn.style.display = 'none';
                });
            }
        } catch (e) {}
    }
    window.syncAuthStateUI = syncAuthStateUI;

    window.logoutUser = async function (e) {
        if (e && e.preventDefault) e.preventDefault();
        try {
            if (window.DeliceDB && window.DeliceDB.auth && typeof window.DeliceDB.auth.signOut === 'function') {
                await window.DeliceDB.auth.signOut();
            }
        } catch (err) {}

        try {
            localStorage.removeItem('delice_user');
            localStorage.removeItem('delice_user_phone');
            localStorage.removeItem('delice_user_email');
            localStorage.removeItem('delice_user_name');
            localStorage.removeItem('delice_authenticated');
            localStorage.removeItem('delice_supabase_auth_token');
            sessionStorage.removeItem('delice_authenticated');
            sessionStorage.removeItem('delice_guest_checkout');
        } catch (e) {}

        if (typeof window.syncAuthStateUI === 'function') {
            window.syncAuthStateUI();
        }

        if (typeof window.showToast === 'function') {
            window.showToast('You have been safely signed out. Have a sweet day! 🎂');
        }

        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    };
    window.signOutUser = window.logoutUser;

    /* =====================================================================
       INITIALIZATION
       ===================================================================== */
    function init() {
        updateCartUI();
        updateWishlistUI();
        window.calcCustomPrice();
        setDefaultOrderDate();
        initCustomStudio();
        renderMenuCatalog();
        syncAuthStateUI();

        // Auto-open checkout if returning from login redirect with continue_checkout=1 or #checkout
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const shouldResumeCheckout = urlParams.get('continue_checkout') === '1' || window.location.hash === '#checkout';
            if (shouldResumeCheckout && window.isUserLoggedIn() && cart && cart.length > 0) {
                setTimeout(() => {
                    window.openOrderModalForCart();
                    window.showToast('✨ Welcome back! Your cake is ready for checkout.');
                }, 400);
            }
        } catch (e) {}

        // Prevent background touch scrolling on modal overlay
        const overlay = $('orderModalOverlay');
        if (overlay) {
            overlay.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });
            overlay.addEventListener('wheel', (e) => { e.preventDefault(); }, { passive: false });
        }

        // Global keyboard accessibility: Close open modals on Escape key (WCAG 2.2 AA)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                const orderModal = $('orderModal');
                if (orderModal && (orderModal.classList.contains('open') || orderModal.style.display === 'flex' || orderModal.style.display === 'block')) {
                    window.closeOrderModal();
                }
                const cartDrawer = $('cartDrawer');
                if (cartDrawer && (cartDrawer.classList.contains('open') || cartDrawer.classList.contains('active'))) {
                    window.closeCartDrawer();
                }
            }
        });

        // Auto-populate footer copyright year
        const yrEl = $('yr');
        if (yrEl) yrEl.textContent = new Date().getFullYear();

        // Register Progressive Web App (PWA) Service Worker
        if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(reg => {
                        console.log('[PWA] Service Worker registered with scope:', reg.scope);
                    })
                    .catch(err => {
                        console.warn('[PWA] Service Worker registration failed:', err);
                    });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();



