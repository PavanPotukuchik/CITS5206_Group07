
    const API_URL = 'https://five206pocketbase.onrender.com';

    async function loadUserDetails() {
        const cachedUsername = localStorage.getItem('username');
        const cachedAvatar = localStorage.getItem('avatar');

        if (cachedUsername && cachedAvatar) {
            document.getElementById('username').innerText = cachedUsername;
            document.getElementById('user-avatar').src = cachedAvatar;
        } else {
            const authData = JSON.parse(localStorage.getItem('client_auth'));
            if (authData && authData.record && authData.token) {
                try {
                    const response = await fetch(`${API_URL}/api/collections/users/records/${authData.record.id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${authData.token}`
                        }
                    });
                    if (response.ok) {
                        const user = await response.json();
                        document.getElementById('username').innerText = user.username;
                        const avatarUrl = user.avatar 
                            ? `${API_URL}/api/files/users/${user.id}/${user.avatar}` 
                            : "/static/img/user.jpg"; 

                        document.getElementById('user-avatar').src = avatarUrl;
                        localStorage.setItem('username', user.username);
                        localStorage.setItem('avatar', avatarUrl);

                    } else {
                        console.error('Failed to load user details');
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            } else {
                console.error('User is not authenticated');
            }
        }
    }
    window.onload = loadUserDetails;
