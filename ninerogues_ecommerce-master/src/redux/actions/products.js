import axios from 'axios';
import {
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAIL,
    GET_PRODUCTS_BY_ARRIVAL_SUCCESS,
    GET_PRODUCTS_BY_ARRIVAL_FAIL,
    GET_PRODUCTS_BY_SOLD_SUCCESS,
    GET_PRODUCTS_BY_SOLD_FAIL,
    GET_PRODUCT_SUCCESS,
    GET_PRODUCT_FAIL,
    SEARCH_PRODUCTS_SUCCESS,
    SEARCH_PRODUCTS_FAIL,
    RELATED_PRODUCTS_SUCCESS,
    RELATED_PRODUCTS_FAIL,
    FILTER_PRODUCTS_SUCCESS,
    FILTER_PRODUCTS_FAIL,
    POST_PRODUCTS_SUCCESS,
    POST_PRODUCTS_FAIL,
    DELETE_PRODUCTS_SUCCESS,
    DELETE_PRODUCTS_FAIL,
    UPDATE_PRODUCTS_SUCCESS,
    UPDATE_PRODUCTS_FAIL
} from './types';

export const get_products = (
    name,
    description,
    price,
    quantity,
    category,
    photo
) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/get-products`, config);

        if (res.status === 200) {
            dispatch({
                type: GET_PRODUCTS_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_PRODUCTS_FAIL
            });
        }

    } catch (err) {
        dispatch({
            type: GET_PRODUCTS_FAIL
        });
    }
}

export const post_product = (
    name,
    photo,
    description,
    price,
    category,
    quantity,
    sold
) => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        const body = new FormData();
        body.append('name', name);
        body.append('description', description);
        body.append('price', price);
        body.append('compare_price', price);
        body.append('quantity', quantity);
        body.append('category', category);
        body.append('sold', sold);
        body.append('photo', photo);
        body.append('get_thumbnail', photo);
        console.log([...body])
         try {
             const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/product/new-product/`,
                body,
                config
            );

            if (res.status === 201) {
                dispatch({
                    type: POST_PRODUCTS_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: POST_PRODUCTS_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: POST_PRODUCTS_FAIL
            });
        }
    }
}

export const delete_product = (productId,) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/product/admin-product/${productId}`, config);

        if (res.status === 200) {
            dispatch({
                type: DELETE_PRODUCTS_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: DELETE_PRODUCTS_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: DELETE_PRODUCTS_FAIL
        });
    }
}

export const update_product = (
    productId,
    name,
    description,
    price,
    category,
    quantity,
    sold
    ) => async dispatch =>{

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify({
            name,
            description,
            price,
            category,
            quantity,
        });

        console.log([...body])
        console.log(productId)
         try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/product/admin-product/${productId}`, body, config);

            if (res.status === 200) {
                dispatch({
                    type: UPDATE_PRODUCTS_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: UPDATE_PRODUCTS_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: UPDATE_PRODUCTS_FAIL
            });
        }

    
}

export const get_products_by_arrival = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/get-products?sortBy=date_created&order=desc&limit=3`, config);

        if (res.status === 200) {
            dispatch({
                type: GET_PRODUCTS_BY_ARRIVAL_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_PRODUCTS_BY_ARRIVAL_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GET_PRODUCTS_BY_ARRIVAL_FAIL
        });
    }
}

export const get_products_by_sold = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/get-products?sortBy=sold&order=desc&limit=3`, config);

        if (res.status === 200) {
            dispatch({
                type: GET_PRODUCTS_BY_SOLD_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_PRODUCTS_BY_SOLD_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GET_PRODUCTS_BY_SOLD_FAIL
        });
    }
}

export const get_product = (productId) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/product/${productId}`, config);

        if (res.status === 200) {
            dispatch({
                type: GET_PRODUCT_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_PRODUCT_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GET_PRODUCT_FAIL
        });
    }
}

export const get_related_products = (productId) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/related/${productId}`, config);

        if (res.status === 200 && !res.data.error) {
            dispatch({
                type: RELATED_PRODUCTS_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: RELATED_PRODUCTS_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: RELATED_PRODUCTS_FAIL
        });
    }
}


export const get_filtered_products = (category_id, price_range, sort_by, order) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        category_id,
        price_range,
        sort_by,
        order
    });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/product/by/search`, body, config);

        if (res.status === 200 && !res.data.error) {
            dispatch({
                type: FILTER_PRODUCTS_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: FILTER_PRODUCTS_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: FILTER_PRODUCTS_FAIL
        });
    }
}

export const get_search_products = (search, category_id) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        search,
        category_id
    });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/product/search`, body, config);

        if (res.status === 200) {
            dispatch({
                type: SEARCH_PRODUCTS_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: SEARCH_PRODUCTS_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: SEARCH_PRODUCTS_FAIL
        });
    }
}