const rootElement = document.querySelector('#admin');

let pizzas = [];
let images = [];

const navBarComponent = function () {
  return `
      <nav class="menu">
        
        <img id="top" src="/public/images/top.png">
        <ul class="menu-list">
          <li class="main-page">
            <a class="nav-link" href="../../">Main</a>
          </li>
          <li class="orders-page">
            <a class="nav-link" href="../../orders">Orders</a>
          </li>
        </ul>
      </nav>
    `;
};

const valueComponent = function (pizzaName) {
  return `
    <option value="${pizzaName}">
    `;
};

const imageValueComponent = function (pizzaImage) {
  return `
  <option value="${pizzaImage}">
    ${pizzaImage.replace(`/public/images/pizzas/`, '')}
  </option>
  `;
};

const adminFormComponent = function () {
  return `
  <div id='main'>
    <form class="image-upload">
      <div class="input-container">
        <input class="image-name" type="text" placeholder="image name">
        <input class="image-uploader" type="file" placeholder="Upload image" required>
        <div class="button-container">
          <button id="image-upload-button">Send</button>
        </div>
      </div>
    </form>
    <div class="order-container">
        <div class="form-container">
            <span>Available pizzas</span>
            <form class="pizza-update" action="">
                <div>
                    <input id="choice" list="browsers" placeholder="search..." required>
                    <datalist class="dd" id="browsers">
                      <option value="">
                    </datalist>
                </div>
                <input id="name" type="text" placeholder="Pizza Name" required>
                <input id="ingredients" type="text" placeholder="Ingredients" required>
                <input id="price" type="text" placeholder="Price" required>
                <input id="currency" type="text" placeholder="Currency" required>
                <div class="display-container">
                  <div id="select">
                    <select class="img" id="image-browsers" placeholder="Choose image">
                      <option class="select" value="">Select image</option>
                    </select>
                  </div>
                  <div class="image-holder"></div>
                </div>
                <div class="button-container">
                    <button class="pizza-update-btn">Update</button>
                    <button class="pizza-delete-btn">Delete</button>
                </div>
            </form>
        </div>
        <div class="form-container">
            <span>Add pizza</span>
            <form class="add-pizza" action="">
                <input id="add-id" type="number" placeholder="Pizza ID" required>
                <input id="add-name" type="text" placeholder="Pizza Name" required>
                <input id="add-ingredients" type="text" placeholder="Ingredients" required>
                <input id="add-price" type="text" placeholder="Price" required>
                <input id="add-currency" type="text" placeholder="Currency" required>
                <div class="display-container">
                  <select class="add-img" id="image-browsers" placeholder="Choose image">
                    <option class="select" value="">Select image</option>
                  </select>
              </div>
                <div class="button-container">
                    <button class="add-btn">Add</button>
                </div>
            </form>
        </div>
    </div>
    </div>
    `;
};

const footerComponent = function (copyrights) {
  return `
      <footer>${copyrights}</footer>
    `;
};

