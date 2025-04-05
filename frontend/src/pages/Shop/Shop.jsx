import Layout from "../../components/Layout/Layout";
import Nav from "../../components/Nav/Nav";
import { Card } from "../../components/Card/Card";

const Shop = () => {
    console.log("Shop")
    return (
        <>
        <Nav/>
        <div id="shop-root" className="h-screen p-4">

            <div id="body-container" className="mt-[4em] mx-[2vw]">
                <div id="shop-header">
                    <h1 className="uppercase !text-[6rem] text-[#352f36]">ALL</h1>
                </div>

                <div id="filter-system-container">

                </div>



                <div id="shop-grid" className="grid md:grid-cols-[1fr_1fr_1fr_1fr]">

                    <Card productName="Item 1"/>
                    <Card productName="Item 2"/>
                    <Card productName="Item 3"/>
                    <Card productName="Item 4"/>

                </div>

            </div>
        </div>
        </>
    )

}

export default Shop;