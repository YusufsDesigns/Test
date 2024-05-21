"use client"

import Image, { StaticImageData } from 'next/image'
import { CiHeart } from "react-icons/ci";
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

interface CardPropTypes{
    image: StaticImageData
    name: string
    collection: string
    price: string
    sold: boolean
    classname?: string
    cozy?: boolean
}

const Card = ({ image, name, collection, price, sold, classname, cozy }: CardPropTypes) => {
    const parentVariants = {
        hover: { 
            transition: { 
            staggerChildren: 0.1 
            }
        }
    };

    const childVariants = {
        initial: { opacity: 0, y: 20 },
        hover: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={parentVariants}
            initial="initial"
            whileHover="hover"
            className={classname}
        >
            <div className='relative border'>
                <motion.div
                initial={{ opacity: 0 }}
                variants={childVariants}
                >
                    <CiHeart className='text-xl absolute top-2 right-2' />
                    <div className='p-2 absolute bottom-0 w-full'>
                        <Button className='w-full rounded-none bg-black py-6 uppercase text-xs'>{sold ? "Read More" : "Add to cart"}</Button>
                    </div>
                </motion.div>
                <Image src={image} alt={name} />
            </div>
            <div className='mt-3 text-[#13161a]'>
                {cozy && <h3 className='text-[#333333]'>Cozy</h3>}
                <h2 className='text-[18px] uppercase tracking-[0.09px]'>{name}</h2>
                <p className='text-[#333333] text-[15px]'>{collection}</p>
                <p className='mt-2'>{price}</p>
            </div>
        </motion.div>
    )
}

export default Card