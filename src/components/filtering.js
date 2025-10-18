export function initFiltering(elements) {
    // Функция для обновления индексов в выпадающих списках
    const updateIndexes = (elements, indexes) => {
        // @todo: #4.1 — заполнить выпадающие списки опциями
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].innerHTML = ''; // Очищаем существующие опции
            
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }));
        });
    };

    // Функция применения фильтрации
    const applyFiltering = (query, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action === 'clear') {
            Object.keys(elements).forEach(key => {
                elements[key].value = '';
            });
            return query;
        }

        // @todo: #4.5 — отфильтровать данные, используя параметры запроса
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) {
                    filter[`filter[${elements[key].name}]`] = elements[key].value;
                }
            }
        });

        return Object.keys(filter).length 
            ? Object.assign({}, query, filter) 
            : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}
