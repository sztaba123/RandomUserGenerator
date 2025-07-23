
// Example: Fetch random user data from Random User API
async function getRandomUser() {
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();
    const user = data.results[0];
    return user;
}

function displayUserPhoto(photoUrl){
    const img = document.getElementById('user-photo');
    if (img) {
        img.src = photoUrl;
        img.alt = 'User Photo';
    } else {
        console.error("Element with id 'user-photo' not found in the DOM.");
    }
}

function displayUserData(user) {
    document.getElementById('name').textContent = user.name.first;
    document.getElementById('surname').textContent =  user.name.last;
    document.getElementById('email').textContent =  user.email;
    document.getElementById('phone').textContent =  user.phone;
    document.getElementById('country').textContent =  user.location.country;
    document.getElementById('username').textContent = '@'+ user.login.username;
    document.getElementById('data-tittle').textContent = `${user.login.username.charAt(0).toUpperCase() + user.login.username.slice(1)}'s Data`;
}

function generateRandomUser() {
    getRandomUser().then(user => {
        displayUserData(user);
        displayUserPhoto(user.picture.large);
    }).catch(error => {
        console.error('Error fetching random user:', error);
    });
}

// Function that copies user data to clipboard
function copyUserData() {
    let UserData = {
        name: document.getElementById('name').textContent,
        surname: document.getElementById('surname').textContent,
        email: document.getElementById('email').textContent,
        country: document.getElementById('country').textContent,
        username: document.getElementById('username').textContent
    }
    let textToCopy = `Name: ${UserData.name}\nSurname: ${UserData.surname}\nEmail: ${UserData.email}\nCountry: ${UserData.country}\nUsername: ${UserData.username}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        showCustomAlert('User data copied to clipboard!');
    }).catch(err => {
        console.error('Error copying user data:', err);
        showCustomAlert('Error copying user data!');
    });
}

// Function that copies user photo to clipboard (to be implemented for later)
function copyUserPhoto() {}

// Custom alert functions
function showCustomAlert(message) {
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('customAlertOverlay').style.display = 'block';
}

function closeCustomAlert() {
    document.getElementById('customAlertOverlay').style.display = 'none';
}


window.onload = async () => {
    const user = await getRandomUser();
    displayUserData(user);
    displayUserPhoto(user.picture.large);
    
};


