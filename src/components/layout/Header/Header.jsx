import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.scss'
import { FaPhone } from "react-icons/fa6";
import { assets } from '../../assets/assets'
const Header = () => {
    return (
        <div className='header'>
            <div className="card">
                <img src= {assets.doctor} className="card-img w-50" alt="" />
                <div className="card-img-overlay w-50">
                    <h1 className="card-title">Get ready for your best ever medical service experience!</h1>
                    <p className="card-text">We use only the best quality materials on the market in order to provide the best products to our patients, So don’t worry about anything and book yourself.</p>
                    <button className='btn mt-3 me-3'>Book an appointment</button>
                    <button className='btn btn-outline mt-3'> <FaPhone/> Dental 24H Emergency</button>
                </div>
            </div>
            
        </div>
    )
}

export default Header
