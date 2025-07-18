import { useEffect } from "react";
import { useAuth } from "../../utils/authentication/AuthProvider";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav/Nav";
import { Extras } from "../Index/Extras";

import { IoPerson } from "react-icons/io5";
import Footer from "../../components/Footer/Footer";

const Profile = () => {
  return (
    <div>
      <Nav />
      <div id="profile-wrapper" className="bg-[#FAF9F6]">
        <div
          id="profile-container"
          className="min-h-screen mt-[4em] mx-[2vw] grid grid-rows-[200px_1fr] p-4 bg-[#FAF9F6]"
        >
          <div id="grid-item-1">
            <div id="profile-header">
              <h1 className="uppercase !text-[4rem] md:!text-[6rem] text-[#352f36] satoshi">
                FAQ
              </h1>
            </div>
          </div>

          <div id="grid-item-2" className="">
            <div
              id="orders-container"
              className="flex flex-col w-full md:w-1/2 gap-1"
            >
              <div className="satoshi-bold">
                Q: Do you ship internationally?
              </div>
              <div className="mb-4">
                Not yet, but we are working on it! If you have experience with
                international shipping or are willing to assist with the
                process, feel free to message us. We're happy to explore
                possibilities with you.
              </div>

              <div className="satoshi-bold">
                Q: How and when can I place an order? Are the products ready to
                ship?
              </div>
              <div className="mb-4">
                You can place an order by messaging us directly through our
                contact number or preferred messaging app. Some of our pieces
                are ready to ship, while others are on a per order basis—
                especially bulk orders.
              </div>
              <div className="satoshi-bold">
                Q: Where can I find these products?
              </div>
              <div className="mb-4">
                You can catch our handcrafted items at pop-up events, local
                fairs, or through direct orders online. Follow us on our social
                media pages for announcements on where we'll be next!
              </div>
              <div className="satoshi-bold">
                Q: How long do the products last?
              </div>
              <div className="mb-4">
                With proper care and storage, our handcrafted pieces can last
                for many years. Keepy them dry, handle them gently, and store
                them safely when not in use. With dyed products, keep away from
                direct sunlight— a little love goes a long way.
              </div>
              <div className="satoshi-bold">
                Q: What payment methods are available?
              </div>
              <div>
                For now, payments can be made via GCash and Bank Transfer
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-hidden overflow-y-hidden bg-[#352f36]">
          <Extras showSlider={false} />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Profile;
