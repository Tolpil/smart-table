import {makeIndex} from "./lib/utils.js";

// Добавляем константу с адресом сервера
const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData(sourceData) {
    // Переменные для кеширования данных
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    // Функция для преобразования данных в нужный формат
    const mapRecords = (data) => data.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));

    // Функция получения индексов
    const getIndexes = async () => {
        try {
            if (!sellers || !customers) {
                // Если индексы не загружены, делаем запросы
                [sellers, customers] = await Promise.all([
                    fetch(`${BASE_URL}/sellers`)
                        .then(res => res.json())
                        .then(data => makeIndex(data, 'id', v => `${v.first_name} ${v.last_name}`)),
                    
                    fetch(`${BASE_URL}/customers`)
                        .then(res => res.json())
                        .then(data => makeIndex(data, 'id', v => `${v.first_name} ${v.last_name}`))
                ]);
            }
            
            return { sellers, customers };
        } catch (error) {
            console.error('Ошибка получения индексов:', error);
            throw error;
        }
    };

    // Функция получения записей
    const getRecords = async (query, isUpdated = false) => {
        try {
            const qs = new URLSearchParams(query);
            const nextQuery = qs.toString();

            if (lastQuery === nextQuery && !isUpdated) {
                return lastResult;
            }

            const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
            const records = await response.json();

            lastQuery = nextQuery;
            lastResult = {
                total: records.total,
                items: mapRecords(records.items)
            };

            return lastResult;
        } catch (error) {
            console.error('Ошибка получения записей:', error);
            throw error;
        }
    };

    return {
        getIndexes,
        getRecords
    };
}
