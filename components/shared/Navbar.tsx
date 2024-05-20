import { CiSearch, CiHeart } from "react-icons/ci";
import { AiOutlineUser, AiOutlineShopping } from "react-icons/ai";
import Logo from "../../public/logo.png"
import Image from "next/image";
import Drawer from "../kits/Drawer";

const Navbar = () => {
    return (
        <div className="absolute top-0 w-full py-12 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className="hidden lg:block">
                    <Drawer />
                </div>
                <Image src={Logo} alt="Logo" className="w-[118px]" />
            </div>
            <div className="flex items-center gap-2 text-white lg:mr-10">
                <div className="items-center gap-7 hidden lg:flex">
                    <CiSearch className="text-2xl" />
                    <CiHeart className="text-2xl" />
                    <AiOutlineUser className="text-2xl" />
                </div>
                <div className="flex items-center gap-2">
                    <AiOutlineShopping className="text-2xl" />
                    <span>My Bag</span>
                </div>
                <div className="block lg:hidden">
                    <Drawer />
                </div>
            </div>
        </div>
    )
}

export default Navbar