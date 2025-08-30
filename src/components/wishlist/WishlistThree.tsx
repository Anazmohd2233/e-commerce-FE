import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import { useCart } from "../../hooks/useCart";
import { addWishlist, removeWishlist } from "@/store/reducers/wishlistSlice";
import { addCompare, removeCompareItem } from "@/store/reducers/compareSlice";
import { useState } from "react";
import QuickViewModal from "../model/QuickViewModal";
import StarRating from "../stars/StarRating";
import { showSuccessToast } from "@/utility/toast";
import { Item } from "@/types/data.types";
import { Link } from "react-router-dom";

const WishlistThree = () => {
  const [show, setShow] = useState(false);
  const [quickData, setQuickData] = useState<Item>();
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.wishlist
  );

  const compareItems = useSelector((state: RootState) => state.compare.compare);

  const dispatch = useDispatch();

  const handleRemoveFromwishlist = (id: number) => {
    dispatch(removeWishlist(id));
    showSuccessToast("Remove product from wishlist!");
  };

  const { addItemToCart } = useCart();

  const handleCart = (data: Item) => {
    addItemToCart({
      productId: data.id.toString(),
      quantity: 1
    });
    showSuccessToast("Add product in Cart Successfully!");
  };

  const handleClose = () => setShow(false);
  const handleShow = (eachItem: Item) => {
    setQuickData(eachItem);
    setShow(true);
  };

  const isInWishlist = (data: Item) => {
    return wishlistItems.some((item: Item) => item.id === data.id);
  };

  const handleWishlist = (data: Item) => {
    if (!isInWishlist(data)) {
      dispatch(addWishlist(data));
      showSuccessToast("Add product in Wishlist Successfully!", {
        icon: false,
      });
    } else {
      dispatch(removeWishlist(data.id));
      showSuccessToast("Remove product on Wishlist Successfully!", {
        icon: false,
      });
      // showErrorToast("Item already have to wishlist");
    }
  };

  const isInCompare = (data: Item) => {
    return compareItems.some((item: Item) => item.id === data.id);
  };

  const handleCompareItem = (data: Item) => {
    if (!isInCompare(data)) {
      dispatch(addCompare(data));
      showSuccessToast(`Add product in Compare list Successfully!`, {
        icon: false,
      });
    } else {
      dispatch(removeCompareItem(data.id));
      showSuccessToast("Remove product on Compare list Successfully!", {
        icon: false,
      });
      // showErrorToast("Item already have to compare list");
    }
  };

  return (
    <>
      <section className="gi-wishlist padding-tb-40">
        <div className="container">
          <div className="row mb-minus-24px">
          {wishlistItems.length === 0 ? (
            <h4 className="text-center">Your wishlist is empty.</h4>
          ):<>
            {wishlistItems.map((data, index) => (
              <div
                key={index}
                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-6 mb-6 gi-product-box pro-gl-content"
              >
                <a
                  onClick={() => handleRemoveFromwishlist(data.id)}
                  className="remove-product"
                >
                  <i className="fi-rr-cross-small"></i>
                </a>
                <div className="gi-product-content">
                  <div className="gi-product-inner">
                    <div className="gi-pro-image-outer">
                      <div className="gi-pro-image">
                        <Link to={`/product-left-sidebar`} className="image">
                          <span className="label veg">
                            <span className="dot"></span>
                          </span>
                          <img
                            className="main-image"
                            src={data.image}
                            alt="Product"
                          />
                          <img
                            className="hover-image"
                            src={data.imageTwo}
                            alt="Product"
                          />
                        </Link>

                        <div className="gi-pro-actions">
                          <a
                            onClick={() => handleWishlist(data)}
                            className={
                              "gi-btn-group wishlist " +
                              (isInWishlist(data) ? "active" : "")
                            }
                            title="Wishlist"
                          >
                            <i className="fi-rr-heart"></i>
                          </a>
                          <a
                            className="gi-btn-group quickview"
                            data-link-action="quickview"
                            title="Quick view"
                            data-bs-toggle="modal"
                            data-bs-target="#gi_quickview_modal"
                            onClick={() => handleShow(data)}
                          >
                            <i className="fi-rr-eye"></i>
                          </a>
                          <a
                            onClick={() => handleCompareItem(data)}
                            className={
                              "gi-btn-group compare " +
                              (isInCompare(data) ? "active" : "")
                            }
                            title="Compare"
                          >
                            <i className="fi fi-rr-arrows-repeat"></i>
                          </a>
                          <a
                            title="Add To Cart"
                            className="gi-btn-group add-to-cart"
                            onClick={() => handleCart(data)}
                          >
                            <i className="fi-rr-shopping-basket"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="gi-pro-content">
                      <Link to={`/shop-left-sidebar-col-3`}>
                        <h6 className="gi-pro-stitle">{data.brand}</h6>
                      </Link>
                      <h5 className="gi-pro-title">
                        <Link to={`/product-left-sidebar`}>{data.title}</Link>
                      </h5>
                      <p className="gi-info">
                        Contrary to popular belief, Lorem Ipsum is not simply
                        random text. It has roots in a piece of classical Latin
                        literature from 45 BC, making it over 2000 years old.
                      </p>
                      <div className="gi-pro-rat-price">
                        <span className="gi-pro-rating">
                          <StarRating rating={data.rating} />
                        </span>
                        <span className="gi-price">
                          <span className="new-price">${data.newPrice}</span>
                          <span className="old-price">${data.oldPrice}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>}
          </div>
        </div>
      </section>
      {quickData && (
        <QuickViewModal
          data={quickData}
          handleClose={handleClose}
          show={show}
        />
      )}
    </>
  );
};

export default WishlistThree;
