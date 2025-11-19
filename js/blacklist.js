(async function() {
    // --- PASTE YOUR DEPLOYED URL HERE ---
    const BLACKLIST_API_URL = 'https://script.google.com/macros/s/AKfycbyNhGaZvsiar-kHmk8Hg0wFpPYo42KJCZ25SspufcS8IeroeyNUs_fQfJviqL7AQQBShA/exec'; 
    // ------------------------------------

    function triggerGlitchMode() {
        // ... (Keep your glitch code from before, it was perfect) ...
        const style = document.createElement('style');
        style.innerHTML = `
            body { background: black !important; color: red !important; overflow: hidden; }
            * { cursor: none !important; animation: none !important; }
            header, footer, .main-container { display: none !important; }
        `;
        document.head.appendChild(style);
        document.body.innerHTML = '<h1 style="font-family:monospace;font-size:50px;text-align:center;margin-top:20%;">mb bro ts doesnt work anymore</h1>';
    }

    try {
        // 1. Check Local Storage for User Name
        const mbsDataString = localStorage.getItem('mbsData');
        if (!mbsDataString) return;

        const mbsData = JSON.parse(mbsDataString);
        if (!mbsData.nom) return;

        const userName = mbsData.nom.trim().toLowerCase();

        // 2. Fetch Blacklist (Simple GET request)
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
