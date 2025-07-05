import { motion } from "framer-motion"
import { ReactNode } from "react"

interface SlideAnimationProps{
    children: ReactNode
    paragraph: boolean
}

const SlideAnimation = ({ children, paragraph }: SlideAnimationProps) => {
    return (
        <motion.div
                    initial={{ width: 0, originX: 1 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1 }}
                    className="bg-right-2 flex flex-col items-center justify-center h-full"
        >
            {/* Animated paragraph with initial position and opacity, transitions to final state */}
            {paragraph ? 
                children : 
                <motion.p
                initial={{ y: 100, opacity: 0 }} // Initial state
                animate={{ y: 0, opacity: 1 }} // Animation on view
                transition={{ duration: 1, delay: 0.5 }} // Animation duration and delay
                className="text-white text-lg text-center tracking-wide font-medium max-w-[400px]"
                >
                {children}
            </motion.p>}
        </motion.div>
    )
}

export default SlideAnimation