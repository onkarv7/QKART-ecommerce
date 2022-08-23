import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";
import { useState } from "react";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  // console.log("cart in CART.js->", productsData);
  if (!cartData.length || !productsData.length) {
    return;
  }
  const cartItems = [];
  const products = productsData;
  console.log("products", products)
  cartData.forEach((data) => {
    const product = products.filter((product) => {
      return product._id === data.productId;
    });
    // console.log(data)
    const details = {
      ...data,
      ...product[0],
    };
    cartItems.push(details);
  });
  return cartItems;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {

  let total = 0;
  if (items.length > 0) {
    for (let i = 0; i < items.length; i++) {
      total += items[i].cost * items[i].qty;
    }
  }
  return total;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */


// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
const GetTotalItems = (items = [], readOnly) => {

  let ShippingCharge = 0;
  let subTotal = getTotalCartValue(items.items)
  let total = ShippingCharge + subTotal

  return (
    <>
      {readOnly === true && (


        <Box padding="1rem">
          <h3>Order Details</h3>
          <Stack direction="column" alignItems="center"  >
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
              <Box paddingBottom="1rem">
                Products
          </Box>
              <Box paddingBottom="1rem">
                {items.items.length}
              </Box>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
              <Box paddingBottom="1rem">
                Sub Total
        </Box>
              <Box paddingBottom="1rem">
                {subTotal}
              </Box>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
              <Box paddingBottom="1rem">
                Shipping Charges
        </Box>
              <Box paddingBottom="1rem">
                {ShippingCharge}
              </Box>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
              <Box paddingBottom="1rem">
                <h4>
                  Total
          </h4>
              </Box>
              <Box paddingBottom="1rem">
                <h4>
                  {total}
                </h4>
              </Box>
            </Box>
          </Stack>
        </Box>
      )}
    </>
  )
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  readOnly
}) => {

  console.log("1", readOnly)

  return (
    <>
      {readOnly === false ?
        (<Stack direction="row" alignItems="center">
          <IconButton size="small" color="primary" onClick={handleDelete}>
            <RemoveOutlined />
          </IconButton>
          <Box padding="0.5rem" data-testid="item-qty">
            {value}
          </Box>
          <IconButton size="small" color="primary" onClick={handleAdd}>
            <AddOutlined />
          </IconButton>
        </Stack>)
        :
        (<Stack direction="row" alignItems="center">
          <Box padding="0.5rem" data-testid="item-qty">
            Qty: {value}
          </Box>
        </Stack>)
      }
    </>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */

const Cart = ({ isReadOnly = false, products, items = [], handleQuantity }) => {

  // const [readOnly, setReadOnly] = useState("");
  console.log("readOnly===>>", items);

  // if(readOnly !== isReadOnly) {
  //   setReadOnly(isReadOnly);
  // }

  const history = useHistory();
  // {
  //   console.log("itmea->", items);
  // }

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

        {items.map((item) => (
          <Box display="flex" alignItems="flex-start" padding="1rem" key={item._id}>
            <Box className="image-container">

              <img
                // Add product image
                src={item.image}
                // Add product name as alt eext
                alt={item.name}
                width="100%"
                height="100%"
              />
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="space-between" height="6rem" paddingX="1rem" >
              <div>{item.name}</div>
              <Box display="flex" justifyContent="space-between" alignItems="center" >
                <ItemQuantity value={item.qty}
                  handleAdd={() => handleQuantity(item.productId, Number(item.qty) + 1)}
                  handleDelete={() => handleQuantity(item.productId, Number(item.qty) - 1)}
                  readOnly={isReadOnly}
                // Add required props by checking implementation
                />
                <Box padding="0.5rem" fontWeight="700">
                  ${item.cost}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        {isReadOnly === false && (

          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => {
                history.push("/checkout");
              }}
            >
              Checkout
          </Button>
          </Box>
        )}
      </Box>
      <Box className="cart">
        <GetTotalItems items={items} readOnly={isReadOnly} />
        {/* hello */}
      </Box>
    </>
  );
};

export default Cart;
