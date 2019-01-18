'use strict';
import {
  popularCities,
  MSG_RELOAD,
  MSG_ERROR,
  TRY_LOAD,
  MAX_RESULT
} from './consts/consts.js';
import {
  getRandomInt
} from './helpers/helpers.js'
const clean = document.querySelector('#clean');
const renderContainer = document.querySelector('#render-city');
const inputCityId = renderContainer.querySelector('.input-city-id');
let cities = [];
const input = document.querySelector('.input-city');
let lock = false;
let noConnect;
let validate;


function toggleErrorNode(error = true) {
  if (!!renderContainer) {
    if (!!error) {
      renderContainer.classList.add('render-city_error');
    } else {
      if (renderContainer.classList.contains('render-city_error')) {
        renderContainer.classList.remove('render-city_error');
      }
    }
  }
}

/*
  Проверка на наличие подходящих совпадений города
*/
function validateCity(cities, e) {
  let foundCity = 0;
  cities.forEach(function (city) {
    const cityLabel = `${city['Id']} ${city['City']}`;
    const userInputField = `${inputCityId.value} ${e.target.value}`;
    if (!!cityLabel && !!userInputField && cityLabel === userInputField) {
      console.log(cityLabel);
      foundCity += 1;
    }
    if (foundCity === 0) {
      toggleErrorNode();
    } else {
      toggleErrorNode(false);
    }
  })
  console.log(foundCity);
}

/*
  Проверка на наличие подходящих совпадений города end
*/

/*
  Сообщение об ошибке
*/
function msgError() {
  // clearTimeout(noConnect);
  if (!!renderContainer.querySelector('.rendered')) {
    noConnect = setTimeout(function () {
      renderContainer.querySelector('.rendered').innerHTML = MSG_ERROR;
    }, 5000)
  }
};

/* Сообщение об ошибке end */

/*
  Загрузка городов
*/
function loadCities(e) {
  if (!lock) {
    fetch('./data.json')
      .then(res => {
        /* Disable error simulation
        if (Math.random() > 0.5) {
          throw new Error(TRY_LOAD);
        }
        */
        lock = true;
        setTimeout(function () {
          return res.json()
            .then(res => {
              cities = res;
              console.log(cities);
            })
        }, getRandomInt(1000, 2000));
      })
      .catch(e => {
        console.error(e);
        msgError();
        console.info(MSG_RELOAD);
        setTimeout(function () {
          input.click();
        }, 10000)
      });
  }
}
/* Загрузка городов end */


/*
  Показать популярные города
*/
function showPopularCities(e) {
  let render = document.createElement('div');
  render.classList.add('rendered');
  renderContainer.appendChild(render);
  let list = document.createElement('div');
  list.classList.add('rendered__contain');
  let popularCitiesLabel = document.createElement('div');
  popularCitiesLabel.classList.add('render-city__popular-label');
  popularCitiesLabel.innerHTML = 'Популярные города';
  list.appendChild(popularCitiesLabel);
  popularCities.forEach(function (el) {
    let li = document.createElement('div');
    li.classList.add('rendered__element');
    const idCity = `${el['Id']} ${el['City']}`;
    li.innerText = idCity;
    li.addEventListener('click', function () {
      inputCityId.value = el['Id'];
      input.value = el['City'];
      clean.appendChild(render);
      clean.innerHTML = '';
      validateCity(cities, e);
    });
    list.appendChild(li);
  });
  render.appendChild(list);
}

/*
  Показать популярные города end
*/

/*
  Показать города
*/
function showCities(e) {
  if (!!renderContainer.querySelector('.rendered')) {
    clean.appendChild(renderContainer.querySelector('.rendered'));
    clean.innerHTML = '';
  }
  let render = document.createElement('div');

  render.classList.add('rendered');
  renderContainer.appendChild(render);
  render.innerHTML = '';
  let result = '';
  const length = document.createElement('div');
  length.classList.add('rendered__length');

  if (cities.length === 0) {
    length.innerHTML = '<div class="loader"></div><div>Загрузка</div>';
    msgError();
  };
  result = cities.filter(function (el) {
    return el['Id'].toString().startsWith(e.target.value) ||
      el['City'].toLowerCase().startsWith(e.target.value.toLowerCase());
  });
  let sliced = result.slice(0, MAX_RESULT);
  let list = document.createElement('div');
  list.classList.add('rendered__contain');
  sliced.forEach(function (el) {
    let li = document.createElement('div');
    li.classList.add('rendered__element');
    const idCity = `${el['Id']} ${el['City']}`;
    li.innerText = idCity;
    li.addEventListener('click', function () {
      inputCityId.value = el['Id'];
      input.value = el['City'];
      clean.appendChild(render);
      clean.innerHTML = '';
      validateCity(cities, e);
    });
    list.appendChild(li);
  });
  if (result.length === 1) {
    const firstResultId = result[0]['Id'];
    const firstResultCity = result[0]['City'].toLowerCase();
    if (firstResultId.toString() === e.target.value ||
      firstResultCity === e.target.value.toLowerCase()) {
      e.target.value = result[0]['City'];
      inputCityId.value = firstResultId;
    }
  }
  if (cities.length > 0) {
    length.innerText = `Показано ${sliced.length} из ${result.length} найденных городов`;
  }
  if (result.length === 0 && cities.length > 0) {
    length.innerHTML = '<div>Не найдено</div>';
  }
  render.appendChild(list);
  list.appendChild(length);
  if (this.value === 0) {
    clean.appendChild(render);
    clean.innerHTML = '';
    // showPopularCities(e);
  }
  clearTimeout(validate);
  validate = setTimeout(validateCity, 2000, cities, e);
}

/*
  Показать города end
*/

// events

input.addEventListener('click', loadCities);

input.addEventListener('click', function (e) {
  showPopularCities(e);
})

input.addEventListener('input', showCities);

input.onfocus = function () {
  this.select();
}

input.onblur = function () {
  setTimeout(function () {
    try {
      clean.appendChild(renderContainer.querySelector('.rendered'));
      clean.innerHTML = '';
    } catch (err) {

    }
  }, 100);
}

input.addEventListener('error', function () {
  console.log('error');
})