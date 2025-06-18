// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Input Elements & DOM references (condensed)
    const winningNumberInput = document.getElementById('winning-number-input'); /* ... */
    const addResultButton = document.getElementById('add-result-button');
    // ... other inputs ...
    const resultsList = document.getElementById('results-list');

    // DOM Elements for analysis sections (condensed)
    const hotNumbersDisplaySpan = document.getElementById('hot-numbers-display'); /* ... */
    const coldNumbersDisplaySpan = document.getElementById('cold-numbers-display');
    const repeatPatternsContentDiv = document.getElementById('repeat-patterns-content');
    const recentGapsDisplaySpan = document.getElementById('recent-gaps-display');
    // ... (other analysis span/div references) ...
    const finalesAChevalAnalysisContentDiv = document.getElementById('finales-a-cheval-analysis-content');

    let results = [];
    let currentCenterNumber = 0;
    let currentNeighbourCount = 2;
    let customNumberSets = [];
    const DEFAULT_HOT_COLD_COUNT = 5;
    const N_FOR_SECTION_REPEAT = [2, 3];

    // Number Group Definitions
    const wheelSequence = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const numberToIndexMap = new Map(wheelSequence.map((num, index) => [num, index]));
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
    // ... other definitions ...

    // --- Utility Functions (condensed) ---
    const getNeighbourNumbers = (centerNum, neighbourCt) => { /* ... */ return []; };
    // ... other utility functions ...

    // --- Analysis Functions (condensed) ---
    const analyzeBasicProperties = (r) => { /* ... */ return { red:{}, black:{}, even:{}, odd:{}, low:{}, high:{}, zeroCount:0};};
    const analyzeRepeatPatterns = (fullResultsArray) => { /* ... */ return {backToBackSame: null, prevIsNeighbour: null, sectionRepeats: [] }; };
    const analyzeHotColdNumbers = (resultsArray, numToShow = DEFAULT_HOT_COLD_COUNT) => { /* ... */ return {hot:[], cold:[]}; };
    const analyzeNumberFrequency = (r) => ([]);
    const analyzeStreaksAndFlips = (r) => ({redBlack:{}, evenOdd:{}, highLow:{}});
    const analyzeFinalesACheval = (r) => ([]); /* ... */

    const analyzeBallLandingGaps = (fullResultsArray) => {
        if (fullResultsArray.length < 2) {
            return { allGaps: [], recentGaps: [] };
        }
        const gaps = [];
        for (let i = 1; i < fullResultsArray.length; i++) {
            const num1 = fullResultsArray[i-1];
            const num2 = fullResultsArray[i];

            const index1 = numberToIndexMap.get(num1);
            const index2 = numberToIndexMap.get(num2);

            if (index1 === undefined || index2 === undefined) { // Should not happen with valid numbers
                console.warn(`Undefined index for numbers: ${num1} or ${num2}`);
                continue;
            }

            const clockwiseDistance = (index2 - index1 + wheelSequence.length) % wheelSequence.length;
            // Anti-clockwise distance is total length minus clockwise, unless clockwise is 0 (same number)
            // No, simpler: (index1 - index2 + length) % length
            const antiClockwiseDistance = (index1 - index2 + wheelSequence.length) % wheelSequence.length;

            let gapValue = 0;
            if (clockwiseDistance <= antiClockwiseDistance) {
                gapValue = clockwiseDistance;
            } else {
                gapValue = -antiClockwiseDistance; // Negative for anti-clockwise
            }
            // If num1 and num2 are the same, both distances are 0. clockwiseDistance <= antiClockwiseDistance is true, so gapValue = 0. Correct.
            gaps.push({ from: num1, to: num2, gap: gapValue });
        }
        return { allGaps: gaps, recentGaps: gaps.slice(-10) };
    };

    // --- Display Functions (condensed) ---
    const displayBasicPropertiesAnalysis = (d) => { /* ... */ };
    const displayRepeatPatterns = (d) => { repeatPatternsContentDiv.innerHTML = '';};
    const displayHotColdNumbers = (d) => { /* ... */ };
    const displayNumberFrequencyAnalysis = (d) => { /* ... */ };
    const displayStreaksAndFlips = (d) => { /* ... */ };
    const displayFinalesAChevalAnalysis = (d) => { finalesAChevalAnalysisContentDiv.innerHTML = '';}; /* ... */

    const displayBallLandingGaps = (analysisData) => {
        if (!analysisData || !analysisData.recentGaps || analysisData.recentGaps.length === 0) {
            recentGapsDisplaySpan.textContent = 'N/A (Not enough results)';
            return;
        }
        const gapStrings = analysisData.recentGaps.map(g =>
            `${g.gap > 0 ? '+' : ''}${g.gap} (${g.from}→${g.to})`
        );
        recentGapsDisplaySpan.textContent = gapStrings.join(', ');
    };

    // --- Custom Sets Logic (condensed) ---
    const renderCustomSetsAndAnalysis = () => { /* ... */ };
    // ... other custom set functions ...

    // --- Core Logic ---
    const getFilteredResults = () => {
        const val = document.querySelector('input[name="range_filter"]:checked').value;
        return val === 'all' || isNaN(parseInt(val)) ? results : results.slice(-parseInt(val));
    };

    const runAllAnalyses = () => {
        const currentFilteredResults = getFilteredResults();
        // Call all existing analysis display functions (condensed)
        displayBasicPropertiesAnalysis(analyzeBasicProperties(currentFilteredResults));
        displayNumberFrequencyAnalysis(analyzeNumberFrequency(currentFilteredResults));
        displayHotColdNumbers(analyzeHotColdNumbers(currentFilteredResults, DEFAULT_HOT_COLD_COUNT));
        displayRepeatPatterns(analyzeRepeatPatterns(results));
        displayStreaksAndFlips(analyzeStreaksAndFlips(currentFilteredResults));
        displayBallLandingGaps(analyzeBallLandingGaps(results)); // New, uses full results

        renderCustomSetsAndAnalysis();
    };

    const renderResultsList = () => { /* ... */ };
    const loadResults = () => { /* ... */
        const stored = localStorage.getItem('rouletteResults');
        if (stored) { results = JSON.parse(stored); }
        // Initialize neighbour bet inputs (if they exist)
        const neighbourCenterInput = document.getElementById('neighbour-center-number');
        const neighbourCountInput = document.getElementById('neighbour-count');
        if (neighbourCenterInput && neighbourCountInput) {
            currentCenterNumber = parseInt(neighbourCenterInput.value, 10);
            currentNeighbourCount = parseInt(neighbourCountInput.value, 10);
        }
        loadCustomSets();
        renderResultsList();
        runAllAnalyses();
    };

    // --- Event Listeners (condensed) ---
    addResultButton.addEventListener('click', () => { /* ... */ });
    resetDataButton.addEventListener('click', () => { /* ... */ });
    rangeFilterRadios.forEach(radio => radio.addEventListener('change', () => { /* ... */ }));
    // ... other listeners ...

    // Initial load
    loadResults();
});
