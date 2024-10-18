$(document).ready(function() {
    const authData = localStorage.getItem('client_auth');
    if (!authData) {
        window.location.href = "/login";
    }

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');
   
    async function fetchProjectDetails() {
        try {
            const response = await fetch(`https://five206pocketbase.onrender.com/api/collections/project/records?expand=clientid`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(authData).token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const project = data.items.find(item => item.id === projectId);
                var clin_Data = JSON.parse(localStorage.getItem('client_auth')); 
                var _clinName = null;

                if (project) {
                    console.log(project);
                    const clientName = project.expand?.clientid?.name || 'Unknown User';

                    document.getElementById('projectId').textContent = project.id;
                    document.getElementById('projectName').textContent = project.projectName;
                    document.getElementById('projectStatus').textContent = project.projectStatus;
                    document.getElementById('createdDate').textContent = new Date(project.created).toLocaleDateString();
                    document.getElementById('updatedDate').textContent = new Date(project.updated).toLocaleDateString();
                    document.getElementById('clientName').textContent = clientName;
                    document.getElementById('description').textContent = project.description || "No description available";
                    document.getElementById('features').textContent = project.features || "No features listed";

                    if(project.projectStatus == "Active")
                    {
                        document.getElementById('lblActive').textContent = "since " + new Date(project.updated).toLocaleDateString(); 
                        $("#divActive").addClass("small-box bg-success"); 
                        $("#iconActive").addClass("fas fa-thumbs-up");
                    }
                    else 
                    {
                        document.getElementById('lblActive').textContent = "-";
                        $("#divActive").addClass("small-box bg-warning"); 
                        $("#iconActive").addClass("fas fa-thumbs-down");
                    }
                    if(project.projectStatus == "Pending")
                    {
                        document.getElementById('lblPending"=').textContent = "since " + new Date(project.updated).toLocaleDateString();
                        $("#divPending").addClass("small-box bg-success"); 
                        $("#iconPending").addClass("fas fa-thumbs-up");
                    }
                    else 
                    {
                        document.getElementById('lblPending').textContent = "-";
                        $("#divPending").addClass("small-box bg-warning"); 
                        $("#iconPending").addClass("fas fa-thumbs-down");
                    } 
                    if(project.projectStatus == "Priority")
                    {
                        document.getElementById('lblPriority').textContent = "since " + new Date(project.updated).toLocaleDateString();
                        $("#divPriority").addClass("small-box bg-success"); 
                        $("#iconPriority").addClass("fas fa-thumbs-up");
                    }
                    else 
                    {
                        document.getElementById('lblPriority').textContent = "-";
                        $("#divPriority").addClass("small-box bg-warning"); 
                        $("#iconPriority").addClass("fas fa-thumbs-down");
                    } 
                    if(project.projectStatus == "Not-Started")
                    {
                        document.getElementById('lblNotStarted').textContent = "since " + new Date(project.updated).toLocaleDateString();
                        $("#divNotStarted").addClass("small-box bg-success"); 
                        $("#iconNotStarted").addClass("fas fa-thumbs-up");
                    } 
                    else
                    {
                        document.getElementById('lblNotStarted').textContent = "-";
                        $("#divNotStarted").addClass("small-box bg-warning"); 
                        $("#iconNotStarted").addClass("fas fa-thumbs-down");
                    }
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
        window.location.href = `/client-change-request?projectId=${projectId}`; 
    });

    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('client_auth');
        window.location.href = '/login';
    });
});
