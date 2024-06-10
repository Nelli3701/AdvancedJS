'use strict'

let containerEl;

/**
 * Загрузка данных из хранилища
 * @param {*} key ключ
 * @returns массив с данными по ключу
 */
const load = (key) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(localStorage.getItem(key)) || []);
        } catch (error) {
            reject(new Error('Could not found ' + key + ' in localStorage'));
        }
    });
}

/**
 * Сохранение в хранилище
 * @param {*} product 
 */
const save = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Создание главной страницы
 * @param {*} products список товаров
 */
const showIndex = (products) => {
    containerEl = document.querySelector('.container');
    containerEl.appendChild(createTitle('Список товаров'));

    const inputEl = document.createElement('input');
    containerEl.appendChild(inputEl);

    const newBtn = document.createElement('button');
    newBtn.innerText = "Добавить товар";
    newBtn.addEventListener('click', () => {
        const name = inputEl.value;
        try {
            checkItem(name);
            products.push(name);
            save('products', products);
            save(name, {
                name: name,
                reviews: []
            });
            productsUl.appendChild(createProduct(name));
            inputEl.value = '';
        } catch (error) {
            inputEl.classList.add('error');
            const errorMessageEl = document.createElement('p');
            errorMessageEl.classList.add('error__message');
            errorMessageEl.innerText = error.message;
            containerEl.appendChild(errorMessageEl);
        }

    });
    containerEl.appendChild(newBtn);

    const productsUl = document.createElement('ul');
    products.forEach(product => productsUl.appendChild(createProduct(product)));
    containerEl.appendChild(productsUl);
}

/**
 * Проверка нового товара на допустимость длины
 * @param {*} name назвае товара
 * @throws в случае недопустимой длины выбрасывается исключение
 */
const checkItem = (name) => {
    if (!name) throw new Error('Поле не может быть пустым');
}

/**
 * Создать заголовок страницы
 * @param {*} title заголовок
 * @returns h1 страницы
 */
const createTitle = (title) => {
    const titleEl = document.createElement('h1');
    titleEl.innerText = title;
    return titleEl;
}

/**
 * Создать продукт для индекса
 * @param {*} product данные о продукте
 * @returns li с сылкой на данные продукта
 */
const createProduct = (product) => {
    const productLi = document.createElement('li');
    const productLink = document.createElement('a');
    productLink.href = product;
    productLink.innerText = product;
    productLink.addEventListener('click', (e) => {
        e.preventDefault();
        load(product)
            .then(data => showProduct(data))
            .catch((error) => console.error(error.message));
    });
    productLi.appendChild(productLink);
    return productLi;
}

/**
 * Отобразить страницу продукта
 * @param {*} product данные выбранного товара
 */
const showProduct = (product) => {
    containerEl.innerHTML = '';

    containerEl.appendChild(createTitle(product.name));

    const uiBox = document.createElement('div');
    uiBox.className = 'ui-box';

    const textareaEl = document.createElement('textarea');
    textareaEl.classList.add('input');
    uiBox.appendChild(textareaEl);
    textareaEl.addEventListener('focus', () => {
        if (textareaEl.classList.contains('error')) {
            textareaEl.classList.remove('error');
        }
        const errorMessageEl = containerEl.querySelector('.error__message');
        if (errorMessageEl) {
            errorMessageEl.remove();
        }
    });
    const addBtn = document.createElement('button');
    addBtn.innerText = 'Отправить';
    addBtn.addEventListener('click', () => {
        const review = textareaEl.value;
        try {
            checkReview(review);
            product.reviews.push(review);
            save(product.name, product);
            reviewsUl.appendChild(createReview(product, review));
            textareaEl.value = '';
        } catch (error) {
            textareaEl.classList.add('error');
            const errorMessageEl = document.createElement('p');
            errorMessageEl.classList.add('error__message');
            errorMessageEl.innerText = error.message;
            uiBox.appendChild(errorMessageEl);
        }

    });

    uiBox.appendChild(addBtn);

    containerEl.appendChild(uiBox);

    const reviewsUl = document.createElement('ul');
    reviewsUl.classList.add('review-list');
    containerEl.appendChild(reviewsUl);

    product.reviews.forEach(review => reviewsUl.appendChild(createReview(product, review)));
}

/**
 * Создать отзыв
 * @param {*} text введённый текст отзыва
 * @returns li с отзывом
 */
const createReview = (product, text) => {
    const reviewLi = document.createElement('li');
    const reviewTextEl = document.createElement('p');
    reviewTextEl.innerText = text;
    reviewLi.appendChild(reviewTextEl);

    const delBtn = document.createElement('button');
    delBtn.innerText = 'Удалить отзыв';
    delBtn.addEventListener('click', () => {
        reviewLi.parentElement.removeChild(reviewLi);
        product.reviews.splice(product.reviews.indexOf(text), 1);
        save(product.name, product);
    });
    reviewLi.appendChild(delBtn);

    return reviewLi;
}


/**
 * Проверка нового отзыва на допустимость длины
 * @param {*} text новый отзыв
 * @throws в случае недопустимой длины выбрасывается исключение
 */
const checkReview = (text) => {
    if (text.length > 500 || text.length < 50) throw new Error('Длина должна быть не менее 50 и не более 500 символов');
}

/**
 * Стартовая загрузка
 */
document.addEventListener('DOMContentLoaded', function (e) {
    load('products')
        .then(data => showIndex(data))
        .catch(err => console.error(err.message));
});