async function loadEvent() {
  const response = await fetch('/home');
  pizzas = await response.json();
  const imageResponse = await fetch('/pizzaimages');
  images = await imageResponse.json();

  const admin = document.querySelector('#admin');

  admin.insertAdjacentHTML('beforeend', navBarComponent());

  admin.insertAdjacentHTML('beforeend', adminFormComponent());
  const dataList = document.querySelector('.dd');
  const imageList = document.querySelector('.img');
  const addImageList = document.querySelector('.add-img');

  admin.insertAdjacentHTML(
    'afterend',
    footerComponent(
      'Copyright © 2022 <u>Prosciutto CRUDo</u> || All rights reserved'
    )
  );

  const imageUploadElement = document.querySelector('.image-upload');
  imageUploadElement.addEventListener('submit', (event) => {
    event.preventDefault();

    const imageName = event.target.querySelector('.image-name').value;
    const imageFile = event.target.querySelector('.image-uploader').files[0];

    const formData = new FormData();
    formData.append('imageName', imageName);
    formData.append('imageFile', imageFile);

    const fetchSettings = {
      method: 'POST',
      body: formData,
    };

    fetch('/uploadimage', fetchSettings)
      .then(async (data) => {
        if (data.status === 200) {
          console.log('OK');
          images = [];
          const newImageResponse = await fetch('/pizzaimages');
          images = await newImageResponse.json();
          imageList.innerHTML = '';
          addImageList.innerHTML = '';
          for (element of images) {
            imageList.insertAdjacentHTML(
              'beforeend',
              imageValueComponent(element.image)
            );
            addImageList.insertAdjacentHTML(
              'beforeend',
              imageValueComponent(element.image)
            );
          }
        } else {
          event.target.outerHTML = 'Tölts fel képet!';
        }
      })
      .catch((error) => {
        event.target.outerHTML = 'Tölts már fel képet!';
        console.log(error);
      });

    let imageSendButton = document.querySelector('.input-container');
    let newDiv = document.createElement('div');
    newDiv.setAttribute('id', 'text');
    newDiv.textContent = 'Image uploaded!';

    imageUploadElement.removeChild(imageSendButton);
    imageUploadElement.appendChild(newDiv);

    setTimeout(function () {
      imageUploadElement.removeChild(newDiv);

      imageUploadElement.appendChild(imageSendButton);
    }, 8000);
  });

  let pizzaNames = [];

  for (element of pizzas) {
    dataList.insertAdjacentHTML('beforeend', valueComponent(element.name));
    pizzaNames.push(element.name);
  }

  for (element of images) {
    imageList.insertAdjacentHTML(
      'beforeend',
      imageValueComponent(element.image)
    );
    addImageList.insertAdjacentHTML(
      'beforeend',
      imageValueComponent(element.image)
    );
  }

  // [...document.querySelectorAll('option')].forEach((el) =>
  //   el.addEventListener('input', (event) => {
  //     console.log('first');
  //   })
  // );

  const searchBar = document.querySelector('#choice');
  searchBar.addEventListener('change', () => {
    let val = searchBar.value;
    let found = pizzaNames.find((pizza) => pizza == val);
    if (val == found) {
      let content = pizzas.find((pizza) => pizza.name == found);

      let name = document.querySelector('#name');
      name.value = content.name;

      let ingredients = document.querySelector('#ingredients');
      ingredients.value = content.ingredients;

      let price = document.querySelector('#price');
      price.value = content.price;

      let currency = document.querySelector('#currency');
      currency.value = content.currency;

      let imageHolder = document.querySelector('.image-holder');
      imageHolder.innerHTML = '';
      imageHolder.insertAdjacentHTML(
        'beforeend',
        `<img src="${content.image}">`
      );
      // let image = document.querySelector('#image');
      // let imageValue = image.value;
      // imageValue = imageValue.replace(`C:\\fakepath\\`, '');
    }
  });

  const mainPageNav = document.querySelector('.main-page');
  mainPageNav.addEventListener('click', function () {
    console.log('main page');
  });

  const ordersPageNav = document.querySelector('.orders-page');
  ordersPageNav.addEventListener('click', function () {
    console.log('orders page');
  });

  const updateButtonElement = document.querySelector('.pizza-update-btn');
  const updateElement = document.querySelector('.pizza-update');

  updateButtonElement.addEventListener('click', (event) => {
    event.preventDefault();

    const formName = updateElement.querySelector('#name').value;
    const formIngredients = updateElement.querySelector('#ingredients').value;
    const formPrice = updateElement.querySelector('#price').value;
    const formCurrency = updateElement.querySelector('#currency').value;
    const formImage = updateElement.querySelector('.img').value;

    let jsonObject = [
      {
        name: formName,
        ingredients: formIngredients,
        price: formPrice,
        currency: formCurrency,
        image: formImage,
      },
    ];

    // let newUpdate = document.createElement('div');
    // newUpdate.textContent = 'Thank you for your update!';

    // updateElement.removeChild(updateButtonElement);
    // updateElement.appendChild(newUpdate);

    const choice = document.querySelector('#choice').value;
    fetch(`/pizza/${choice}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonObject),
    });

    // setTimeout(function () {
    //   formElement.removeChild(newDiv);

    //   formElement.appendChild(orderButton);
    // }, 4000);
  });

  const updateDeleteElement = document.querySelector('.pizza-delete-btn');

  updateDeleteElement.addEventListener('click', (event) => {
    event.preventDefault();

    // let newUpdate = document.createElement('div');
    // newUpdate.textContent = 'Thank you for your update!';

    // updateElement.removeChild(updateButtonElement);
    // updateElement.appendChild(newUpdate);

    const choice = document.querySelector('#choice').value;
    fetch(`/pizza/${choice}`, {
      method: 'DELETE',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
    });

    // setTimeout(function () {
    //   formElement.removeChild(newDiv);

    //   formElement.appendChild(orderButton);
    // }, 4000);
  });
  const addButtonElement = document.querySelector('.add-btn');
  const addElement = document.querySelector('.add-pizza');

  addButtonElement.addEventListener('click', (event) => {
    event.preventDefault();

    const formAddName = addElement.querySelector('#add-name').value;
    const formAddIngredients =
      addElement.querySelector('#add-ingredients').value;
    const formAddPrice = addElement.querySelector('#add-price').value;
    const formAddCurrency = addElement.querySelector('#add-currency').value;
    const formAddImage = addElement.querySelector('.add-img').value;

    let jsonObject = [
      {
        name: formAddName,
        ingredients: formAddIngredients,
        price: formAddPrice,
        currency: formAddCurrency,
        image: formAddImage,
      },
    ];

    // let newUpdate = document.createElement('div');
    // newUpdate.textContent = 'Thank you for your update!';

    // updateElement.removeChild(updateButtonElement);
    // updateElement.appendChild(newUpdate);

    fetch('/pizza', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonObject),
    });

    // setTimeout(function () {
    //   formElement.removeChild(newDiv);

    //   formElement.appendChild(orderButton);
    // }, 4000);
  });
}

window.addEventListener('load', loadEvent);
