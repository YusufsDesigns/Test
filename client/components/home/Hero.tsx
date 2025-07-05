// Fixed Hero Component with Animations
"use client"

import { Cinzel } from "next/font/google";
import { Button } from "../ui/button"
import { cn } from "../../lib/utils";
import { motion } from "framer-motion"
import Image from "next/image";
import Link from "next/link";
import LeftImg from "../../public/green-dress.jpg"
import RightImg from "../../public/black-dress-2.jpg"

const cinzel = Cinzel({ subsets: ["latin"] });

const Hero: React.FC = () => {
    // Animation variants for the images
    const imageVariants = {
        initial: { scale: 1.2, opacity: 0 },
        animate: { 
            scale: 1, 
            opacity: 1,
            transition: { 
                duration: 1.2, 
                ease: "easeOut" 
            }
        }
    };

    // Animation variants for the overlay
    const overlayVariants = {
        initial: { opacity: 0 },
        animate: { 
            opacity: 1,
            transition: { 
                duration: 0.8, 
                delay: 0.3 
            }
        }
    };

    // Animation variants for content
    const contentVariants = {
        initial: { opacity: 0, y: 50 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.8, 
                delay: 0.6,
                ease: "easeOut"
            }
        }
    };

    // Stagger animation for mobile content
    const staggerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.8
            }
        }
    };

    const itemVariants = {
        initial: { opacity: 0, y: 30 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.6, 
                ease: "easeOut" 
            }
        }
    };

    return (
        <div className="h-[50vh] md:h-full lg:h-screen w-full overflow-hidden">
            <div className="h-full lg:h-screen w-full flex lg:flex-row items-center relative">
                {/* Left section of the Hero component */}
                <motion.div 
                    className="h-full w-1/2 md:h-screen lg:h-full md:w-full flex-1 relative overflow-hidden"
                    initial="initial"
                    animate="animate"
                >
                    {/* Background Image */}
                    <motion.div
                        variants={imageVariants}
                        className="absolute inset-0"
                    >
                        <Image
                            src={LeftImg}
                            alt="Black Dress"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>

                    {/* Overlay */}
                    <motion.div 
                        variants={overlayVariants}
                        className="absolute inset-0 bg-black/20"
                    />
                    
                    {/* Content Container - Desktop only */}
                    <motion.div 
                        variants={contentVariants}
                        className="absolute inset-0 hidden lg:flex flex-col items-center justify-end pb-24"
                    >
                        {/* Title - Desktop only */}
                        <motion.h1 
                            className={cn(cinzel.className, "text-white text-4xl font-semibold tracking-[0.55px] mb-2 text-center z-10")}
                            whileHover={{ 
                                scale: 1.05,
                                transition: { duration: 0.3 }
                            }}
                        >
                            READY TO WEAR
                        </motion.h1>
                        
                        {/* Button Link - Desktop only */}
                        <Link href="/outfits">
                            <motion.div
                                whileHover={{ 
                                    scale: 1.05,
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button 
                                    size="lg" 
                                    className="text-xs bg-white rounded-sm text-black hover:bg-white/90 px-20 py-7 border-white z-10 transition-all duration-300 hover:shadow-lg"
                                >
                                    SHOP NOW
                                </Button>
                            </motion.div>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right section of the Hero component */}
                <motion.div 
                    className="h-full md:h-screen lg:h-full w-1/2 md:w-full flex-1 relative overflow-hidden"
                    initial="initial"
                    animate="animate"
                >
                    {/* Background Image */}
                    <motion.div
                        variants={{
                            ...imageVariants,
                            animate: {
                                ...imageVariants.animate,
                                transition: {
                                    ...imageVariants.animate.transition,
                                    delay: 0.2
                                }
                            }
                        }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={RightImg}
                            alt="Green Dress"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>

                    {/* Overlay */}
                    <motion.div 
                        variants={{
                            ...overlayVariants,
                            animate: {
                                ...overlayVariants.animate,
                                transition: {
                                    ...overlayVariants.animate.transition,
                                    delay: 0.5
                                }
                            }
                        }}
                        className="absolute inset-0 bg-black/30"
                    />
                </motion.div>

                {/* Mobile centered content - spans across both sections */}
                <motion.div 
                    variants={staggerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 flex lg:hidden flex-col items-center justify-center z-20 bg-black/20"
                >
                    <motion.h1 
                        variants={itemVariants}
                        className={cn(cinzel.className, "text-white text-2xl md:text-4xl font-semibold tracking-[0.55px] mb-2 text-center")}
                    >
                        READY TO WEAR
                    </motion.h1>
                    
                    <motion.div variants={itemVariants}>
                        <Link href="/outfits">
                            <motion.div
                                whileHover={{ 
                                    scale: 1.05,
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button 
                                    size="lg" 
                                    className="text-xs bg-white rounded-sm text-black hover:bg-white/90 md:px-20 py-7 border-white transition-all duration-300 hover:shadow-lg"
                                >
                                    SHOP NOW
                                </Button>
                            </motion.div>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default Hero