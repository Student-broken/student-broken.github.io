(async function() {
    // --- CONFIGURATION ---
    const API_URL = 'https://script.google.com/macros/s/AKfycbz0nC6F3F5UHvLLGC1MxlB9RgfyHEGQ1wXCCc75FE3wBjBkLYZ7Ek3VLGJu2czidkpksQ/exec'; 
    const BG_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Black_colour.jpg/500px-Black_colour.jpg";
    // ---------------------

    // --- 1. IMMEDIATE NATURAL LOADING SCREEN ---
    // Runs instantly. White background, simple spinner. Looks innocent.
    function applyLoadingScreen() {
        if (document.getElementById('security-overlay')) return;

        const style = document.createElement('style');
        style.id = 'security-style';
        style.innerHTML = `
            /* FREEZE INTERACTION BEHIND SCENES */
            body, html { 
                margin: 0 !important; padding: 0 !important; 
                width: 100% !important; height: 100% !important; 
                overflow: hidden !important; 
            }
            
            /* THE WHITE OVERLAY */
            #security-overlay { 
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
                z-index: 2147483647; 
                background-color: #ffffff; /* Natural White */
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                pointer-events: auto !important;
            }

            /* THE NATURAL SPINNER */
            .natural-spinner {
                border: 4px solid #f3f3f3; /* Light grey */
                border-top: 4px solid #3498db; /* Blue */
                border-radius: 50%;
                width: 50px; height: 50px;
                animation: spin 1s linear infinite;
            }

            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

            /* BLACK BACKGROUND (Hidden by default, used for Ban/Lock) */
            #security-bg {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                object-fit: cover; z-index: -1; display: none;
            }

            /* HIDE SITE CONTENT */
            body > *:not(#security-overlay):not(#security-style) { display: none !important; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'security-overlay';
        
        // Hidden Black BG Image (Preloaded for smooth transition if needed)
        const img = document.createElement('img');
        img.id = 'security-bg';
        img.src = BG_IMAGE_URL;
        
        // The Spinner
        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.className = 'natural-spinner';

        overlay.appendChild(img);
        overlay.appendChild(spinner);
        document.body.appendChild(overlay);
    }

    // Activate immediately
    applyLoadingScreen();


    // --- 2. TRANSITION HELPERS ---

    // Switch from "Nice White Screen" to "Dark Lockdown Mode"
    function activateDarkLockdown() {
        const overlay = document.getElementById('security-overlay');
        const bg = document.getElementById('security-bg');
        const spinner = document.getElementById('loading-spinner');
        
        if (overlay) overlay.style.backgroundColor = 'black'; // Fallback
        if (bg) bg.style.display = 'block'; // Show Black Image
        if (spinner) spinner.remove(); // Remove innocent spinner
    }

    function setBanStatus() {
        localStorage.setItem('perm_banned_user', 'true');
        Object.defineProperty(localStorage, 'perm_banned_user', { value: 'true', writable: false });
        sessionStorage.setItem('perm_banned_user', 'true');
        const d = new Date(); d.setTime(d.getTime() + (365*24*60*60*1000));
        document.cookie = "perm_banned_user=true; expires=" + d.toUTCString() + "; path=/";
    }

    function isDeviceBanned() {
        if (localStorage.getItem('perm_banned_user') === 'true') return true;
        if (sessionStorage.getItem('perm_banned_user') === 'true') return true;
        if (document.cookie.indexOf('perm_banned_user=true') > -1) {
            setBanStatus(); return true;
        }
        return false;
    }

    function triggerPermBan() {
        activateDarkLockdown(); // Switch to black
        setBanStatus();
        
        // Add simple ban text if not present
        const overlay = document.getElementById('security-overlay');
        if (overlay && !document.getElementById('ban-text')) {
            const txt = document.createElement('h1');
            txt.id = 'ban-text';
            txt.innerText = "ACCESS PERMANENTLY DENIED";
            txt.style.color = "red";
            txt.style.fontFamily = "Courier New, monospace";
            overlay.appendChild(txt);
        }
        throw new Error("Banned");
    }

    function restoreSite() {
        const overlay = document.getElementById('security-overlay');
        const style = document.getElementById('security-style');
        if (overlay) overlay.remove();
        if (style) style.remove();
        
        const hidden = document.querySelectorAll('body > *');
        hidden.forEach(el => el.style.removeProperty('display'));
    }

    // --- 3. PASSWORD UI ---

    function promptPasswordCustom(correctPassword, startFails) {
        return new Promise((resolve, reject) => {
            activateDarkLockdown(); // Switch from White Spinner to Black BG

            const overlay = document.getElementById('security-overlay');
            
            // Create Login Box
            const container = document.createElement('div');
            container.id = 'custom-lock-container';
            container.style.cssText = `
                position: relative; z-index: 20;
                background: rgba(10, 10, 10, 0.95); border: 2px solid red; 
                box-shadow: 0 0 20px red; color: red; padding: 30px; 
                font-family: 'Courier New', monospace; text-align: center; 
                width: 320px; border-radius: 10px;
            `;

            container.innerHTML = `
                <h2 style="margin: 0 0 20px 0; text-transform: uppercase; font-size: 24px;">System Locked</h2>
                <input type="password" id="lock-input" style="
                    width: 100%; padding: 10px; margin-bottom: 10px; box-sizing: border-box;
                    background: #222; border: 1px solid #555; color: white; text-align: center; font-size: 18px;
                " placeholder="Enter Password" autofocus>
                
                <div id="lock-status" style="height: 20px; font-size: 12px; color: yellow; margin-bottom: 15px;"></div>
                
                <button id="lock-btn" style="
                    background: red; color: white; border: none; padding: 10px 20px; margin-bottom: 10px;
                    cursor: pointer; font-weight: bold; text-transform: uppercase; width: 100%; box-sizing: border-box;
                ">Unlock</button>

                <button id="request-btn" style="
                    background: transparent; color: #888; border: 1px solid #555; padding: 5px 10px; 
                    cursor: pointer; font-size: 12px; width: 100%; box-sizing: border-box;
                ">Request Access</button>
            `;

            overlay.appendChild(container);

            const input = document.getElementById('lock-input');
            const unlockBtn = document.getElementById('lock-btn');
            const requestBtn = document.getElementById('request-btn');
            const status = document.getElementById('lock-status');
            let fails = startFails;

            const checkPass = () => {
                if (input.value === correctPassword) {
                    resolve(true);
                } else {
                    fails++;
                    localStorage.setItem('fail_count', fails);
                    input.value = '';
                    if (fails >= 5) {
                        reject(fails);
                    } else {
                        status.innerText = `ACCESS DENIED. Attempts: ${5 - fails}`;
                        status.style.color = 'red';
                    }
                }
            };

            unlockBtn.onclick = checkPass;
            requestBtn.onclick = () => { window.location.href = 'ticket.html'; };
            input.onkeydown = (e) => { if (e.key === 'Enter') checkPass(); };
            
            status.innerText = `Attempts remaining: ${5 - fails}`;
            input.focus();
        });
    }

    // --- 4. MAIN LOGIC ---

    try {
        // 1. Check Device Ban
        if (isDeviceBanned()) triggerPermBan();

        // 2. Check Cache
        if (localStorage.getItem('vip_safe_user') === 'true') {
            restoreSite(); return;
        }
        if (sessionStorage.getItem('temp_safe_user') === 'true') {
            restoreSite(); return;
        }

        // 3. Identify User
        let userName = null;
        try {
            const mbs = JSON.parse(localStorage.getItem('mbsData'));
            if (mbs && mbs.nom) userName = mbs.nom.trim().toLowerCase();
        } catch(e){}
        
        if (!userName) {
             try {
                const jdlm = JSON.parse(localStorage.getItem('jdlmData'));
                if (jdlm && jdlm.nom) userName = jdlm.nom.trim().toLowerCase();
            } catch(e){}
        }

        if (!userName) {
            restoreSite(); return; // Guest
        }

        // 4. Fetch
        const response = await fetch(API_URL);
        if (!response.ok) {
            restoreSite(); return; // Fail safe
        }
        const data = await response.json();

        // 5. Check Lists
        if (data.banned && data.banned.includes(userName)) triggerPermBan();
        
        if (data.vip && data.vip.includes(userName)) {
            localStorage.setItem('vip_safe_user', 'true');
            restoreSite();
            return;
        }

        if (data.trusted && data.trusted.includes(userName)) {
            sessionStorage.setItem('temp_safe_user', 'true');
            restoreSite();
            return;
        }

        // 6. Challenge Unknown
        let fails = parseInt(localStorage.getItem('fail_count') || '0');
        if (fails >= 5) triggerPermBan();

        try {
            await promptPasswordCustom(data.password, fails);
            
            // Success
            restoreSite();
            localStorage.removeItem('fail_count');
            sessionStorage.setItem('temp_safe_user', 'true');
            
            fetch(API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {'Content-Type': 'text/plain'},
                body: JSON.stringify({ name: userName, type: 'trust' })
            });

        } catch (finalFails) {
            // Failure
            fetch(API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {'Content-Type': 'text/plain'},
                body: JSON.stringify({ name: userName, type: 'ban' })
            });
            triggerPermBan();
        }

    } catch (e) {
        console.log("Process complete");
    }
})();
