const submitButton = document.querySelector('#submit');
const input = document.querySelector('#input');
const errorSpan = document.querySelector('#error');
const resultsContainer = document.querySelector('#results');

const endpoint = 'https://en.wikipedia.org/w/api.php?';
const params = {
    origin: '*',
    format: 'json',
    action: 'query',
    prop: 'extracts',
    exchars: 250,
    exintro: true,
    explaintext: true,
    generator: 'search',
    gsrlimit: 20,
};

const disableUI = () => {
    input.disabled = true;
    submitButton.disabled = true;
};
const enableUI = () => {
    input.disabled = false;
    submitButton.disabled = false;
};
const clearPreviousResults = () => {
    resultsContainer.innerHTML = '';
    errorSpan.innerHTML = '';
};
const isInputEmpty = input => {
    if (!input || input === '') return true;
    return false;
};
const showError = error => {
    errorSpan.innerHTML = `🚨${error}🚨`;
};

const showResults = results => {
    results.forEach(result => {
        resultsContainer.innerHTML += `
        <div class="results__item">
            <a href="https://en.wikipedia.org/?curid=${result.pageId}" target="_blank" class="card animated bounceInUp">
                <h2 class="results__item__title">${result.title}</h2>
                <p class="results__item__intro">${result.intro}</p>
            </a>
        </div>
    `;
    });
};

const gatherData = (pages) => {
    const results = Object.values(pages).map(page => ({
        pageId: page.pageid,
        title: page.title,
        intro: page.extract,
    }));
    showResults(results);
}

const getData = async () => {
    const userInput = input.value;
    if (isInputEmpty(userInput)) {
        return;
    }
    params.gsrsearch = userInput;
    clearPreviousResults();
    disableUI();

    try {
        const { data } = await axios.get(endpoint, { params });

        if (data.error) throw new Error(data.error.info);
        gatherData(data.query.pages);
    } catch (error) {
        showError(error);
    } finally {
        enableUI();
    }
};
const handleKeyEvent = e => {
    if (e.key == 'Enter') {
        getData();
    }
};

const registerEventHandler = () => {
    input.addEventListener('keydown', handleKeyEvent);
    submitButton.addEventListener('click', getData);
};

registerEventHandler();
