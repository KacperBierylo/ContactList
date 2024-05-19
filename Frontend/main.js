document.addEventListener('DOMContentLoaded', (event) => {
    loadHome();
    updateNav();
});

function loadHome() {
    document.getElementById('content').innerHTML = `
        <h2>Lista kontaktów - aplikacja</h2>
    `;
}

function loadContacts() {
    const token = localStorage.getItem('token');
    // zapytanie o listę kontaktów
    fetch('https://localhost:7050/api/contacts', {
        method: 'GET'
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
        loadLogin();
        return;
    }
    //zapytanie o kontakt o padnym ID, dodany nagłówek do autoryzacji i token
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
            <p><strong>Imię i nazwisko:</strong> ${contact.firstName} ${contact.lastName}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Telefon:</strong> ${contact.phone}</p>
            <p><strong>Kategoria:</strong> ${contact.category}</p>
            <p><strong>Podkategoria:</strong> ${contact.subCategory}</p>
            <p><strong>Data urodzenia:</strong> ${new Date(contact.birthDate).toLocaleDateString('pl')}</p>
            <button onclick="loadEditContact(${contact.id})">Edytuj</button>
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
    
    //zapytanie o listę kategorii, dodany nagłówek do autoryzacji i token
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
        let subcategory = "–" //domyślnie brak reprezentowany przez "–"
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const category = document.getElementById('category').value;
        if(document.getElementById('subcategory')){
            subcategory = document.getElementById('subcategory').value;
           }
        const birthDate = document.getElementById('birthDate').value;
        // warunki na wypełnienie wszystkich pól
        if(firstName === ""){
            alert('Imię kontaktu nie może być puste');
            return;
        }
        if(lastName === ""){
            alert('Nazwisko kontaktu nie może być puste');
            return;
        }
        //sprawdzanie porpawności maili i telefonu, puste nie pasują do regexa, więc nie potrzeba dodatkowych warunków
        var regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!regexEmail.test(email)) {
            alert('Nieprawidłowy adres email');
            return;
        }

        var regexPhone = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{3})/;
        if (!regexPhone.test(phone)) {
            alert('Nieprawidłowy numer telefonu');
            return;
        }

        if(birthDate === ""){
            alert('Data urodzenia kontaktu nie może być pusta');
            return;
        }
        //żądanie dodania kontaktu
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
}


function loadEditContact(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        loadLogin();
        return;
    }
    //żądanie pobrania kontaktu o podanym ID, aby uzupełnić pola przy edycji danymi edytowanego kontaktu
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
        var contactCategory = 0;
        var contactSubCategory = contact.subCategory;
        // pobranie listy kategorii i podkategorii, aby poprawnie wczytać formularz
        fetch('https://localhost:7050/api/Categories')
        .then(response => response.json())
        .then(categories => {
          const select = document.getElementById('category');
          categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            // załadowanie kategorii i podkategorii tak, żeby stan domyślny odpowiadał stanowi aktualnemu
            if(contact.category == category.name){
                contactCategory = category.id;
                handleCategoryChange(category.id, contactSubCategory );
            }
            option.textContent = category.name;
            select.appendChild(option);
          });
        })
        .catch(error => console.error('Error fetching categories:', error));
      
        document.getElementById('editContactForm').addEventListener('submit', function(event) {
            event.preventDefault();
            let subcategory = "–"
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const category = document.getElementById('category').value;
            if(document.getElementById('subcategory')){
             subcategory = document.getElementById('subcategory').value;
            }
            const birthDate = document.getElementById('birthDate').value;
            //warunki poprawności inputu
            if(firstName === ""){
                alert('Imię kontaktu nie może być puste');
                return;
            }
            if(lastName === ""){
                alert('Nazwisko kontaktu nie może być puste');
                return;
            }

            var regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!regexEmail.test(email)) {
                alert('Nieprawidłowy adres email');
                return;
            }
    
            var regexPhone = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{3})/;
    
            if (!regexPhone.test(phone)) {
                alert('Nieprawidłowy numer telefonu');
                return;
            }
            if(birthDate === ""){
                alert('Data urodzenia kontaktu nie może być pusta');
                return;
            }
            // żądanie aktualizacji kontaktu
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
                    alert('Nie udało się zaktualizować kontaktu');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    })
    .catch(error => console.error('Error:', error));
}

