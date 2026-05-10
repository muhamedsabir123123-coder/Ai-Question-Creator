document.getElementById('generate-btn').addEventListener('click', async () => {
    const topic = document.getElementById('topic').value.trim();
    const count = document.getElementById('count').value;
    
    const loadingUI = document.getElementById('loading-spinner');
    const errorUI = document.getElementById('error-message');
    const resultsCard = document.getElementById('results-card');
    const outputText = document.getElementById('output-text');

    if (!topic) {
        showError("Please enter a subject or topic.");
        return;
    }

    loadingUI.classList.remove('hidden');
    errorUI.classList.add('hidden');
    resultsCard.classList.add('hidden');

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic: topic, count: count })
        });

        const rawText = await response.text();
        
        let data;
        try {
            data = JSON.parse(rawText);
        } catch (e) {
            throw new Error("Server did not return valid JSON. Check api.php setup.");
        }

        if (data.error) {
            throw new Error(data.error.message || "API Rejected the request.");
        }

        const aiText = data.candidates[0].content.parts[0].text;
        
        outputText.innerText = aiText;
        resultsCard.classList.remove('hidden');

    } catch (error) {
        showError(error.message);
    } finally {
        loadingUI.classList.remove('hidden');
        loadingUI.classList.add('hidden');
    }
});

document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('topic').value = '';
    document.getElementById('results-card').classList.add('hidden');
    window.scrollTo(0, 0);
});

function showError(message) {
    const errorUI = document.getElementById('error-message');
    errorUI.innerText = message;
    errorUI.classList.remove('hidden');
}