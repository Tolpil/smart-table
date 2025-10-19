/**
 * Инициализирует функционал фильтрации данных
 * @param {Object} elements - Объект с DOM-элементами для фильтрации
 * @returns {Object} - Объект с методами управления фильтрацией
 */
export function initFiltering(elements) {
    /**
     * Заполняет селекты опциями на основе переданных индексов
     *
     * @param {Object} elements - Объект с DOM-элементами
     * @param {Object} indexes - Объект с данными для заполнения селектов
     */
    const updateIndexes = (elements, indexes) => {
        // Проходим по всем элементам индексов
        Object.keys(indexes).forEach((elementName) => {
            // Добавляем опции в соответствующий селект
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map((name) => {
                    // Создаем новый элемент option
                    const el = document.createElement("option");
                    el.textContent = name; // Устанавливаем текст опции
                    el.value = name; // Устанавливаем значение опции
                    return el; // Возвращаем созданный элемент
                })
            );
        });
    };

    /**
     * Применяет фильтрацию к данным
     *
     * @param {Object} query - Текущий запрос
     * @param {Object} state - Состояние фильтрации
     * @param {Object} action - Действие, вызвавшее фильтрацию
     * @returns {Object} - Обновленный запрос с фильтрами
     */
    const applyFiltering = (query, state, action) => {
        // Обработка действия очистки фильтра
        if (action && action.name === "clear") {
            // Получаем input элемент и имя поля
            const input = action.parentElement.querySelector("input");
            const fieldName = action.dataset.field;

            // Очищаем значение input и состояние
            if (input) {
                input.value = "";
                state[fieldName] = "";
            }
        }

        // Создаем объект для хранения фильтров
        const filter = {};

        // Проходим по всем элементам фильтрации
        Object.keys(elements).forEach((key) => {
            if (elements[key]) {
                // Проверяем, что элемент является INPUT или SELECT и имеет значение
                if (["INPUT", "SELECT"].includes(elements[key].tagName) && elements[key].value) {
                    // Формируем ключ для фильтра в формате filter[имя]
                    filter[`filter[${elements[key].name}]`] = elements[key].value;
                }
            }
        });

        // Возвращаем обновленный запрос с фильтрами
        // Если фильтры есть - объединяем их с текущим запросом
        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    // Экспортируем методы управления фильтрацией
    return {
        updateIndexes,
        applyFiltering,
    };
}
