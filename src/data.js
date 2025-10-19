import { makeIndex } from "./lib/utils.js";

// Базовый URL для API запросов
const BASE_URL = "https://webinars.webdev.education-services.ru/sp7-api";

/**
 * Инициализирует работу с данными
 * @returns {Object} - Объект с методами для работы с данными
 */
export function initData() {
    // Переменные для кеширования данных
    let sellers; // Индексы продавцов
    let customers; // Индексы покупателей
    let lastResult; // Последние полученные данные
    let lastQuery; // Последний использованный запрос

    /**
     * Преобразует сырые данные в формат, подходящий для отображения в таблице
     * @param {Array} data - Массив исходных данных
     * @returns {Array} - Массив подготовленных записей
     */
    const mapRecords = (data) =>
        data.map((item) => ({
            id: item.receipt_id,
            date: item.date,
            seller: sellers[item.seller_id],
            customer: customers[item.customer_id],
            total: item.total_amount,
        }));

    /**
     * Загружает индексы продавцов и покупателей
     * @returns {Promise<Object>} - Объект с индексами
     */
    const getIndexes = async () => {
        // Проверяем, загружены ли индексы
        if (!sellers || !customers) {
            // Если нет, выполняем параллельные запросы
            [sellers, customers] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then((res) => res.json()), // Загружаем данные продавцов
                fetch(`${BASE_URL}/customers`).then((res) => res.json()), // Загружаем данные покупателей
            ]);
        }

        return { sellers, customers };
    };

    /**
     * Получает записи о продажах с сервера
     * @param {Object} query - Параметры запроса
     * @param {boolean} isUpdated - Флаг принудительного обновления
     * @returns {Promise<Object>} - Объект с данными
     */
    const getRecords = async (query, isUpdated = false) => {
        // Преобразуем параметры в URLSearchParams
        const qs = new URLSearchParams(query);
        const nextQuery = qs.toString();

        // Проверяем кеш
        if (lastQuery === nextQuery && !isUpdated) {
            return lastResult; // Возвращаем кешированные данные
        }

        // Выполняем запрос к серверу
        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        const records = await response.json();

        // Сохраняем результат для кеширования
        lastQuery = nextQuery;
        lastResult = {
            total: records.total,
            items: mapRecords(records.items),
        };

        return lastResult;
    };

    return {
        getIndexes,
        getRecords,
    };
}

/**
 * Описание функционала:
 * 1. Управление кешем данных
 * 2. Преобразование сырых данных в удобный формат
 * 3. Загрузка индексов продавцов и покупателей
 * 4. Получение записей с учетом кеширования
 * 5. Работа с API через асинхронные запросы
 */
