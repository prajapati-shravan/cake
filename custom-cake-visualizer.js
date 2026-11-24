/**
 * =====================================================================
 * DÉLICE & CO. — BESPOKE CAKE STUDIO 2.5D INTERACTIVE VISUALIZER
 * Real-Time Dynamic Vector Cake Rendering Engine
 * Features:
 *   - Multi-Tier Vector Architecture (1, 2, or 3 Grand Tiers)
 *   - Gourmet Frosting & Sponge Palette (Truffle, Velvet, Strawberry, Bento, Pistachio, etc.)
 *   - Realistic Cascading Drips (Belgian Ganache, 24K Gold Drizzle, Berry Coulis)
 *   - Artisanal Toppings (Wild Strawberries, French Macarons, Gold Leaf, Candles)
 *   - Live Piped Inscription directly on the Cake Face (Chocolate / Gold Calligraphy)
 *   - Ambient Lighting Modes (Daylight Patisserie vs Romantic Candlelight)
 *   - Tactile 3D Tilt Micro-interactions
 *   - 100% Fail-Safe Direct Global Handlers (window.selectStudioSize, etc.)
 * =====================================================================
 */

(function () {
    'use strict';

    // Core State Model
    const VisualizerState = {
        tiers: 1,
        weightLabel: '1/2 kg (Serves 4–6)',
        sizeKey: '0.5',
        sizeMult: 1.0,
        flavourId: 'truffle',
        flavourTitle: 'Belgian Dark Truffle',
        flavourBase: 849,
        diet: '100% Pure Veg (Eggless)',
        message: 'Happy Birthday',
        pipingColor: 'gold',     // 'gold', 'chocolate', 'white', 'rose'
        dripStyle: 'ganache',    // 'ganache', 'gold', 'berry', 'none'
        toppings: {
            berries: true,
            macarons: false,
            goldLeaf: true,
            rosePetals: false,
            candles: false
        },
        lighting: 'daylight',    // 'daylight' or 'candlelight'
        viewMode: '3d'           // '3d' or 'photo'
    };

    // Flavor Palette Profiles & Gradients
    const FLAVOR_PALETTES = {
        truffle: {
            title: 'Belgian Dark Truffle',
            basePrice: 849,
            bodyTop: '#3D1F10',
            bodyBot: '#200E05',
            topSurface: '#4A2814',
            pearlRim: '#D4AF37',
            spongeCrumb: '#261106',
            dripColor: '#170902',
            dripShine: '#5E3820',
            plaqueBg: '#2A1408',
            plaqueBorder: '#D4AF37',
            defaultPiping: 'gold',
            img: 'assets/cake_chocolate.jpg'
        },
        velvet: {
            title: 'The Velvet Rose & Raspberry',
            basePrice: 899,
            bodyTop: '#FCE7F3',
            bodyBot: '#F472B6',
            topSurface: '#FDF2F8',
            pearlRim: '#BE123C',
            spongeCrumb: '#9F1239',
            dripColor: '#BE123C',
            dripShine: '#FB7185',
            plaqueBg: '#FFF1F2',
            plaqueBorder: '#E11D48',
            defaultPiping: 'rose',
            img: 'assets/cake_velvet.jpg'
        },
        strawberry: {
            title: 'Kyoto Fresh Strawberry Cloud',
            basePrice: 799,
            bodyTop: '#FFF1F2',
            bodyBot: '#FDA4AF',
            topSurface: '#FFFBFB',
            pearlRim: '#E11D48',
            spongeCrumb: '#FFE4E6',
            dripColor: '#E11D48',
            dripShine: '#FDA4AF',
            plaqueBg: '#FFF5F5',
            plaqueBorder: '#FB7185',
            defaultPiping: 'chocolate',
            img: 'assets/cake_strawberry.jpg'
        },
        bento: {
            title: 'Pastel Petal Korean Bento',
            basePrice: 499,
            bodyTop: '#F5F3FF',
            bodyBot: '#DDD6FE',
            topSurface: '#FAF5FF',
            pearlRim: '#8B5CF6',
            spongeCrumb: '#EDE9FE',
            dripColor: '#C4B5FD',
            dripShine: '#FFFFFF',
            plaqueBg: '#FAF5FF',
            plaqueBorder: '#A78BFA',
            defaultPiping: 'white',
            img: 'assets/cake_bento.jpg'
        },
        pistachio: {
            title: 'Sicilian Pistachio & Wild Berry',
            basePrice: 949,
            bodyTop: '#E8F5E9',
            bodyBot: '#A3B18A',
            topSurface: '#F1F8E9',
            pearlRim: '#588157',
            spongeCrumb: '#3A5A40',
            dripColor: '#4A154B',
            dripShine: '#7E22CE',
            plaqueBg: '#F4FBF4',
            plaqueBorder: '#588157',
            defaultPiping: 'gold',
            img: 'assets/cake_pistachio.jpg'
        },
        pineapple: {
            title: 'Golden Pineapple & Cream Gateau',
            basePrice: 549,
            bodyTop: '#FEFCE8',
            bodyBot: '#FDE047',
            topSurface: '#FFFBEB',
            pearlRim: '#CA8A04',
            spongeCrumb: '#FEF08A',
            dripColor: '#EAB308',
            dripShine: '#FEF9C3',
            plaqueBg: '#FFFDF0',
            plaqueBorder: '#CA8A04',
            defaultPiping: 'chocolate',
            img: 'assets/cake_pineapple.jpg'
        },
        caramel: {
            title: 'Salted Butterscotch & Caramel',
            basePrice: 879,
            bodyTop: '#FFEDD5',
            bodyBot: '#FB923C',
            topSurface: '#FFF7ED',
            pearlRim: '#C2410C',
            spongeCrumb: '#EA580C',
            dripColor: '#9A3412',
            dripShine: '#FDBA74',
            plaqueBg: '#FFF7ED',
            plaqueBorder: '#C2410C',
            defaultPiping: 'gold',
            img: 'assets/cake_chocolate.jpg'
        },
        vanilla: {
            title: 'Tahitian Vanilla & Gold Luster',
            basePrice: 749,
            bodyTop: '#FAF8F5',
            bodyBot: '#E7DFD5',
            topSurface: '#FFFDF9',
            pearlRim: '#D4AF37',
            spongeCrumb: '#E5D5C5',
            dripColor: '#D4AF37',
            dripShine: '#FFFBEB',
            plaqueBg: '#FFFDF7',
            plaqueBorder: '#D4AF37',
            defaultPiping: 'gold',
            img: 'assets/cake_velvet.jpg'
        }
    };

    // Piping calligraphy colors
    const PIPING_COLORS = {
        gold: { fill: '#F59E0B', stroke: '#78350F', glow: '#FDE68A' },
        chocolate: { fill: '#3E1C0A', stroke: '#1C0B03', glow: '#78350F' },
        white: { fill: '#FFFFFF', stroke: '#CBD5E1', glow: '#F8FAFC' },
        rose: { fill: '#BE123C', stroke: '#881337', glow: '#FDA4AF' }
    };

    /**
     * Generate Pure SVG Markup for the Cake Model
     */
    function buildCakeSVG(state) {
        const pal = FLAVOR_PALETTES[state.flavourId] || FLAVOR_PALETTES.truffle;
        const piping = PIPING_COLORS[state.pipingColor] || PIPING_COLORS.gold;
        const isNight = state.lighting === 'candlelight';
        const numTiers = state.tiers;

        // Background Gradient
        const bgGrad = isNight
            ? `<radialGradient id="stageBg" cx="50%" cy="45%" r="65%">
                 <stop offset="0%" stop-color="#382115" />
                 <stop offset="60%" stop-color="#1A0D07" />
                 <stop offset="100%" stop-color="#0B0503" />
               </radialGradient>`
            : `<radialGradient id="stageBg" cx="50%" cy="40%" r="70%">
                 <stop offset="0%" stop-color="#FFFFFF" />
                 <stop offset="50%" stop-color="#FAF5EE" />
                 <stop offset="100%" stop-color="#EDE2D3" />
               </radialGradient>`;

        // Stand / Plate coordinates
        const standBaseY = 415;
        const plateY = 365;

        // Tier definitions: [ { rx, ry, topY, botY } ]
        let tiersData = [];
        if (numTiers === 1) {
            tiersData = [
                { id: 1, rx: 135, ry: 25, topY: 250, botY: plateY }
            ];
        } else if (numTiers === 2) {
            tiersData = [
                { id: 1, rx: 140, ry: 24, topY: 285, botY: plateY },
                { id: 2, rx: 95,  ry: 18, topY: 185, botY: 285 }
            ];
        } else {
            tiersData = [
                { id: 1, rx: 145, ry: 24, topY: 295, botY: plateY },
                { id: 2, rx: 105, ry: 18, topY: 215, botY: 295 },
                { id: 3, rx: 70,  ry: 13, topY: 135, botY: 215 }
            ];
        }

        const topTier = tiersData[tiersData.length - 1];

        // Drip Path Generator for Top Tier
        function generateDripsPath(tier) {
            const rx = tier.rx;
            const topY = tier.topY;
            const ry = tier.ry;
            const left = 250 - rx;
            const count = 9;
            const step = (rx * 2) / count;

            let dripLengths = [24, 38, 18, 44, 22, 40, 20, 36, 22];
            let pathD = `M ${left} ${topY}`;

            for (let i = 0; i < count; i++) {
                const segX = left + i * step;
                const nextX = segX + step;
                const midX = segX + step * 0.5;
                const dropLen = dripLengths[i % dripLengths.length];
                pathD += ` Q ${segX + step * 0.25} ${topY + dropLen} ${midX} ${topY + dropLen}`;
                pathD += ` Q ${segX + step * 0.75} ${topY + dropLen} ${nextX} ${topY}`;
            }

            pathD += ` A ${rx} ${ry} 0 0 1 ${left} ${topY} Z`;
            return pathD;
        }

        // Drip Color logic
        let dripFill = pal.dripColor;
        let dripStroke = pal.dripShine;
        if (state.dripStyle === 'gold') {
            dripFill = '#D4AF37';
            dripStroke = '#FFE680';
        } else if (state.dripStyle === 'berry') {
            dripFill = '#9F1239';
            dripStroke = '#FB7185';
        } else if (state.dripStyle === 'ganache') {
            dripFill = '#220D04';
            dripStroke = '#5C2D13';
        }

        // Render tiers markup
        let tiersMarkup = '';
        tiersData.forEach((t) => {
            const rx = t.rx;
            const ry = t.ry;
            const topY = t.topY;
            const botY = t.botY;
            const left = 250 - rx;
            const right = 250 + rx;

            const cylinderPath = `M ${left} ${topY} L ${left} ${botY} A ${rx} ${ry} 0 0 0 ${right} ${botY} L ${right} ${topY} Z`;

            const numPearls = Math.round(rx * 0.32);
            let pearlsMarkup = '';
            for (let p = 0; p <= numPearls; p++) {
                const angle = Math.PI * (p / numPearls);
                const px = 250 - rx * Math.cos(angle);
                const py = botY + ry * Math.sin(angle);
                pearlsMarkup += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3" fill="url(#pearlGrad)" opacity="0.95"/>`;
            }

            tiersMarkup += `
                <!-- Tier ${t.id} -->
                <g class="cake-tier cake-tier-${t.id}">
                    <path d="${cylinderPath}" fill="url(#tierBodyGrad_${t.id})" filter="url(#cakeDropShadow)"/>
                    <g class="tier-pearls">${pearlsMarkup}</g>
                    <ellipse cx="250" cy="${topY}" rx="${rx}" ry="${ry}" fill="url(#tierTopGrad_${t.id})"/>
                </g>
            `;
        });

        // Drip overlay on top tier
        let dripMarkup = '';
        if (state.dripStyle !== 'none') {
            dripMarkup = `
                <g class="cake-drips">
                    <path d="${generateDripsPath(topTier)}" fill="${dripFill}" opacity="0.95" filter="url(#dripShadow)"/>
                    <ellipse cx="250" cy="${topTier.topY}" rx="${topTier.rx - 1}" ry="${topTier.ry - 1}" fill="none" stroke="${dripStroke}" stroke-width="1.8" opacity="0.7"/>
                </g>
            `;
        }

        // Personalized Inscription Placement
        let messageY = 310;
        let plaqueW = 210;
        let plaqueH = 34;

        if (numTiers === 1) {
            messageY = 310;
            plaqueW = 200;
        } else if (numTiers === 2) {
            messageY = 328;
            plaqueW = 210;
        } else {
            messageY = 332;
            plaqueW = 220;
        }

        const msgText = (state.message || '').trim() || 'Happy Birthday';
        const displayMsg = msgText.length > 28 ? msgText.substring(0, 26) + '…' : msgText;

        const pipingMarkup = `
            <!-- Live Piped Inscription Cartouche -->
            <g class="cake-inscription" transform="translate(250, ${messageY})">
                <rect x="${-plaqueW / 2}" y="-17" width="${plaqueW}" height="${plaqueH}" rx="17" fill="${pal.plaqueBg}" stroke="${pal.plaqueBorder}" stroke-width="1.4" filter="url(#subtleGlow)" opacity="0.94"/>
                <circle cx="${-plaqueW / 2 + 10}" cy="0" r="3" fill="${pal.plaqueBorder}"/>
                <circle cx="${plaqueW / 2 - 10}" cy="0" r="3" fill="${pal.plaqueBorder}"/>
                <text x="0" y="6" text-anchor="middle" font-family="'Great Vibes', 'Playfair Display', cursive, serif" font-size="20" font-weight="700" fill="${piping.fill}" stroke="${piping.stroke}" stroke-width="0.3" filter="url(#text3dShadow)">
                    ${escapeXml(displayMsg)}
                </text>
            </g>
        `;

        // Toppings Markup
        let toppingsMarkup = '';
        const topY = topTier.topY;
        const topRx = topTier.rx;

        // 1. Fresh Strawberries
        if (state.toppings.berries) {
            toppingsMarkup += `
                <!-- Fresh Gourmet Strawberries & Wild Berries -->
                <g class="topping-berries">
                    <g transform="translate(245, ${topY - 14}) scale(0.95)">
                        <path d="M 0 -14 C 11 -14 16 7 0 20 C -16 7 -11 -14 0 -14 Z" fill="url(#berryRubyGrad)" filter="url(#subtleGlow)"/>
                        <circle cx="-3" cy="-2" r="0.9" fill="#FDE047"/>
                        <circle cx="4" cy="2" r="0.9" fill="#FDE047"/>
                        <circle cx="-1" cy="7" r="0.9" fill="#FDE047"/>
                        <path d="M 0 -12 L 4 -19 L 2 -12 L 9 -14 L 3 -9 L 0 -16 L -3 -9 L -9 -14 L -2 -12 L -4 -19 Z" fill="#15803D"/>
                    </g>
                    <g transform="translate(${250 - topRx * 0.35}, ${topY - 8}) rotate(-14) scale(0.78)">
                        <path d="M 0 -14 C 11 -14 16 7 0 20 C -16 7 -11 -14 0 -14 Z" fill="url(#berryRubyGrad)"/>
                        <circle cx="-3" cy="0" r="0.8" fill="#FDE047"/>
                        <circle cx="3" cy="5" r="0.8" fill="#FDE047"/>
                        <path d="M 0 -12 L 3 -18 L 1 -12 L 7 -13 L 2 -9 L 0 -15 L -2 -9 L -7 -13 L -1 -12 L -3 -18 Z" fill="#166534"/>
                    </g>
                    <circle cx="${250 + topRx * 0.38}" cy="${topY + 3}" r="7" fill="#1E1B4B" stroke="#312E81" stroke-width="1"/>
                    <circle cx="${250 + topRx * 0.36}" cy="${topY + 1}" r="2" fill="#818CF8" opacity="0.6"/>
                    <circle cx="${250 + topRx * 0.22}" cy="${topY - 6}" r="6" fill="#1E1B4B"/>
                    <circle cx="${250 - topRx * 0.52}" cy="${topY + 2}" r="6.5" fill="#1E1B4B"/>
                </g>
            `;
        }

        // 2. French Macarons
        if (state.toppings.macarons) {
            toppingsMarkup += `
                <!-- French Macarons & Chocolate Shavings -->
                <g class="topping-macarons">
                    <g transform="translate(${250 + topRx * 0.45}, ${topY - 10}) rotate(18) scale(0.85)">
                        <ellipse cx="0" cy="-6" rx="14" ry="7" fill="#FDA4AF"/>
                        <rect x="-14" y="-3" width="28" height="6" rx="2" fill="#F43F5E"/>
                        <rect x="-13" y="-1" width="26" height="2" rx="1" fill="#FFFFFF"/>
                        <ellipse cx="0" cy="3" rx="14" ry="7" fill="#FDA4AF"/>
                    </g>
                    <g transform="translate(${250 - topRx * 0.42}, ${topY - 14}) rotate(-22) scale(0.8)">
                        <ellipse cx="0" cy="-6" rx="14" ry="7" fill="#A7F3D0"/>
                        <rect x="-14" y="-3" width="28" height="6" rx="2" fill="#10B981"/>
                        <rect x="-13" y="-1" width="26" height="2" rx="1" fill="#FFFFFF"/>
                        <ellipse cx="0" cy="3" rx="14" ry="7" fill="#A7F3D0"/>
                    </g>
                    <path d="M 230 ${topY + 2} Q 240 ${topY - 8} 252 ${topY - 2} Q 242 ${topY + 6} 230 ${topY + 2} Z" fill="#291206"/>
                </g>
            `;
        }

        // 3. 24K Gold Leaf
        if (state.toppings.goldLeaf) {
            toppingsMarkup += `
                <!-- 24K Edible Gold Leaf Accents -->
                <g class="topping-gold-leaf" opacity="0.92">
                    <polygon points="248,${topY - 8} 255,${topY - 14} 252,${topY - 4}" fill="url(#goldFoilGrad)"/>
                    <polygon points="${250 - topRx * 0.2},${topY + 4} ${250 - topRx * 0.2 + 8},${topY} ${250 - topRx * 0.2 + 4},${topY + 8}" fill="url(#goldFoilGrad)"/>
                    <polygon points="${250 + topRx * 0.25},${topY - 5} ${250 + topRx * 0.25 + 6},${topY - 11} ${250 + topRx * 0.25 + 2},${topY - 2}" fill="url(#goldFoilGrad)"/>
                    <circle cx="${250 - topRx * 0.4}" cy="${topY + 6}" r="1.8" fill="#FDE047"/>
                    <circle cx="${250 + topRx * 0.48}" cy="${topY - 2}" r="1.5" fill="#FDE047"/>
                    <circle cx="250" cy="${topY + 12}" r="1.6" fill="#FDE047"/>
                </g>
            `;
        }

        // 4. Edible Organic Rose Petals
        if (state.toppings.rosePetals) {
            toppingsMarkup += `
                <!-- Organic Rose Petals -->
                <g class="topping-rose-petals" opacity="0.9">
                    <path d="M ${250 - topRx * 0.15} ${topY - 4} C ${250 - topRx * 0.15 - 10} ${topY - 14} ${250 - topRx * 0.15 + 10} ${topY - 16} ${250 - topRx * 0.15} ${topY - 4} Z" fill="#E11D48"/>
                    <path d="M ${250 + topRx * 0.2} ${topY + 5} C ${250 + topRx * 0.2 + 10} ${topY - 4} ${250 + topRx * 0.2 - 6} ${topY - 10} ${250 + topRx * 0.2} ${topY + 5} Z" fill="#FB7185"/>
                    <path d="M 252 ${topY + 8} C 260 ${topY} 242 ${topY - 2} 252 ${topY + 8} Z" fill="#BE123C"/>
                </g>
            `;
        }

        // 5. Celebration Birthday Candles (Animated Glow)
        if (state.toppings.candles) {
            const candleY = topY - 55;
            toppingsMarkup += `
                <!-- Celebration Birthday Candle with Animated Flame -->
                <g class="topping-candle" transform="translate(250, ${candleY})">
                    <rect x="-4" y="18" width="8" height="38" rx="2" fill="url(#candleStripeGrad)" filter="url(#subtleGlow)"/>
                    <line x1="0" y1="18" x2="0" y2="10" stroke="#1E293B" stroke-width="1.6" stroke-linecap="round"/>
                    <circle cx="0" cy="5" r="16" fill="rgba(251, 191, 36, 0.25)" filter="url(#candleHaloBlur)"/>
                    <circle cx="0" cy="5" r="8" fill="rgba(245, 158, 11, 0.4)" filter="url(#candleHaloBlur)"/>
                    <path class="studio-candle-flame" d="M 0 10 Q 5 2 0 -6 Q -5 2 0 10 Z" fill="url(#flameGrad)" filter="url(#subtleGlow)"/>
                </g>
            `;
        }

        // Assemble Full SVG Document
        return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 460" width="100%" height="100%" class="delice-cake-svg" aria-label="Live Custom Cake Design Preview">
                <defs>
                    ${bgGrad}
                    <filter id="cakeDropShadow" x="-20%" y="-20%" width="140%" height="150%">
                        <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="${isNight ? '#000000' : '#3E2415'}" flood-opacity="${isNight ? '0.6' : '0.18'}"/>
                    </filter>
                    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.18"/>
                    </filter>
                    <filter id="dripShadow" x="-10%" y="-10%" width="120%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.25"/>
                    </filter>
                    <filter id="text3dShadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="1.5" stdDeviation="1" flood-color="#000000" flood-opacity="0.35"/>
                    </filter>
                    <filter id="candleHaloBlur" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6"/>
                    </filter>

                    <!-- Stand Gradients -->
                    <linearGradient id="standGoldBase" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#E5C388"/>
                        <stop offset="50%" stop-color="#CBA46B"/>
                        <stop offset="100%" stop-color="#9A773F"/>
                    </linearGradient>
                    <linearGradient id="standStemGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stop-color="#E2D4C3"/>
                        <stop offset="50%" stop-color="#FFFFFF"/>
                        <stop offset="100%" stop-color="#C4B4A1"/>
                    </linearGradient>
                    <linearGradient id="standRimGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#CBA46B"/>
                        <stop offset="100%" stop-color="#9A773F"/>
                    </linearGradient>
                    <linearGradient id="standPlateGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#FFFFFF"/>
                        <stop offset="60%" stop-color="#FAF6F0"/>
                        <stop offset="100%" stop-color="#E6DED4"/>
                    </linearGradient>

                    <!-- Pearl Border Gradient -->
                    <radialGradient id="pearlGrad" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stop-color="#FFFFFF"/>
                        <stop offset="60%" stop-color="${pal.pearlRim}"/>
                        <stop offset="100%" stop-color="#644824"/>
                    </radialGradient>

                    <!-- Topping Gradients -->
                    <linearGradient id="berryRubyGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#FF4D6D"/>
                        <stop offset="50%" stop-color="#DC2626"/>
                        <stop offset="100%" stop-color="#7F1D1D"/>
                    </linearGradient>
                    <linearGradient id="goldFoilGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#FFFBEB"/>
                        <stop offset="40%" stop-color="#FDE047"/>
                        <stop offset="80%" stop-color="#D97706"/>
                        <stop offset="100%" stop-color="#92400E"/>
                    </linearGradient>
                    <linearGradient id="candleStripeGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#FDE68A"/>
                        <stop offset="50%" stop-color="#F59E0B"/>
                        <stop offset="100%" stop-color="#B45309"/>
                    </linearGradient>
                    <radialGradient id="flameGrad" cx="50%" cy="70%" r="50%">
                        <stop offset="0%" stop-color="#FFFFFF"/>
                        <stop offset="35%" stop-color="#FEF08A"/>
                        <stop offset="70%" stop-color="#F97316"/>
                        <stop offset="100%" stop-color="#DC2626"/>
                    </radialGradient>

                    <!-- Dynamic Tier Gradients -->
                    ${tiersData.map(t => `
                        <linearGradient id="tierBodyGrad_${t.id}" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stop-color="${pal.bodyBot}" stop-opacity="0.95"/>
                            <stop offset="25%" stop-color="${pal.bodyTop}"/>
                            <stop offset="75%" stop-color="${pal.bodyTop}"/>
                            <stop offset="100%" stop-color="${pal.bodyBot}"/>
                        </linearGradient>
                        <radialGradient id="tierTopGrad_${t.id}" cx="45%" cy="40%" r="65%">
                            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.25"/>
                            <stop offset="30%" stop-color="${pal.topSurface}"/>
                            <stop offset="100%" stop-color="${pal.bodyTop}"/>
                        </radialGradient>
                    `).join('')}
                </defs>

                <!-- Stage Background -->
                <rect width="500" height="460" rx="20" fill="url(#stageBg)"/>

                <!-- Ambient Pedestal Shadow -->
                <ellipse cx="250" cy="${standBaseY + 12}" rx="110" ry="16" fill="${isNight ? '#000000' : '#C7B9A9'}" opacity="${isNight ? '0.7' : '0.4'}" filter="url(#cakeDropShadow)"/>

                <!-- Luxury Marble & Gold Cake Stand -->
                <g class="cake-stand" filter="url(#cakeDropShadow)">
                    <ellipse cx="250" cy="${standBaseY}" rx="95" ry="14" fill="url(#standGoldBase)"/>
                    <ellipse cx="250" cy="${standBaseY - 2}" rx="88" ry="12" fill="#FFFFFF" opacity="0.65"/>
                    <path d="M 234 365 L 238 412 L 262 412 L 266 365 Z" fill="url(#standStemGrad)"/>
                    <ellipse cx="250" cy="${plateY + 4}" rx="190" ry="26" fill="url(#standRimGrad)"/>
                    <ellipse cx="250" cy="${plateY}" rx="188" ry="24" fill="url(#standPlateGrad)"/>
                    <ellipse cx="250" cy="${plateY - 1}" rx="172" ry="21" fill="none" stroke="url(#standGoldBase)" stroke-width="1.2" stroke-dasharray="3 4" opacity="0.6"/>
                </g>

                <!-- Cake Tiers Group -->
                <g class="cake-tiers-assembly">
                    ${tiersMarkup}
                    ${dripMarkup}
                    ${toppingsMarkup}
                    ${pipingMarkup}
                </g>

                <!-- 100% Pure Veg Watermark Stamp -->
                <g class="cake-veg-stamp" transform="translate(24, 24)" opacity="0.88">
                    <rect x="0" y="0" width="18" height="18" rx="4" fill="#FFFFFF" stroke="#16A34A" stroke-width="1.5"/>
                    <circle cx="9" cy="9" r="4.5" fill="#16A34A"/>
                </g>
            </svg>
        `;
    }

    function escapeXml(unsafe) {
        return (unsafe || '').replace(/[<>&'"]/g, function (c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
        });
    }

    /**
     * Compute Real-Time Custom Cake Price
     */
    function computeCustomPrice() {
        const pal = FLAVOR_PALETTES[VisualizerState.flavourId] || FLAVOR_PALETTES.truffle;
        const base = pal.basePrice;
        let total = Math.round(base * VisualizerState.sizeMult);

        if (VisualizerState.toppings.macarons) total += 120;
        if (VisualizerState.toppings.candles) total += 49;
        if (VisualizerState.dripStyle === 'gold') total += 150;

        return total;
    }

    /**
     * Refresh the Live Visualizer & UI
     */
    function updateVisualizer() {
        const mount = document.getElementById('cakeVisualizerMount');
        if (mount && VisualizerState.viewMode === '3d') {
            mount.innerHTML = buildCakeSVG(VisualizerState);
        }

        const pal = FLAVOR_PALETTES[VisualizerState.flavourId] || FLAVOR_PALETTES.truffle;
        const cakeImg = document.getElementById('studioCakeImg');
        if (cakeImg && pal.img) {
            cakeImg.src = pal.img;
        }

        const titleEl = document.getElementById('studioCakeTitle');
        if (titleEl) titleEl.textContent = pal.title;

        const badgeEl = document.getElementById('studioTierBadge');
        if (badgeEl) badgeEl.textContent = `${VisualizerState.tiers} Tier${VisualizerState.tiers > 1 ? 's' : ''} • ${VisualizerState.weightLabel}`;

        const descEl = document.getElementById('studioCakeDesc');
        if (descEl) descEl.textContent = `${VisualizerState.diet} • Pure Dairy Butter`;

        const pipingEl = document.getElementById('studioPipingText');
        if (pipingEl) pipingEl.textContent = `"${VisualizerState.message || 'Happy Birthday'}"`;

        const priceEl = document.getElementById('studioPrice');
        const calculatedTotal = computeCustomPrice();
        if (priceEl) priceEl.textContent = `₹${calculatedTotal.toLocaleString('en-IN')}`;

        window.calcCustomPrice = function () {
            return computeCustomPrice();
        };

        return calculatedTotal;
    }

    // =====================================================================
    // 100% DIRECT FAIL-SAFE GLOBAL EVENT HANDLERS (EXPOSED ON WINDOW)
    // =====================================================================

    window.selectStudioSize = function (btn) {
        if (!btn) return;
        document.querySelectorAll('#sizeSelector .studio-chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const sizeVal = btn.getAttribute('data-size') || '0.5';
        const multVal = parseFloat(btn.getAttribute('data-mult') || '1');
        const tiersVal = parseInt(btn.getAttribute('data-tiers') || (parseFloat(sizeVal) >= 3 ? '3' : (parseFloat(sizeVal) >= 2 ? '2' : '1')), 10);
        const label = btn.getAttribute('data-label') || btn.textContent.trim();

        VisualizerState.sizeKey = sizeVal;
        VisualizerState.sizeMult = multVal;
        VisualizerState.tiers = tiersVal;
        VisualizerState.weightLabel = label;

        updateVisualizer();
        window.playAudioTone?.('click');
    };

    window.selectStudioFlavor = function (btn) {
        if (!btn) return;
        document.querySelectorAll('#flavorSelector .studio-chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const flavId = btn.getAttribute('data-flavor') || 'truffle';
        VisualizerState.flavourId = flavId;

        const pal = FLAVOR_PALETTES[flavId];
        if (pal && pal.defaultPiping) {
            VisualizerState.pipingColor = pal.defaultPiping;
            document.querySelectorAll('#pipingColorSelector .studio-color-btn').forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-color') === VisualizerState.pipingColor);
            });
        }

        updateVisualizer();
        window.playAudioTone?.('click');
    };

    window.selectStudioDrip = function (btn) {
        if (!btn) return;
        document.querySelectorAll('#dripSelector .studio-chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        VisualizerState.dripStyle = btn.getAttribute('data-drip') || 'ganache';
        updateVisualizer();
        window.playAudioTone?.('click');
    };

    window.toggleStudioTopping = function (btn) {
        if (!btn) return;
        const key = btn.getAttribute('data-topping');
        if (!key) return;
        VisualizerState.toppings[key] = !VisualizerState.toppings[key];
        btn.classList.toggle('active', Boolean(VisualizerState.toppings[key]));
        updateVisualizer();
        window.playAudioTone?.('click');
    };

    window.selectStudioDiet = function (btn) {
        if (!btn) return;
        document.querySelectorAll('#dietSelector .studio-chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        VisualizerState.diet = btn.getAttribute('data-diet') || btn.textContent.trim();
        updateVisualizer();
        window.playAudioTone?.('click');
    };

    window.selectStudioPipingColor = function (btn) {
        if (!btn) return;
        document.querySelectorAll('#pipingColorSelector .studio-color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        VisualizerState.pipingColor = btn.getAttribute('data-color') || 'gold';
        updateVisualizer();
        window.playAudioTone?.('click');
    };

    window.updateStudioMessage = function (text) {
        VisualizerState.message = text;
        updateVisualizer();
    };

    window.setStudioView = function (mode) {
        VisualizerState.viewMode = mode;
        const mount = document.getElementById('cakeVisualizerMount');
        const photoView = document.getElementById('studioPhotoView');
        const btn3D = document.getElementById('btnView3D');
        const btnPhoto = document.getElementById('btnViewPhoto');

        if (mode === '3d') {
            if (mount) mount.style.display = 'block';
            if (photoView) photoView.style.display = 'none';
            if (btn3D) btn3D.classList.add('active');
            if (btnPhoto) btnPhoto.classList.remove('active');
            updateVisualizer();
        } else {
            if (mount) mount.style.display = 'none';
            if (photoView) photoView.style.display = 'flex';
            if (btn3D) btn3D.classList.remove('active');
            if (btnPhoto) btnPhoto.classList.add('active');
        }
    };

    window.toggleStudioLighting = function () {
        VisualizerState.lighting = VisualizerState.lighting === 'daylight' ? 'candlelight' : 'daylight';
        const card = document.getElementById('studioPreviewCard');
        const btn = document.getElementById('btnViewCandle');

        if (card) {
            card.classList.toggle('night-mode', VisualizerState.lighting === 'candlelight');
        }
        if (btn) {
            btn.classList.toggle('active', VisualizerState.lighting === 'candlelight');
            btn.innerHTML = VisualizerState.lighting === 'candlelight' ? '☀️ Day' : '🕯️ Glow';
        }
        updateVisualizer();
        window.playAudioTone?.('click');
    };

    // Export design state for checkout
    window.getCustomCakeDesignState = function () {
        const pal = FLAVOR_PALETTES[VisualizerState.flavourId] || FLAVOR_PALETTES.truffle;
        return {
            tiers: VisualizerState.tiers,
            size: VisualizerState.weightLabel,
            flavour: pal.title,
            diet: VisualizerState.diet,
            message: VisualizerState.message,
            pipingColor: VisualizerState.pipingColor,
            dripStyle: VisualizerState.dripStyle,
            toppings: Object.keys(VisualizerState.toppings).filter(k => VisualizerState.toppings[k]),
            price: computeCustomPrice(),
            img: pal.img
        };
    };

    /**
     * DOM Event Listeners & Tilt Setup
     */
    function initVisualizerEvents() {
        // Message input live sync
        const msgInput = document.getElementById('cakeMessageInput');
        if (msgInput) {
            msgInput.addEventListener('input', (e) => {
                VisualizerState.message = e.target.value;
                updateVisualizer();
            });
        }

        // 3D Tilt interaction
        const stageEl = document.getElementById('studioCakeStage');
        if (stageEl) {
            stageEl.addEventListener('mousemove', (e) => {
                const rect = stageEl.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const rotY = (x / (rect.width / 2)) * 8;
                const rotX = -(y / (rect.height / 2)) * 6;
                stageEl.style.transform = `perspective(800px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg)`;
            });

            stageEl.addEventListener('mouseleave', () => {
                stageEl.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
            });
        }

        // Initial render
        updateVisualizer();
    }

    // Auto-bootstrap
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVisualizerEvents);
    } else {
        initVisualizerEvents();
    }

})();
