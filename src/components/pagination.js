import { getPages } from "../lib/utils.js";

/**
 * Инициализирует функционал пагинации
 *
 * @param {Object} options - Настройки пагинации
 * @param {number} options.pages - Количество отображаемых страниц
 * @param {HTMLElement} options.fromRow - Контейнер для отображения номера начальной строки
 * @param {HTMLElement} options.toRow - Контейнер для отображения номера конечной строки
 * @param {HTMLElement} options.totalRows - Контейнер для отображения общего количества строк
 * @param {Function} createPage - Функция создания элемента страницы
 * @returns {Object} - Объект с методами управления пагинацией
 */
export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
    // Создаем шаблон кнопки страницы и очищаем контейнер
    // Используем первый элемент как шаблон и удаляем его из DOM
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    let pageCount = 0; // Общее количество страниц

    /**
     * Применяет параметры пагинации к запросу
     *
     * @param {Object} query - Текущий запрос
     * @param {Object} state - Состояние пагинации
     * @param {Object} action - Действие навигации (кнопки)
     * @returns {Object} - Обновленный запрос с параметрами пагинации
     */
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage; // Количество элементов на странице
        let page = state.page; // Текущая страница

        // Обработка действий навигации
        if (action) {
            switch (action.name) {
                case "prev":
                    // Переход на предыдущую страницу
                    page = Math.max(1, page - 1);
                    break;
                case "next":
                    // Переход на следующую страницу
                    page = Math.min(pageCount, page + 1);
                    break;
                case "first":
                    // Переход на первую страницу
                    page = 1;
                    break;
                case "last":
                    // Переход на последнюю страницу
                    page = pageCount;
                    break;
            }
        }

        // Возвращаем новый объект с параметрами пагинации
        return Object.assign({}, query, {
            limit,
            page,
        });
    };

    /**
     * Обновляет состояние пагинации
     *
     * @param {number} total - Общее количество элементов
     * @param {Object} params - Параметры пагинации
     * @param {number} params.page - Текущая страница
     * @param {number} params.limit - Количество элементов на странице
     */
    const updatePagination = (total, { page, limit }) => {
        // Рассчитываем общее количество страниц
        pageCount = Math.ceil(total / limit);

        // Получаем список видимых страниц
        const visiblePages = getPages(page, pageCount, 5);

        // Обновляем отображение страниц
        pages.replaceChildren(
            ...visiblePages.map((pageNumber) => {
                const el = pageTemplate.cloneNode(true); // Клонируем шаблон
                return createPage(el, pageNumber, pageNumber === page);
            })
        );

        // Обновляем статус пагинации
        fromRow.textContent = (page - 1) * limit + 1; // Начальная строка
        toRow.textContent = Math.min(page * limit, total); // Конечная строка
        totalRows.textContent = total; // Общее количество строк
    };

    return {
        updatePagination,
        applyPagination,
    };
};
