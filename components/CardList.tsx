import Card from "./kits/Card"
import ProdOne from "../public/shop-one.jpg"
import ProdTwo from "../public/shop-two.jpg"
import ProdThree from "../public/shop-three.jpg"
import ProdFour from "../public/shop-four.jpg"
import ProdFive from "../public/shop-five.jpg"
import ProdSix from "../public/shop-six.jpg"
import ProdSeven from "../public/shop-seven.jpg"

const CardList = () => {
    return (
        <>
            <Card
                name="LEATHER SLIPPERS"
                image={ProdOne}
                sold={false}
                price="$363.00"
                collection="Collection of men’s designer"
            />
            <Card
                name="CLOTHES HANGER"
                image={ProdTwo}
                sold={false}
                price="$112.00"
                collection="Collection of men’s designer"
            />
            <Card
                name="BATHROBE"
                image={ProdThree}
                sold={false}
                price="$560.00"
                collection="Collection of men’s designer"
                classname="col-span-2"
            />
            <Card
                name="CERAMIC MUG"
                image={ProdFour}
                sold={false}
                price="$200.00"
                collection="Collection of men’s designer"
            />
            <Card
                name="FACE CREAM"
                image={ProdFive}
                sold={false}
                price="$337.00"
                collection="Collection of men’s designer"
            />
            <Card
                name="WOOL BLANKET"
                image={ProdSix}
                sold={false}
                price="$311.00"
                collection="Collection of men’s designer"
            />
            <Card
                name="SIMPLE DESIGN"
                image={ProdSeven}
                sold={false}
                price="$220.00"
                collection="Collection of men’s designer"
            />
        </>
    )
}

export default CardList