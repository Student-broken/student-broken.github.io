// --- 1. CONFIGURATION ---
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1CoMUIieKjENe1jE-5It-pIEi7qiU2Mv6ian-3yDNs6uz383wlQYmCdDNXXHAgLjpGw/exec';

const TERM_WEIGHTS = { etape1: 0.20, etape2: 0.20, etape3: 0.60 };

let mbsData = JSON.parse(localStorage.getItem('mbsData')) || {}; // Loads your local grades
let rankingData = { status: 'idle', data: null, error: null };


async function fetchRankingData() {
    // Prevent double-sending if already loading
    if (rankingData.status === 'loading' || rankingData.status === 'loaded') return;
    rankingData.status = 'loading';

    try {
        if (!mbsData?.nom || !mbsData?.settings?.niveau) throw new Error("Nom ou niveau manquant.");

        const localAvgs = calculateAveragesFromRawData(mbsData);

        const encodedName = btoa(unescape(encodeURIComponent(mbsData.nom)));

        const formData = new FormData();
        formData.append('encodedName', encodedName);
        formData.append('secondaryLevel', mbsData.settings.niveau);

        for (const key in localAvgs.term) {
            formData.append(key, localAvgs.term[key]?.toFixed(2) ?? '');
        }

        for (const key in localAvgs.subjects) {
            formData.append(key, localAvgs.subjects[key]?.toFixed(2) ?? '');
        }

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' 
        });


    } catch (error) {
        console.error("Ranking Fetch Error:", error);
    }
}


// --- 3. HELPER FUNCTIONS (REQUIRED FOR MATH) ---

// Calculates the global and term averages from the raw mbsData object
function calculateAveragesFromRawData(data) {
    let termAverages = { GlobalAverage: null, Etape1Average: null, Etape2Average: null, Etape3Average: null };
    let allSubjectAverages = {};

    ['etape1', 'etape2', 'etape3'].forEach(etape => {
        let termSubjectAvgs = [];
        (data[etape] || []).forEach(subject => {
            const subjectAverage = calculateSubjectAverage(subject);
            if (subjectAverage !== null) {
                termSubjectAvgs.push(subjectAverage);
                const code = subject.code.substring(0, 3);
                if (!allSubjectAverages[code]) allSubjectAverages[code] = { total: 0, count: 0 };
                allSubjectAverages[code].total += subjectAverage;
                allSubjectAverages[code].count++;
            }
        });
        if (termSubjectAvgs.length > 0) {
            const etapeKey = 'Etape' + etape.slice(-1) + 'Average';
            termAverages[etapeKey] = termSubjectAvgs.reduce((a, b) => a + b, 0) / termSubjectAvgs.length;
        }
    });

    const finalSubjectAvgs = {};
    for (const code in allSubjectAverages) {
        finalSubjectAvgs[code] = allSubjectAverages[code].total / allSubjectAverages[code].count;
    }

    let globalTotal = 0, globalWeight = 0;
    if (termAverages.Etape1Average !== null) { globalTotal += termAverages.Etape1Average * TERM_WEIGHTS.etape1; globalWeight += TERM_WEIGHTS.etape1 };
    if (termAverages.Etape2Average !== null) { globalTotal += termAverages.Etape2Average * TERM_WEIGHTS.etape2; globalWeight += TERM_WEIGHTS.etape2 };
    if (termAverages.Etape3Average !== null) { globalTotal += termAverages.Etape3Average * TERM_WEIGHTS.etape3; globalWeight += TERM_WEIGHTS.etape3 };
    
    if (globalWeight > 0) termAverages.GlobalAverage = globalTotal / globalWeight;
    
    return { term: termAverages, subjects: finalSubjectAvgs };
}

// Calculates the average for a single subject
const calculateSubjectAverage = (subject) => {
    let totalWeightedCompetencyScore = 0, totalCompetencyWeight = 0;
    (subject?.competencies || []).forEach(comp => {
        const compWeightMatch = comp.name.match(/\((\d+)%\)/);
        if (!compWeightMatch) return;
        const competencyWeight = parseFloat(compWeightMatch[1]);
        const compResult = calculateAverage(comp.assignments);
        if (compResult) {
            totalWeightedCompetencyScore += compResult.average * competencyWeight;
            totalCompetencyWeight += competencyWeight;
        }
    });
    return totalCompetencyWeight > 0 ? totalWeightedCompetencyScore / totalCompetencyWeight : null;
};

// Calculates the average for a list of assignments
const calculateAverage = (assignments) => {
    let totalWeightedGrade = 0, totalWeight = 0;
    (assignments || []).forEach(assign => {
        const grade = getNumericGrade(assign.result);
        const weight = parseFloat(assign.pond);
        if (grade !== null && !isNaN(weight) && weight > 0) {
            totalWeightedGrade += grade * weight;
            totalWeight += weight;
        }
    });
    return totalWeight > 0 ? { average: totalWeightedGrade / totalWeight, weight: totalWeight } : null;
};

// Parses a string grade (e.g., "85 / 100") into a number
const getNumericGrade = (result) => {
    if (!result) return null;
    const gradeMap = { 'A+': 100, 'A': 95, 'A-': 90, 'B+': 85, 'B': 80, 'B-': 75, 'C+': 70, 'C': 65, 'C-': 60, 'D+': 55, 'D': 50, 'E': 45 };
    const trimmed = result.trim();
    if (gradeMap[trimmed]) return gradeMap[trimmed];
    const scoreMatch = trimmed.match(/(\d+[,.]?\d*)\s*\/\s*(\d+[,.]?\d*)/);
    if (scoreMatch) {
        const score = parseFloat(scoreMatch[1].replace(',', '.'));
        const max = parseFloat(scoreMatch[2].replace(',', '.'));
        return (max > 0) ? (score / max) * 100 : null;
    }
    return null;
};
