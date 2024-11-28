
async function loadDashboard() {
    try {
    const response = await fetch('/dashboard');
    const results = await response.json();
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; 
    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${result.rule}</td>
        <td class="${result.status.toLowerCase()}">${result.status}</td>
        `;
        tableBody.appendChild(row);
    });
    } catch (error) {
    console.error('Error loading the dashboard:', error);
    }
}

loadDashboard(); 
