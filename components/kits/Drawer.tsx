import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet"
import { IoIosMenu } from "react-icons/io"


const Drawer = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <IoIosMenu className="text-white text-3xl cursor-pointer" />
            </SheetTrigger>
            <SheetContent side="left" className="bg-black text-white text-base px-10 py-44">
                <ul className="flex flex-col gap-3">
                    <li>HOME</li>
                    <li>PAGES</li>
                    <li>SHOP</li>
                    <li>BLOG</li>
                    <li>LANDING</li>
                </ul>
            </SheetContent>
        </Sheet>
    )
}

export default Drawer