// components/sorting.js

import {sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        // Обработка действия сортировки
        if (action && action.name === 'sort') {
            // Получаем параметры сортировки из действия
            field = action.field;
            order = action.order || 'asc'; // по умолчанию сортировка по возрастанию
            
            // Сбрасываем сортировки остальных колонок
            Object.keys(columns).forEach(col => {
                if (col !== field) {
                    columns[col].order = 'none';
                }
            });
            
            // Сохраняем текущий порядок сортировки
            columns[field].order = order;
        } else {
            // Получаем сохраненный порядок сортировки
            Object.keys(columns).forEach(col => {
                if (columns[col].order !== 'none') {
                    field = col;
                    order = columns[col].order;
                }
            });
        }

        // Формируем параметр сортировки
        const sort = (field && order !== 'none') ? `${field}:${order}` : null;

        // Возвращаем модифицированный query
        return sort ? Object.assign({}, query, { sort }) : query;
    }
}
