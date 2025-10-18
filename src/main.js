import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";
import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";

// Инициализируем API
const api = initData(sourceData);

// Получаем элементы DOM для пагинации
const paginationContainer = document.querySelector('.pagination');
const fromRow = paginationContainer.querySelector('.from-row');
const toRow = paginationContainer.querySelector('.to-row');
const totalRows = document.querySelector('.total-rows');

// Инициализируем пагинацию
const {applyPagination, updatePagination} = initPagination({
    pages: 5, // количество видимых страниц
    fromRow,
    toRow,
    totalRows
}, (pageNum) => {
    return document.createElement('button');
});

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    return {
        ...state
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let query = {}; // параметры запроса

    // Здесь будут применяться другие фильтры и сортировки
    // result = applySearching(result, state, action);
    // result = applyFiltering(result, state, action);
    // result = applySorting(result, state, action);

    // Применяем пагинацию к запросу
    query = applyPagination(query, state, action);

    // Получаем данные с учетом параметров
    const { total, items } = await api.getRecords(query);

    // Обновляем пагинатор
    updatePagination(total, query);

    // Рендерим таблицу
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: [],
    after: []
}, render);

// Асинхронная функция инициализации
async function init() {
    // Получаем индексы
    await api.getIndexes();
}

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// Запускаем инициализацию
init().then(render);
