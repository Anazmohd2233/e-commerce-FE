import HeaderManu from "./header/HeaderManu";
import HeaderOne from "./header/HeaderOne";
import HeaderTwo from "./header/HeaderTwo";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";

function Header() {
  const { getCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.wishlist
  ) || [];

  useEffect(() => {
    const loadCart = async () => {
      try {
        const items = await getCart();
        setCartItems(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error("Error loading cart:", error);
        setCartItems([]);
      }
    };
    loadCart();
  }, [getCart]);

  return (
    <>
      {/* <Loader /> */}

      <header className="gi-header">
        <HeaderOne wishlistItems={wishlistItems} cartItems={cartItems} />
        <HeaderTwo cartItems={cartItems} wishlistItems={wishlistItems} />
        <HeaderManu />
      </header>
    </>
  );
}

export default Header;
