import { showSuccessToast } from "@/utility/toast";
import { Item } from "@/types/data.types";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

const TrendingItem = ({ data }: { data: Item}) => {
  const { addItemToCart, updateItem, isProductInCart, getCartItem } = useCart();

  const handleCart = async (product: Item) => {
    try {
      const isInCart = isProductInCart(product.id.toString());
      
      if (isInCart) {
        const cartItem = getCartItem(product.id.toString());
        await updateItem({
          productId: product.id.toString(),
          quantity: (cartItem?.quantity || 0) + 1
        });
      } else {
        await addItemToCart({
          productId: product.id.toString(),
          quantity: 1
        });
      }
      showSuccessToast("Product added to cart successfully!");
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  return (
    <>
      <div className="col-sm-12 gi-all-product-block">
        <div className="gi-all-product-inner">
          <div className="gi-pro-image-outer">
            <div className="gi-pro-image">
              <Link to={`/product-left-sidebar`} className="image">
                <img className="main-image" src={data.image} alt="Product" />
              </Link>
            </div>
          </div>
          <div className="gi-pro-content">
            <h5 className="gi-pro-title">
              <Link to={`/product-left-sidebar`}>{data.title}</Link>
            </h5>
            <h6 className="gi-pro-stitle">
              <Link to={`/shop-left-sidebar-col-3`}>{data.name}</Link>
            </h6>
            <div className="gi-pro-rat-price">
              <div className="gi-pro-rat-pri-inner">
                <span className="gi-price">
                  <span className="new-price">${data.newPrice}.00</span>
                  <span className="old-price">${data.oldPrice}.00</span>
                  <span className="qty">- {data.waight}</span>
                </span>
              </div>
            </div>
            <a
              className="add-to-cart"
              title="Add To Cart"
              onClick={() => handleCart(data)}
            >
              <i className="fi-rr-shopping-basket"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrendingItem;
