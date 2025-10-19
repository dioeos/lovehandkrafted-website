// src/pages/ProductPage.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";
import { Extras } from "../Index/Extras";
import api from "../../utils/lib/api";
import { IoPerson } from "react-icons/io5";

export default function ProductPage() {
  const { slug } = useParams();
  const location = useLocation();
  const seeded = location.state?.product || null;

  const [product, setProduct] = useState(seeded);
  const [loading, setLoading] = useState(!seeded);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (seeded && seeded.slug === slug) return;
    let active = true;
    (async () => {
      try {
        const { data } = await api.get(`/products/by-slug/${slug}/`);
        if (active) setProduct(data);
      } catch {
        if (active) setError("Product not found.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug, seeded]);

  const price = product?.default_price
    ? Number(product.default_price).toLocaleString("en-PH")
    : "";

  return (
    <div className="bg-[#352f36]">
      <Nav />

      <div id="product-wrapper" className="bg-[#FAF9F6]">
        <div className="mt-[4em] mx-[2vw] p-4 min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <section className="lg:col-span-7 flex justify-center">
              <div
                className="
                  w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[95%] xl:w-[90%]
                  h-[65vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] xl:h-[90vh]
                  bg-white overflow-hidden
                "
              >
                {loading ? (
                  <div className="grid place-items-center h-full text-gray-400 satoshi">
                    Loading…
                  </div>
                ) : product?.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid place-items-center h-full text-gray-400 satoshi">
                    No image
                  </div>
                )}
              </div>
            </section>

            <section className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <h1 className="satoshi text-[#352f36] !text-[2rem] md:!text-[2.5rem] leading-tight">
                  {loading ? "…" : product?.name}
                </h1>
                <div className="mt-2 text-[#352f36] satoshi text-xl">
                  {price} PHP
                </div>
              </div>

              <div className="text-gray-700 satoshi leading-relaxed">
                {product?.description || "No description available."}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  className="w-full py-4 rounded-xl satoshi text-[#FAF9F6] bg-[#352f36] hover:opacity-90 transition disabled:opacity-50"
                  disabled={!product}
                  onClick={() => console.log("Add to cart", slug)}
                >
                  ADD TO CART
                </button>
                <div className="text-xs text-gray-700 satoshi">
                  Subscribe to our newsletter to hear about deals on this
                  purchase.
                </div>
              </div>

              <div className="mt-2 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-green-600" />
                  <p className="text-sm text-gray-700 satoshi">
                    Shipped within 7–14 business days
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="overflow-x-hidden overflow-y-hidden bg-[#352f36]">
          <Extras showSlider={false} />
        </div>
        <Footer />
      </div>
    </div>
  );
}
