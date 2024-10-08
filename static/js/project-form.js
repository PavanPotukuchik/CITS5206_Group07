$(document).ready(function() {
    const authData = localStorage.getItem('admin_auth');
    const API_URL = 'http://127.0.0.1:8090';
    const FILE_COLLECTION = 'project';

    if (!authData) {
        window.location.href = "/login";
    }
    
    async function fetchClient() {
        try {
                const response = await fetch('http://127.0.0.1:8090/api/collections/users/records?expand=clientName', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(authData).token}`
                }
            });

            if (response.ok) {
                const clientData = await response.json();

                var ddlclient = $("[id*=ddlclient]");
                ddlclient.empty();
                ddlclient.append($("<option></option>").val("").html(""));

                clientData.items.forEach(client => {
                    ddlclient.append($("<option></option>").val(client.id).html(client.name + " (" + client.email + ")"));
                });

            } else {
                console.error('Failed to fetch client.');
            }
        } catch (error) {
            console.error('An error occurred while fetching client:', error);
        }
    }

    fetchClient();

    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('client_auth');
        window.location.href = '/login';
    });

    document.getElementById('addProjectForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        var projName = document.getElementById('name').value;
        var projStatus = document.getElementById('ddlstatus').value;
        var projSubStatus = document.getElementById('ddlsubstatus').value;
        var projDesc = document.getElementById('description').value;
        var projFeatures = document.getElementById('features').value;        
        var clientId = document.getElementById('ddlclient').value;        
        var admin_Data = JSON.parse(localStorage.getItem('admin_auth'));
        var clin_Data = JSON.parse(localStorage.getItem('client_auth'));   
        var projLogo = document.getElementById('Logo-file');
        var logo = projLogo.files[0];
        var projResources = document.getElementById('resources');
        var resources = projResources.files[0];
                   
        var data = new FormData();
        data.append('projectName', projName);
        data.append('projectStatus', projStatus);
        data.append('projectSubStatus', projSubStatus);
        data.append('description', projDesc);
        data.append('features', projFeatures);
        data.append('clientid', clientId);
        data.append('user', admin_Data.admin.id);
        data.append('logo', logo);
        data.append('resources', resources);
        data.append('adminEmail', admin_Data.admin.email)
   
        try
        {
            var response = await fetch(`${API_URL}/api/collections/${FILE_COLLECTION}/records`, 
            {
                method: 'POST',
                headers: 
                {
                    'Authorization': `Bearer ${authData.token}`
                },
                body: data
            }); 

            if (response.ok) 
            {
                var data = await response.json();
                showFlash("Project Created Successfully.","success");
            } 
            else 
            {
                var err = await response.json();
                var errString = JSON.stringify(err.data);
                var myArray = errString.replaceAll('{','').replaceAll('}','').replaceAll('"','').split(":");
                
                for (let i = 0; i < myArray.length; i++) {
                    if (myArray[i] === "code") 
                    {
                        let spliced = myArray.splice(i, 1);
                    }                    
                    if (myArray[i].includes("validation_")) 
                    {
                        let spliced = myArray.splice(i, 1);
                    }
                    if (myArray[i] === "message") 
                    {
                        let spliced = myArray.splice(i, 1);
                    }
                }
                showFlash("Failed: " + myArray.toString().replaceAll(".,","  ").replaceAll(",",": "), "error");
            }
        }
        catch(error)
        { 
            showFlash(error.message,"error");
        }           
    });
    
    function showFlash(text, mode) {
        $("#flashDiv").removeClass(); 
        if(mode == "success")
        {
            $("#flashDiv").addClass("alert alert-success alert-dismissable");
        }
        else if(mode == "error")
        {
            $("#flashDiv").addClass("alert alert-danger alert-dismissable");
        }
        $("#flashDiv").show();
        $("#lblPass").text(text); 
    } 
});
