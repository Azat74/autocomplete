'use strict';

let clean = document.querySelector('#clean');
let renderContainer = document.querySelector('#render-city');
let inputCityId = renderContainer.querySelector('.input-city-id');
let cities = [];
let input = document.querySelector('.input-city');
let lock = false;
let noConnect;
let validate;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function validateCity (cities, evt) {
  let foundCity = 0;
  cities.forEach(function (city) {
    if (city['Id'].toString() + ' ' + city['City'] == inputCityId.value + ' ' + evt.target.value) {
      console.log(city['Id'].toString() + ' ' + city['City']);
      foundCity += 1;
    }
  })
  console.log(foundCity);
}

function msgError() {
  // clearTimeout(noConnect);
  noConnect = setTimeout(function () {
    render.innerHTML = 'Ой что-то пошло не так';
  }, 5000)
};


function loadCities (evt) {
  if (lock == false) {
    fetch('../data.json')
      .then(res => {
        // if (Math.random() > 0.5) {
        //   throw new Error('данные не загружены, попробуйте повторить загрузку');
        // }
        lock = true;
        setTimeout(function () {
          return res.json()
            .then(res => {
              cities = res;
              console.log(cities);
              showCities.call(input, evt);
            })
        }, getRandomInt(1, 2));
      })
      .catch(e => {
        console.error(e);
        msgError();
        console.info('повторная загрузка будет запущена через 10 секунд');
        setTimeout(function () {
          input.click();
        }, 10000)
      });
  }
}

function showCities(evt) {
  if (renderContainer.querySelector('.rendered')) {
    clean.appendChild(renderContainer.querySelector('.rendered'));
    clean.innerHTML = '';
  }
  let render = document.createElement('div');

  render.classList.add('rendered');
  renderContainer.appendChild(render);
  render.innerHTML = '';
  let result = '';
  let length = document.createElement('div');
  length.classList.add('rendered__length');

  if (cities.length == 0) {
    length.innerHTML = '<div class="loader"></div><div>Загрузка</div>';
    msgError();
  };
  result = cities.filter(function (el) {
    return el['Id'].toString().match(evt.target.value) || el['City'].toLowerCase().match(evt.target.value.toLowerCase());
  });
  let sliced = result.slice(0, 5);
  let list = document.createElement('div');
  list.classList.add('rendered__contain');
  sliced.forEach(function (el) {
    let li = document.createElement('div');
    li.classList.add('rendered__element');
    li.innerText = el['Id'] + ' ' + el['City'];
    li.addEventListener('click', function () {
      inputCityId.value = el['Id'];
      input.value = el['City'];
      input.select();
      render.innerHTML = '';
    });
    list.appendChild(li);
  });
  if (result.length == 1) {
    if (result[0]['Id'].toString() == evt.target.value || result[0]['City'].toLowerCase() == evt.target.value.toLowerCase()) {
      evt.target.value = result[0]['City'];
      inputCityId.value = result[0]['Id'];
    } 
  }
  if (cities.length > 0) {
    length.innerText = 'Показано ' + sliced.length + ' из ' + result.length + ' найденных городов';
  }
  if (result.length == 0 && cities.length > 0) {
    length.innerHTML = '<div>Не найдено</div>';
  }
  render.appendChild(list);
  list.appendChild(length);
  if (this.value == 0) {
    clean.appendChild(render);
    clean.innerHTML = '';
  }
  clearTimeout(validate);
  validate = setTimeout(validateCity, 2000, cities, evt);
}

input.addEventListener('click', loadCities);

input.addEventListener('input', showCities);

input.onfocus = function () {
  this.select();
}

input.addEventListener('error', function (evt) {
  console.log('error');
})