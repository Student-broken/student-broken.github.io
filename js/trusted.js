--- START OF FILE blacklist.js ---

(async function() {
    // --- PASTE YOUR NEW DEPLOYED URL HERE ---
    const API_URL = 'https://script.google.com/macros/s/AKfycbyD9bYuYdXQkZS4MQ98rUPVgY_1TqRB4QVcQPSIPoszKUxDRBG8QIrIgASl9y9EziVddg/exec'; 
    // ----------------------------------------

    const KEYS = {
        PERM_BAN: 'blacklist_perm_ban',
        TRUSTED_USER: 'blacklist_trusted_user_name', // Stores the NAME, not just true/false
        FAILURES: 'blacklist_fail_count'
    };
    
    const MAX_ATTEMPTS = 5;

    // --- UTILS ---
    function log(msg) {
        console.log(`%c[Security System] ${msg}`, 'color: yellow; background: black; font-weight: bold; padding: 2px;');
    }

    // --- VISUALS ---
    function nukeWebsite() {
        if (document.getElementById('brainrot-style')) return;
        
        const style = document.createElement('style');
        style.id = 'brainrot-style';
        style.innerHTML = `
            body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: black !important; }
            #brainrot-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: fill; z-index: 2147483647; pointer-events: none; }
            #brainrot-caption { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); color: red; font-family: Impact, sans-serif; font-size: 5vw; z-index: 2147483647; text-align: center; text-transform: uppercase; text-shadow: 2px 2px 0 #000; }
            body > *:not(#brainrot-bg):not(#brainrot-caption):not(#brainrot-style) { display: none !important; }
        `;
        document.head.appendChild(style);

        const img = document.createElement('img');
        img.id = 'brainrot-bg';
        img.src = "https://media.tenor.com/p_PSprNhLkkAAAAj/monkey-tongue-out.gif";
        
        const caption = document.createElement('div');
        caption.id = 'brainrot-caption';
        caption.innerText = "Nuh uh - Restricted Access";

        document.body.appendChild(img);
        document.body.appendChild(caption);
    }

    function triggerPermBan() {
        log("PERMANENT BAN ACTIVATED.");
        localStorage.clear();
        localStorage.setItem(KEYS.PERM_BAN, 'true');
        
        document.body.innerHTML = ''; 
        const style = document.createElement('style');
        style.innerHTML = `body, html { margin:0; padding:0; background: black; height: 100%; overflow: hidden; }`;
        document.head.appendChild(style);

        const img = document.createElement('img');
        img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Black_colour.jpg/500px-Black_colour.jpg";
        img.style.width = "100vw"; 
        img.style.height = "100vh";
        img.style.objectFit = "cover";
        document.body.appendChild(img);
    }

    function restoreWebsite() {
        log("Access Granted. Restoring site.");
        const bg = document.getElementById('brainrot-bg');
        const cap = document.getElementById('brainrot-caption');
        const style = document.getElementById('brainrot-style');
        if (bg) bg.remove();
        if (cap) cap.remove();
        if (style) style.remove();
        
        const hidden = document.querySelectorAll('body > *');
        hidden.forEach(el => el.style.removeProperty('display'));
    }

    // --- MAIN CHECK ---
    async function checkSecurity() {
        // 1. Check Perm Ban
        if (localStorage.getItem(KEYS.PERM_BAN) === 'true') {
            triggerPermBan();
            return;
        }

        // 2. Identify User
        let userName = null;
        try {
            const mbs = JSON.parse(localStorage.getItem('mbsData'));
            if (mbs && mbs.nom) userName = mbs.nom.trim().toLowerCase();
        } catch (e) {}

        if (!userName) {
            try {
                const jdlm = JSON.parse(localStorage.getItem('jdlmData'));
                if (jdlm && jdlm.nom) userName = jdlm.nom.trim().toLowerCase();
            } catch (e) {}
        }

        if (!userName) {
            log("No 'nom' found in mbsData or jdlmData. Script standing by (or user not logged in).");
            // If you want to FORCE a check even without a name, remove this return, 
            // but usually we wait for a name.
            return; 
        }

        log(`Identified User: ${userName}`);

        // 3. Check Local Trust (FIXED: Checks if THIS specific user is trusted)
        const trustedUser = localStorage.getItem(KEYS.TRUSTED_USER);
        if (trustedUser === userName) {
            log("User is locally verified as trusted. Skipping server check.");
            return; 
        } else if (trustedUser) {
            log("Local trust found for different user. Clearing and re-verifying.");
            localStorage.removeItem(KEYS.TRUSTED_USER);
        }

        // 4. Server Check
        log("Fetching security data...");
        let data;
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("API Network Error");
            data = await res.json();
            log("Data received.");
        } catch (e) {
            console.error(e);
            // If server is down, what do? For now, we return to avoid locking out everyone.
            // Or trigger nuke if you want fail-secure.
            return; 
        }

        // Default to empty arrays if undefined
        const trusted = data.trusted || [];
        const secondary = data.secondary || [];
        const nono = data.nono || [];
        const password = data.password;

        // 5. Whitelist Check
        if (trusted.includes(userName) || secondary.includes(userName)) {
            log("User is on Whitelist. Granting access.");
            localStorage.setItem(KEYS.TRUSTED_USER, userName);
            return;
        }

        // 6. Access Denied Logic
        log("User NOT on whitelist. Initiating Lockdown.");
        nukeWebsite();

        // 7. Password / NoNo Logic
        let currentFailures = parseInt(localStorage.getItem(KEYS.FAILURES) || '0');
        
        // Wait 100ms for UI update
        await new Promise(r => setTimeout(r, 100));

        // If on No-No list, we might want to be stricter, but logic is same: password saves you.
        // Unless you want No-No list to be INSTANT ban? (Current logic: Password still works)

        while (currentFailures < MAX_ATTEMPTS) {
            const attempt = prompt(`⚠ SECURITY ALERT ⚠\nUser: ${userName}\nYou are not authorized.\nEnter Password to unlock.\nAttempts left: ${MAX_ATTEMPTS - currentFailures}`);

            if (attempt === password) {
                // SUCCESS
                log("Password Correct.");
                restoreWebsite();
                localStorage.setItem(KEYS.TRUSTED_USER, userName);
                localStorage.removeItem(KEYS.FAILURES);

                // Add to Secondary List (Backend)
                fetch(API_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Standard for GAS simple POSTs
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify({ action: 'add_secondary', name: userName })
                }).catch(e => console.error("Backend update failed", e));
                
                return;
            } else {
                // FAIL
                currentFailures++;
                localStorage.setItem(KEYS.FAILURES, currentFailures);
                if (currentFailures >= MAX_ATTEMPTS) {
                    triggerPermBan();
                    return;
                }
                alert("INCORRECT PASSWORD.");
            }
        }
        
        // If loop finishes (failures reached max)
        triggerPermBan();
    }

    checkSecurity();
})();
