const messageElement = document.getElementById('message');

document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        messageElement.textContent = 'New passwords do not match.';
        return;
    }

    const authData = JSON.parse(localStorage.getItem('pocketbase_auth'));
    if (!authData) {
        messageElement.textContent = 'You are not logged in.';
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8090/api/collections/users/records/${authData.record.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authData.token}`
            },
            body: JSON.stringify({
                oldPassword: currentPassword,
                password: newPassword,
                passwordConfirm: confirmPassword
            })
        });

        if (response.ok) {
            messageElement.textContent = 'Password changed successfully.';
            document.getElementById('changePasswordForm').reset();
        } else {
            const errorData = await response.json();
            messageElement.textContent = 'Failed to change password: ' + (errorData.message || response.statusText);
        }
    } catch (error) {
        messageElement.textContent = 'An error occurred: ' + error.message;
    }
});

document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Check if user is logged in on page load
window.addEventListener('load', () => {
    const authData = JSON.parse(localStorage.getItem('pocketbase_auth'));
    if (!authData) {
        messageElement.textContent = 'You must be logged in to change your password.';
        document.getElementById('changePasswordForm').style.display = 'none';
        return; // Prevent further execution if not logged in
    }
});