function handleCategoryChange(categoryId=null, Csubcategory=null) {
 
    if(categoryId == null){

        category = document.getElementById('category').value;       
    }
    else{
        category = categoryId;
    }

    let subcategories = []
    let canChoose = false
    // żądanie pobrania podkategorii przekazanej do funkcji kategorii
    fetch(`https://localhost:7050/api/Categories/${category}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Błąd podczas komunikacji z serwerem');
      }
      return response.json();
    })
    .then(data => {
      subcategories = data.subCategories;
      canChoose = data.canChoose;
      // jeśli kategoria zawiera możliwe do wyboru podkategorie
      if(canChoose && subcategories.length != 0){
        const selectSubcategory = document.createElement('select');
        selectSubcategory.id = 'subcategory';
        
        subcategories.forEach(subcategory => {
          const option = document.createElement('option');
          option.value = subcategory.name;
          option.textContent = subcategory.name;
          selectSubcategory.appendChild(option);
        });
        
        const label = document.createElement('label');
        label.textContent = 'Podkategoria';
        
        const subcategoryContainer = document.getElementById('subcategoryContainer');
        if(!(Csubcategory == null))
         selectSubcategory.value = Csubcategory;

        const categoryContainer = document.getElementById('category');
        if(!(categoryId==null))
            categoryContainer.value = categoryId;
        subcategoryContainer.innerHTML = '';
        subcategoryContainer.appendChild(label);
        subcategoryContainer.appendChild(selectSubcategory);
    }
    // jeśli można wybrać kategorie, ale lista jest pusta, można wpisać dowolną
    else if(canChoose){
        const categoryContainer = document.getElementById('category');
        if(!(categoryId==null))
            categoryContainer.value = categoryId;
        if(!(Csubcategory == null))
            subcategoryContainer.innerHTML = `<label>Podkategoria</label> <input type="text" id="subcategory" value = ${Csubcategory} >`;
        else
            subcategoryContainer.innerHTML = '<label>Podkategoria</label> <input type="text" id="subcategory">';

    }
    // kiedy nie można wybrać kategorii, nie wyświetla się pole podkategorii
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
    //żądanie usunięcia kontaktu
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
            alert('Nie udało się usunąć kontaktu');
        }
    })
    .catch(error => console.error('Error:', error));
}
    // wczytanie formularza logowania
function loadLogin() {
    document.getElementById('content').innerHTML = `
        <h2>Zaloguj się</h2>
        <form id="loginForm">
            <div>
                <label>Nazwa</label>
                <input type="text" id="username">
            </div>
            <div>
                <label>Hasło</label>
                <input type="password" id="password">
            </div>
            <button type="submit">Login</button>
        </form>
        <p>Nie masz konta? <a href="#" onclick="loadRegistration()">Zarejestruj się</a></p>
    `;

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        //żądanie zalogowania, wysyłany jest login i hasło na serwer
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
                loadHome();
                updateNav();
            } else {
                alert('Nieprawidłowa nazwa użytkownika lub hasło');
            }
        })
        .catch(error => console.error('Error:', error));
    });
}
    // wczytanie formularza rejsetracji
function loadRegistration() {
    document.getElementById('content').innerHTML = `
        <h2>Rejestracja</h2>
        <form id="registrationForm">
            <div>
                <label>Nazwa</label>
                <input type="text" id="regUsername">
            </div>
            <div>
                <label>Hasło</label>
                <input type="password" id="regPassword">
            </div>
            <div>
                <label>Potwierdź hasło</label>
                <input type="password" id="confirmPassword">
            </div>
            <button type="submit">Zarejestruj</button>
        </form>
        <p>Masz już konto? <a href="#" onclick="loadLogin()">Zaloguj</a></p>
    `;

    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        // sprawdzenie zgodności pól na hasło i złożoności hasła
        if (password !== confirmPassword) {
            alert('Hasła nie zgadzają się ze sobą');
            return;
        }
        var regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

        if (!regex.test(password)) {
            alert('Hasło musi zawierać co najmniej jedną wielką literę angielską, małą literę angielską, cyfrę, znak specjalny (#?!@$%^&*-), osiem znaków.');
            return;
        }
        // żądanie rejestracji, nazwa użytkownika i hasło są wysyłane na serwer
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
                alert('Nazwa użytkownika zajęta.');
            }
        })
        .catch(error => console.error('Error:', error));
    });
}
    // wyologowanie poprzez usunięcie tokenu z pamięci
function logout() {
    localStorage.removeItem('token');
    loadHome();
    updateNav();
}
    // aktualizacja przycisków zalogowania i wylogowania w zależności od tego, czy użytkownik jest zalogowany 
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
