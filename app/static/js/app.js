async function fetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
    }
    if (res.status === 204) return null;
    return res.json();
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
