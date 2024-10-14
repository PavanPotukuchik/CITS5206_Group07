$(document).ready(function() {
    const authData = localStorage.getItem('admin_auth');
    if (!authData) {
        window.location.href = "/login";
    }

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');
    let clientId = ''; 
    async function fetchProjectDetails() {
        try {
            const response = await fetch(`https://five206pocketbase.onrender.com/api/collections/project/records?expand=userId`, {
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
                    clientId = project.userId; 
                    const clientName = project.expand?.userId?.name || 'Unknown User';

                    document.getElementById('projectId').textContent = project.id;
                    document.getElementById('projectName').textContent = project.projectName;
                    document.getElementById('projectStatus').textContent = project.projectStatus;
                    document.getElementById('createdDate').textContent = new Date(project.created).toLocaleDateString();
                    document.getElementById('updatedDate').textContent = new Date(project.updated).toLocaleDateString();
                    document.getElementById('clientName').textContent = clientName; 
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
        window.location.href = '/project-list';
    });

    document.getElementById('resourcesBtn').addEventListener('click', function() {
        if (clientId) {
            window.location.href = `/documents?userId=${clientId}`;
        } else {
            console.error('Client ID not found');
        }
    });

    document.getElementById('clientInfoBtn').addEventListener('click', function() {
        window.location.href = '/clients-list'; 
    });

    document.getElementById('requestFormBtn').addEventListener('click', function() {
        // Action for the request form button (this part is not specified yet)
        console.log('Request Form button clicked.');       
    });
    document.getElementById('QuestionBtn').addEventListener('click', function() {
        // Action for the request form button (this part is not specified yet)
        console.log('Question button clicked.');       
    });

    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('admin_auth');
        window.location.href = "/login";
    });
});
