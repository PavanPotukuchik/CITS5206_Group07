$(document).ready(function() {
    const authData = localStorage.getItem('admin_auth');
    if (!authData) {
        window.location.href = '/login';
    }

    let fileToDelete = null;

    function displayPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');

        if (userId) {
            loadFiles(userId);
            $('#backButton').show();
        } else {
            fetchUsers();
            $('#backButton').hide();
        }
    }

    async function fetchUsers() {
        try {
            const response = await fetch('https://five206pocketbase.onrender.com/api/collections/users/records', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(authData).token}`
                }
            });

            if (response.ok) {
                const usersData = await response.json();
                const userList = document.getElementById('userList');

                usersData.items.forEach(user => {
                    const userRow = document.createElement('tr');
                    userRow.innerHTML = `
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                    `;

                    userRow.addEventListener('click', () => {
                        window.location.href = `/documents?userId=${user.id}`;
                    });

                    userList.appendChild(userRow);
                });
            } else {
                console.error('Failed to fetch users.');
            }
        } catch (error) {
            console.error('An error occurred while fetching users:', error);
        }
    }

    async function loadFiles(userId) {
        const filesCard = document.getElementById('filesCard');
        const fileList = document.getElementById('fileList');
        const messageElement = document.getElementById('message');

        fileList.innerHTML = '';
        filesCard.style.display = 'block';
        document.getElementById('userListCard').style.display = 'none';

        try {
            const response = await fetch(`https://five206pocketbase.onrender.com/api/collections/files/records?filter=(user='${userId}')`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(authData).token}`
                }
            });

            if (response.ok) {
                const filesData = await response.json();
                if (filesData.items.length > 0) {
                    filesData.items.forEach(file => displayFile(file));
                } else {
                    messageElement.textContent = 'No files uploaded by this user.';
                }
            } else {
                const errorData = await response.json();
                messageElement.textContent = 'Failed to load files: ' + (errorData.message || response.statusText);
            }
        } catch (error) {
            messageElement.textContent = 'An error occurred: ' + error.message;
        }
    }

    function displayFile(file) {
        const fileList = document.getElementById('fileList');
        const li = document.createElement('li');
        li.className = 'file-item';
        li.innerHTML = `
            <div class="file-description">${file.description || 'No description'}</div>
            <a href="https://five206pocketbase.onrender.com/api/files/files/${file.id}/${file.file}" target="_blank" class="file-name">${file.filename}</a>
            <div class="file-actions">
                <button class="delete-button" data-file-id="${file.id}">
                    <i class="ph ph-trash"></i> Delete
                </button>
                <button class="download-button" data-file-id="${file.id}" data-file-name="${file.file}" data-original-name="${file.filename}">
                    <i class="ph ph-download-simple"></i> Download
                </button>
            </div>
        `;
        fileList.appendChild(li);
    }

    async function deleteFile(fileId) {
        try {
            const response = await fetch(`https://five206pocketbase.onrender.com/api/collections/files/records/${fileId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(authData).token}`
                }
            });

            if (response.ok) {
                document.querySelector(`button[data-file-id="${fileId}"]`).closest('li').remove();
                closeModal();
            } else {
                const errorData = await response.json();
                document.getElementById('message').textContent = 'Failed to delete file: ' + (errorData.message || response.statusText);
            }
        } catch (error) {
            document.getElementById('message').textContent = 'An error occurred: ' + error.message;
        }
    }

    function downloadFile(fileId, fileName, originalName) {
        const link = document.createElement('a');
        link.href = `https://five206pocketbase.onrender.com/files/files/${fileId}/${fileName}`;
        link.download = originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function openDeleteModal(fileId) {
        fileToDelete = fileId;
        document.getElementById('deleteModal').style.display = 'block';
    }

    document.getElementById('confirmDeleteButton').addEventListener('click', () => {
        if (fileToDelete) {
            deleteFile(fileToDelete);
        }
    });

    document.getElementById('cancelDeleteButton').addEventListener('click', closeModal);

    function closeModal() {
        document.getElementById('deleteModal').style.display = 'none';
        fileToDelete = null;
    }

    document.getElementById('backButton').addEventListener('click', () => {
        window.location.href = '/documents';
    });

    document.addEventListener('click', function(event) {
        if (event.target.closest('.download-button')) {
            const button = event.target.closest('.download-button');
            const fileId = button.getAttribute('data-file-id');
            const fileName = button.getAttribute('data-file-name');
            const originalName = button.getAttribute('data-original-name');
            downloadFile(fileId, fileName, originalName);
        }

        if (event.target.closest('.delete-button')) {
            const button = event.target.closest('.delete-button');
            const fileId = button.getAttribute('data-file-id');
            openDeleteModal(fileId);
        }
    });

    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('admin_auth');
        window.location.href = '/login';
    });

    displayPage();
});
