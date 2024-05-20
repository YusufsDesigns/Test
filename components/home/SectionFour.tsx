import Image from "next/image"
import ProdOne from "../../public/prod-1.jpg"
import ProdTwo from "../../public/prod-2.jpg"
import ProdThree from "../../public/prod-3.jpg"
import Card from "../kits/Card"


const SectionFour = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-32 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-20">
            <div className="col-span-2 relative">
                <Image src={ProdOne} alt="prod-1" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[220px] max-h-[220px] w-full h-full text-white border border-white rounded-full flex items-center justify-center">
                    PLAY VIDEO
                </div>
            </div>
            <Card name="FACE SERUM" collection="Collection of men’s designer" price="$507.00" sold={false} image={ProdTwo}  />
            <Card name="SKIN OIL" collection="Collection of men’s designer" price="$435.00" sold={false} image={ProdThree}  />
        </div>
    )
}

export default SectionFour