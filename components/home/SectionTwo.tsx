import CardList from "../CardList"



const SectionTwo = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-32">
            <h1 className="text-[32px] max-w-[800px] mb-10">NEW IN: HAND-PICKED DAILY FROM THE WORLD’S BEST BRANDS AND BOUTIQUES</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-20">
                <CardList />
            </div>
        </div>
    )
}

export default SectionTwo