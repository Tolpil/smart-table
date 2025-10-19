// Импортируем стили
import "./fonts/ys-display/fonts.css";
import "./style.css";

// Импортируем необходимые модули
import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Инициализируем работу с данными
const api = initData();

/**
 * Собирает и обрабатывает данные из формы
 * @returns {Object} - Объект с состоянием формы
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage, 10); // преобразуем в число
    const page = parseInt(state.page ?? 1, 10); // номер страницы по умолчанию 1

    return {
        ...state,
        rowsPerPage,
        page,
    };
}

/**
 * Перерисовывает состояние таблицы при изменениях
 * @param {HTMLButtonElement?} action - Действие, вызвавшее обновление
 */
async function render(action) {
    // Собираем состояние из формы
    let state = collectState();
    let query = {};

    // Применяем все фильтры и настройки
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    // Получаем данные с сервера
    const { total, items } = await api.getRecords(query);

    // Обновляем интерфейс
    updatePagination(total, query);
    sampleTable.render(items);
}

// Инициализируем таблицу
const sampleTable = initTable(
    {
        tableTemplate: "table",
        rowTemplate: "row",
        before: ["search", "header", "filter"],
        after: ["pagination"],
    },
    render
);

// Инициализируем пагинацию
const { applyPagination, updatePagination } = initPagination(sampleTable.pagination.elements, (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
});

// Инициализируем сортировку
const applySorting = initSorting([sampleTable.header.elements.sortByDate, sampleTable.header.elements.sortByTotal]);

// Инициализируем фильтрацию
const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);

// Инициализируем поиск
const applySearching = initSearching('search');

// Получаем корневой элемент приложения
const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

/**
 * Функция инициализации приложения
 * @returns {Promise} - Промис завершения инициализации
 */
async function init() {
    // Загружаем индексы
    const indexes = await api.getIndexes();

    // Обновляем индексы в фильтрах
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers,
    });
}

// Запускаем инициализацию и первый рендер
init().then(render);

/**
 * Общая структура приложения:
 * 1. Инициализация компонентов
 * 2. Настройка обработчиков
 * 3. Сбор и обработка данных
 * 4. Рендеринг интерфейса
 * 5. Обновление состояния
 */
