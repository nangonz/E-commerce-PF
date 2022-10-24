import React from 'react'
import axios from 'axios'
import useLoginEmail from '../../../utils/useLoginEmail'
import { useEffect } from 'react'
import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'




const OrderCard = () => {
    const { getAccessTokenSilently } = useAuth0()
    const userEmail = useLoginEmail()
    const [userOrders, setUserOrders] = useState([])


    async function getUserOrders() {
        const token = await getAccessTokenSilently()
        try {
            var result = await axios.get(`/order/email/${userEmail}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserOrders(result.data)
        } catch (error) {
            console.log("getUserOrders Error:", error)
        }
    }

    useEffect(() => {
        getUserOrders()
      },[])

    return (
        <div>
            <div className='col-12 mb-3'>
                { typeof userOrders === 'object' ? userOrders.map(order =>
                    <div key={order.id} className="card border-secondary p-2 shadow-sm mb-3">
                        <div className="row">
                            {/* Order ID */}
                            <div className="col-8">
                                <p className=' text-sm fw-semibold  bg-danger text-white px-2 w-25 text-center rounded rounded-pill'>Order ID: {order.id} </p>
                            </div>
                            {/* Order Status */}
                            <div className="col-4 text-danger fs-6 fw-bold">
                                <p> Order status: {order.status}  </p>
                            </div>
                            {/* shipping information */}  
                            <div className="col-6 mb-3">
                                <div className=' card position-relative mx-3 border border-danger'>
                                    <span class="position-absolute mx-5  top-0 start-0 translate-middle badge rounded-pill bg-danger">
                                        Shipping Information
                                    </span>
                                    <div className="row m-2">
                                            <div className="col-6 mt-1"><span>{order.shipping_address}</span></div>
                                    </div>
                                </div>
                            </div>
                            {/* Products */}
                                <div className="col-12 pb-2">
                                    <div className=' card position-relative mx-3 border border-danger'>
                                        <span class="position-absolute mx-3 mb-2 top-0 start-0 translate-middle badge rounded-pill bg-danger">
                                        Products
                                        </span>
                                        <span class="position-absolute mx-3 fs-6 px-3 top-100 start-50 translate-middle badge rounded-pill bg-danger">
                                            $ {order.total_payment}
                                        </span>
                                        <div className='m-2'>
                                            {order.Products.map(product =>
                                                <div key={product.id} className="row text-center">
                                                    <div className="col"><span className='fw-bold'>{product.name}</span> </div>
                                                    <div className="col"><span className='fw-bold'>{product.price}</span></div>
                                                    <div className="col"><span className='fw-bold'>{product.OrderDetail.units}</span></div>
                                                    <div className="col"><span className='fw-bold'>$ {product.OrderDetail.units * product.price}</span> </div>
                                                </div>
                                            )}
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ) : <p>Without Orders</p>
                }
            </div>
        </div>
    )
}
export default OrderCard;
