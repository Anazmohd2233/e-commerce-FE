import HeaderTop from "./header/HeaderTop";
import HeaderBottom from "./header/HeaderBottom";
import HeaderManu from "./header/HeaderManu";
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
        <HeaderTop />
        <HeaderBottom wishlistItems={wishlistItems} cartItems={cartItems} />
        <HeaderManu />
      </header>
    </>
  );
}

export default Header;
