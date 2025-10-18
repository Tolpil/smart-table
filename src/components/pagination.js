import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    let pageCount; // переменная для хранения количества страниц

    // Функция формирования параметров пагинации
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        // @todo: #2.6 — обработать действия
        if (action === 'prev') {
            page = Math.max(page - 1, 1);
        } else if (action === 'next') {
            page = Math.min(page + 1, pageCount);
        } else if (action === 'first') {
            page = 1;
        } else if (action === 'last') {
            page = pageCount;
        }

        return {
            ...query,
            limit,
            page
        };
    };

    // Функция обновления состояния пагинации
    const updatePagination = (total, { page, limit }) => {
        // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
        pageCount = Math.ceil(total / limit);

        // @todo: #2.4 — получить список видимых страниц и вывести их
        const visiblePages = getPages(pageCount, page, pages);

        // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
        fromRow.innerHTML = '';
        toRow.innerHTML = '';

        visiblePages.forEach((pageNum, index) => {
            const pageElement = createPage(pageNum);
            if (pageNum === page) {
                pageElement.classList.add('active');
            }
            if (index < pages / 2) {
                fromRow.appendChild(pageElement);
            } else {
                toRow.appendChild(pageElement);
            }
        });

        // @todo: #2.5 — обновить статус пагинации
        totalRows.textContent = total;
    };

    return {
        updatePagination,
        applyPagination
    };
};
