
let currentUser = null;
let currentDataType = 'data';

async function getRandomUser() {
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();
    const user = data.results[0];
    return user;
}

function displayUserPhoto(photoUrl) {
    const img = document.getElementById('user-photo');
    if (img) {
        img.src = photoUrl;
        img.alt = 'User Photo';
    } else {
        console.error("Element with id 'user-photo' not found in the DOM.");
    }
}

function displayUsername(user) {
    document.getElementById('username').textContent = '@' + user.login.username;
    document.getElementById('data-tittle').textContent = `${user.login.username.charAt(0).toUpperCase() + user.login.username.slice(1)}'s Data`;
}

function createListItem(icon, iconColor, label, value, id = '') {
    return `
        <li class="list-group-item d-flex align-items-center">
            <div class="row w-100 align-items-center">
                <div class="col-1 text-center">
                    <i class="bi bi-${icon} ${iconColor}"></i>
                </div>
                <div class="col-4 fw-semibold">${label}:</div>
                <div class="col-7 fw-semibold" ${id ? `id="${id}"` : ''}>${value}</div>
            </div>
        </li>
    `;
}

function generateDataHTML(user, dataType) {
    let html = '';
    
    switch(dataType) {
        case 'data':
            if(user.gender === 'male') {
                html += createListItem('gender-male', 'text-info', 'Gender', user.gender.charAt(0).toUpperCase() + user.gender.slice(1), 'gender');
            } else {
                html += createListItem('gender-female', 'text-danger', 'Gender', user.gender.charAt(0).toUpperCase() + user.gender.slice(1), 'gender');
            }
            html += createListItem('person-fill', 'text-primary', 'First Name', user.name.first, 'name');
            html += createListItem('person-badge-fill', 'text-success', 'Last Name', user.name.last, 'surname');
            html += createListItem('calendar-fill', 'text-warning', 'Age', user.dob.age + ' years old', 'age');
            break;
            
        case 'localisation':
            html += createListItem('geo-alt-fill', 'text-danger', 'Country', user.location.country, 'country');
            html += createListItem('building-fill', 'text-info', 'State', user.location.state, 'state');
            html += createListItem('house-door-fill', 'text-success', 'City', user.location.city, 'city');
            break;
            
        case 'contact':
            html += createListItem('envelope-fill', 'text-success', 'Email', user.email, 'email');
            html += createListItem('telephone-fill', 'text-warning', 'Phone', user.phone, 'phone');
            break;
    }
    
    return html;
}

function displayUserData(user, dataType = 'data') {
    const dataList = document.getElementById('data-list');
    if (dataList) {
        dataList.innerHTML = generateDataHTML(user, dataType);
    }
}

function selectData(dataType) {
    document.querySelectorAll('.data-icon').forEach(icon => {
        icon.classList.remove('active');
    });
    
    document.getElementById(dataType).classList.add('active');
    
    currentDataType = dataType;
    
    if (currentUser) {
        displayUserData(currentUser, dataType);
    }
}

function generateRandomUser() {
    getRandomUser().then(user => {
        currentUser = user;
        displayUsername(user);
        displayUserPhoto(user.picture.large);
        displayUserData(user, currentDataType);
    }).catch(error => {
        console.error('Error fetching random user:', error);
    });
}

function copyUserData() {
    if (!currentUser) {
        showCustomAlert('No user data to copy!');
        return;
    }
    
    let textToCopy = '';
    const username = currentUser.login.username;
    
    switch(currentDataType) {
        case 'data':
            textToCopy = `=== ${username}'s Personal Data ===\n`;
            textToCopy += `Gender: ${currentUser.gender.charAt(0).toUpperCase() + currentUser.gender.slice(1)}\n`;
            textToCopy += `First Name: ${currentUser.name.first}\n`;
            textToCopy += `Last Name: ${currentUser.name.last}\n`;
            textToCopy += `Age: ${currentUser.dob.age} years old`;
            break;
            
        case 'localisation':
            textToCopy = `=== ${username}'s Location ===\n`;
            textToCopy += `Country: ${currentUser.location.country}\n`;
            textToCopy += `State: ${currentUser.location.state}\n`;
            textToCopy += `City: ${currentUser.location.city}`;
            break;
            
        case 'contact':
            textToCopy = `=== ${username}'s Contact Info ===\n`;
            textToCopy += `Email: ${currentUser.email}\n`;
            textToCopy += `Phone: ${currentUser.phone}`;
            break;
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        showCustomAlert('User data copied to clipboard!');
    }).catch(err => {
        console.error('Error copying user data:', err);
        showCustomAlert('Error copying user data!');
    });
}

function copyUserPhoto() {
    const img = document.getElementById('user-photo');
    if (img && img.src) {
        const link = document.createElement('a');
        link.href = img.src;
        link.download = `${currentUser ? currentUser.login.username : 'user'}-photo.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showCustomAlertPhoto('User photo downloaded!');
    } else {
        console.error("No user photo to download.");
        showCustomAlertPhoto('No photo to download!');
    }
}

function showCustomAlert(message) {
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('customAlertOverlay').style.display = 'block';
}

function closeCustomAlert() {
    document.getElementById('customAlertOverlay').style.display = 'none';
}

function showCustomAlertPhoto(message) {
    document.getElementById('alertMessagePhoto').textContent = message;
    document.getElementById('customAlertOverlayPhoto').style.display = 'block';
}

function closeCustomAlertPhoto() {
    document.getElementById('customAlertOverlayPhoto').style.display = 'none';
}

window.onload = async () => {
    const user = await getRandomUser();
    currentUser = user;
    displayUsername(user);
    displayUserPhoto(user.picture.large);
    
    selectData('data');
};


