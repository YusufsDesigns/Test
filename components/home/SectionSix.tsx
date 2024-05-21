"use client"

import { motion } from "framer-motion"


const SectionSix = () => {
    return (
        <div className="h-screen md:h-full lg:h-screen w-full flex flex-col lg:flex-row items-center">
            <div className="h-full  md:h-screen lg:h-full w-full lg:flex-1 lg:px-3">
                <motion.div 
                    initial={{ width: 0, originX: 1 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 0.5 }}
                    className="bg-left-2 flex flex-col items-center justify-end pb-5 md:pb-24 h-full"
                />
            </div>
            <div className="h-full  md:h-screen lg:h-full w-full lg:flex-1">
                <motion.div
                    initial={{ width: 0, originX: 1 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 0.5 }}
                    className="bg-right-2 flex flex-col items-center justify-center h-full"
                >
                    <motion.p
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-white text-lg text-center tracking-wide font-medium max-w-[400px]">BE 
                        BEAUTY IS THE SYMBOL – GET INSPIRED BY THE LATEST CREATIONS FOR THE SEASON</motion.p>
                </motion.div>
            </div>
        </div>
    )
}

export default SectionSix