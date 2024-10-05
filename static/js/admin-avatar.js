document.addEventListener('DOMContentLoaded', function () {
    // Retrieve admin authentication data from localStorage
    const authData = localStorage.getItem('admin_auth');
    
    if (authData) {
        const adminData = JSON.parse(authData).admin;
        
        // Check if avatar number is between 0 and 9, default to 0 if not valid
        const avatarNumber = adminData.avatar || 0;

        // Construct the dynamic URL based on the avatar number
        const avatarUrl = `https://five206pocketbase.onrender.com//_/images/avatars/avatar${avatarNumber}.svg`;

        // Update the avatar image dynamically in the HTML
        document.getElementById('adminAvatar').src = avatarUrl;

        // Log the avatar URL for debugging
        console.log(`Avatar updated to: ${avatarUrl}`);
    } else {
        console.error("No admin authentication data found.");
    }
});