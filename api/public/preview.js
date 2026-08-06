const templateSelect = document.querySelector("#template");
const mockSelect = document.querySelector("#mock");
const iframe = document.querySelector("#preview");
const autoReload = document.querySelector("#autoreload");

let currentVersion = 0;

iframe.addEventListener("load", () => {
    const doc = iframe.contentDocument;

    if (!doc) {
        return;
    }

    doc.body.style.margin = "0";
    doc.documentElement.style.margin = "0";

    iframe.style.height = `${doc.documentElement.scrollHeight}px`
});

async function loadTemplates() {
    const response = await fetch("/api/templates");
    return response.json();    
}

async function loadMocks() {
    const response = await fetch("/api/mocks");
    return response.json();
}

async function getVersion() {
    const response = await fetch("/api/version");
    return response.json();
}

function saveState() {
    localStorage.setItem("template", templateSelect.value);
    localStorage.setItem("mock", mockSelect.value);
}

function restoreState() {
    const template = localStorage.getItem("template");
    const mock = localStorage.getItem("mock");

    if (template) {
        templateSelect.value = template;
    }

    if (mock) {
        mockSelect.value = mock;
    }
}

function buildPreviewUrl(template, mock) {
    const params = new URLSearchParams({ mock, });
    return `/preview/${template}?${params.toString()}`;
}

function renderPreview() {
    const template = templateSelect.value;
    const mock = mockSelect.value;

    iframe.src = buildPreviewUrl(template, mock);
}

function updatePreview() {
    saveState();
    renderPreview();
}

async function checkForUpdates() {
    if (!autoReload.checked) {
        return;
    }

    const { version } = await getVersion();

    if (version === currentVersion) {
        return;
    }

    currentVersion = version;
    renderPreview();
}

async function init() {
    const templates = await loadTemplates();
    const mocks = await loadMocks();

    templates.forEach(template => {
        const option = document.createElement("option");

        option.value = template;
        option.textContent = template;

        templateSelect.append(option);
    });

    mocks.forEach(mock => {
        const option = document.createElement("option");

        option.value = mock;
        option.textContent = mock;

        mockSelect.append(option);
    });

    restoreState();

    if (!templateSelect.value && templates.length > 0) {
        templateSelect.value = templates[0];
    }

    if (!mockSelect.value && mocks.length > 0) {
        mockSelect.value = mocks[0];
    }

    templateSelect.addEventListener("change", updatePreview);
    mockSelect.addEventListener("change", updatePreview);

    updatePreview();

    setInterval(checkForUpdates, 5000);
}

init();