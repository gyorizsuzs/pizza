const express = require('express');
const fileUpload = require('express-fileupload');

const path = require('path');
const fs = require('fs');

const app = express();

let pizzas;

/* const pizzas = require('../frontend/public/scripts/data'); */

const port = 3000;

app.use(fileUpload()); // a formdatás fetch-hez kell hogy a server megkapja a formdatát
app.use(express.json()); // ez pedig a json-os fetchhez kell

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.get('/home', (req, res) => {
  const file = __dirname + '/data.json';
  fs.readFile(file, (err, data) => {
    if (err) throw err;
    res.setHeader('content-type', 'application/json');
    res.send(data);
  });
});

app.get('/pizzaimages', (req, res) => {
  const file = __dirname + '/pizzaimages.json';
  fs.readFile(file, (err, data) => {
    if (err) throw err;
    res.setHeader('content-type', 'application/json');
    res.send(data);
  });
});

app.use('/public', express.static(`${__dirname}/../frontend/public`));

app.post('/uploadimage', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('no file was uploaded');
  }

  const file = req.files.imageFile;
  const fileName = req.body.imageName;

  file.mv(
    `${__dirname}/../frontend/public/images/pizzas/${fileName}.jpg`,
    (error) => {
      if (error) {
        return res.status(500).send(error);
      }

      try {
        let images = fs.readFileSync(
          `${__dirname}/../backend/pizzaimages.json`
        );
        imageData = JSON.parse(images);
        imageData.push({ image: `/public/images/pizzas/${fileName}.jpg` });
        fs.writeFileSync(
          `${__dirname}/../backend/pizzaimages.json`,
          JSON.stringify(imageData)
        );
        res.status(200).send('nice');
      } catch (error) {
        console.log(error);
        res.status(418).send(error);
      }
    }
  );
});
// json-os fetch endpoint-ja
//
app.post('/uploadjson', (req, res) => {
  const json = req.body;
  const file = JSON.stringify(json);
  let date = new Date();
  try {
    let orders = fs.readFileSync(`${__dirname}/../backend/orders.json`);
    orderData = JSON.parse(orders);
    orderData.push(json);
    fs.writeFileSync(
      `${__dirname}/../backend/orders.json`,
      JSON.stringify(orderData)
    );
    fs.writeFileSync(
      `${__dirname}/../backend/orders/order${date.getSeconds()}_${date.getMinutes()}_${date.getHours()}_${date.getDate()}_${date.getMonth()}_${date.getFullYear()}_number${
        orderData.length + 1
      }.json`,
      file,
      (error) => {
        if (error) {
          res.status(500).send(error);
        }
      }
    );
    res.status(200).send('ok');
  } catch (error) {
    console.log(error);
    res.status(418).send(error);
  }
});
// fs.writeFile(
//   `${__dirname}/../backend/orders/${json[0].name}.json`,
//   file,
//   (error) => {
//     if (error) {
//       res.status(500).send(error);
//     } else {
//       res.status(200).send('ok');
//     }
//   }
// );

const getPizza = (req, res) => {
  const name = req.params.name;
  const file = __dirname + '/data.json';
  fs.readFile(file, (err, data) => {
    if (err) throw err;
    const pizzas = JSON.parse(data);
    res.setHeader('content-type', 'application/json');
    const pizza = pizzas.find((pizza) => pizza.name == name);

    res.send(pizza);
  });
};

const createPizza = (req, res) => {
  try {
    const json = req.body;
    const lucien = json[0];

    let beluska = fs.readFileSync(`${__dirname}/../backend/data.json`);
    const beluskaData = JSON.parse(beluska);
    beluskaData.push(lucien);
    fs.writeFileSync(
      `${__dirname}/../backend/data.json`,
      JSON.stringify(beluskaData)
    );
    res.status(200).send('ok');
  } catch (error) {
    console.log(error);
    res.status(418).send(error);
  }
};

const updatePizza = (req, res) => {
  const name = req.params.name;
  const jason = req.body;
  const elek = jason[0];

  try {
    let beluska = fs.readFileSync(`${__dirname}/data.json`);
    let pizza = JSON.parse(beluska);
    let result = pizza.find((pizza) => pizza.name == name);
    /*     console.log(result);
    console.log(pizza[0].name); */
    let objects = Object.keys(pizza[0]);
    let jasonObjects = Object.keys(jason);

    for (let i = 0; i < pizza.length; i++) {
      if (result.name == pizza[i].name) {
        for (const object in pizza[i]) {
          for (const item in elek) {
            if (object === item) {
              console.log(object);
              pizza[i][object] = elek[item];
              fs.writeFileSync(
                `${__dirname}/../backend/data.json`,
                JSON.stringify(pizza)
              );
            }
          }
        }
        /*pizza[i].ingredients = jason.ingredients;*/
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

const deletePizza = async (req, res) => {
  const name = req.params.name;
  const json = req.body;

  try {
    let beluska = fs.readFileSync(`${__dirname}/data.json`);
    let pizza = JSON.parse(beluska);
    let javier = [];
    let result = pizza.find((pizza) => pizza.name == name);
    for (let i = 0; i < pizza.length; i++) {
      if (result.name != pizza[i].name) {
        javier.push(pizza[i]);
      }
    }
    for (let i = 0; i < javier.length; i++) {
      javier[i].id = i + 1;
    }
    fs.writeFileSync(
      `${__dirname}/../backend/data.json`,
      JSON.stringify(javier)
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

// ROUTE HANDLERS

app.get('/admin', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/admin.html`));
});

app.get('/orders', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/orders.html`));
});

app.get('/orderlist', (req, res) => {
  const file = __dirname + '/orders.json';
  fs.readFile(file, (err, data) => {
    if (err) throw err;
    res.setHeader('content-type', 'application/json');
    res.send(data);
  });
});

app.get('/pizza/:name', getPizza);
app.post('/pizza', createPizza);
app.patch('/pizza/:name', updatePizza);
app.delete('/pizza/:name', deletePizza);

// PORT

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
