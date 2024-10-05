$(document).ready(function() {
    const authData = localStorage.getItem('admin_auth');
    if (!authData) {
        window.location.href = "/login";
    }

    async function fetchClients() {
        try {
            const response = await fetch('https://127.0.0.1:8090/api/collections/users/records', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(authData).token}`
                }
            });

            if (response.ok) {
                const clientsData = await response.json();
                const clientsTableBody = document.getElementById('clientsTableBody');

                clientsData.items.forEach(client => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td><img src="https://127.0.0.1:8090/api/files/${client.collectionId}/${client.id}/${client.avatar}" alt="Avatar" class="avatar-img"></td>
                        <td>${client.username}</td>
                        <td>${client.email}</td>
                        <td>${new Date(client.created).toLocaleDateString()}</td>
                        <td>${new Date(client.updated).toLocaleDateString()}</td>
                    `;

                    clientsTableBody.appendChild(row);
                });
            } else {
                console.error('Failed to fetch clients.');
            }
        } catch (error) {
            console.error('An error occurred while fetching clients:', error);
        }
    }

    fetchClients();

    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('admin_auth');
        window.location.href = "/login";
    });
});
