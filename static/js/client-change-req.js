$(document).ready(function() {
    const authData = localStorage.getItem('client_auth');
    const API_URL = 'http://127.0.0.1:8090';
    const FILE_COLLECTION = 'ChangeRequest';

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');

    var admininfo = null;

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

                if(projectId)
                {
                    console.log(projectId);
                    $('#ddlproject').val(projectId);
                }

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
        localStorage.removeItem('client_auth');
        window.location.href = "/login";
    }); 

    document.getElementById('ddlproject').addEventListener('change', async(e) => {
        e.preventDefault();
        
        var pid = document.getElementById('ddlproject').value;
        var pname = $("#ddlproject option:selected").text();

        console.log("ProjectID: " + pid + ", ProjectName: " + pname);
         try{
            const response = await fetch(`http://127.0.0.1:8090/api/collections/project/records?filter=(id='${pid}')`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(authData).token}`
                }
            });

            if (response.ok) 
            {
                const projData = await response.json();
                projData.items.forEach(proj => {
                    admininfo = "Admin*" + proj.adminEmail;
                });

                console.log(admininfo);
            }
            else
            {
                alert("Failed to fetch project.");
            }
         }
         catch (error) {
            alert('An error occurred: ' + error.message);
        }
    });
    
    document.getElementById('addChangeRequest').addEventListener('submit', async (e) => {
        
        e.preventDefault();

        var pid = document.getElementById('ddlproject').value;
        var tktnumber = document.getElementById('ticket-number').value;
        var pname = $("#ddlproject option:selected").text();
        var pfeatures = document.getElementById('feature-to-change').value;
        var pdescription = document.getElementById('description').value;
        var preason = document.getElementById('reason').value;
        var pfiledescription = document.getElementById('file-description').value; 
        var admin_Data = JSON.parse(localStorage.getItem('admin_auth'));
        var clin_Data = JSON.parse(localStorage.getItem('client_auth'));      
        var fileInput = document.getElementById('file-upload');
        var file = fileInput.files[0];
                   
        var data = new FormData();
        data.append('pid', pid);
        data.append('Ticket_Number', tktnumber);
        data.append('Features_to_be_changed', pfeatures);
        data.append('Change_to', pdescription);
        data.append('Reason', preason);
        data.append('user', clin_Data.record.id); 
        data.append('Documents', file);
        
        try
        {
            //const record = await pb.collection('ChangeRequest').create(data);
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
                var fromName = clin_Data.record.name;
                var toName =  admininfo.split('*')[0];
                var toEmail = admininfo.split('*')[1];//admin_Data.admin.email.toString().replaceAll('"');
                var ccEmail = clin_Data.record.email;
                
                var params = {
                    project: pname.toUpperCase(),
                    from_name: fromName,
                    to_name: toName,
                    to_Email: toEmail,
                    cc_Email: ccEmail.replaceAll('"',''),
                    sender_Name: fromName.replaceAll('"','').toUpperCase(),
                    tcktno: tktnumber,
                    features: pfeatures,
                    desc: pdescription,
                    reason: preason
                };
        
                var serviceID = "service_53kyzbr";
                var templateID = "template_s60o8kk";
        
                emailjs.send(serviceID, templateID, params)
                .then(
                    res => {
                        console.log(JSON.stringify(res.status));
                    })
                .catch((err) => console.log(err));
                
                showFlash("Change Request successfully captured.","success");
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
