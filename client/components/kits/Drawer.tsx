"use client"

import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet"
import { IoIosMenu } from "react-icons/io"

// Menu that is triggered when the menu button in the NavBar is clicked
const Drawer: React.FC = () => {
    return (
        // Sheet component from shadcn/ui library that displays a menu overlay when triggered
        <Sheet>
            {/* Trigger that opens menu overlay */}
            <SheetTrigger asChild>
                <IoIosMenu className="text-white text-3xl cursor-pointer" />
            </SheetTrigger>
            {/* Menu overlay content */}
            <SheetContent side="left" className="bg-[#202124] text-white text-base px-6 py-8">
                <div className="flex flex-col gap-4 mt-20">
                    {/* Home Link */}
                    <div className="py-3 px-2 border-b border-white/10">
                        <a href="/" className="text-lg font-medium hover:text-gray-300 transition-colors">
                            HOME
                        </a>
                    </div>

                    {/* Outfits Link */}
                    <div className="py-3 px-2 border-b border-white/10">
                        <a href="/outfits" className="text-lg font-medium hover:text-gray-300 transition-colors">
                            OUTFITS BY THE BRAND
                        </a>
                    </div>

                    {/* Handmade Shoes Link */}
                    <div className="py-3 px-2 border-b border-white/10">
                        <a href="/shoes" className="text-lg font-medium hover:text-gray-300 transition-colors">
                            HANDMADE SHOES
                        </a>
                    </div>

                    {/* Accessories Link */}
                    <div className="py-3 px-2 border-b border-white/10">
                        <a href="/accessories" className="text-lg font-medium hover:text-gray-300 transition-colors">
                            ACCESSORIES
                        </a>
                    </div>

                    {/* Additional Links */}
                    <div className="py-3 px-2 border-b border-white/10">
                        <a href="/about" className="text-lg font-medium hover:text-gray-300 transition-colors">
                            ABOUT US
                        </a>
                    </div>

                    <div className="py-3 px-2 border-b border-white/10">
                        <a href="/contact" className="text-lg font-medium hover:text-gray-300 transition-colors">
                            CONTACT
                        </a>
                    </div>
                </div>

                {/* Account Section */}
                <div className="absolute bottom-8 left-6 right-6">
                    <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                        <button className="flex items-center gap-3 text-left hover:text-gray-300 transition-colors">
                            <span className="text-lg">❤️</span>
                            <span>Wishlist</span>
                        </button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default Drawer