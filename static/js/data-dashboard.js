$(document).ready(function() {
    const authData = localStorage.getItem('admin_auth');
    if (!authData) {
        window.location.href = "/login"; // Redirect to login if not authenticated
    }

    // Load Google Charts
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(fetchUserCounts); // Fetch user counts and then draw the chart

    // Function to fetch the total and new user counts
    async function fetchUserCounts() {
        try {
            // Make an API call to fetch all users from the 'users' collection
            const response = await fetch('http://127.0.0.1:8090/api/collections/users/records', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(authData).token}` // Using Bearer token for authorization
                }
            });

            if (response.ok) {
                const usersData = await response.json();
                const users = usersData.items;

                // Get today's date in 'YYYY-MM-DD' format
                const today = new Date().toISOString().split('T')[0];

                // Filter the users to find those created today
                const newUsersToday = users.filter(user => {
                    const createdDate = new Date(user.created).toISOString().split('T')[0];
                    return createdDate === today;
                });

                const newUsersCount = newUsersToday.length; // Count new users created today
                const totalUsersCount = users.length; // Total number of users

                // Display the user counts in HTML (optional)
                document.getElementById('totalUsersCount').innerText = `Total Users: ${totalUsersCount}`;
                document.getElementById('newUsersCount').innerText = `New Users Today: ${newUsersCount}`;

                // Call the function to draw the chart with the fetched data
                drawChart(newUsersCount, totalUsersCount);
            } else {
                console.error('Failed to fetch users.');
            }
        } catch (error) {
            console.error('An error occurred while fetching users:', error);
        }
    }

    // Function to draw the Google chart
    function drawChart(newUsers, totalUsers) {
        const data = google.visualization.arrayToDataTable([
            ['Label', 'Count'],
            ['New Users Today', newUsers],
            ['Existing Users', totalUsers - newUsers] // Calculate existing users by subtracting new users from total users
        ]);

        const options = {
            title: 'User Distribution: New vs Existing',
            width: 400,
            height: 300,
            pieHole: 0.4, // To make a donut chart, you can adjust this or remove it for a normal pie chart
        };

        const chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }

    // Logout functionality
    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('admin_auth'); // Remove authentication token
        window.location.href = "/login"; // Redirect to login
    });
});
