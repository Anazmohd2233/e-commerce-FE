import { useEffect, useState, useCallback, useMemo } from "react";
import StarRating from "../stars/StarRating";
import QuickViewModal from "../model/QuickViewModal";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { RootState } from "@/store";
import { addWishlist, removeWishlist } from "@/store/reducers/wishlistSlice";
import { addCompare, removeCompareItem } from "@/store/reducers/compareSlice";
import { showSuccessToast } from "@/utility/toast";
import { Item } from "@/types/data.types";
import { useCart } from "../../hooks/useCart";

const ItemCard = ({ data }: { data: Item }) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const compareItems = useSelector((state: RootState) => state.compare.compare);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.wishlist);
  const { cartItems, addItemToCart, updateItem, isProductInCart, getCartItem, getCart } = useCart();

  // Load cart items from API on mount
  useEffect(() => {
    getCart(1);
  }, [getCart]);

  // Memoize callbacks
  const handleCart = useCallback((data: Item) => {
    const productInCart = isProductInCart(data.id.toString());

    if (!productInCart) {
      // Add new item to cart
      addItemToCart({
        productId: data.id.toString(),
        quantity: 1,
        productVariantId: data.variantId || undefined
      });
      showSuccessToast("Add product in Cart Successfully!");
    } else {
      // Update existing item quantity
      const existingItem = getCartItem(data.id.toString());
      if (existingItem) {
        updateItem({
          itemId: existingItem.id,
          quantity: existingItem.quantity + 1,
          productVariantId: existingItem.productVariant?.id
        });
        showSuccessToast("Updated product quantity in Cart!");
      }
    }
  }, [isProductInCart, addItemToCart, updateItem, getCartItem]);

  // Memoize computed values
  const isInWishlist = useMemo(() => 
    wishlistItems.some((item: Item) => item.id === data.id),
    [wishlistItems, data.id]
  );

  const handleWishlist = useCallback((data: Item) => {
    if (!isInWishlist) {
      dispatch(addWishlist(data));
      showSuccessToast("Add product in Wishlist Successfully!", {
        icon: false,
      });
    } else {
      dispatch(removeWishlist(data.id));
      showSuccessToast("Remove product on Wishlist Successfully!", {
        icon: false,
      });
    }
  }, [isInWishlist, dispatch]);

  const isInCompare = useMemo(() => 
    compareItems.some((item: Item) => item.id === data.id),
    [compareItems, data.id]
  );


  const handleCompareItem = useCallback((data: Item) => {
    if (!isInCompare) {
      dispatch(addCompare(data));
      showSuccessToast(`Add product in Compare list Successfully!`, {
        icon: false,
      });
    } else {
      dispatch(removeCompareItem(data.id));
      showSuccessToast("Remove product on Compare list Successfully!", {
        icon: false,
      });
    }
  }, [isInCompare, dispatch]);

  const handleClose = useCallback(() => setShow(false), []);
  const handleShow = useCallback(() => setShow(true), []);

  return (
    <>
      <div className="gi-product-content">
        <div className="gi-product-inner">
          <div className="gi-pro-image-outer">
            <div className="gi-pro-image">
              <Link to="/" className="image">
                <span className="label veg">
                  <span className="dot"></span>
                </span>
                <img className="main-image" src="/assets/img/product-images/6_1.jpg" alt="Product" loading="lazy" />
                <img
                  className="hover-image"
                  src="/assets/img/product-images/6_2.jpg"
                  alt="Product"
                  loading="lazy"
                />
              </Link>
              <span className="flags">
                {data.sale && (
                  <span className={data.sale === "Sale" ? "sale" : "new"}>
                    {data.sale}
                  </span>
                )}
              </span>
              <div className="gi-pro-actions">
                <button
                  onClick={() => handleWishlist(data)}
                  className={`gi-btn-group wishlist ${isInWishlist ? "active" : ""}`}
                  title="Wishlist"
                >
                  <i className="fi-rr-heart"></i>
                </button>
                <button
                  className="gi-btn-group quickview gi-cart-toggle"
                  data-link-action="quickview"
                  title="Quick view"
                  data-bs-toggle="modal"
                  data-bs-target="#gi_quickview_modal"
                  onClick={handleShow}
                >
                  <i className="fi-rr-eye"></i>
                </button>
                <button
                  onClick={() => handleCompareItem(data)}
                  className={`gi-btn-group compare ${isInCompare ? "active" : ""}`}
                  title="Compare"
                >
                  <i className="fi fi-rr-arrows-repeat"></i>
                </button>
                <button
                  title="Add To Cart"
                  className="gi-btn-group add-to-cart"
                  onClick={() => handleCart(data)}
                >
                  <i className="fi-rr-shopping-basket"></i>
                </button>
              </div>
              <div className="gi-pro-option">
                {data.color1 && data.color2 && data.color3 && (
                  <ul className="colors">
                    {data.color1 && (
                      <li className={`color-${data.color1}`}>
                        <a href=""></a>
                      </li>
                    )}
                    {data.color2 && (
                      <li className={`color-${data.color2}`}>
                        <a href=""></a>
                      </li>
                    )}
                    {data.color3 && (
                      <li className={`color-${data.color3}`}>
                        <a href=""></a>
                      </li>
                    )}
                  </ul>
                )}
                {data.size1 && data.size2 && (
                  <ul className="sizes">
                    {data.size1 && (
                      <li>
                        <a href="">{data.size1}</a>
                      </li>
                    )}
                    {data.size2 && (
                      <li>
                        <a href="">{data.size2}</a>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="gi-pro-content">
            <Link to="/shop-left-sidebar-col-3">
              <h6 className="gi-pro-stitle">{data.category}</h6>
            </Link>
            <h5 className="gi-pro-title">
              <Link to="/product-left-sidebar">{data.title}</Link>
            </h5>
            <p className="gi-info">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old.
            </p>
            <div className="gi-pro-rat-price">
              <span className="gi-pro-rating">
                <StarRating rating={data.rating} />
                <span className="qty">{data.weight}</span>
              </span>
              <span className="gi-price">
                <span className="new-price">${data.newPrice}.00</span>
                <span className="old-price">${data.oldPrice}.00</span>
              </span>
            </div>
          </div>
        </div>
        <QuickViewModal data={data} handleClose={handleClose} show={show} />
      </div>
    </>
  );
};

export default ItemCard;
