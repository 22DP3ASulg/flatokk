document.addEventListener('DOMContentLoaded', () => {
    console.log('Scripts.js loaded');

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) themeToggle.textContent = 'Light Theme';
    } else {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) themeToggle.textContent = 'Dark Theme';
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.textContent = 'Light Theme';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.textContent = 'Dark Theme';
            }
        });
    }

    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        homeLink.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Home link clicked - checking session');
            fetch('http://localhost/flatok/api/check-session.php', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => {
                console.log('Check-session response status:', response.status);
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                console.log('Session data for home link:', data);
                if (data.success === true) {
                    window.location.href = 'Main2.html';
                } else {
                    window.location.href = 'mainp.html';
                }
            })
            .catch(error => {
                console.error('Error checking session for home link:', error);
                window.location.href = 'mainp.html';
            });
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('Register form found');
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const submitBtn = document.getElementById('submitBtn');

        const usernameError = document.getElementById('usernameError');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');

        function validateForm() {
            let valid = true;

            if (username.value.trim() === '') {
                usernameError.style.display = 'block';
                valid = false;
            } else {
                usernameError.style.display = 'none';
            }

            if (!email.value.includes('@') || !email.value.includes('.')) {
                emailError.style.display = 'block';
                valid = false;
            } else {
                emailError.style.display = 'none';
            }

            if (password.value.length < 6) {
                passwordError.style.display = 'block';
                valid = false;
            } else {
                passwordError.style.display = 'none';
            }

            if (confirmPassword.value !== password.value || confirmPassword.value === '') {
                confirmPasswordError.style.display = 'block';
                valid = false;
            } else {
                confirmPasswordError.style.display = 'none';
            }

            submitBtn.disabled = !valid;
        }

        username.addEventListener('input', validateForm);
        email.addEventListener('input', validateForm);
        password.addEventListener('input', validateForm);
        confirmPassword.addEventListener('input', validateForm);

        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log('Register form submitted');
            const response = await fetch('http://localhost/flatok/api/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username.value,
                    email: email.value,
                    password: password.value
                })
            });
            const result = await response.json();
            console.log('Register response:', result);
            if (result.success) {
                window.location.href = 'login.html';
            } else {
                alert(result.error || 'Registration failed');
            }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found');
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log('Login form submitted');
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            console.log('Login data:', { email, password });
            const response = await fetch('http://localhost/flatok/api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            console.log('Login response:', result);
            if (result.success) {
                alert('Login successful!');
                if (result.role_id === 3) {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'Main2.html';
                }
            } else {
                alert(result.error || 'Login failed');
            }
        });
    }

    const mainpContainer = document.querySelector('#mainp.main-container');
    const main2Container = document.querySelector('#main2.main-container');
    const adminContainer = document.querySelector('#admin.main-container');

    if (mainpContainer) {
        console.log('Mainp page detected - starting session check');
        fetch('http://localhost/flatok/api/check-session.php', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            console.log('Check-session response status:', response.status);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Session data on mainp:', data);
            const welcomeMessage = document.getElementById('welcome-message');
            const authButtons = document.getElementById('auth-buttons');
            const logoutSection = document.getElementById('logout-section');
            const listingsContainer = document.getElementById('listings');
            const toMain2Btn = document.getElementById('to-main2-btn');
            const toAdminBtn = document.getElementById('to-admin-btn');
            const createListingBtn = document.getElementById('create-listing-btn');
            if (data.success === true) {
                console.log('User logged in - redirecting based on role');
                if (data.role === 3) {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'Main2.html';
                }
            } else {
                console.log('User not logged in - showing guest UI');
                welcomeMessage.textContent = '';
                authButtons.innerHTML = `
                    <button class="button register-btn" onclick="window.location.href='registration.html'">Register</button>
                    <button class="button login-btn" onclick="window.location.href='login.html'">Log in</button>
                `;
                logoutSection.innerHTML = '';
                if (createListingBtn) createListingBtn.style.display = 'none';
            }
            if (toMain2Btn) toMain2Btn.style.display = 'none';
            if (toAdminBtn) toAdminBtn.style.display = 'none';
            fetch('http://localhost/flatok/api/listings.php')
                .then(response => {
                    console.log('Listings response status:', response.status);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.json();
                })
                .then(listings => {
                    console.log('Listings data received:', listings);
                    if (listingsContainer) {
                        listingsContainer.innerHTML = '';
                        if (Array.isArray(listings) && listings.length > 0) {
                            listings.forEach(listing => {
                                const listingDiv = document.createElement('div');
                                listingDiv.className = 'listing-card';
                                listingDiv.innerHTML = `
                                    <h3>${listing.Title || 'No Title'}</h3>
                                    <p>Description: ${listing.Description || 'N/A'}</p>
                                    <p>City: ${listing.City || 'N/A'}</p>
                                    <p>Price: ${listing.Price || 'N/A'} EUR</p>
                                    <p>Type: ${listing.Deal_Type || 'N/A'}</p>
                                    <p>Rooms: ${listing.Rooms || 'N/A'}</p>
                                    <p>Floor: ${listing.Floor || 'N/A'}</p>
                                    <p>Address: ${listing.Address || 'N/A'}</p>
                                `;
                                listingsContainer.appendChild(listingDiv);
                            });
                        } else {
                            listingsContainer.innerHTML = '<p>No listings available.</p>';
                        }
                    } else {
                        console.log('Listings container not found');
                    }
                })
                .catch(error => {
                    console.error('Detailed error loading listings:', error);
                    const listingsContainer = document.getElementById('listings');
                    if (listingsContainer) {
                        listingsContainer.innerHTML = `<p>Error loading listings: ${error.message}. Please try again later.</p>`;
                    }
                });
        })
        .catch(error => {
            console.error('Error fetching session on mainp:', error);
            const welcomeMessage = document.getElementById('welcome-message');
            const authButtons = document.getElementById('auth-buttons');
            const logoutSection = document.getElementById('logout-section');
            welcomeMessage.textContent = '';
            authButtons.innerHTML = `
                <button class="button register-btn" onclick="window.location.href='registration.html'">Register</button>
                <button class="button login-btn" onclick="window.location.href='login.html'">Log in</button>
            `;
            logoutSection.innerHTML = '';
            const toMain2Btn = document.getElementById('to-main2-btn');
            const toAdminBtn = document.getElementById('to-admin-btn');
            const createListingBtn = document.getElementById('create-listing-btn');
            if (toMain2Btn) toMain2Btn.style.display = 'none';
            if (toAdminBtn) toAdminBtn.style.display = 'none';
            if (createListingBtn) createListingBtn.style.display = 'none';
        });
    } else if (main2Container) {
        console.log('Main2 page detected - starting session check');
        fetch('http://localhost/flatok/api/check-session.php', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            console.log('Check-session response status:', response.status);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Session data on main2:', data);
            const welcomeMessage = document.getElementById('welcome-message');
            const authButtons = document.getElementById('auth-buttons');
            const logoutSection = document.getElementById('logout-section');
            const listingsContainer = document.getElementById('listings');
            const toAdminBtn = document.getElementById('to-admin-btn');
            const createListingBtn = document.getElementById('create-listing-btn');
            if (data.success === true) {
                console.log('User logged in - updating UI for Main2');
                welcomeMessage.textContent = `Hello, ${data.username || 'User'}`;
                authButtons.innerHTML = '';
                let logoutSectionContent = `
                    <button class="button" onclick="logout()">Logout</button>
                `;
                if (data.role === 3) {
                    console.log('User is admin - adding Admin Panel button on Main2');
                    logoutSectionContent += `
                        <button class="button admin-btn" onclick="window.location.href='admin.html'">Admin Panel</button>
                    `;
                }
                logoutSection.innerHTML = logoutSectionContent;
                if (createListingBtn) createListingBtn.style.display = 'inline-block';
            } else {
                console.log('User not logged in - redirecting to mainp');
                window.location.href = 'mainp.html';
            }
            fetch('http://localhost/flatok/api/listings.php')
                .then(response => {
                    console.log('Listings response status:', response.status);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.json();
                })
                .then(listings => {
                    console.log('Listings data received:', listings);
                    if (listingsContainer) {
                        listingsContainer.innerHTML = '';
                        if (Array.isArray(listings) && listings.length > 0) {
                            listings.forEach(listing => {
                                const listingDiv = document.createElement('div');
                                listingDiv.className = 'listing-card';
                                const currentUserId = Number(data.user_id);
                                const listingUserId = Number(listing.user_id);
                                const userRole = Number(data.role);
                                const isOwnerOrAdmin = data.success && (currentUserId === listingUserId || userRole === 3);
                                console.log(`Listing ${listing.Ad_ID}: Current user_id=${currentUserId} (type=${typeof currentUserId}), Listing user_id=${listingUserId} (type=${typeof listingUserId}), Role=${userRole}, isOwnerOrAdmin=${isOwnerOrAdmin}`);
                                let deleteButton = '';
                                let editButton = '';
                                if (isOwnerOrAdmin) {
                                    deleteButton = `<button class="button delete-btn" onclick="deleteListing(${listing.Ad_ID})">Delete</button>`;
                                    editButton = `<button class="button edit-btn" onclick="editListing(${listing.Ad_ID})">Edit</button>`;
                                } else {
                                    console.log(`Not showing delete/edit button for listing ${listing.Ad_ID} - user is not owner or admin`);
                                }
                                let commentsButton = data.success ? `<button class="button comments-btn" onclick="showComments(${listing.Ad_ID})">Comments</button>` : '';
                                listingDiv.innerHTML = `
                                    <h3>${listing.Title || 'No Title'}</h3>
                                    <p>Description: ${listing.Description || 'N/A'}</p>
                                    <p>City: ${listing.City || 'N/A'}</p>
                                    <p>Price: ${listing.Price || 'N/A'} EUR</p>
                                    <p>Type: ${listing.Deal_Type || 'N/A'}</p>
                                    <p>Rooms: ${listing.Rooms || 'N/A'}</p>
                                    <p>Floor: ${listing.Floor || 'N/A'}</p>
                                    <p>Address: ${listing.Address || 'N/A'}</p>
                                    <p>Posted by: ${listing.username || 'Unknown'} (${listing.email || 'No email'})</p>
                                    ${deleteButton}
                                    ${editButton}
                                    ${commentsButton}
                                `;
                                listingsContainer.appendChild(listingDiv);
                            });
                        } else {
                            listingsContainer.innerHTML = '<p>No listings available.</p>';
                        }
                    } else {
                        console.log('Listings container not found');
                    }
                })
                .catch(error => {
                    console.error('Detailed error loading listings:', error);
                    const listingsContainer = document.getElementById('listings');
                    if (listingsContainer) {
                        listingsContainer.innerHTML = `<p>Error loading listings: ${error.message}. Please try again later.</p>`;
                    }
                });
        })
        .catch(error => {
            console.error('Error fetching session on main2:', error);
            window.location.href = 'mainp.html';
        });

    window.editListing = function(adId) {
        console.log('Editing listing with ID:', adId);
        const modal = document.getElementById('edit-listing-modal');
        if (modal) {
            modal.style.display = 'block';
            document.getElementById('edit-listing-form').reset();
            document.getElementById('edit-listing-id').value = adId;

            fetch(`http://localhost/flatok/api/get-listing.php?id=${adId}`)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    console.log('Listing data for edit:', data);
                    if (data.success) {
                        const listing = data.listing;
                        document.getElementById('edit-listing-title').value = listing.Title || '';
                        document.getElementById('edit-listing-description').value = listing.Description || '';
                        document.getElementById('edit-listing-city').value = listing.City || '';
                        document.getElementById('edit-listing-price').value = listing.Price || '';
                        document.getElementById('edit-listing-deal-type').value = listing.Deal_Type || 'Sale';
                        document.getElementById('edit-listing-rooms').value = listing.Rooms || '';
                        document.getElementById('edit-listing-floor').value = listing.Floor || '';
                        document.getElementById('edit-listing-address').value = listing.Address || '';
                    } else {
                        alert('Listing not found: ' + data.error);
                    }
                })
                .catch(error => console.error('Error loading listing for edit:', error));

            const closeEditModal = document.getElementById('close-edit-modal');
            if (closeEditModal) {
                closeEditModal.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }

            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });

            const submitEditListingBtn = document.getElementById('submit-edit-listing');
            if (submitEditListingBtn) {
                submitEditListingBtn.addEventListener('click', async () => {
                    const listingData = {
                        id: document.getElementById('edit-listing-id').value,
                        Title: document.getElementById('edit-listing-title').value,
                        Description: document.getElementById('edit-listing-description').value || null,
                        City: document.getElementById('edit-listing-city').value,
                        Price: parseFloat(document.getElementById('edit-listing-price').value),
                        Deal_Type: document.getElementById('edit-listing-deal-type').value,
                        Rooms: parseInt(document.getElementById('edit-listing-rooms').value),
                        Floor: document.getElementById('edit-listing-floor').value || null,
                        Address: document.getElementById('edit-listing-address').value || null
                    };

                    if (!listingData.Title || !listingData.City || !listingData.Price || !listingData.Deal_Type || !listingData.Rooms) {
                        alert('Please fill in all required fields (Title, City, Price, Deal Type, Rooms)');
                        return;
                    }

                    console.log('Submitting edited listing data:', JSON.stringify(listingData));

                    try {
                        const response = await fetch('http://localhost/flatok/api/update-listing.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(listingData)
                        });
                        const result = await response.json();
                        console.log('Update listing response:', result);
                        if (result.success) {
                            modal.style.display = 'none';
                            window.location.reload();
                        } else {
                            alert(result.error || 'Failed to update listing');
                        }
                    } catch (error) {
                        console.error('Error updating listing:', error);
                        alert('Error updating listing: ' + error.message);
                    }
                });
            }
        }
    };
    } else if (adminContainer) {
        console.log('Admin page detected - starting session check');
        fetch('http://localhost/flatok/api/check-session.php', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            console.log('Check-session response status:', response.status);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Session data on admin:', data);
            const welcomeMessage = document.getElementById('welcome-message');
            const authButtons = document.getElementById('auth-buttons');
            const logoutSection = document.getElementById('logout-section');
            const toMain2Btn = document.getElementById('to-main2-btn');
            const createListingBtn = document.getElementById('create-listing-btn');
            if (data.success === true && data.role === 3) {
                console.log('User is admin - loading admin panel');
                if (welcomeMessage) welcomeMessage.textContent = `Hello, ${data.username || 'Admin'}`;
                if (authButtons) authButtons.innerHTML = '';
                if (logoutSection) {
                    logoutSection.innerHTML = `
                        <button class="button" onclick="logout()">Logout</button>
                    `;
                }
                if (toMain2Btn) toMain2Btn.style.display = 'inline-block';
                if (createListingBtn) createListingBtn.style.display = 'inline-block';

                const usersContainer = document.getElementById('users');
                let allUsers = [];

                const displayUsers = (users) => {
                    usersContainer.innerHTML = '';
                    if (users && Array.isArray(users) && users.length > 0) {
                        users.forEach(user => {
                            const currentUserId = Number(data.user_id);
                            const isCurrentUser = currentUserId === Number(user.id);
                            const deleteButton = isCurrentUser ? '' : `<button class="button delete-btn" onclick="deleteUser(${user.id})">Delete</button>`;
                            const userDiv = document.createElement('div');
                            userDiv.className = 'user-card';
                            userDiv.innerHTML = `
                                <p>ID: ${user.id}</p>
                                <p>Username: ${user.username}</p>
                                <p>Email: ${user.email}</p>
                                <p>Role: ${user.role == 3 ? 'Admin' : 'User'}</p>
                                <p>Registered: ${new Date(user.Registration_date).toLocaleDateString()}</p>
                                ${deleteButton}
                            `;
                            usersContainer.appendChild(userDiv);
                        });
                    } else {
                        usersContainer.innerHTML = '<p>No users found.</p>';
                    }
                };

                const normalizeDate = (dateString) => {
                    if (!dateString) return new Date(0);
                    const date = new Date(dateString);
                    if (!isNaN(date.getTime())) return date;
                    const match = dateString.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2}:\d{2})/);
                    if (match) {
                        return new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}Z`);
                    }
                    console.warn(`Invalid date format: ${dateString}, using default date`);
                    return new Date(0);
                };

                fetch('http://localhost/flatok/api/users.php')
                    .then(response => response.json())
                    .then(users => {
                        console.log('Users data:', users);
                        if (!Array.isArray(users)) {
                            console.error('Users data is not an array:', users);
                            usersContainer.innerHTML = '<p>Error: Invalid users data.</p>';
                            return;
                        }
                        allUsers = users.map(user => ({
                            ...user,
                            role: Number(user.role)
                        }));
                        console.log('Processed allUsers:', allUsers);
                        displayUsers(allUsers);
                    })
                    .catch(error => {
                        console.log('Error loading users:', error);
                        usersContainer.innerHTML = '<p>Error loading users.</p>';
                    });

                const applyFiltersBtn = document.getElementById('apply-filters');
                if (applyFiltersBtn) {
                    applyFiltersBtn.addEventListener('click', () => {
                        const nameSort = document.getElementById('name-sort').value;
                        const dateSort = document.getElementById('date-sort').value;

                        console.log('Applying filters:', { nameSort, dateSort });

                        let filteredUsers = [...allUsers];

                        if (nameSort && nameSort !== 'none') {
                            filteredUsers.sort((a, b) => {
                                const nameA = a.username ? a.username.toLowerCase() : '';
                                const nameB = b.username ? b.username.toLowerCase() : '';
                                if (nameSort === 'asc') {
                                    return nameA < nameB ? -1 : 1;
                                } else {
                                    return nameA > nameB ? -1 : 1;
                                }
                            });
                        }

                        if (dateSort && dateSort !== 'none') {
                            filteredUsers.sort((a, b) => {
                                const dateA = normalizeDate(a.Registration_date);
                                const dateB = normalizeDate(b.Registration_date);
                                console.log(`Sorting: dateA=${dateA.toISOString()}, dateB=${dateB.toISOString()}, dateSort=${dateSort}`);
                                if (dateSort === 'asc') {
                                    return dateA - dateB;
                                } else {
                                    return dateB - dateA;
                                }
                            });
                        }

                        console.log('Filtered users:', filteredUsers);
                        displayUsers(filteredUsers);
                    });
                }

                const resetFiltersBtn = document.getElementById('reset-filters');
                if (resetFiltersBtn) {
                    resetFiltersBtn.addEventListener('click', () => {
                        console.log('Resetting filters');
                        document.getElementById('name-sort').value = 'none';
                        document.getElementById('date-sort').value = 'none';
                        displayUsers(allUsers);
                    });
                }

                // Добавление поиска пользователей
                const userSearchInput = document.getElementById('user-search');
                if (userSearchInput) {
                    userSearchInput.addEventListener('input', () => {
                        const searchTerm = userSearchInput.value.trim().toLowerCase();
                        fetch(`http://localhost/flatok/api/users.php?search=${encodeURIComponent(searchTerm)}`)
                            .then(response => {
                                if (!response.ok) throw new Error('Network response was not ok');
                                return response.json();
                            })
                            .then(users => {
                                console.log('Search results:', users);
                                if (!Array.isArray(users)) {
                                    console.error('Search data is not an array:', users);
                                    usersContainer.innerHTML = '<p>Error: Invalid search data.</p>';
                                    return;
                                }
                                allUsers = users.map(user => ({
                                    ...user,
                                    role: Number(user.role)
                                }));
                                displayUsers(allUsers);
                            })
                            .catch(error => {
                                console.error('Error searching users:', error);
                                usersContainer.innerHTML = '<p>Error searching users.</p>';
                            });
                    });
                }
            } else {
                console.log('User is not admin - redirecting to mainp');
                window.location.href = 'mainp.html';
            }
        })
        .catch(error => {
            console.error('Error fetching session on admin:', error);
            window.location.href = 'mainp.html';
        });
    } else {
        console.log('Neither Mainp, Main2, nor Admin element found');
    }

    const createListingBtn = document.getElementById('create-listing-btn');
    const modal = document.getElementById('create-listing-modal');
    const closeModal = document.getElementById('close-modal');
    const submitListingBtn = document.getElementById('submit-listing');

    if (createListingBtn && modal) {
        createListingBtn.addEventListener('click', () => {
            console.log('Create Listing button clicked');
            modal.style.display = 'block';
        });

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        if (submitListingBtn) {
            submitListingBtn.addEventListener('click', async () => {
                const title = document.getElementById('listing-title').value;
                const description = document.getElementById('listing-description').value || null;
                const city = document.getElementById('listing-city').value;
                const price = document.getElementById('listing-price').value;
                const dealType = document.getElementById('listing-deal-type').value;
                const rooms = document.getElementById('listing-rooms').value;
                const floor = document.getElementById('listing-floor').value || null;
                const address = document.getElementById('listing-address').value || null;

                if (!title || !city || !price || !dealType || !rooms) {
                    alert('Please fill in all required fields (Title, City, Price, Deal Type, Rooms)');
                    return;
                }

                const listingData = {
                    Title: title,
                    Description: description,
                    City: city,
                    Price: parseFloat(price),
                    Deal_Type: dealType,
                    Rooms: parseInt(rooms),
                    Floor: floor ? parseInt(floor) : null,
                    Address: address
                };

                console.log('Submitting listing:', listingData);

                try {
                    const response = await fetch('http://localhost/flatok/api/create-listing.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(listingData)
                    });
                    const result = await response.json();
                    console.log('Create listing response:', result);
                    if (result.success) {
                        modal.style.display = 'none';
                        window.location.reload();
                    } else {
                        alert(result.error || 'Failed to create listing');
                    }
                } catch (error) {
                    console.error('Error creating listing:', error);
                    alert('Error creating listing');
                }
            });
        }
    }

    window.deleteListing = function(listingId) {
        console.log('Deleting listing with ID:', listingId);
        console.log('Type of listingId:', typeof listingId);
        if (listingId === undefined || listingId === null) {
            console.error('listingId is undefined or null');
            alert('Error: Listing ID is missing');
            return;
        }
        if (confirm('Are you sure you want to delete this listing?')) {
            const requestBody = { listingId: Number(listingId) };
            console.log('Request body being sent:', requestBody);
            fetch('http://localhost/flatok/api/delete-listing.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            })
            .then(response => {
                console.log('Delete listing response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Delete listing response:', data);
                if (data.success) {
                    window.location.reload();
                } else {
                    alert(data.error || 'Failed to delete listing');
                }
            })
            .catch(error => {
                console.error('Error deleting listing:', error);
                alert('Error deleting listing: ' + error.message);
            });
        }
    };

    window.logout = function() {
        console.log('Logout button clicked');
        fetch('http://localhost/flatok/api/logout.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Logout response:', data);
            if (data.success) {
                window.location.href = 'login.html';
            }
        })
        .catch(error => console.log('Error during logout:', error));
    };

    window.deleteUser = function(userId) {
        console.log('Deleting user with ID:', userId);
        if (confirm('Are you sure you want to delete this user?')) {
            fetch('http://localhost/flatok/api/delete-user.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId })
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok: ' + response.status);
                return response.json();
            })
            .then(data => {
                console.log('Delete user response:', data);
                if (data.success) {
                    window.location.reload();
                } else {
                    alert(data.error || 'Failed to delete user');
                }
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                alert('Error deleting user: ' + error.message);
            });
        }
    };

    window.showComments = function(adId) {
        console.log('Showing comments for Ad_ID:', adId);
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="this.parentElement.parentElement.remove()">×</span>
                <h3>Comments for Ad #${adId}</h3>
                <div id="comments-list-${adId}" class="comments-list"></div>
                <textarea id="comment-text-${adId}" placeholder="Write a comment..." rows="4" cols="50"></textarea>
                <button class="add-comment-btn" onclick="addComment(${adId})">Add Comment</button>
            </div>
        `;
        document.body.appendChild(modal);

        fetch(`http://localhost/flatok/api/comments.php?adId=${adId}`)
            .then(response => response.json())
            .then(comments => {
                console.log('Comments data:', comments);
                const commentsList = document.getElementById(`comments-list-${adId}`);
                if (commentsList) {
                    if (Array.isArray(comments) && comments.length > 0) {
                        commentsList.innerHTML = comments.map(comment => `
                            <div class="comment">
                                <p><strong>${comment.username || 'Unknown'}</strong> (${comment.email || 'No email'})</p>
                                <p>${comment.Comment_Text}</p>
                                <p><small>${new Date(comment.Created_At).toLocaleString()}</small></p>
                            </div>
                        `).join('');
                    } else {
                        commentsList.innerHTML = '<p>No comments yet.</p>';
                    }
                }
            })
            .catch(error => console.error('Error loading comments:', error));
    };

    window.addComment = function(adId) {
        const commentText = document.getElementById(`comment-text-${adId}`).value.trim();
        if (!commentText) {
            alert('Comment text is required');
            return;
        }

        fetch('http://localhost/flatok/api/create-comment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adId, commentText })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Add comment response:', data);
            if (data.success) {
                alert('Comment added successfully!');
                document.getElementById(`comment-text-${adId}`).value = '';
                showComments(adId);
            } else {
                alert(data.error || 'Failed to add comment');
            }
        })
        .catch(error => console.error('Error adding comment:', error));
    };
});