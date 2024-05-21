import Card from "../kits/Card"
import ShopOne from "../../public/shop-single-1.jpg"
import ShopTwo from "../../public/shop-single-2.jpg"
import ShopThree from "../../public/shop-single-3.jpg"
import ShopFour from "../../public/shop-single-4.jpg"


const SectionSeven = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-32">
            <h1 className="text-[32px] max-w-[800px] mb-10">NEW IN: HAND-PICKED DAILY FROM THE WORLD’S BEST BRANDS AND BOUTIQUES</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-20">
                <Card
                    name="LEATHER SLIPPERS"
                    image={ShopOne}
                    sold={false}
                    price="$363.00"
                    collection="Collection of men’s designer"
                    cozy
                />
                <Card
                    name="CLOTHES HANGER"
                    image={ShopTwo}
                    sold={false}
                    price="$112.00"
                    collection="Collection of men’s designer"
                    cozy
                />
                <Card
                    name="BATHROBE"
                    image={ShopThree}
                    sold={false}
                    price="$560.00"
                    collection="Collection of men’s designer"
                    cozy
                />
                <Card
                    name="CERAMIC MUG"
                    image={ShopFour}
                    sold={false}
                    price="$200.00"
                    collection="Collection of men’s designer"
                    cozy
                />
            </div>
        </div>
    )
}

export default SectionSeven