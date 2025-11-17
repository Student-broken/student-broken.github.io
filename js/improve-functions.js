<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analyse - Outil MBS</title>
    <link rel="icon" href="https://raw.githubusercontent.com/Student-broken/student-broken.github.io/refs/heads/main/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --primary-color: #2980b9; --secondary-color: #2c3e50; --background-color: #f7f9fb; --widget-background: #ffffff; --text-color: #34495e; --text-secondary-color: #7f8c8d; --accent-color: #3498db; --light-grey: #e0e6eb; --footer-grey: #7f8c8d; --success-color: #27ae60; --danger-color: #e74c3c; --warning-color: #f39c12; --shadow-header: 0 2px 4px rgba(0,0,0,0.05); --shadow-widget: 0 8px 15px rgba(0,0,0,0.08); --border-color: #e0e6eb; --goal-success-bg: #eafaf1; --goal-warning-bg: #fff9f0; --goal-danger-bg: #fdf3f2; --transition-duration: 0.35s;
        }
        [data-theme="dark"] {
            --background-color: #121212; --widget-background: #1e1e1e; --text-color: #e0e0e0; --text-secondary-color: #a0a0a0; --secondary-color: #bbbbbb; --light-grey: #333333; --footer-grey: #a0a0a0; --shadow-header: 0 2px 5px rgba(255,255,255,0.1); --shadow-widget: 0 5px 10px rgba(0,0,0,0.3); --border-color: #333333; --goal-success-bg: #1a3e2a; --goal-warning-bg: #4d381c; --goal-danger-bg: #4f2323;
        }
        [data-theme="dark"] .site-header,[data-theme="dark"] .widget-title { color:var(--text-color); } [data-theme="dark"] .comp-widget,[data-theme="dark"] .calculator-container { background-color:#282828; border-color:var(--border-color); } [data-theme="dark"] .modal-content { background-color:var(--background-color); } [data-theme="dark"] .modal-header { background-color:#2c3e50; } [data-theme="dark"] .goal-input input { background-color:#282828; border-color:var(--light-grey); color:var(--text-color); } [data-theme="dark"] #order-list li { background-color:#333; } [data-theme="dark"] .grade-pill { background-color:#444; } [data-theme="dark"] .leaderboard-item.is-user { background-color: #2c3e50; }

        /* General Styles & Transitions */
        body, .site-header-container, .subject-widget, .tab-btn { transition: background-color var(--transition-duration) ease, color var(--transition-duration) ease, border-color var(--transition-duration) ease, box-shadow var(--transition-duration) ease; }
        body { margin: 0; font-family: 'Inter', sans-serif; background-color: var(--background-color); color: var(--text-color); }

        /* Header */
        .site-header-container { background-color: var(--widget-background); box-shadow: var(--shadow-header); border-bottom: 1px solid var(--border-color); padding: 15px 25px; display: flex; align-items: center; justify-content: space-between; }
        .header-left, .header-right { display: flex; align-items: center; gap: 15px; flex: 1; }
        .header-right { justify-content: flex-end; }
        .site-header { flex: 2; text-align: center; padding: 0; margin: 0; color: var(--secondary-color); font-size: 2.2em; font-family: 'Playfair Display', serif; }
        .icon-btn { background: none; border: 2px solid var(--light-grey); color: var(--text-color); width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1em; text-decoration: none; transition: all 0.2s ease; }
        .icon-btn:hover { border-color: var(--primary-color); color: var(--primary-color); transform: scale(1.1); }
        .btn-secondary { text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; background-color: #2980b9; color: white; border: none; transition: all 0.2s ease; }
        .btn-secondary:hover { background-color: #3498db; }

        /* Tabs & Grid */
        .sticky-tabs { position: sticky; top: 0; background-color: var(--background-color); z-index: 100; padding: 15px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; }
        .tab-btn { padding: 10px 20px; border: 1px solid var(--light-grey); border-radius: 20px; background-color: transparent; color: var(--text-color); font-weight: 600; cursor: pointer; }
        .tab-btn.active { background-color: var(--primary-color); color: white; border-color: var(--primary-color); }
        .widget-grid { max-width: 1400px; margin: 30px auto; padding: 0 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 25px; }

        /* Subject Widget Styles */
        .subject-widget { background-color: var(--widget-background); border-radius: 12px; box-shadow: var(--shadow-widget); padding: 20px; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
        .subject-widget:hover { transform: translateY(-5px); box-shadow: 0 12px 20px rgba(0,0,0,0.1); }
        .widget-top-section { display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; cursor: pointer; }
        .widget-info { flex: 1; }
        .widget-title { font-size: 1.2em; font-weight: 700; color: var(--secondary-color); margin: 0 0 10px 0; }
        .widget-average { font-size: 2.5em; font-weight: 700; color: var(--primary-color); margin: 0; }
        .widget-trend { display: flex; align-items: center; gap: 5px; font-weight: 600; font-size: 0.9em; margin-top: 5px; }
        .widget-trend.up { color: var(--success-color); } .widget-trend.down { color: var(--danger-color); } .widget-trend.neutral { color: var(--text-secondary-color); }
        .gauge-container { width: 120px; height: 70px; position: relative; }
        .histogram-container { margin-top: 15px; height: 120px; }
        .widget-chart-controls { display: flex; justify-content: flex-end; align-items: center; margin-bottom: 5px; height: 25px; gap: 5px; }
        .chart-toggle-btn { background: none; border: 1px solid var(--border-color); color: var(--light-grey); padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 0.8em; }
        .chart-toggle-btn:hover { color: var(--primary-color); border-color: var(--primary-color); }

        /* EXPANDED VIEW (Placeholder styling) */
        #expanded-view-overlay { position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px); z-index: 1000; display: none; justify-content: center; align-items: center; padding: 20px; }
        #expanded-view-overlay.active { display: flex; }
        #expanded-view-grid { display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 25px; width: 100%; max-width: 1400px; max-height: 95vh; }
        
        /* Right Widget (Ranking) Placeholder Styling */
        .mini-leaderboard-container { flex-grow: 1; overflow-y: auto; position: relative; border-top: 1px solid var(--light-grey); padding-top: 15px; max-height: 250px; }
        .leaderboard-list { list-style: none; padding: 0; margin: 0; }
        .leaderboard-item { display: flex; align-items: center; padding: 8px 10px; border-radius: 8px; font-size: 0.9em; transition: background-color 0.2s; }
        .leaderboard-item.is-user { background-color: #eaf2f8; font-weight: bold; }
        .item-rank { width: 40px; } .item-name { flex-grow: 1; } .item-grade { font-weight: 600; }
        .widget-rank { font-size: 1.1em; color: var(--secondary-color); margin-top: 5px; }
        
        footer { text-align: center; padding: 25px; font-size: 0.9em; color: var(--footer-grey); border-top: 1px solid var(--border-color); margin-top: 40px; }
    </style>
</head>
<body>
    <header class="site-header-container">
        <div class="header-left">
            <a href="main.html" class="icon-btn" title="Retour au tableau de bord"><i class="fa-solid fa-arrow-left"></i></a>
        </div>
        <h1 class="site-header">Outil MBS</h1>
        <div class="header-right">
            <button id="theme-toggle" class="icon-btn" aria-label="Changer de thème"><i class="fa-solid fa-moon"></i></button>
            <a href="projection.html" class="btn btn-secondary">Projection</a>
        </div>
    </header>

    <div class="sticky-tabs">
        <button class="tab-btn active" data-etape="generale">Générale</button>
        <button class="tab-btn" data-etape="etape1">Étape 1</button>
        <button class="tab-btn" data-etape="etape2">Étape 2</button>
        <button class="tab-btn" data-etape="etape3">Étape 3</button>
    </div>

    <main id="widget-grid" class="widget-grid">
        <!-- Widgets will be populated by improve-functions.js -->
    </main>
    
    <div id="expanded-view-overlay">
        <div id="expanded-view-grid">
            <!-- Expanded view widgets will be populated here -->
        </div>
    </div>

    <!-- CHATBOT MARKUP -->
    <style>
        :root {
            --mbs-bg-color: #1a1a1a; --mbs-surface-color: #2c2c2c; --mbs-primary-color: #61afef; --mbs-text-color: #f0f0f0; --mbs-text-secondary-color: #a0a0a0; --mbs-border-color: #444444; --mbs-font-family: 'Inter', sans-serif;
        }
        #mbs-chatbot-container *, #mbs-chatbot-container *::before, #mbs-chatbot-container *::after { box-sizing: border-box; margin: 0; padding: 0; }
        #mbs-chatbot-container { position: fixed; bottom: 20px; right: 20px; z-index: 10000; font-family: var(--mbs-font-family); }
        #mbs-chatbot-toggle {
            background-color: var(--mbs-primary-color); color: white; border: none; border-radius: 50%; width: 60px; height: 60px; font-size: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); transition: transform 0.2s ease, background-color 0.2s ease;
        }
        #mbs-chatbot-toggle:hover { transform: scale(1.1); }
        #mbs-chatbot-toggle.loading { background-color: #444; cursor: wait; animation: mbs-pulse 1.5s infinite; }
        #mbs-chatbot-toggle .chat-icon, #mbs-chatbot-toggle .close-icon, #mbs-chatbot-toggle .loading-icon { display: none; }
        #mbs-chatbot-toggle:not(.loading) .chat-icon { display: block; }
        #mbs-chatbot-container.expanded #mbs-chatbot-toggle .chat-icon { display: none; }
        #mbs-chatbot-container.expanded #mbs-chatbot-toggle .close-icon { display: block; }
        #mbs-chatbot-toggle.loading .loading-icon { display: block; animation: mbs-spin 1.5s linear infinite; }
        @keyframes mbs-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes mbs-pulse { 0% { box-shadow: 0 0 0 0 rgba(97, 175, 239, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(97, 175, 239, 0); } 100% { box-shadow: 0 0 0 0 rgba(97, 175, 239, 0); } }
        #mbs-chatbot-window {
            position: fixed; bottom: 90px; right: 20px; width: clamp(380px, 30vw, 450px); max-height: 60vh; background-color: var(--mbs-bg-color); border: 1px solid var(--mbs-border-color); border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); display: flex; flex-direction: column; opacity: 0; visibility: hidden; transform: translateY(20px); transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s; z-index: 9999;
        }
        #mbs-chatbot-container.expanded #mbs-chatbot-window { opacity: 1; visibility: visible; transform: translateY(0); }
        .mbs-chat-header { padding: 16px; background-color: var(--mbs-surface-color); border-bottom: 1px solid var(--mbs-border-color); text-align: center; flex-shrink: 0; border-radius: 12px 12px 0 0; }
        .mbs-chat-header h3 { color: var(--mbs-text-color); font-size: 1.1rem; margin: 0; }
        #mbs-chat-messages { flex-grow: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
        #mbs-chat-messages a { color: #61afef; text-decoration: underline; }
        #mbs-chat-messages::-webkit-scrollbar { width: 6px; }
        #mbs-chat-messages::-webkit-scrollbar-track { background: transparent; }
        #mbs-chat-messages::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }
        .mbs-chat-message { max-width: 90%; padding: 12px 16px; border-radius: 10px; line-height: 1.6; font-size: 0.95rem; overflow-wrap: break-word; }
        .mbs-chat-message.user { color: white; background-color: var(--mbs-primary-color); align-self: flex-end; border-bottom-right-radius: 2px; }
        .mbs-chat-message.ai { color: var(--mbs-text-color); background-color: var(--mbs-surface-color); align-self: flex-start; border-bottom-left-radius: 2px; }
        .mbs-chat-message.ai * { margin: 0; color: inherit; }
        .mbs-chat-message.ai > *:not(:last-child) { margin-bottom: 0.8em; }
        .mbs-chat-message.ai ul, .mbs-chat-message.ai ol { padding-left: 20px; }
        .mbs-chat-message.ai li:not(:last-child) { margin-bottom: 4px; }
        .mbs-chat-message.ai strong, .mbs-chat-message.ai b { color: #c678dd; font-weight: 600; }
        .mbs-chat-message.ai code { background-color: #212121; padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', Courier, monospace; }
        .mbs-typing-indicator { align-self: flex-start; display: flex; align-items: center; gap: 5px; padding: 14px 20px; background-color: var(--mbs-surface-color); border-radius: 12px; border-bottom-left-radius: 4px; }
        .mbs-typing-indicator span { width: 8px; height: 8px; background-color: var(--mbs-text-secondary-color); border-radius: 50%; animation: mbs-typing-bounce 1.4s infinite ease-in-out both; }
        .mbs-typing-indicator span:nth-child(1) { animation-delay: -0.32s; } .mbs-typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes mbs-typing-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
        #mbs-chat-form { display: flex; padding: 12px; border-top: 1px solid var(--mbs-border-color); background-color: var(--mbs-bg-color); flex-shrink: 0; border-radius: 0 0 12px 12px; }
        #mbs-chat-input { flex-grow: 1; background-color: var(--mbs-surface-color); border: 1px solid var(--mbs-border-color); border-radius: 20px; padding: 10px 16px; color: var(--mbs-text-color); font-size: 0.95rem; margin-right: 10px; outline: none; transition: border-color 0.2s ease; }
        #mbs-chat-input:focus { border-color: var(--mbs-primary-color); }
        #mbs-chat-input::placeholder { color: var(--mbs-text-secondary-color); }
        #mbs-chat-send { background-color: var(--mbs-primary-color); border: none; color: white; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; transition: background-color 0.2s ease; }
        #mbs-chat-send:not([disabled]):hover { opacity: 0.85; }
        #mbs-chat-form:has(input:disabled) #mbs-chat-send, #mbs-chat-send:disabled { background-color: #555; cursor: not-allowed; }
    </style>
    <div id="mbs-chatbot-container">
        <div id="mbs-chatbot-window">
            <div class="mbs-chat-header"><h3>Assistant MBS</h3></div>
            <div id="mbs-chat-messages"></div>
            <form id="mbs-chat-form">
                <input type="text" id="mbs-chat-input" placeholder="Chargement..." autocomplete="off" disabled>
                <button type="submit" id="mbs-chat-send" aria-label="Envoyer" disabled>
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </form>
        </div>
        <button id="mbs-chatbot-toggle" aria-label="Ouvrir/Fermer le chatbot" class="loading">
            <span class="chat-icon"><i class="fa-solid fa-comment-dots"></i></span>
            <span class="close-icon"><i class="fa-solid fa-xmark"></i></span>
            <span class="loading-icon"><i class="fa-solid fa-spinner"></i></span>
        </button>
    </div>
    
    <footer><p>Outil MBS - Moyenne, Bilan, Stratégie</p></footer>

    <!-- MARKED.JS for Markdown rendering -->
    <script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.umd.min.js"></script>

    <script id="improve-functions">
    document.addEventListener('DOMContentLoaded', () => {

        // --- GLOBAL VARIABLES ---
        const widgetGrid = document.getElementById('widget-grid');
        const tabs = document.querySelectorAll('.tab-btn');
        let currentEtape = 'generale';
        let charts = {}; // To keep track of Chart.js instances

        // --- INITIALIZATION ---
        function init() {
            setupEventListeners();
            loadDataAndRender(currentEtape);
            initTheme();
        }

        // --- EVENT LISTENERS ---
        function setupEventListeners() {
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Update active tab UI
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    // Get new etape and re-render
                    currentEtape = tab.dataset.etape;
                    loadDataAndRender(currentEtape);
                });
            });

            document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
        }

        // --- DATA LOADING AND PROCESSING ---
        function loadDataAndRender(etape) {
            try {
                const rawData = localStorage.getItem('mbsData');
                if (!rawData) {
                    widgetGrid.innerHTML = `<p>Aucune donnée trouvée. Veuillez importer vos notes.</p>`;
                    return;
                }
                const mbsData = JSON.parse(rawData);
                const processedData = processDataForEtape(mbsData, etape);
                renderWidgets(processedData);

            } catch (error) {
                console.error("Error loading or parsing data:", error);
                widgetGrid.innerHTML = `<p>Erreur lors du chargement des données.</p>`;
            }
        }
        
        function processDataForEtape(data, etape) {
            const subjectMap = new Map();

            data.subjects.forEach(subject => {
                const filteredGrades = subject.grades.filter(grade => {
                    if (etape === 'generale') return true;
                    // Assumes grade.etape is 'Étape 1', 'Étape 2', etc.
                    return grade.etape.replace(/\s+/g, '').toLowerCase() === etape;
                });

                if (filteredGrades.length > 0) {
                    const subjectData = {
                        name: subject.name,
                        grades: filteredGrades,
                        average: calculateWeightedAverage(filteredGrades),
                        // Add more calculations here if needed (e.g., trend)
                    };
                    subjectMap.set(subject.name, subjectData);
                }
            });
            return Array.from(subjectMap.values());
        }

        function calculateWeightedAverage(grades) {
            let totalPoints = 0;
            let totalWeight = 0;

            grades.forEach(grade => {
                const score = parseFloat(grade.result);
                const maxScore = parseFloat(grade.max);
                const weight = parseFloat(grade.weight);

                if (!isNaN(score) && !isNaN(maxScore) && !isNaN(weight) && maxScore > 0) {
                    totalPoints += (score / maxScore) * weight;
                    totalWeight += weight;
                }
            });
            
            return totalWeight > 0 ? (totalPoints / totalWeight) * 100 : 0;
        }

        // --- RENDERING ---
        function renderWidgets(subjectData) {
            // Clear previous charts and grid content
            Object.values(charts).forEach(chart => chart.destroy());
            charts = {};
            widgetGrid.innerHTML = '';
            
            if (subjectData.length === 0) {
                widgetGrid.innerHTML = `<p>Aucune note trouvée pour cette étape.</p>`;
                return;
            }

            subjectData.sort((a, b) => b.average - a.average); // Sort by average

            subjectData.forEach((subject, index) => {
                const widgetHTML = `
                    <div class="subject-widget" data-subject="${subject.name}">
                        <div class="widget-top-section">
                            <div class="widget-info">
                                <h3 class="widget-title">${subject.name}</h3>
                                <p class="widget-average">${subject.average.toFixed(1)}%</p>
                                <!-- Trend logic can be added here -->
                            </div>
                            <div class="histogram-container">
                                <canvas id="chart-${index}"></canvas>
                            </div>
                        </div>
                        <div class="mini-leaderboard-container" id="leaderboard-${index}">
                           <!-- Leaderboard will be rendered here -->
                        </div>
                    </div>
                `;
                widgetGrid.insertAdjacentHTML('beforeend', widgetHTML);
                
                // Create chart and render leaderboard after HTML is in the DOM
                createChart(`chart-${index}`, subject.grades);
                renderLeaderboard(`leaderboard-${index}`, subject.average);
            });
        }
        
        function createChart(canvasId, grades) {
            const ctx = document.getElementById(canvasId);
            if (!ctx) return;
            
            const gradePercentages = grades.map(g => {
                const score = parseFloat(g.result);
                const max = parseFloat(g.max);
                return (score && max) ? (score / max) * 100 : 0;
            }).filter(p => p > 0);

            charts[canvasId] = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: grades.map((g, i) => `Éval ${i + 1}`),
                    datasets: [{
                        label: 'Résultats',
                        data: gradePercentages,
                        backgroundColor: 'rgba(41, 128, 185, 0.6)',
                        borderColor: 'rgba(41, 128, 185, 1)',
                        borderWidth: 1,
                        borderRadius: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: 100, display: false },
                        x: { display: false }
                    },
                    plugins: { legend: { display: false }, tooltip: { enabled: true } }
                }
            });
        }
        
        /**
         * FIX: This function now correctly uses the pre-calculated average from localStorage
         * to find the user's rank. A full implementation requires a database of other students.
         * This is a simulation to demonstrate the corrected logic.
         */
        function renderLeaderboard(containerId, userAverage) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            // Simulate leaderboard data
            const leaderboardData = [
                { name: 'A. Tremblay', grade: 94.5 }, { name: 'B. Côté', grade: 91.2 },
                { name: 'C. Roy', grade: 88.9 }, { name: 'D. Gagnon', grade: 85.1 },
                { name: 'E. Bouchard', grade: 82.4 }
            ];

            // Add the current user to the data
            const userEntry = { name: 'Vous', grade: userAverage, isUser: true };
            leaderboardData.push(userEntry);
            
            // Sort by grade to establish ranking
            leaderboardData.sort((a, b) => b.grade - a.grade);

            let listHTML = '<ul class="leaderboard-list">';
            leaderboardData.forEach((item, index) => {
                listHTML += `
                    <li class="leaderboard-item ${item.isUser ? 'is-user' : ''}">
                        <span class="item-rank">${index + 1}.</span>
                        <span class="item-name">${item.name}</span>
                        <span class="item-grade">${item.grade.toFixed(1)}%</span>
                    </li>
                `;
            });
            listHTML += '</ul>';
            container.innerHTML = listHTML;
        }

        // --- THEME MANAGEMENT ---
        function initTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            document.getElementById('theme-toggle').querySelector('i').className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }

        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            document.getElementById('theme-toggle').querySelector('i').className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }

        // --- START THE APP ---
        init();
    });
    </script>
    
    <script id="chatbot-script">
    (function() {
        // --- CONFIGURATION ---
        const appScriptUrl = "https://script.google.com/macros/s/AKfycbwSKlEFJU94tw8B0Vq1VB4dI-4fgD1whUl4IoFkkelrODBjPdIGh3jTOYgIMR-cu5WIcg/exec";
        const GEMINI_MODEL = "gemini-1.5-flash-latest"; // Using a modern, efficient model
        let geminiApiKey = ''; 
        let isFetching = false;
        
        /**
         * --- IMPROVED SYSTEM PROMPT ---
         * This prompt now includes clear instructions on formatting, tone, and the crucial requirement to use clickable Markdown links.
         */
        const SYSTEM_PROMPT = `Tu es "Assistant MBS", un assistant IA pour les élèves du système éducatif québécois. Ton rôle est de les aider à comprendre leurs notes, leurs projections et leurs priorités d'amélioration en te basant sur les données JSON fournies.
        
        Règles de communication :
        1.  **Langue** : Communique en français (par défaut) ou en anglais, selon la langue de l'utilisateur.
        2.  **Ton** : Sois encourageant, clair et concis. Évite le jargon complexe.
        3.  **Formatage OBLIGATOIRE** : Structure tes réponses pour une lisibilité maximale. Utilise des paragraphes (sauts de ligne), des listes à puces (*), et du texte en gras (**mot**) pour hiérarchiser l'information. C'EST CRUCIAL. Évite les longs blocs de texte.
        4.  **Liens Cliquables** : Lorsque tu suggères des ressources externes, tu DOIS les formater en liens Markdown cliquables.
            *   Exemple correct : "Tu peux trouver de l'aide sur [Alloprof](https://www.alloprof.qc.ca)."
            *   Exemple correct : "Gère tes devoirs avec [Google Classroom](https://classroom.google.com/)."
        5.  **Analyse de Données** : N'effectue une analyse approfondie des notes que si l'utilisateur le demande explicitement. Pour les salutations simples, réponds par une salutation simple et amicale.
        `;

        // --- DOM Elements ---
        const container = document.getElementById('mbs-chatbot-container');
        const toggleButton = document.getElementById('mbs-chatbot-toggle');
        const chatWindow = document.getElementById('mbs-chatbot-window');
        const messagesContainer = document.getElementById('mbs-chat-messages');
        const chatForm = document.getElementById('mbs-chat-form');
        const chatInput = document.getElementById('mbs-chat-input');
        const chatSend = document.getElementById('mbs-chat-send');
        
        function init() {
            // FIX: Configure marked.js to treat newlines as <br>, crucial for chat formatting
            if (window.marked) {
                marked.use({ breaks: true });
            }
            
            setChatState('loading'); 
            fetchApiKey();
            setupEventListeners();
        }
        
        function setChatState(state) {
            isFetching = (state === 'fetching');
            const isReady = (state === 'ready' || state === 'idle');
            
            toggleButton.classList.toggle('loading', state === 'loading' || state === 'fetching');
            chatInput.disabled = !isReady;
            chatSend.disabled = !isReady;

            if (state === 'ready') {
                chatInput.placeholder = "Posez votre question...";
                displayMessage("Bonjour ! Comment puis-je vous aider avec vos notes aujourd'hui ?", 'ai');
            } else if (state === 'loading') {
                chatInput.placeholder = "Chargement de l'assistant...";
            } else if (state === 'idle') {
                chatInput.focus();
            }
        }
        
        function fetchApiKey() {
            fetch(appScriptUrl)
                .then(response => {
                    if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
                    return response.json();
                })
                .then(data => {
                    if (data && data.status === "success" && data.data.firstBox) {
                        geminiApiKey = data.data.firstBox.trim();
                        setChatState('ready');
                    } else {
                        throw new Error("Invalid API key format received.");
                    }
                })
                .catch(error => {
                    console.error("MBS Chatbot: API Key fetch error:", error);
                    displayMessage(`**Erreur de chargement:** Impossible de contacter le service de l'assistant. Veuillez réessayer plus tard.`, 'ai');
                });
        }

        function setupEventListeners() {
            toggleButton.addEventListener('click', () => {
                if (!toggleButton.classList.contains('loading')) {
                     container.classList.toggle('expanded');
                     if(container.classList.contains('expanded')) {
                        chatInput.focus();
                     }
                }
            });
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const userMessage = chatInput.value.trim();
                if (userMessage && !isFetching) {
                    displayMessage(userMessage, 'user');
                    chatInput.value = '';
                    processUserMessage(userMessage);
                }
            });
        }

        function displayMessage(message, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `mbs-chat-message ${sender}`;
            
            // FIX: Use marked.parse for AI messages to render HTML from Markdown
            if (sender === 'ai' && window.marked) {
                messageDiv.innerHTML = marked.parse(message);
            } else {
                messageDiv.textContent = message;
            }
            
            messagesContainer.appendChild(messageDiv);
            scrollToBottom();
            return messageDiv;
        }

        function showTypingIndicator() {
            if (messagesContainer.querySelector('.mbs-typing-indicator')) return;
            const indicatorDiv = document.createElement('div');
            indicatorDiv.className = 'mbs-typing-indicator';
            indicatorDiv.innerHTML = '<span></span><span></span><span></span>';
            messagesContainer.appendChild(indicatorDiv);
            scrollToBottom();
        }

        function removeTypingIndicator() {
            const indicator = messagesContainer.querySelector('.mbs-typing-indicator');
            if (indicator) indicator.remove();
        }

        function scrollToBottom() {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function getStudentDataForPrompt() {
            const safeParse = (key) => {
                try {
                    const rawData = localStorage.getItem(key);
                    return rawData ? JSON.parse(rawData) : { error: `Données '${key}' introuvables.` };
                } catch (e) {
                    return { error: `Erreur de lecture des données '${key}'.` };
                }
            };
            return { 
                mbsData: safeParse('mbsData'), 
                mbsProjectionCache: safeParse('mbsProjectionCache') 
            };
        }

        async function processUserMessage(userMessage) {
            if (!geminiApiKey) {
                 displayMessage('Désolé, l\'assistant n\'est pas correctement configuré. Clé API manquante.', 'ai');
                 return;
            }
            
            setChatState('fetching');
            showTypingIndicator();
            
            const studentDataContext = JSON.stringify(getStudentDataForPrompt(), null, 2);
            
            const fullPrompt = `${userMessage}\n\n---CONTEXTE DES DONNÉES DE L'ÉLÈVE---\n${studentDataContext}`;
            
            const payload = {
                contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
            };

            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || `Erreur HTTP: ${response.status}`);
                }

                const responseData = await response.json();
                const aiResponseText = responseData.candidates[0]?.content?.parts[0]?.text;

                if (aiResponseText) {
                    displayMessage(aiResponseText, 'ai');
                } else {
                    throw new Error("Réponse invalide ou vide de l'API.");
                }

            } catch (error) {
                console.error("MBS Chatbot: API Error:", error);
                displayMessage(`**Oups !** Une erreur est survenue. Voici le détail : ${error.message}`, 'ai');
            } finally {
                removeTypingIndicator();
                setChatState('idle');
            }
        }
        
        init();
    })();
    </script>

</body>
</html>
