import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import CheckoutForm from "./CheckoutForm.jsx";



export default function PaymentCard() {
    return(
        <div>
            <CheckoutForm/>
        </div>
    )
}