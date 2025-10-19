import { sortMap } from "../lib/sort.js";

/**
 * Инициализирует функционал сортировки данных
 *
 * @param {Array} columns - Массив кнопок сортировки (DOM-элементы)
 * @returns {Function} - Функция обработки сортировки
 */
export function initSorting(columns) {
    /**
     * Обрабатывает сортировку данных
     *
     * @param {Object} query - Текущий запрос
     * @param {Object} state - Состояние приложения
     * @param {Object} action - Действие сортировки (событие)
     * @returns {Object} - Обновленный запрос с параметрами сортировки
     */
    return (query, state, action) => {
        let field = null; // Поле для сортировки
        let order = null; // Направление сортировки

        // Обработка действия сортировки
        if (action && action.name === "sort") {
            // Запоминаем выбранный режим сортировки
            action.dataset.value = sortMap[action.dataset.value]; // Применяем следующее состояние из карты
            field = action.dataset.field; // Получаем поле сортировки из датасета
            order = action.dataset.value; // Получаем направление сортировки

            // Сброс сортировки для остальных колонок
            columns.forEach((column) => {
                // Перебираем все кнопки сортировки
                if (column.dataset.field !== action.dataset.field) {
                    // Если это не текущая колонка
                    column.dataset.value = "none"; // Сбрасываем состояние
                }
            });
        } else {
            // Получаем текущий режим сортировки
            columns.forEach((column) => {
                // Ищем активную колонку сортировки
                if (column.dataset.value !== "none") {
                    field = column.dataset.field; // Сохраняем поле
                    order = column.dataset.value; // Сохраняем направление
                }
            });
        }

        // Формируем параметр сортировки
        const sort =
            field && order !== "none"
                ? `${field}:${order}` // Формат: поле:направление
                : null;

        // Возвращаем обновленный запрос
        return sort
            ? Object.assign({}, query, { sort }) // Добавляем параметр сортировки
            : query; // Возвращаем исходный запрос
    };
}

/**
 * Логика работы:
 * 1. Функция принимает массив кнопок сортировки
 * 2. Возвращает обработчик, который:
 *    - обрабатывает действия сортировки
 *    - управляет состоянием сортировки
 *    - обновляет параметры запроса
 * 3. Поддерживает:
 *    - переключение направления сортировки
 *    - сброс сортировки для неактивных колонок
 *    - получение текущего состояния сортировки
 */
