import { GET_PRODUCTS, GET_DETAILS, DELETE_PRODUCT, ADD_CART , DELETE_CART, CLEAR_CART, GET_ITEMS_LOCAL, SET_TOTAL_PAYMENT, SET_CURRENT_ORDER} from "./actions";

const stateInitial = {
    products: {},
    details: {},
    cart: [],
    totalPayment: 0,
    currentItem: null,
    currentOrder: {}
};

export default function rootReducer(state = stateInitial, action) {
    switch (action.type) {
        case GET_PRODUCTS:
            return {
                ...JSON.parse(JSON.stringify(state)),
                products: action.payload
            }
        case GET_DETAILS:
            return {
                ...JSON.parse(JSON.stringify(state)),
                details: action.payload
            }
        case DELETE_PRODUCT:
            return {
                ...JSON.parse(JSON.stringify(state)),
                products: state.products.filter((p) => p.id !== action.payload),
            }
        case ADD_CART:
            return {   
                ...JSON.parse(JSON.stringify(state)),
                cart: [...JSON.parse(JSON.stringify(state.cart)), action.payload]
            }
        case DELETE_CART:
            return {
                ...JSON.parse(JSON.stringify(state)),
                cart: state.cart.filter((p) => p.id !== action.payload)
            }
        case SET_TOTAL_PAYMENT:
            return {
                ...JSON.parse(JSON.stringify(state)),
                totalPayment: action.payload
            }
        case CLEAR_CART:
            return {
                ...JSON.parse(JSON.stringify(state)),
                cart: []
            }
        case GET_ITEMS_LOCAL:
            return {
                ...JSON.parse(JSON.stringify(state)),
                cart: action.payload,
            }
        case SET_CURRENT_ORDER:
            return {
                ...JSON.parse(JSON.stringify(state)),
                currentOrder: action.payload,
            }
        default:
            return state;
    }
}