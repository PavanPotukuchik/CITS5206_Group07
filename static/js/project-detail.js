$(document).ready(function() {
    const authData = localStorage.getItem('admin_auth');
    if (!authData) {
        window.location.href = "/login";
    }

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');

    async function fetchProjectDetails() {
        try {
            const response = await fetch(`http://127.0.0.1:8090/api/collections/projects/records`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(authData).token}`
                }
            });

            if (response.ok) {
                const project = await response.json();

                // Populate the details
                document.getElementById('clientName').textContent = project.clientName;
                document.getElementById('projectName').textContent = project.projectName;
                document.getElementById('description').textContent = project.description || "No description available";
                document.getElementById('features').textContent = project.features || "No features listed";

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
