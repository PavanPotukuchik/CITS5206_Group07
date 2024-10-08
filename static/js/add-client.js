$(document).ready(function() {
    const API_URL = 'http://127.0.0.1:8090';
    const FILE_COLLECTION = 'users';
        
        document.getElementById('addClientForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const clientName = document.getElementById('name').value;
            const clientEmail = document.getElementById('email').value;
            const contactNumber = document.getElementById('contactNumber').value;
            const companyName = document.getElementById('companyName').value;
            const password = document.getElementById('password').value;
            const authData = JSON.parse(localStorage.getItem('admin_auth'));    
            
            var data = new FormData();
            data.append('username', companyName);
            data.append('email', clientEmail);
            data.append('emailVisibility', true);
            data.append('password', password);
            data.append('passwordConfirm', password);
            data.append('name', clientName)
            
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
                    showFlash("Client created successfully", "success");
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
                     
                    showFlash("Client not created: " + myArray.toString().replaceAll(".,","  ").replaceAll(",",": "), "error");
                }                
            }
            catch(error)
            {
                showFlash("Client not created. Please see the error" + error, "error");
            }
        });

        document.getElementById('logoutButton').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('admin_auth');
            localStorage.removeItem('client_auth');
            window.location.href = "/login";
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