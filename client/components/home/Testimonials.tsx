"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselApi,
} from "@/components/ui/carousel"
import { getTestimonials, SanityTestimonial } from "@/lib/sanity"

const Testimonials = () => {
    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )
    
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [testimonials, setTestimonials] = useState<SanityTestimonial[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch testimonials from Sanity
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await getTestimonials(10); // Limit to 10 testimonials
                setTestimonials(data);
            } catch (error) {
                console.error('Failed to fetch testimonials:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    // Track current slide
    useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    // Format date helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
        });
    };

    // Generate star rating
    const generateStars = (rating: number) => {
        return '⭐'.repeat(Math.min(Math.max(rating, 0), 5));
    };

    if (loading) {
        return (
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
                            <div className="h-24 bg-gray-200 rounded max-w-2xl mx-auto"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (testimonials.length === 0) {
        return null; // Don't render section if no testimonials
    }

    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Simple header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-2xl font-light text-gray-900 tracking-wide">
                        What Our Customers Say
                    </h2>
                </motion.div>

                {/* Testimonials carousel */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <Carousel
                        setApi={setApi}
                        plugins={[plugin.current]}
                        className="w-full max-w-4xl mx-auto"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent>
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem key={testimonial._id}>
                                    <div className="text-center px-8 md:px-16">
                                        {/* Star Rating */}
                                        <div className="text-2xl mb-6">
                                            {generateStars(testimonial.rating)}
                                        </div>

                                        {/* Quote */}
                                        <blockquote className="text-xl md:text-2xl font-light text-gray-800 leading-relaxed mb-8 max-w-3xl mx-auto">
                                            "{testimonial.text}"
                                        </blockquote>

                                        {/* Attribution */}
                                        <div className="text-sm text-gray-500 font-light tracking-wide">
                                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                                <span className="text-gray-700 font-medium">
                                                    {testimonial.customerName || 'Customer'}
                                                </span>
                                                {testimonial.location && (
                                                    <>
                                                        <span className="text-gray-400">•</span>
                                                        <span>{testimonial.location}</span>
                                                    </>
                                                )}
                                                <span className="text-gray-400">•</span>
                                                <span>{formatDate(testimonial.date)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Custom positioned navigation */}
                        <CarouselPrevious 
                            className="absolute -left-12 md:-left-16 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:bg-white hover:shadow-xl text-gray-600 hover:text-gray-900 transition-all duration-200 w-12 h-12 rounded-full" 
                        />
                        <CarouselNext 
                            className="absolute -right-12 md:-right-16 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:bg-white hover:shadow-xl text-gray-600 hover:text-gray-900 transition-all duration-200 w-12 h-12 rounded-full" 
                        />
                    </Carousel>
                </motion.div>

                {/* Dots indicator */}
                {testimonials.length > 1 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex justify-center mt-12 space-x-2"
                    >
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                    index === current 
                                        ? 'bg-gray-800 w-8' 
                                        : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Stats footer (optional) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center mt-16 pt-8 border-t border-gray-100"
                >
                    <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                        <div>
                            <span className="font-semibold text-gray-900">{testimonials.length}+</span> Happy Customers
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div>
                            <span className="font-semibold text-gray-900">
                                {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)}
                            </span> Average Rating
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div>
                            <span className="font-semibold text-gray-900">100%</span> Authentic Reviews
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Testimonials