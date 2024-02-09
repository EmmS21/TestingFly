import {
    GET_ORDERS_SUCCESS,
    GET_ORDERS_FAIL,
    GET_ORDER_DETAIL_SUCCESS,
    GET_ORDER_DETAIL_FAIL,
    UPDATE_ORDER_STATUS_FAIL,
    UPDATE_ORDER_STATUS_SUCCESS,
    GET_ITEMS_ORDERS_SUCCESS,
    GET_ITEMS_ORDERS_FAIL,
    SEARCH_ORDER_SUCCESS,
    SEARCH_ORDER_FAIL
} from '../actions/types';

const initialState = {
    orders: null,
    order: null,
    search_orders: null,
    items: null
};


export default function Orders(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_ORDERS_SUCCESS:
            return {
                ...state,
                orders: payload.orders
            }
        case GET_ITEMS_ORDERS_SUCCESS:
            return {
                ...state,
                items: payload.items
            }
        case GET_ITEMS_ORDERS_FAIL:
            return {
                ...state,
                items: []
            }
        case UPDATE_ORDER_STATUS_SUCCESS:
            return {
                ...state,
                order: payload.order
            }
        case UPDATE_ORDER_STATUS_FAIL:
            return {
                ...state,
                order: []
            }
        case GET_ORDERS_FAIL:
            return {
                ...state,
                orders: []
            }
        case GET_ORDER_DETAIL_SUCCESS:
            return {
                ...state,
                order: payload.order
            }
        case GET_ORDER_DETAIL_FAIL:
            return {
                ...state,
                order: {}
            }
        case SEARCH_ORDER_SUCCESS:
            return {
                ...state,
                search_orders: payload.search_orders
            }
        case SEARCH_ORDER_FAIL:
            return {
                ...state,
                search_orders: null
            }
        default:
            return state;
    }
}