import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";
import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initTable} from "./components/table.js";

// Инициализируем API
const api = initData(sourceData);

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
    let query = {}; // заменяем копирование данных на пустой объект запроса
    
    // Здесь будут применяться фильтры, сортировка и пагинация
    // applyFilter(query, state.filter);
    // applySort(query, state.sort);
    // applyPagination(query, state.page);

    // Получаем данные из API
    const { total, items } = await api.getRecords(query);
    
    sampleTable.render(items); // передаем items вместо result
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
    const indexes = await api.getIndexes();
    // Здесь можно добавить дальнейшую инициализацию
}

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// Заменяем прямой вызов render() на init().then(render)
init().then(render);
