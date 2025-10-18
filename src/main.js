import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
// @todo: подключение


// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

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
function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let result = [...data]; // копируем для последующего изменения
    
    // applyFilter(result, state.filter);
    // applySort(result, state.sort);
    // applyPagination(result, state.page);

    sampleTable.render(result)
}


const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: [],
    after: []
}, render);

// @todo: инициализация
// Отключена синхронная инициализация фильтра
// Будет заменена на асинхронную загрузку данных с сервера
// const applyFiltering = initFiltering({
//     data: data,
//     container: document.querySelector('.filter-container'),
//     onFilter: (filteredData) => {
//         // логика фильтрации
//     }
// });



const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
