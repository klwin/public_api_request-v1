// Handle requests
async function getJSON(url) {
    try {
      const response = await fetch(url);
      return await response.json();
    }
    catch (error) {
      throw error;
    }
}


// Generate the markup for Gallery
async function renderUsers() {
    let htmlString = '';
    let users = await getJSON("https://randomuser.me/api/?results=12&nat=US");

    users.results.map( (user) => {
        htmlString +=
        `<div class="card">
            <div class="card-img-container">
                <img class="card-img" src=${user.picture.large} alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
            </div>
        </div>`

    });

    let galleryElement = document.getElementById('gallery');
    galleryElement.insertAdjacentHTML('beforeend',htmlString);

    let cards = document.getElementsByClassName('card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', (e) => {
            buildModal(users.results,i);
        });
    }

    buildSearchBar(users.results);
    
}

//build modal based off index
function buildModal(data,index) {
    let galleryElement = document.getElementById('gallery');
    let modalElement = document.getElementsByClassName('modal-container');

    if(modalElement.length != 0) {
        modalElement[0].remove();
    }

    let nextIndex = (index == 11) ? 0 : index+1;
    let prevIndex = (index == 0) ? 11 : index-1;

    let birthday = parseBirthday(data[index].dob.date);
    let cellPhone = parsePhone(data[index].cell);

    let htmlString = '';
    htmlString += 
    `<div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src=${data[index].picture.large} alt="profile picture">
                <h3 id="name" class="modal-name cap">${data[index].name.first} ${data[index].name.last}</h3>
                <p class="modal-text">${data[index].email}</p>
                <p class="modal-text cap">${data[index].location.city}</p>
                <hr>
                <p class="modal-text">${cellPhone}</p>
                <p class="modal-text">${data[index].location.street.number}, ${data[index].location.street.name}, ${data[index].location.city}, ${data[index].location.state} ${data[index].location.postcode}</p>
                <p class="modal-text">${birthday}</p>
            </div>
        </div>

        // IMPORTANT: Below is only for exceeds tasks 
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>`

    galleryElement.insertAdjacentHTML('afterend', htmlString);

    document.getElementById('modal-close-btn').addEventListener('click', closeModal);

    document.getElementById('modal-prev').addEventListener('click', (e) => buildModal(data,prevIndex));
    document.getElementById('modal-next').addEventListener('click', (e) => buildModal(data,nextIndex));
}

// format the birthday date
function parseBirthday(date) {
    let newDate = new Date(date);
    let day = newDate.getDate();
    let month = newDate.getMonth();
    let year = newDate.getFullYear();
    let birthday = month + '/' + day + '/' + year;
    return birthday;
}

//formate cellphone
function parsePhone(numbers) {
    newNumber = String(numbers).split('-');
    newNumber = newNumber[0] + ' ' + newNumber[1] + '-' + newNumber[2];
    return newNumber;
}

//close modal
function closeModal() {
    document.getElementById('modal-close-btn').parentElement.parentElement.style.display = 'none';
}

//
function buildSearchBar() {
    let searchElement = document.getElementsByClassName('search-container')[0];

    let htmlString = '';
    htmlString += 
    `<form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`

    searchElement.insertAdjacentHTML('beforeend',htmlString);

    document.getElementById('search-input').addEventListener('input', (e) => {
        let keyword = e.target.value.toLowerCase();
        let names = document.getElementsByClassName('card-name');
        for (let name of names) {
            name.parentElement.parentElement.style.display = 'none';
            let userName = name.textContent.toLowerCase();
            if (userName.indexOf(keyword) >= 0) {
                name.parentElement.parentElement.style.display = 'flex';
            } else {
                name.parentElement.parentElement.style.display = 'none';
            }
        }
    });
}
document.body.style.backgroundColor = "#deeaee";
document.getElementsByTagName('h1')[0].style.color = "#000";
renderUsers();