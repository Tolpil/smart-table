import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";
import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initFiltering} from "./components/filtering.js";

// Инициализируем API
const api = initData(sourceData);

// Получаем элементы DOM для пагинации
const paginationContainer = document.querySelector('.pagination');
const fromRow = paginationContainer.querySelector('.from-row');
const toRow = paginationContainer.querySelector('.to-row');
const totalRows = document.querySelector('.total-rows');

// Инициализируем пагинацию
const {applyPagination, updatePagination} = initPagination({
    pages: 5,
    fromRow,
    toRow,
    totalRows
}, (pageNum) => document.createElement('button'));

// Получаем элементы фильтрации
const filteringElements = {
    // Здесь должны быть ваши элементы фильтрации
    // Например:
    // sellerFilter: document.querySelector('#seller-filter'),
    // dateFilter: document.querySelector('#date-filter')
};

// Инициализируем фильтрацию
const {applyFiltering, updateIndexes} = initFiltering(filteringElements);

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    return {
        ...state
    };
}

async function render(action) {
    let state = collectState();
    let query = {};

    // Применяем фильтрацию
    query = applyFiltering(query, state, action);

    // Другие apply*
    // query = applySearching(query, state, action);
    // query = applySorting(query, state, action);

    // Применяем пагинацию
    query = applyPagination(query, state, action);

    // Получаем данные
    const {total, items} = await api.getRecords(query);

    // Обновляем пагинатор
    updatePagination(total, query);

    // Рендерим таблицу
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    // Другие параметры
}, render);

async function init() {
    // Получаем индексы
    const indexes = await api.getIndexes();
    
    // Обновляем индексы в фильтрах
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// Запускаем инициализацию
init().then(render);
