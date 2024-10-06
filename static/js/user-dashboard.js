$(document).ready(function() {
    const authData = localStorage.getItem('admin_auth');
    if (!authData) {
        window.location.href = "/login"; // Redirect to login if not authenticated
    }

    // Load Google Charts for the User Chart
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(fetchUserCounts); // Fetch user counts and then draw the chart

    // Function to fetch the total and new user counts
    async function fetchUserCounts() {
        try {
            const response = await fetch('https://five206pocketbase.onrender.com/api/collections/users/records', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(authData).token}` // Using Bearer token for authorization
                }
            });

            if (response.ok) {
                const usersData = await response.json();
                const users = usersData.items;

                const today = new Date().toISOString().split('T')[0];
                const newUsersToday = users.filter(user => {
                    const createdDate = new Date(user.created).toISOString().split('T')[0];
                    return createdDate === today;
                });

                const newUsersCount = newUsersToday.length;
                const totalUsersCount = users.length;

                // Display the user counts in HTML
                // document.getElementById('totalUsersCount').innerText = `Total Users: ${totalUsersCount}`;
                // document.getElementById('newUsersCount').innerText = `New Users Today: ${newUsersCount}`;
                                // Update table with the user counts
                                document.getElementById('totalUsersCount').innerText = totalUsersCount;
                                document.getElementById('newUsersCount').innerText = newUsersCount;
                

                // Call the function to draw the user chart
                drawUserChart(newUsersCount, totalUsersCount);
            } else {
                console.error('Failed to fetch users.');
            }
        } catch (error) {
            console.error('An error occurred while fetching users:', error);
        }
    }

    // Function to draw the User Google chart
    function drawUserChart(newUsers, totalUsers) {
        const data = google.visualization.arrayToDataTable([
            ['Label', 'Count'],
            ['New Users Today', newUsers],
            ['Existing Users', totalUsers - newUsers]
        ]);

        const options = {
            title: 'User Distribution: New vs Existing',
            width: 400,
            height: 300,
            pieHole: 0.4
        };

        const chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }

    // Logout functionality
    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('admin_auth');
        window.location.href = "/login";
    });
});

