import Card from "../../public/card.svg"
import Bus from "../../public/bus.svg"
import Package from "../../public/package.svg"
import Headphone from "../../public/headphone.svg"
import Image from "next/image"
import { TfiAngleRight } from "react-icons/tfi";

const Footer = () => {
    return (
        <div className="bg-black text-white">
            <div className="border-b border-b-slate-300">
                <div className="flex items-center justify-between flex-wrap py-14 max-w-[1400px] mx-auto px-4">
                    <div className="flex items-center gap-10 mb-5">
                        <Image src={Card} alt="card" />
                        <span>100% SECURE PAYMENT</span>
                    </div>
                    <div className="flex items-center gap-10 mb-5">
                        <Image src={Bus} alt="bus" />
                        <span>FAST DELIVERY</span>
                    </div>
                    <div className="flex items-center gap-10 mb-5">
                        <Image src={Package} alt="package" />
                        <span>FREE & EASY RETURNS</span>
                    </div>
                    <div className="flex items-center gap-10 mb-5">
                        <Image src={Headphone} alt="headphone" />
                        <span>CUSTOMER SERVICE</span>
                    </div>
                </div>
            </div>
            <div className="py-16 max-w-[1400px] mx-auto px-4">
                <div className="flex flex-col items-center justify-center pb-14">
                    <h1 className="text-[22px] mb-5">GET TREND UPDATES, STYLE TIPS AND MORE</h1>
                    <p className="text-[#cccccc] mb-14">*Be inspired by the spirit of the season. Discover the new arrivals</p>
                    <div className="flex items-center border-b border-b-slate-300 max-w-[800px] w-full">
                        <input className="bg-black placeholder:text-white w-full border-none outline-none" placeholder="E-mail address" />
                        <TfiAngleRight className="w-3 h-3" />
                    </div>
                </div>
                <div className="flex items-start justify-between flex-wrap">
                    <div>
                        <h1 className="text-[22px] mb-3">ETTORE STORE</h1>
                        <p className="max-w-[300px] mb-5">Via Giulia 83, 00186 Roma, Italy, Europe +11 223345 66, +11 223345 66 ettore@example.com</p>
                    </div>
                    <div>
                        <h2 className="text-[22px] mb-3">CUSTOMER CARE</h2>
                        <ul className="space-y-2 mb-3">
                            <li>Contact Us</li>
                            <li>Shipping</li>
                            <li>Order & Payments</li>
                            <li>Returns</li>
                            <li>World Wide Delivery</li>
                            <li>Track Your Order</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-[22px] mb-3">ABOUT STORE</h2>
                        <ul className="space-y-3 mb-3">
                            <li>Loyality Programme</li>
                            <li>About Us</li>
                            <li>Boutique Partners</li>
                            <li>Careers</li>
                            <li>Store Locator</li>
                            <li>History</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-[22px] mb-3">LEGAL AREA</h2>
                        <ul className="space-y-3 mb-3">
                            <li>Terms & Conditions Of Use</li>
                            <li>Return Policy</li>
                            <li>Privacy Policy</li>
                            <li>Cookie Settings</li>
                            <li>Conditions Of Sale</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="max-w-[1400px] mx-auto flex items-center px-4 justify-between flex-wrap pb-4">
                <p>© 2024 Qode Interactive, All Rights Reserved</p>
                <div className="flex items-center gap-4">
                    <p>Instagram</p>
                    <p>Facebook</p>
                    <p>Twitter</p>
                </div>
            </div>
        </div>
    )
}

export default Footer