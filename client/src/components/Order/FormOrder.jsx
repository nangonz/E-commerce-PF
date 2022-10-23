
import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FormOrder = (props) => {

    const { user } = useAuth0();
    const { getAccessTokenSilently } = useAuth0()

    useEffect(() => {
        try {
            const token = getAccessTokenSilently();
            const response = axios.get(`/user/${user.email}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            response.then(response => {
                setinputOrder(response.data)
            })
        } catch (error) {
            console.log(error)
        }
    }, [])

    async function saveUser(e) {
        e.preventDefault();
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.put(`/user/${user.email}`, inputOrder,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            if (response.status === 200) toast.success('Updated successfully');
        } catch (error) {
            console.log(error);
        }
    }

    const [inputOrder, setinputOrder] = useState({
        email: user ? user.email : '',
        name: user ? user.name : '',
        country: '',
        region: '',
        shipping_address: '',
        postal_code: '',
        phone: ''
    });

    const [errors, setErrors] = useState({

    })


    function validate(input) {
        if (input.email === '') {
            errors.email = 'Email is required';
        } else if (! /\S+@\S+\.\S+/.test(input.email)) {
            errors.email = 'Enter a valid email';
        } else {
            errors.email = '';
        }

        if (input.name === '') {
            errors.name = 'Contact Name is required';
        } else {
            errors.name = '';
        }

        if (input.country === '') {
            errors.country = 'country is required';
        } else {
            errors.country = '';
        }

        if (input.region === '') {
            errors.region = 'region is required';
        } else {
            errors.region = '';
        }

        if (input.shipping_address === '') {
            errors.shipping_address = 'Street Address is required';
        } else {
            errors.shipping_address = '';
        }

        if (input.postal_code === '') {
            errors.postal_code = 'Postal Code is required';
        } else {
            errors.postal_code = '';
        }

        if (input.phone === '') {
            errors.phone = 'Contact Number is required';
        } else {
            errors.phone = '';
        }
        return errors;
    }



    function handleChange(e) {
        e.preventDefault();
        setinputOrder({
            ...inputOrder,
            [e.target.name]: e.target.value
        })

        setErrors(
            validate({
                ...inputOrder,
                [e.target.name]: e.target.value
            })
        )
    }

    return (
        <>
            <form autoComplete='off' >
                <div className="form-floating mb-3">
                    <input type="email" className={errors.email ? "form-control border border-danger" : "form-control"} id="email" name='email' defaultValue={user.email} value={inputOrder.email} onChange={handleChange} />
                    <label htmlFor="email">Email</label>
                    {errors.email && <span className="ms-2 text-danger">{errors.email}</span>}
                </div>
                <div className="form-floating mb-3">
                    <input type="text" className={errors.contactName ? "form-control border border-danger" : "form-control"} id="contactName" name='contactName' defaultValue={user.name} value={inputOrder.contactName} onChange={handleChange} />
                    <label htmlFor="contactName"> Name</label>
                    {errors.name && <span className="ms-2 text-danger">{errors.name}</span>}
                </div>
                <div className="row mb-3">
                    <div className="col-6">
                        <div className="form-floating ">
                            <input type="text" className={errors.country ? "form-control border border-danger" : "form-control"} id="country" name='country' defaultValue={inputOrder.country} value={inputOrder.country} onChange={handleChange} />
                            <label htmlFor="floatingPassword">country</label>
                            {errors.country && <span className="ms-2 text-danger">{errors.country}</span>}
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-floating" >
                            <input type="text" className={errors.region ? "form-control border border-danger" : "form-control"} id="region" name='region' defaultValue={inputOrder.region} value={inputOrder.region} onChange={handleChange} />
                            <label htmlFor="floatingPassword">region or Region</label>
                            {errors.region && <span className="ms-2 text-danger">{errors.region}</span>}
                        </div>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-6">
                        <div className="form-floating ">
                            <input type="text" className={errors.shipping_address ? "form-control border border-danger" : "form-control"} id="shipping_address" name='shipping_address' value={inputOrder.shipping_address} onChange={handleChange} />
                            <label htmlFor="floatingPassword">Street Address</label>
                            {errors.shipping_address && <span className="ms-2 text-danger">{errors.shipping_address}</span>}
                        </div>
                    </div>
                    <div className="col-6 mb-3">
                        <div className="form-floating ">
                            <input type="number" className={errors.postal_code ? "form-control border border-danger" : "form-control"} id="postal_code" name='postal_code' value={inputOrder.postal_code} onChange={handleChange} />
                            <label htmlFor="floatingPassword">Postal Code</label>
                            {errors.postal_code && <span className="ms-2 text-danger">{errors.postal_code}</span>}
                        </div>
                    </div>
                    <div className="col-12 ">
                        <div className="form-floating ">
                            <input type="number" className={errors.phone ? "form-control border border-danger" : "form-control"} id="phone" name='phone' value={inputOrder.phone} onChange={handleChange} />
                            <label htmlFor="floatingPassword">Phone</label>
                            {errors.phone && <span className="ms-2 text-danger">{errors.phone}</span>}
                        </div>
                    </div>
                    <input onClick={saveUser} className='col btn btn-success mt-2 text-center mx-5' type="submit" value="Guardar" />
                </div>




            </form>


        </>
    )
}

export default FormOrder;