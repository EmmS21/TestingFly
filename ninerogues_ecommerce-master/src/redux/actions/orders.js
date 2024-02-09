import axios from 'axios';
import {
    GET_ORDERS_SUCCESS,
    GET_ORDERS_FAIL,
    GET_ORDER_DETAIL_SUCCESS,
    GET_ORDER_DETAIL_FAIL,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAIL,
    GET_ITEMS_ORDERS_SUCCESS,
    GET_ITEMS_ORDERS_FAIL,
    SEARCH_ORDER_SUCCESS,
    SEARCH_ORDER_FAIL
} from './types';


export const get_search_order = (search) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        search
    });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/search`, body, config);

        if (res.status === 200) {
            dispatch({
                type: SEARCH_ORDER_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: SEARCH_ORDER_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: SEARCH_ORDER_FAIL
        });
    }
}

export const get_item_order = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/get-all-items/`, config);

            if (res.status === 200) {
                dispatch({
                    type: GET_ITEMS_ORDERS_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: GET_ITEMS_ORDERS_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: GET_ITEMS_ORDERS_FAIL
            });
        }
    }
}

export const list_orders = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/get-orders`, config);

            if (res.status === 200) {
                dispatch({
                    type: GET_ORDERS_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: GET_ORDERS_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: GET_ORDERS_FAIL
            });
        }
    }
}
export const list_all_orders = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/get-all-orders/`, config);

            if (res.status === 200) {
                dispatch({
                    type: GET_ORDERS_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: GET_ORDERS_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: GET_ORDERS_FAIL
            });
        }
    }
}
export const update_order_status = (transactionId, status) => async dispatch => {

    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',

            }
        };

        const body = JSON.stringify({
            status
        });

        try {
            const res = await axios.patch(`${process.env.REACT_APP_API_URL}/api/orders/admin-orders/${transactionId}`, body, config);

            if (res.status === 200) {
                dispatch({
                    type: UPDATE_ORDER_STATUS_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: UPDATE_ORDER_STATUS_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: UPDATE_ORDER_STATUS_FAIL
            });
        }

    }
}

export const get_order_detail = transactionId => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/get-order/${transactionId}`, config);

            if (res.status === 200) {
                dispatch({
                    type: GET_ORDER_DETAIL_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: GET_ORDER_DETAIL_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: GET_ORDER_DETAIL_FAIL
            });
        }
    }
}