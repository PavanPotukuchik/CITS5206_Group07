$(document).ready(function() {
    const authData = localStorage.getItem('admin_auth');
    if (!authData) {
        window.location.href = "/login";
    }

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');
    
    let clientId = ''; 

    $(".small-box-footer").click(async function() {        
        const response = await fetch(`https://five206pocketbase.onrender.com/api/collections/project/records?expand=userId`, {
            method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(authData).token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);

                //$('#modalDetails').modal('show');

                var varDataTableSumm = null;
                const tbl = document.getElementById('tbl');
                tbl.style.visibility = "";
                
                varDataTableSumm = $('#tbl').DataTable({
                    "data": data.items,
                    "paging": false,
                    "searching": true,
                    "responsive": true,
                    "bInfo": false,
                    "processing": true,
                    "ordering": true,
                    "scrollY": '181px',
                    "scrollX": false,
                    "scrollCollapse": true,
                    "language": {
                        'loadingRecords': '&nbsp;',
                        'processing': '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'
                    },
                    "columns": [
                        { "data": "newStatus"},
                        { "data": "newSubStatus"},
                        { "data": "comments"}                    
                    ],
                    "order": [[0, 'desc']],
                    "pageLength": 15,
                    "lengthMenu": [[5, 10, 15, 25, 50, -1], [5, 10, 15, 25, 50, "All"]],
                    "columnDefs": [{ "defaultContent": "", "searchable": true, "ordering": true, "className": "text-left", "targets": [0] },
                                   { "defaultContent": "", "searchable": true, "ordering": true, "className": "text-right", "targets": [] }]
                });
            }
      });

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
                    console.log(project);
                    const clientName = project.expand?.clientid?.name || 'Unknown User';
                    clientId = project.clientid;
                    
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
        window.location.href = `/change-request?projectId=${projectId}`; 
    });

    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('client_auth');
        window.location.href = '/login';
    });
});
