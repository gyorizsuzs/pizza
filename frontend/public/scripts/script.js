// import { pizzas } from './data.js';

let pizzas;
let order = [];

let total = { total: 0 };

const navBarComponent = function () {
  return `
    <nav class="menu">
      
      <img id="top" src="/public/images/top.png">
      <ul class="menu-list">
        <li>Our Story</li>
        <li>Menu</li>
        <li>Contact us</li>
        <li class="admin-page">
          <a class="nav-link" href="../../admin">Admin</a>
        </li>
      </ul>
    </nav>
  `;
};

/* function clickInner(target) {
  window.location.href = `./${target}`;

  after href in the html element: onClick="clickInner('admin.html');"
} */

const headerComponent = function (title) {
  return `
    <header>
      <img id="eatled" src="/public/images/eatled.jpeg">
    </header>

  `;
};

const footerComponent = function (copyrights) {
  return `
    <footer>${copyrights}</footer>
  `;
};

const cardComponent = function (name, image, ingredients, price, currency) {
  return `
    <div class="card-container">
      <div class="card">
        <img src="${image}">
        <h1>${name}</h1>
        <p>${ingredients}</p>
        <h3>${price} ${currency}</h3>
        <input class="input-amount" type="number"
          min=0 max=10>
        <button class="cart-button">Add to cart</button>
      </div>
    <div>
  `;
};

const formComponent = function () {
  return `
    <div class="order-container">
      <div class="basket">
        <span>Your Order</span> 
        <div class="basket-order-container">
        </div>
        <div class="basket-container">
            <div class="display-name"></div>
            <div class="display-address"></div>
            <div class="display-zip"></div>
            <div class="display-city"></div>
            <div class="display-phone"></div>
            <div class="display-email"></div>
        </div>
      </div>
      <div class="form-container">
        <span>Your Details</span>
        <form action="">
          <input id="name" type="text" placeholder="Name" required>
          <input id="address" type="text" placeholder="Address" required>
          <input id="zip" type="text" minlength="1" maxlength="10" placeholder="ZIP Code" required>
          <input id="city"type="text" placeholder="City" required>
          <input id="phone" type="number" placeholder="Phone" required>
          <input id="e-mail" type="text" placeholder="e-mail" required>
          <button id="order-button">Send Your Order</button>
        </form>
      </div>
    </div>
  `;
};

const basketComponent = function () {
  let divElement = ``;
  for (let i = 0; i <= pizzas.length; i++) {
    divElement += `<div class="basket-content"></div>`;
  }
  return divElement;
};

