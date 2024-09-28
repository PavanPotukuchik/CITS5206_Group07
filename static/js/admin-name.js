// Function to extract the username from the email
function extractUsernameFromEmail(email) {
    return email.split('@')[0];  // Split the email by "@" and return the first part (username)
}

// Function to display the admin username
function displayAdminUsername() {
    // Retrieve the admin authentication data from localStorage using the 'admin_auth' key
    const authData = localStorage.getItem('admin_auth');
    
    // Check if authData exists in localStorage
    if (authData) {
        try {
            const parsedData = JSON.parse(authData);  // Parse the JSON string

            // Log the parsed data to check its structure
            console.log('Parsed admin data:', parsedData);

            // Extract the email from the "admin" object inside the parsed data
            const adminEmail = parsedData.admin.email;  
            console.log('Admin email:', adminEmail);  // Log the email for debugging

            // Extract the username from the email
            const username = extractUsernameFromEmail(adminEmail);
            console.log('Extracted username:', username);  // Log the username for debugging
            
            // Display the username in the HTML
            
            document.getElementById('adminUsername-1').textContent = username;
            document.getElementById('adminUsername-2').textContent = username;

        } catch (error) {
            console.error('Error parsing admin data:', error);
        }
    } else {
        console.error('No admin authentication data found.');
    }
}

// Call the function to display the admin username after the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    displayAdminUsername();
});