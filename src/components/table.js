import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и обрабатывает события при изменениях и нажатиях на кнопки
 *
 * @param {Object} settings - Настройки таблицы
 * @param {Function} onAction - Колбэк для обработки действий
 * @returns {Object} - Объект с контейнером, элементами и методом рендеринга
 */
export function initTable(settings, onAction) {
    // Разбираем настройки на составляющие
    const { tableTemplate, rowTemplate, before, after } = settings;

    // Клонируем основной шаблон таблицы
    const root = cloneTemplate(tableTemplate);

    /**
     * Добавление дополнительных шаблонов до таблицы
     * Обрабатываем в обратном порядке для корректного отображения
     */
    before.reverse().forEach((templateId) => {
        root[templateId] = cloneTemplate(templateId);
        root.container.prepend(root[templateId].container);
    });

    /**
     * Добавление дополнительных шаблонов после таблицы
     */
    after.forEach((templateId) => {
        root[templateId] = cloneTemplate(templateId);
        root.container.append(root[templateId].container);
    });

    /**
     * Обработка событий на контейнере таблицы
     */
    root.container.addEventListener("change", onAction);

    root.container.addEventListener("reset", () => {
        setTimeout(onAction);
    });

    root.container.addEventListener("submit", (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    /**
     * Метод рендеринга данных в таблицу
     *
     * @param {Array} data - Массив данных для отображения
     * @returns {void}
     */
    const render = (data) => {
        // Преобразуем данные в массив строк
        const nextRows = data.map((item) => {
            const row = cloneTemplate(rowTemplate);

            // Заполняем ячейки данными
            Object.keys(item).forEach((key) => {
                if (row.elements && row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });

            return row.container;
        });

        // Обновляем содержимое таблицы
        root.elements.rows.replaceChildren(...nextRows);
    };

    // Возвращаем основной объект с методами и свойствами
    return {
        ...root,
        render,
    };
}

/**
 * Описание логики работы:
 * 1. Инициализация основного контейнера таблицы
 * 2. Добавление дополнительных шаблонов (до и после таблицы)
 * 3. Настройка обработчиков событий
 * 4. Реализация метода рендеринга данных
 * 5. Возврат объекта с основными методами и свойствами
 */
