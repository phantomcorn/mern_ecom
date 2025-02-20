import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import Cart from './Cart';

export default function Main() {

    return (
        <div className="App">
            <Link to="product">Products</Link>
            <Cart/>
        </div>
    )
}