$(document).ready(function () {
    const authData = localStorage.getItem('admin_auth');
    const API_URL = 'http://127.0.0.1:8090';
    
    const FILE_COLLECTION = 'statusUpdates';

    if (!authData) {
        window.location.href = "/login";
    }

    async function fetchProject() {
        try {
            const response = await fetch('http://127.0.0.1:8090/api/collections/project/records', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(authData).token}`
                }
            });

            if (response.ok) {
                const projectData = await response.json();

                var ddlProject = $("[id*=ddlproject]");
                ddlProject.empty();
                ddlProject.append($("<option></option>").val("").html(""));

                projectData.items.forEach(project => {
                    ddlProject.append($("<option></option>").val(project.id).html(project.projectName));
                });

                // if(projectId)
                // {
                //     console.log(projectId);
                //     $('#ddlproject').val(projectId);
                // }

            } else {
                console.error('Failed to fetch project.');
            }
        } catch (error) {
            console.error('An error occurred while fetching project:', error);
        }
    }

    fetchProject();

    document.getElementById('logoutButton').addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('client_auth');
        window.location.href = '/login';
    });

    document.getElementById('addProjectForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        var pid = document.getElementById('ddlproject').value;
        var projStatus = document.getElementById('ddlstatus').value;
        var projSubStatus = document.getElementById('ddlsubstatus').value;
        var admin_Data = JSON.parse(localStorage.getItem('admin_auth'));
        var comments = document.getElementById('comments').value;

        var data = new FormData();
        data.append('projectid', pid);
        data.append('newStatus', projStatus);
        data.append('newSubStatus', projSubStatus);
        data.append('admin', admin_Data.admin.id);
        data.append('comments', comments);

        var response = null;
        try {
            response = await fetch(`${API_URL}/api/collections/${FILE_COLLECTION}/records`,
                {
                    method: 'POST',
                    headers:
                    {
                        'Authorization': `Bearer ${authData.token}`
                    },
                    body: data
                });

            if (response.ok) {
                var data = await response.json();
                showFlash("Status Updated Successfully.", "success");
            }
            else {
                var err = await response.json();
                var errString = JSON.stringify(err.data);
                var myArray = errString.replaceAll('{', '').replaceAll('}', '').replaceAll('"', '').split(":");

                for (let i = 0; i < myArray.length; i++) {
                    if (myArray[i] === "code") {
                        let spliced = myArray.splice(i, 1);
                    }
                    if (myArray[i].includes("validation_")) {
                        let spliced = myArray.splice(i, 1);
                    }
                    if (myArray[i] === "message") {
                        let spliced = myArray.splice(i, 1);
                    }
                }
                showFlash("Failed: " + myArray.toString().replaceAll(".,", "  ").replaceAll(",", ": "), "error");
            }
        }
        catch (error) {
            showFlash(error.message, "error");
        } 
    });
    
    function showFlash(text, mode) {
        $("#flashDiv").removeClass();
        if (mode == "success") {
            $("#flashDiv").addClass("alert alert-success alert-dismissable");
        }
        else if (mode == "error") {
            $("#flashDiv").addClass("alert alert-danger alert-dismissable");
        }
        $("#flashDiv").show();
        $("#lblPass").text(text);
    }
});
