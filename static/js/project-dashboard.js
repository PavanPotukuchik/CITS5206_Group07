document.addEventListener('DOMContentLoaded', function() {
    const authData = localStorage.getItem('admin_auth');
    if (!authData) {
        window.location.href = "/login"; // Redirect to login if not authenticated
    }

    // Load Google Charts for Bar Chart (Project Status)
    google.charts.load('current', {'packages':['corechart', 'bar']});
    google.charts.setOnLoadCallback(fetchProjectStatusCounts); // Call this when charts library is loaded

        async function fetchProjectStatusCounts() {
            try {
                const response = await fetch('https://five206pocketbase.onrender.com/api/collections/project/records', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(authData).token}` // Using Bearer token for authorization
                    }
                });
    
                if (response.ok) {
                    const projectsData = await response.json();
                    const projects = projectsData.items;
    
                    // Create a Set to hold unique project IDs
                    const uniqueProjectIds = new Set();
    
                    // Loop through projects and add the unique project ID to the Set
                    projects.forEach(project => {
                        uniqueProjectIds.add(project.id); // Assuming 'id' is the unique identifier
                    });
    
                    // Total number of unique projects
                    const totalProjectsCount = uniqueProjectIds.size;
    
                    let inProgressCount = 0;
                    let completedCount = 0;
                    let onHoldCount = 0;
    
                    // Loop through projects and count the number of projects for each status
                    projects.forEach(project => {
                        switch (project.projectStatus) {
                            case 'in progress':
                                inProgressCount++;
                                break;
                            case 'completed':
                                completedCount++;
                                break;
                            case 'on hold':
                                onHoldCount++;
                                break;
                            default:
                                break;
                        }
                    });
    
                    // Update the table with the total projects count
                    document.getElementById('totalProjectsCount').innerText = totalProjectsCount;
                    document.getElementById('inProgressCount').innerText = inProgressCount;
                    document.getElementById('completedCount').innerText = completedCount;
                    document.getElementById('onHoldCount').innerText = onHoldCount;
    
                    // Call the function to draw the chart with the project status counts
                    drawProjectChart(inProgressCount, completedCount, onHoldCount);
                } else {
                    console.error('Failed to fetch projects.');
                }
            } catch (error) {
                console.error('An error occurred while fetching projects:', error);
            }
        }
    

    // Function to draw the Google bar chart for project statuses
    function drawProjectChart(inProgress, completed, onHold) {
        const data = google.visualization.arrayToDataTable([
            ['Project Status', 'Count'],
            ['In Progress', inProgress],
            ['Completed', completed],
            ['On Hold', onHold]
        ]);

        const options = {
            title: 'Project Status Distribution',
            legend: { position: 'none' },  // Hide the legend
            chartArea: { width: '50%' },   // Adjust chart area
            height: 400,                   // Increase height for better spacing
            bars: 'horizontal',            // Make bars horizontal
            hAxis: {
                title: 'Number of Projects',
                minValue: 0  // Ensure no negative values
            },
            vAxis: {
                title: 'Project Status'
            }
        };

        const chart = new google.visualization.BarChart(document.getElementById('chart_div-2'));
        chart.draw(data, options);
    }
});