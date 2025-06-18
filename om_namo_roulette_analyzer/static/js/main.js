// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Input Elements & DOM references (condensed)
    const addResultButton = document.getElementById('add-result-button'); /* ... */
    const resultsList = document.getElementById('results-list'); // This is the short "Entered Results" list

    // DOM Elements for analysis sections (condensed)
    const groupPatternAlertsContentDiv = document.getElementById('group-pattern-alerts-content'); /* ... */
    const historyPanelContentDiv = document.getElementById('history-panel-content'); // New
    // ... (other analysis span/div references) ...
    const finalesAChevalAnalysisContentDiv = document.getElementById('finales-a-cheval-analysis-content');

    let results = [];
    let currentDealerFilter = 'all';
    let currentCenterNumber = 0;
    let currentNeighbourCount = 2;
    let customNumberSets = [];
    // ... (Constants like DEFAULT_HOT_COLD_COUNT, etc.)

    // Number Group Definitions (condensed)
    // ...

    // --- Utility Functions (condensed) ---
    // ...

    // --- Analysis Functions (condensed) ---
    const analyzeGroupPatternAlerts = (fullRO) => ([]); /* ... */
    // ... other analysis functions ...

    // --- Display Functions (condensed) ---
    const displayGroupPatternAlerts = (d) => {}; /* ... */
    // ... other display functions ...

    const renderFullHistoryPanel = (dealerFilteredHistoryObjects) => {
        historyPanelContentDiv.innerHTML = ''; // Clear previous content

        if (!dealerFilteredHistoryObjects || dealerFilteredHistoryObjects.length === 0) {
            historyPanelContentDiv.innerHTML = '<p style="font-style: italic;">No results to show for selected dealer.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.style.cssText = 'list-style-type: none; padding-left: 0; font-size: 0.9em;';

        // Displaying in chronological order (oldest first)
        dealerFilteredHistoryObjects.forEach((result, index) => {
            const li = document.createElement('li');
            li.style.borderBottom = '1px dashed #eee';
            li.style.padding = '4px 0';
            const dateStr = new Date(result.timestamp).toLocaleString();
            li.innerHTML = `<strong>#${index + 1}:</strong> ${result.number} (Dealer: ${result.dealer || 'N/A'}, Time: ${dateStr})`;
            ul.appendChild(li);
        });
        historyPanelContentDiv.appendChild(ul);
    };

    // --- Custom Sets Logic (condensed) ---
    const renderCustomSetsAndAnalysis = () => { /* ... */ };
    // ... other custom set functions ...

    // --- Core Logic ---
    const getFilteredResults = () => { /* ... returns array of numbers ... */
        const dealerFilterSelect = document.getElementById('dealer-filter-select');
        currentDealerFilter = dealerFilterSelect ? dealerFilterSelect.value : 'all';
        let filteredByDealer = results;
        if (currentDealerFilter !== 'all') {
            filteredByDealer = results.filter(resObj => resObj.dealer === currentDealerFilter);
        }
        const selectedRange = document.querySelector('input[name="range_filter"]:checked').value;
        let rangeFilteredObjects = (selectedRange === 'all' || isNaN(parseInt(selectedRange))) ?
            filteredByDealer : filteredByDealer.slice(-parseInt(selectedRange, 10));
        return rangeFilteredObjects.map(resultObj => resultObj.number);
    };
    const getFilteredResultObjects = () => { /* ... returns array of objects ... */
         const dealerFilterSelect = document.getElementById('dealer-filter-select');
         currentDealerFilter = dealerFilterSelect ? dealerFilterSelect.value : 'all';
         let filteredByDealer = results;
        if (currentDealerFilter !== 'all') {
            filteredByDealer = results.filter(resObj => resObj.dealer === currentDealerFilter);
        }
        const selectedRange = document.querySelector('input[name="range_filter"]:checked').value;
        return (selectedRange === 'all' || isNaN(parseInt(selectedRange))) ?
            filteredByDealer : filteredByDealer.slice(-parseInt(selectedRange, 10));
    };

    const runAllAnalyses = () => {
        const currentFilteredNumbers = getFilteredResults();
        const currentFilteredObjects = getFilteredResultObjects(); // Used for the short results list display

        let fullHistoryForSelectedDealerObjects = results;
        if (currentDealerFilter !== 'all') {
            fullHistoryForSelectedDealerObjects = results.filter(resObj => resObj.dealer === currentDealerFilter);
        }

        // ... (call all other display(analyze...()) functions for the main analysis panel) ...
        // Example: displayBasicPropertiesAnalysis(analyzeBasicProperties(currentFilteredNumbers));
        // displayGroupPatternAlerts(analyzeGroupPatternAlerts(fullHistoryForSelectedDealerObjects));

        renderFullHistoryPanel(fullHistoryForSelectedDealerObjects); // New: Render full history panel

        renderCustomSetsAndAnalysis();
        const dealerFilterSelect = document.getElementById('dealer-filter-select');
        if(dealerFilterSelect) populateDealerFilter();
    };

    const populateDealerFilter = () => { /* ... */ };
    const renderResultsList = () => { // This is for the short "Entered Results" list
        resultsList.innerHTML = '';
        const objectsToDisplay = getFilteredResultObjects();
        objectsToDisplay.slice().reverse().forEach(resultObj => { // Newest first for this list
            const li = document.createElement('li');
            li.textContent = `N: ${resultObj.number} (D: ${resultObj.dealer || 'N/A'})`;
            resultsList.appendChild(li);
        });
    };
    const loadResults = () => { /* ... */ runAllAnalyses(); };
    const createWheelSVG = () => { /* ... */ };

    // --- Event Listeners (condensed) ---
    addResultButton.addEventListener('click', () => { /* ... */ runAllAnalyses(); });
    // ... other listeners ...

    loadResults();
});
