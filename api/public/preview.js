/* eslint-disable */
const projectSelect = document.querySelector('#project');
const templateSelect = document.querySelector('#template');
const mockSelect = document.querySelector('#mock');
const iframe = document.querySelector('#preview');
const autoReload = document.querySelector('#autoreload');

iframe.addEventListener('load', () => {
    const doc = iframe.contentDocument;

    if (!doc) {
        return;
    }

    doc.body.style.margin = '0';
    doc.documentElement.style.margin = '0';

    iframe.style.height = `${doc.documentElement.scrollHeight}px`;
});

async function loadProjects() {
    const response = await fetch('/projects');

    if (!response.ok) {
        throw new Error('Failed to load projects');
    }

    return response.json();
}

async function loadTemplates(projectId) {
    const response = await fetch(`/projects/${projectId}/templates`);

    if (!response.ok) {
        throw new Error('Failed to load templates');
    }

    return response.json();
}

async function loadMocks(projectId) {
    const response = await fetch(`/projects/${projectId}/mocks`);

    if (!response.ok) {
        throw new Error('Failed to load mocks');
    }

    return response.json();
}

function saveState() {
    localStorage.setItem('project', projectSelect.value);
    localStorage.setItem('template', templateSelect.value);
    localStorage.setItem('mock', mockSelect.value);
}

function restoreState() {
    const project = localStorage.getItem('project');
    const template = localStorage.getItem('template');
    const mock = localStorage.getItem('mock');

    if (project) {
        projectSelect.value = project;
    }

    if (template) {
        templateSelect.value = template;
    }

    if (mock) {
        mockSelect.value = mock;
    }
}

function populateSelect(select, items) {
    select.replaceChildren();

    items.forEach(item => {
        const option = document.createElement('option');

        option.value = item.id;
        option.textContent = item.name;

        select.append(option);
    });
}

function buildPreviewUrl(projectId, templateId, mockId) {
    const params = new URLSearchParams({
        mockId,
    });

    return `/projects/${projectId}/preview/${templateId}?${params.toString()}`;
}

function renderPreview() {
    const projectId = projectSelect.value;
    const templateId = templateSelect.value;
    const mockId = mockSelect.value;

    if (!projectId || !templateId || !mockId) {
        return;
    }

    iframe.src = buildPreviewUrl(projectId, templateId, mockId);
}

function updatePreview() {
    saveState();
    renderPreview();
}

async function updateProjectResources() {
    const projectId = projectSelect.value;

    if (!projectId) {
        return;
    }

    const [templates, mocks] = await Promise.all([loadTemplates(projectId), loadMocks(projectId)]);

    populateSelect(templateSelect, templates);
    populateSelect(mockSelect, mocks);

    templateSelect.value = localStorage.getItem('template') ?? '';
    mockSelect.value = localStorage.getItem('mock') ?? '';

    if (!templateSelect.value && templates.length > 0) {
        templateSelect.value = templates[0].id;
    }

    if (!mockSelect.value && mocks.length > 0) {
        mockSelect.value = mocks[0].id;
    }

    updatePreview();
}

async function checkForUpdates() {
    if (!autoReload.checked) {
        return;
    }
    renderPreview();
}

async function init() {
    const projects = await loadProjects();

    populateSelect(projectSelect, projects);

    restoreState();

    if (!projectSelect.value && projects.length > 0) {
        projectSelect.value = projects[0].id;
    }

    projectSelect.addEventListener('change', async () => {
        localStorage.removeItem('template');
        localStorage.removeItem('mock');

        await updateProjectResources();
    });

    templateSelect.addEventListener('change', updatePreview);
    mockSelect.addEventListener('change', updatePreview);

    await updateProjectResources();

    setInterval(checkForUpdates, 5000);
}

init();
