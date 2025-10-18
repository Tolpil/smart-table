import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";
import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";
import {initSorting} from "./components/sorting.js";

// Инициализируем API
const api = initData(sourceData);

// Элементы пагинации
const paginationContainer = document.querySelector('.pagination');
const fromRow = paginationContainer.querySelector('.from-row');
const toRow = paginationContainer.querySelector('.to-row');
const totalRows = document.querySelector('.total-rows');

// Инициализация пагинации
const {applyPagination, updatePagination} = initPagination({
 pages: 5,
 fromRow,
 toRow,
 totalRows
}, (pageNum) => document.createElement('button'));

// Элементы фильтрации
const filteringElements = {
 // Пример элементов фильтрации
 // sellerFilter: document.querySelector('#seller-filter'),
 // dateFilter: document.querySelector('#date-filter')
};

// Инициализация фильтрации
const {applyFiltering, updateIndexes} = initFiltering(filteringElements);

// Инициализация поиска
const searchField = document.querySelector('#search-field');
const applySearching = initSearching(searchField.name);

// Инициализация сортировки
const columns = {
 // Конфигурация колонок для сортировки
 name: { order: 'none' },
 date: { order: 'none' },
 price: { order: 'none' },
 seller: { order: 'none' },
 client: { order: 'none' }
};
const applySorting = initSorting(columns);

function collectState() {
 const state = processFormData(new FormData(sampleTable.container));
 return {
 ...state
 };
}

async function render(action) {
 let state = collectState();
 let query = {};

 // Применяем сортировку
 query = applySorting(query, state, action);

 // Применяем поиск
 query = applySearching(query, state, action);

 // Применяем фильтрацию
 query = applyFiltering(query, state, action);

 // Применяем пагинацию
 query = applyPagination(query, state, action);

 // Получаем данные с сервера
 const {total, items} = await api.getRecords(query);

 // Обновляем пагинатор
 updatePagination(total, query);

 // Обновляем таблицу
 sampleTable.render(items);
}

const sampleTable = initTable({
 tableTemplate: 'table',
 rowTemplate: 'row',
 columns: columns, // передаем конфигурацию колонок
}, render);

async function init() {
 // Получаем индексы
 const indexes = await api.getIndexes();
 
 // Обновляем индексы в фильтрах
 updateIndexes(sampleTable.filter.elements, {
 searchBySeller: indexes.sellers
 });
}

// Инициализация приложения
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);
init().then(render);
