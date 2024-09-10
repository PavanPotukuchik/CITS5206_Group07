$(document).ready(function() {
    const authData = localStorage.getItem('admin_auth');
    if (!authData) {
        window.location.href = "/login";
    }

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');

    async function fetchProjectDetails() {
        try {
            const response = await fetch(`http://127.0.0.1:8090/api/collections/project/records`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(authData).token}`
                }
            });

            if (response.ok) {
                const data = await response.json();

                const project = data.items.find(item => item.id === projectId);

                if (project) {
                    // Populate the details
                    document.getElementById('projectId').textContent = project.id;
                    document.getElementById('projectName').textContent = project.projectName;
                    document.getElementById('projectStatus').textContent = project.projectStatus;
                    document.getElementById('createdDate').textContent = new Date(project.created).toLocaleDateString();
                    document.getElementById('updatedDate').textContent = new Date(project.updated).toLocaleDateString();
                    document.getElementById('clientName').textContent = project.clientName;
                    document.getElementById('description').textContent = project.description || "No description available";
                    document.getElementById('features').textContent = project.features || "No features listed";
                } else {
                    console.error('Project not found.');
                }
            } else {
                console.error('Failed to fetch project details.');
            }
        } catch (error) {
            console.error('An error occurred while fetching project details:', error);
        }
    }

    fetchProjectDetails();

    document.getElementById('backButton').addEventListener('click', () => {
        window.location.href = '/project-form';
    });
});
