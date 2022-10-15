export const GET_PRODUCTS = "GET_PRODUCTS";
export const GET_PRODUCT = "GET_PRODUCT";
export const GET_DETAILS = "GET_DETAILS";




export const getAllProducts = ()=>{
    return {type: GET_PRODUCTS, payload: "All Products"}
}
export const getProduct = ()=>{
    return {type: GET_PRODUCT, payload: "Product ID"}
}


export const getDetails = (id)=> {
    return async function (dispatch) {
        try {
            var json = await axios.get("http://localhost:3001/product/"+ id)
            return dispatch({
                type: GET_DETAILS,
                payload: json.data
            })
        } catch (error) {
            console.log(error)
        }
    }
}