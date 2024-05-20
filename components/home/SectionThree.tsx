"use client"

import { motion } from "framer-motion"


const SectionThree = () => {
    return (
        <div>
            <motion.div 
                whileHover="hover"
                className="border-t border-y-black border-y relative"
            >
                <motion.h1
                    variants={{
                        hover: { color: '#fff' }
                    }}
                    className="max-w-7xl mx-auto px-2 text-4xl md:text-6xl py-5">ACCESSORIES</motion.h1>
                <motion.div 
                    initial={{ height: 0 }}
                    variants={{
                        hover: { height: '100%' }
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'bottom' }}
                    className="absolute top-1 left-0 w-full h-full bg-black -z-10" />
            </motion.div>
            <motion.div 
                whileHover="hover"
                className="border-t border-b-black border-b relative"
            >
                <motion.h1
                    variants={{
                        hover: { color: '#fff' }
                    }}
                    className="max-w-7xl mx-auto px-2 text-4xl md:text-6xl py-5">BEAUTY</motion.h1>
                <motion.div 
                    initial={{ height: 0 }}
                    variants={{
                        hover: { height: '100%' }
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'bottom' }}
                    className="absolute top-1 left-0 w-full h-full bg-black -z-10" />
            </motion.div>
            <motion.div 
                whileHover="hover"
                className="border-t border-b-black border-b relative"
            >
                <motion.h1
                    variants={{
                        hover: { color: '#fff' }
                    }}
                    className="max-w-7xl mx-auto px-2 text-4xl md:text-6xl py-5">BLUETOOTH</motion.h1>
                <motion.div 
                    initial={{ height: 0 }}
                    variants={{
                        hover: { height: '100%' }
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'bottom' }}
                    className="absolute top-1 left-0 w-full h-full bg-black -z-10" />
            </motion.div>
            <motion.div 
                whileHover="hover"
                className="border-t border-b-black border-b relative"
            >
                <motion.h1
                    variants={{
                        hover: { color: '#fff' }
                    }}
                    className="max-w-7xl mx-auto px-2 text-4xl md:text-6xl py-5">CASUAL WEAR</motion.h1>
                <motion.div 
                    initial={{ height: 0 }}
                    variants={{
                        hover: { height: '100%' }
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'bottom' }}
                    className="absolute top-1 left-0 w-full h-full bg-black -z-10" />
            </motion.div>
            <motion.div 
                whileHover="hover"
                className="border-t border-b-black border-b relative"
            >
                <motion.h1
                    variants={{
                        hover: { color: '#fff' }
                    }}
                    className="max-w-7xl mx-auto px-2 text-4xl md:text-6xl py-5">COZY</motion.h1>
                <motion.div 
                    initial={{ height: 0 }}
                    variants={{
                        hover: { height: '100%' }
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'bottom' }}
                    className="absolute top-1 left-0 w-full h-full bg-black -z-10" />
            </motion.div>
        </div>
    )
}

export default SectionThree