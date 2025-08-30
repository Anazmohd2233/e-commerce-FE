import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import QuantitySelector from "../quantity-selector/QuantitySelector";

const SidebarCart = ({ closeCart, isCartOpen }: any) => {
  const { cartItems, removeItem, getCart } = useCart();
  const [subTotal, setSubTotal] = useState(0);
  const [vat, setVat] = useState(0);

  useEffect(() => {
    // Fetch cart when component mounts
    getCart(1);
  }, [getCart]);

  useEffect(() => {
    if (cartItems.length === 0) {
      setSubTotal(0);
      setVat(0);
      return;
    }

    const subtotal = cartItems.reduce(
      (acc: number, item: any) => acc + parseFloat(item.subTotal || 0),
      0
    );
    setSubTotal(subtotal);
    // Calculate VAT
    const vatAmount = subtotal * 0.2;
    setVat(vatAmount);
  }, [cartItems]);
  const total = subTotal + vat;

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleRemoveFromCart = (item: any) => {
    removeItem(item.id);
  };

  return (
    <>
      {isCartOpen && (
        <div
          style={{ display: isCartOpen ? "block" : "none" }}
          className="gi-side-cart-overlay"
          onClick={closeCart}
        ></div>
      )}
      <div
        id="gi-side-cart"
        className={`gi-side-cart ${isCartOpen ? "gi-open-cart" : ""}`}
      >
        <div className="gi-cart-inner">
          <div className="gi-cart-top">
            <div className="gi-cart-title">
              <span className="cart_title">My Cart</span>
              <Link onClick={closeCart} to="/" className="gi-cart-close">
                <i onClick={handleSubmit} className="fi-rr-cross-small"></i>
              </Link>
            </div>
            {cartItems.length === 0 ? (
              <div className="gi-pro-content cart-pro-title">
                Your cart is empty.
              </div>
            ) : (
              <ul className="gi-cart-pro-items">
                {cartItems.map((item: any, index: number) => (
                  <li key={index}>
                    <Link
                      onClick={handleSubmit}
                      to="/"
                      className="gi-pro-img"
                    >
                      <img src={item.product?.image || '/default-product.jpg'} alt="product" />
                    </Link>
                    <div className="gi-pro-content">
                      <Link to="/" className="cart-pro-title">
                        {item.product?.product_name || 'Product'}
                      </Link>
                      <span className="cart-price">
                        {item.quantity} x ${item.unitPrice}{" "}
                        <span>${item.subTotal}</span>
                      </span>
                      <div className="qty-plus-minus gi-qty-rtl">
                        <QuantitySelector
                          id={parseInt(item.id)}
                          quantity={item.quantity}
                          itemId={item.id}
                          productVariantId={item.productVariant?.id}
                        />
                      </div>
                      <a
                        onClick={() => handleRemoveFromCart(item)}
                        className="remove"
                      >
                        ×
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="gi-cart-bottom">
              <div className="cart-sub-total">
                <table className="table cart-table">
                  <tbody>
                    <tr>
                      <td className="text-left">Sub-Total :</td>
                      <td className="text-right">${subTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="text-left">VAT (20%) :</td>
                      <td className="text-right">${vat.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="text-left">Total :</td>
                      <td className="text-right primary-color">
                        ${total.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="cart_btn">
                <Link to="/cart" className="gi-btn-1" onClick={closeCart}>
                  View Cart
                </Link>
                <Link to="/checkout" className="gi-btn-2" onClick={closeCart}>
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SidebarCart;
