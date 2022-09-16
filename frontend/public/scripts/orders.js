const rootElement = document.querySelector('#orders');

let pizzas = [];

const navBarComponent = function () {
  return `
        <nav class="menu">
          <img id="top" src="./public/images/top.png">
          <ul class="menu-list">
            <li class="main-page">
              <a class="nav-link" href="../../">Main</a>
            </li>
            <li class="admin-page">
              <a class="nav-link" href="../../admin">Admin</a>
            </li>
          </ul>
        </nav>
      `;
};

const orderContainerComponent = function () {
  return `
    <div class="order-container-component"></div>
  `;
};

const orderComponent = function (
  name,
  address,
  zip,
  city,
  phone,
  email,
  pizza,
  total
) {
  return `
    <div class="order-container">
      <div class="name"><u>Name:</u> ${name}</div>
      <div class="address"><u>Details:</u> ${address}</div>
      <div class="zip">${zip}</div>
      <div class="city">${city}</div>
      <div class="phone">${phone}</div>
      <div class="email">${email}</div>
      <div class="pizzas"><u>Pizzas</u>: ${pizza}</div>
      <div class="total"><u>Total:</u> ${total} USD</div>
    </div>
  `;
};

const pizzaComponent = function (pizzaname, pizzaamount, pizzaprice) {
  return `
  <div class=pizza-data>
    <div class="pizzaname">${pizzaname}</div>
    <div class="pizzaamount">${pizzaamount}</div>
    <div class="pizzaprice">${pizzaprice}</div>
  </div>
  `;
};

const totalComponent = function (total) {
  return `
    <div class="total">Total: ${total} USD</div>
  `;
};

const footerComponent = function (copyrights) {
  return `
        <footer>${copyrights}</footer>
      `;
};

async function loadEvent() {
  const orders = document.querySelector('#orders');

  orders.insertAdjacentHTML('beforeend', navBarComponent());
  orders.insertAdjacentHTML('beforeend', orderContainerComponent());

  const containerComponent = document.querySelector(
    '.order-container-component'
  );

  const response = await fetch('/orderlist');
  pizzas = await response.json();

  for (let i = 0; i < pizzas.length; i++) {
    function pizza() {
      let element = '';
      for (let o = 0; o < pizzas[i][1].length; o++) {
        element += `
        <div class=pizza-data>
        <div class="pizzaname">${pizzas[i][1][o].pizzaname}</div>
        <div class="pizzaamount">${pizzas[i][1][o].pizzaamount} pcs</div>
        <div class="pizzaprice">${pizzas[i][1][o].pizzaprice} USD</div>
      </div>`;
      }
      return element;
    }
    containerComponent.insertAdjacentHTML(
      'beforeend',
      orderComponent(
        pizzas[i][0].name,
        pizzas[i][0].address,
        pizzas[i][0].zip,
        pizzas[i][0].city,
        pizzas[i][0].phone,
        pizzas[i][0].email,
        pizza(),
        pizzas[i][2].total
      )
    );
  }

  // const orderPizza = document.querySelector('.pizzas');

  // orderPizza.insertAdjacentHTML('beforeend', pizzaComponent());
  // for (let i = 0; i < pizzas.length; i++) {
  //   console.log(pizzas[i][1].pizzaname);
  //   orders.insertAdjacentHTML(
  //     'beforeend',
  //     orderComponent(
  //       pizzas[i][1].pizzaname,
  //       pizzas[i][1].pizzaamount,
  //       pizzas[i][1].pizzaprice
  //     )
  //   );
  containerComponent.insertAdjacentHTML(
    'beforeend',
    '<img id="mario" src="/public/images/Mario.jpg">'
  );

  orders.insertAdjacentHTML(
    'beforeend',
    footerComponent(
      'Copyright © 2022 <u>Prosciutto CRUDo</u> || All rights reserved'
    )
  );

  const mainPageNav = document.querySelector('.main-page');
  mainPageNav.addEventListener('click', function () {
    console.log('main page');
  });

  const adminPageNav = document.querySelector('.admin-page');
  adminPageNav.addEventListener('click', function () {
    console.log('admin page');
  });
}

window.addEventListener('load', loadEvent);
