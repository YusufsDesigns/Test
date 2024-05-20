"use client"

import { Cinzel } from "next/font/google";
import Navbar from "../shared/Navbar"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"
import { useEffect, useState } from "react";


const cinzel = Cinzel({ subsets: ["latin"] });

const Hero = () => {
    const [isOn, setIsOn] = useState(false)

    useEffect(() => {
        setIsOn(true)
    }, [])
    return (
        <div className="h-screen md:h-full lg:h-screen w-full flex flex-col lg:flex-row items-center">
            <Navbar />
            <div className="h-full  md:h-screen lg:h-full w-full lg:flex-1">
                <motion.div 
                    initial={{ width: 0, originX: 1 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 0.5 }}
                    className="bg-left flex flex-col items-center justify-end pb-5 md:pb-24 h-full"
                >
                    <h1 className={cn(cinzel.className, "text-white text-4xl md:text-[55px] font-semibold tracking-[0.55px] mb-2 text-center")}>MEN’S ESSENTIALS</h1>
                    <Button variant="outline" size="lg" className="text-xs bg-transparent rounded-sm text-white px-20 py-7 border-white">READ MORE INFO</Button>
                </motion.div>
            </div>
            <div className="h-full  md:h-screen lg:h-full w-full lg:flex-1">
                <motion.div
                    initial={{ width: 0, originX: 1 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 0.5 }}
                    className="bg-right flex flex-col items-center justify-center h-full"
                >
                    <motion.p
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-white text-lg text-center tracking-wide font-medium max-w-[400px]">BE INSPIRED BY THE LATEST CREATIONS FOR THE SEASON, DISCOVER THE MAGIC</motion.p>
                </motion.div>
            </div>
        </div>
    )
}

export default Hero