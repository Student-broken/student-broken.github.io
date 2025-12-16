const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1CoMUIieKjENe1jE-5It-pIEi7qiU2Mv6ian-3yDNs6uz383wlQYmCdDNXXHAgLjpGw/exec';

async function fetchRankingData() {
    if (rankingData.status === 'loading' || rankingData.status === 'loaded') return;
    rankingData.status = 'loading';
    try {
        if (!mbsData?.nom || !mbsData?.settings?.niveau) throw new Error("Nom ou niveau manquant.");
        
        const localAvgs = calculateAveragesFromRawData(mbsData);
        
        const encodedName = btoa(unescape(encodeURIComponent(mbsData.nom)));
        
        const formData = new FormData();
        formData.append('encodedName', encodedName);
        formData.append('secondaryLevel', mbsData.settings.niveau);
        
        for (const key in localAvgs.term) formData.append(key, localAvgs.term[key]?.toFixed(2) ?? '');
        
        for (const key in localAvgs.subjects) formData.append(key, localAvgs.subjects[key]?.toFixed(2) ?? '');
        
        fetch(SCRIPT_URL, { method: 'POST', body: formData, mode: 'no-cors' });
