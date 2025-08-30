import { useCart } from "../../hooks/useCart";

const QuantitySelector = ({
  id,
  quantity,
  setQuantity,
  itemId,
  productVariantId,
}: {
  id: number;
  quantity: number;
  setQuantity?: any;
  itemId?: string;
  productVariantId?: string;
}) => {
  const { updateItem } = useCart();

  const handleQuantityChange = (operation: "increase" | "decrease") => {
    let newQuantity = quantity;

    if (operation === "increase") {
      newQuantity = quantity + 1;
    } else if (operation === "decrease" && quantity > 1) {
      newQuantity = quantity - 1;
    }

    if (undefined !== setQuantity) {
      setQuantity(newQuantity);
    } else if (itemId) {
      // Use new cart system to update item quantity
      updateItem({
        itemId,
        quantity: newQuantity,
        productVariantId,
      });
    }
  };

  return (
    <>
      <div
        style={{ margin: " 0 0 0 10px", cursor: "pointer" }}
        onClick={() => handleQuantityChange("decrease")}
      >
        -
      </div>
      <input
        readOnly
        className="qty-input"
        type="text"
        name="gi-qtybtn"
        value={quantity}
      />
      <div
        style={{ margin: " 0 10px 0 0", cursor: "pointer" }}
        onClick={() => handleQuantityChange("increase")}
      >
        +
      </div>
    </>
  );
};

export default QuantitySelector;
