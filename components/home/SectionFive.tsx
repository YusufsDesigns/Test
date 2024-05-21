"use client"

import Autoplay from "embla-carousel-autoplay"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useRef } from "react"
import { data } from "@/data"

const SectionFive = () => {
    const plugin = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    )

    return (
        <div className="max-w-6xl mx-auto px-4 pb-32 md:py-32">
            <Carousel
            plugins={[plugin.current]}
            className="w-full flex items-center justify-between"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            >
                <CarouselPrevious />
                <CarouselContent className="w-full">
                    {data.map((d, index) => (
                    <CarouselItem key={index}>
                        <div className="text-center">
                            <p className="text-2xl mb-6 max-w-[900px] mx-auto">{d.text}</p>
                            <p className="text-[#333333] text-lg">{d.date}</p>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default SectionFive
