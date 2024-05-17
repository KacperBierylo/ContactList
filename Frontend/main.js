document.addEventListener('DOMContentLoaded', (event) => {
    loadHome();
    updateNav();
});

function loadHome() {
    document.getElementById('content').innerHTML = `
        <h2>Lista kontaktów</h2>
    `;
}

function loadContacts() {
    const token = localStorage.getItem('token');
  
    fetch('https://localhost:7050/api/contacts', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        let contactsHTML = '<h2>Kontakty</h2><button onclick="loadAddContact()">Dodaj kontakt</button><ul>';
        data.forEach(contact => {
            contactsHTML += `<li>
                <a href="#" onclick="loadContactDetails(${contact.id})">${contact.firstName} ${contact.lastName}</a>
                <button onclick="deleteContact(${contact.id})">Usuń</button>
                <button onclick="loadEditContact(${contact.id})">Edytuj</button>
            </li>`;
        });
        contactsHTML += '</ul>';
        document.getElementById('content').innerHTML = contactsHTML;
    })
    .catch(error => console.error('Error:', error));
}

function loadContactDetails(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        loadLogin();
        return;
    }

    fetch(`https://localhost:7050/api/contacts/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(contact => {
        const detailsHTML = `
            <h2>Szczegóły</h2>
            <p><strong>Imię:</strong> ${contact.firstName} ${contact.lastName}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Telefon:</strong> ${contact.phone}</p>
            <p><strong>Kategoria:</strong> ${contact.category}</p>
            <p><strong>Podkategoria:</strong> ${contact.subCategory}</p>
            <p><strong>Data urodzenia:</strong> ${contact.birthDate}</p>
            <button onclick="loadEditContact(${contact.id})">Edit</button>
        `;
        document.getElementById('content').innerHTML = detailsHTML;
    })
    .catch(error => console.error('Error:', error));
}

function loadAddContact() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        loadLogin();
        return;
    }
    

    fetch('https://localhost:7050/api/Categories')
    .then(response => response.json())
    .then(categories => {
      const select = document.getElementById('category');
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching categories:', error));



    const addHTML = `
        <h2>Dodaj kontakt</h2>
        <form id="addContactForm">
            <div>
                <label>Imię</label>
                <input type="text" id="firstName">
            </div>
            <div>
                <label>Nazwisko</label>
                <input type="text" id="lastName">
            </div>
            <div>
                <label>Email</label>
                <input type="email" id="email">
            </div>
            <div>
                <label>Telefon</label>
                <input type="text" id="phone">
            </div>
            <div>
                <label>Kategoria</label>
                <select id="category" onchange="handleCategoryChange()">

                </select>
            </div>
            <div id="subcategoryContainer">
            <!--<label>Podkategoria</label>-->
            </div>
            <div>
                <label>Data urodzenia</label>
                <input type="date" id="birthDate">
            </div>
            <button type="submit">Dodaj kontakt</button>
        </form>
    `;
    document.getElementById('content').innerHTML = addHTML;

    document.getElementById('addContactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        let subcategory = "Brak"
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const category = document.getElementById('category').value;
        if(document.getElementById('subcategory')){
            subcategory = document.getElementById('subcategory').value;
           }
        const birthDate = document.getElementById('birthDate').value;

        fetch('https://localhost:7050/api/contacts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                phone,
                category,
                subcategory,
                birthDate
            })
        })
        .then(response => {
            if (response.ok) {
                loadContacts();
            } else {
                alert('Dodawanie kontaktu nie powiodło się.');
            }
        })
        .catch(error => console.error('Error:', error));
    });

    handleCategoryChange();
}


function loadEditContact(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        loadLogin();
        return;
    }

    fetch(`https://localhost:7050/api/contacts/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(contact => {
        const birthDate = new Date(contact.birthDate);
        const day = birthDate.getDate().toString().padStart(2, '0');
        const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
        const year = birthDate.getFullYear().toString().padStart(4, '0');
        const formattedBirthDate = `${year}-${month}-${day}`;

        const editHTML = `
            <h2>Edytuj kontakt</h2>
            <form id="editContactForm">
                <div>
                    <label>Imię</label>
                    <input type="text" id="firstName" value="${contact.firstName}">
                </div>
                <div>
                    <label>Nazwisko</label>
                    <input type="text" id="lastName" value="${contact.lastName}">
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" id="email" value="${contact.email}">
                </div>
                <div>
                    <label>Telefon</label>
                    <input type="text" id="phone" value="${contact.phone}">
                </div>
                <div>
                <label>Kategoria</label>
                <select id="category" onchange="handleCategoryChange()">

                </select>
            </div>
            <div id="subcategoryContainer">
            <!--<label>Podkategoria</label>-->
            </div>
                <div>
                    <label>Data urodzenia</label>
                    <input type="date" id="birthDate" value="${formattedBirthDate}">
                </div>
                <button type="submit">Zapisz zmiany</button>
            </form>
        `;
        document.getElementById('content').innerHTML = editHTML;

        fetch('https://localhost:7050/api/Categories')
        .then(response => response.json())
        .then(categories => {
          const select = document.getElementById('category');
          categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
          });
        })
        .catch(error => console.error('Error fetching categories:', error));


        handleCategoryChange(contact.category);

        document.getElementById('editContactForm').addEventListener('submit', function(event) {
            event.preventDefault();
            let subcategory = "Brak"
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const category = document.getElementById('category').value;
            if(document.getElementById('subcategory')){
             subcategory = document.getElementById('subcategory').value;
            }
            const birthDate = document.getElementById('birthDate').value;

            fetch(`https://localhost:7050/api/contacts/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id,
                    firstName,
                    lastName,
                    email,
                    phone,
                    category,
                    subcategory,
                    birthDate
                })
            })
            .then(response => {
                if (response.ok) {
                    loadContacts();
                } else {
                    alert('Failed to update contact. Please try again.');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    })
    .catch(error => console.error('Error:', error));
}

function handleCategoryChange(selectedCategory = null) {
    console.log("xd")
    category = selectedCategory || document.getElementById('category').value;

    if(document.getElementById('category').value===""){

        return;        
    }
    console.log(document.getElementById('category').value)
    let subcategories = []
    let canChoose = false

    fetch(`https://localhost:7050/api/Categories/${category}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      subcategories = data.subCategories;
      canChoose = data.canChoose;
      if(canChoose && subcategories.length != 0){
        console.log("opcja 1");
        const selectSubcategory = document.createElement('select');
        selectSubcategory.id = 'subcategory';
        
        subcategories.forEach(subcategory => {
            console.log(subcategories)
          const option = document.createElement('option');
          option.value = subcategory.name;
          option.textContent = subcategory.name;
          selectSubcategory.appendChild(option);
        });
        
        const label = document.createElement('label');
        label.textContent = 'SubCategory';
        
        const subcategoryContainer = document.getElementById('subcategoryContainer');
        subcategoryContainer.innerHTML = '';
        subcategoryContainer.appendChild(label);
        subcategoryContainer.appendChild(selectSubcategory);
    }
    else if(canChoose){
        const subcategoryContainer = document.getElementById('subcategoryContainer');
        subcategoryContainer.innerHTML = '<label>Podkategoria</label> <input type="text" id="subcategory">';

    }
    else{
        const subcategoryContainer = document.getElementById('subcategoryContainer');
        subcategoryContainer.innerHTML = '';
    }

    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

function deleteContact(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        loadLogin();
        return;
    }

    fetch(`https://localhost:7050/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            loadContacts();
        } else {
            alert('Failed to delete contact. Please try again.');
        }
    })
    .catch(error => console.error('Error:', error));
}

function loadLogin() {
    document.getElementById('content').innerHTML = `
        <h2>Zaloguj się</h2>
        <form id="loginForm">
            <div>
                <label>Username</label>
                <input type="text" id="username">
            </div>
            <div>
                <label>Password</label>
                <input type="password" id="password">
            </div>
            <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="#" onclick="loadRegistration()">Register</a></p>
    `;

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('https://localhost:7050/api/Auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log('Token saved successfully');
                loadHome();
                updateNav();
            } else {
                alert('Invalid username or password');
            }
        })
        .catch(error => console.error('Error:', error));
    });
}

function loadRegistration() {
    document.getElementById('content').innerHTML = `
        <h2>Rejestracja</h2>
        <form id="registrationForm">
            <div>
                <label>Username</label>
                <input type="text" id="regUsername">
            </div>
            <div>
                <label>Password</label>
                <input type="password" id="regPassword">
            </div>
            <div>
                <label>Confirm Password</label>
                <input type="password" id="confirmPassword">
            </div>
            <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="#" onclick="loadLogin()">Login</a></p>
    `;

    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        fetch('https://localhost:7050/api/Auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.ok) {
                loadLogin();
            } else {
                alert('Registration failed. Please try again.');
            }
        })
        .catch(error => console.error('Error:', error));
    });
}

function logout() {
    localStorage.removeItem('token');
    loadHome();
    updateNav();
}

function updateNav() {
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('loginNav').style.display = 'none';
        document.getElementById('logoutNav').style.display = 'block';
    } else {
        document.getElementById('loginNav').style.display = 'block';
        document.getElementById('logoutNav').style.display = 'none';
    }
}