async function init() {
  const root = document.querySelector('#root');
  const body = document.querySelector('#body');

  const response = await fetch('/home');
  pizzas = await response.json();

  body.insertAdjacentHTML(
    'afterbegin',
    headerComponent('pizza della Nonna - by Mario')
  );

  body.insertAdjacentHTML('afterbegin', navBarComponent());

  body.insertAdjacentHTML(
    'afterend',
    footerComponent(
      'Copyright © 2022 <u>Prosciutto CRUDo</u> || All rights reserved'
    )
  );

  for (let i = 0; i < pizzas.length; i++) {
    order.push({
      pizzaname: pizzas[i].name,
      pizzaamount: 0,
      pizzaprice: 0,
    });
    root.insertAdjacentHTML(
      'beforeend',
      cardComponent(
        pizzas[i].name,
        pizzas[i].image,
        pizzas[i].ingredients,
        pizzas[i].price,
        pizzas[i].currency
      )
    );
  }

  body.insertAdjacentHTML('beforeend', formComponent());

  const basketContainer = document.querySelector('.basket-order-container');

  basketContainer.insertAdjacentHTML('afterbegin', basketComponent());

  const adminNav = document.querySelector('.admin-page');
  adminNav.addEventListener('click', function () {
    console.log('admin page');
  });

  [...document.querySelectorAll('.cart-button')].forEach((el) =>
    el.addEventListener('click', function (event) {
      const target = event.target;
      const parent = target.parentNode;

      const pizzaName = parent.querySelector('h1').innerText;
      const pizzaAmount = parent.querySelector('input').value;

      for (let i = 0; i < order.length; i++) {
        if (order[i].pizzaname === pizzaName && pizzaAmount.length >= 1) {
          order[i].pizzaamount = pizzaAmount;
          order[i].pizzaprice = 0;
          order[i].pizzaprice = pizzas[i].price * pizzaAmount;
        }
      }
      total.total = 0;

      for (let i = 0; i < order.length; i++) {
        total.total = total.total + order[i].pizzaprice;
      }

      const basketContent = document.querySelectorAll('.basket-content');
      basketContent.forEach((div) => {
        div.innerHTML = '';
      });

      for (let i = 0; i < order.length; i++) {
        if (order[i].pizzaamount > 0) {
          basketContent[i].insertAdjacentHTML(
            'beforeend',
            `${order[i].pizzaname}   ${order[i].pizzaamount} pcs   ${order[i].pizzaprice} USD`
          );
        }
      }
      basketContent[pizzas.length].insertAdjacentHTML(
        'afterbegin',
        `Total: ${total.total} USD`
      );
    })
  );

  const inputName = document.querySelector('#name');
  const inputAddress = document.querySelector('#address');
  const inputZip = document.querySelector('#zip');
  const inputCity = document.querySelector('#city');
  const inputPhone = document.querySelector('#phone');
  const inputEmail = document.querySelector('#e-mail');

  const displayName = document.querySelector('.display-name');

  inputName.addEventListener('input', (event) => {
    let inputNameData = event.target.value;
    displayName.innerHTML = inputNameData;
  });

  const displayAddress = document.querySelector('.display-address');

  inputAddress.addEventListener('input', (event) => {
    let inputAddressData = event.target.value;
    displayAddress.innerHTML = inputAddressData;
  });

  const displayZip = document.querySelector('.display-zip');

  inputZip.addEventListener('input', (event) => {
    let inputZipData = event.target.value;
    displayZip.innerHTML = inputZipData;
  });

  const displayCity = document.querySelector('.display-city');

  inputCity.addEventListener('input', (event) => {
    let inputCityData = event.target.value;
    displayCity.innerHTML = inputCityData;
  });

  const displayPhone = document.querySelector('.display-phone');

  inputPhone.addEventListener('input', (event) => {
    let inputPhoneData = event.target.value;
    displayPhone.innerHTML = inputPhoneData;
  });

  const displayEmail = document.querySelector('.display-email');

  inputEmail.addEventListener('input', (event) => {
    let inputEmailData = event.target.value;
    displayEmail.innerHTML = inputEmailData;
  });

  const formElement = document.querySelector('form');

  formElement.addEventListener('submit', (event) => {
    event.preventDefault();

    const formName = formElement.querySelector('#name').value;
    const formAddress = formElement.querySelector('#address').value;
    const formZip = formElement.querySelector('#zip').value;
    const formCity = formElement.querySelector('#city').value;
    const formPhone = formElement.querySelector('#phone').value;
    const formEmail = formElement.querySelector('#e-mail').value;

    let jsonObject = [
      {
        name: formName,
        address: formAddress,
        zip: formZip,
        city: formCity,
        phone: formPhone,
        email: formEmail,
      },
    ];

    let orderElements = [];

    for (let i = 0; i < order.length; i++) {
      if (order[i].pizzaamount > 0) {
        orderElements.push(order[i]);
      }
    }

    jsonObject.push(orderElements);

    let orderButton = document.querySelector('#order-button');
    let newDiv = document.createElement('div');
    newDiv.textContent = 'Thank you for your order!';

    formElement.removeChild(orderButton);
    formElement.appendChild(newDiv);

    jsonObject.push(total);

    console.log(jsonObject);

    fetch('/uploadjson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonObject),
    });

    setTimeout(function () {
      formElement.removeChild(newDiv);

      formElement.appendChild(orderButton);
    }, 4000);
  });
}

window.addEventListener('load', init);
