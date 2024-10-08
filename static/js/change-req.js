$(document).ready(function() {
    const authData = localStorage.getItem('admin_auth');
    const API_URL = 'http://127.0.0.1:8090';
    const FILE_COLLECTION = 'ChangeRequest';

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');

    var clientid = null;
    var clientinfo = null;

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

                // var varDataTableSumm = null;
                // const tbl = document.getElementById('tblWorkList');
                
                // varDataTableSumm = $('#tblWorkList').DataTable({
                //     "data": projectData.items,
                //     "paging": false,
                //     "searching": true,
                //     "responsive": true,
                //     "bInfo": false,
                //     "processing": true,
                //     "ordering": true,
                //     "scrollY": '181px',
                //     "scrollX": false,
                //     "scrollCollapse": true,
                //     "language": {
                //         'loadingRecords': '&nbsp;',
                //         'processing': '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'
                //     },
                //     "columns": [
                //         { "data": "id", "width": "34%", "ordering": true, "className": "text-left hidden-xs" },
                //         { "data": "projectName", "width": "15%", "ordering": true }
                //     ],
                //     "order": [[1, 'desc']],
                //     "pageLength": 15,
                //     "lengthMenu": [[5, 10, 15, 25, 50, -1], [5, 10, 15, 25, 50, "All"]],
                //     "columnDefs": [{ "defaultContent": "", "searchable": true, "ordering": true, "className": "text-left", "targets": [0] },
                //                    { "defaultContent": "", "searchable": true, "ordering": true, "className": "text-right", "targets": [1] }]
                // });

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
            const response = await fetch(`http://127.0.0.1:8090/api/collections/project/records?filter=(id='${pid}')&expand=clientid`, {
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
                    clientid = proj.clientid,
                    clientinfo = proj.expand?.clientid?.name + '*' + proj.expand?.clientid?.email
                });
                console.log(projData);
                console.log(clientinfo);
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
        data.append('user', admin_Data.admin.id);
        data.append('Documents', file);
        
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
                var fromName = "Admin";//"clin_Data.record.name";
                var toName =  clientinfo.split('*')[0];
                var toEmail =  clientinfo.split('*')[1];
                var ccEmail = JSON.parse(authData).admin.email.toString().replaceAll('"');
                
                var params = {
                    project: pname.toUpperCase(),
                    from_name: fromName,//fromName.replaceAll('"','').toUpperCase(),
                    to_name: toName, //toEmail.split('@')[0].toUpperCase(),
                    to_Email: toEmail,
                    cc_Email: ccEmail.replaceAll('"',''),
                    sender_Name: fromName,//fromName.replaceAll('"','').toUpperCase(),
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
