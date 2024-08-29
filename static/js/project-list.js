$(document).ready(function() {
    const authData = localStorage.getItem('admin_auth');
    if (!authData) {
        window.location.href = "/login";
    }

    async function fetchProject() {
        try {
            const response = await fetch('http://127.0.0.1:8090/api/collections/projects/records', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(authData).token}`
                }
            });

            if (response.ok) {
                const projectData = await response.json();
                const projectTableBody = document.getElementById('projectTableBody');

                projectData.items.forEach(project => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td>${project.id}</td>
                        <td>${project.projectName}</td>
                        <td>${project.projectStatus}</td>
                        <td>${new Date(project.created).toLocaleDateString()}</td>
                        <td>${new Date(project.updated).toLocaleDateString()}</td>
                        <td>${project.clientName}</td>
                    `;

                    row.addEventListener('click', () => {
                        window.location.href = `/project-detail?projectId=${project.id}`;
                    });

                    row.style.cursor = 'pointer';

                    projectTableBody.appendChild(row);
                });

            } else {
                console.error('Failed to fetch project.');
            }
        } catch (error) {
            console.error('An error occurred while fetching project:', error);
        }
    }

    fetchProject();

    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('admin_auth');
        window.location.href = "/login";
    });
});
