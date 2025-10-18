export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор (удаляем этот код, так как компаратор больше не нужен)

    return (query, state, action) => {
        // @todo: #5.2 — применить поиск через параметры запроса
        return state[searchField] 
            ? Object.assign({}, query, {
                search: state[searchField]
            }) 
            : query;
    }
}
