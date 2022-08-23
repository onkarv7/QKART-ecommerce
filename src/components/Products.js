import { Search, SentimentDissatisfied } from "@mui/icons-material";
import { CircularProgress, Grid, Item, InputAdornment, TextField, Button } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard.js";
import Cart from "./Cart.js";
import { generateCartItemsFrom } from "./Cart.js";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();

  const userNameInLocalStorage = window.localStorage.getItem("username");
  const logIn_NameIsPresent = userNameInLocalStorage ? true : false;
  const token = window.localStorage.getItem("token");

  const [data, setData] = useState({
    data: [],
    items: [],
  });
  const [cartLoad, setCartLoad] = useState(false);
  const [load, setLoad] = useState(false);
  const [success, setSuccess] = useState(false);
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    performAPICall();
  }, []);

  useEffect(() => {
    fetchCart(token);
  }, [cartLoad]);

  const performAPICall = async () => {
    setLoad(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setData((val) => ({ ...val, data: response.data }));
      // setProductData(response.data);
      setSuccess(true);
      setLoad(false);
      setCartLoad(true);
    } catch (error) {
      // console.log("er->", error.response);
      enqueueSnackbar(error.response.statusText, { variant: "warning" });
      setLoad(false);
    }
  };


  const performSearch = async (text) => {
    const searchProduct = text.target.value;
    try {
      const response = await axios(
        `${config.endpoint}/products/search?value=${searchProduct}`
      );
      // console.log("searchData->", response.data);
      setData((val) => ({ ...val, data: response.data }));
      setSuccess(true);
    } catch (error) {
      // console.log("err->>",error.response)
      // console.log("req->", error.request)

      if (error.response) {
        enqueueSnackbar(error.response.statusText, { variant: "warning" });
      }
      setSuccess(false);
    }
  };



  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      // console.log("res->", response)
      setData((val) => ({ ...val, items: generateCartItemsFrom(response.data, data.data) }));

      // console.log("cart get response->", response.data)

    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // fetchCart(localStorage.token)

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    console.log("isItemIncart->>>>>", items===undefined, productId)
    // console.log("cart data>>>", data.items.length);

    if(items === undefined) {return false};

    
    let itemAlreadyPresentInCart = false;
    // if(data.items.length)
    items.map((item) => {
      if (item.productId === productId) {
        itemAlreadyPresentInCart = true;
        console.log("loop of item")
      }
      console.log(100)
    })
    console.log("itemAlreadyPresentInCart", itemAlreadyPresentInCart);

   return itemAlreadyPresentInCart;
    // console.log("e", items[0].productId)
    // console.log("pr", productId);

  };

  const handleCart = (productid) => {
    console.log("data.items=>", data.items)
    addToCart(token, data.items, data.data, productid, 1);
  }


  const handleQuantity = (itemInCartId, qtyToChange) => {
    addToCartMain(itemInCartId, qtyToChange);
  }

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (token, items, products, productId, qty, options = { preventDuplicate: false }) => {
    // console.log("token->", token)
    if (token) {
      // console.log('clicked')
      if (!isItemInCart(items, productId)) {
        console.log("clicked", productId);
        addToCartMain(productId, qty)

      } else {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item",
          { variant: "warning" }
        );
      }
    } else {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
    }
  };

  const addToCartMain = async(productId, qty) => {
    try {
      console.log("test")
      const response = await axios.post(`${config.endpoint}/cart`,
        {
          "productId": productId,
          "qty": qty,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      )
      console.log("backend cart ->", response.data)
      setData((data) => ({ ...data, items: generateCartItemsFrom(response.data, data.data), }))
    } catch (error) {
      if (error.response) {
        console.log("send item to cart backend->", error.response.statusText);
      }
    }
  }

  const debounceSearch = (event, debounceTimeout) => {
    if (delay !== 0) {
      clearTimeout(delay);
    }
    const timer = setTimeout(() => performSearch(event), debounceTimeout);
    setDelay(timer);
  };

  return (
    <div>
      <Header children>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <Box>
          <TextField
            className="search-desktop"
            size="small"
            sx={{ width: "45vw" }}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            onChange={(e) => debounceSearch(e, 500)}
            placeholder="Search for items/categories"
            name="search"
          />
        </Box>
      </Header>

      {/* Search view for mobiles */}

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        onChange={(e) => debounceSearch(e, 500)}
        placeholder="Search for items/categories"
        name="search"
      />

      <Grid container mb={2}>
        <Grid item md={logIn_NameIsPresent ? 9 : 12}>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>

          {/* when the api is fetchingn the products from backend it displays loading icon */}
          {load === true && (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              className="loading"
            >
              <Grid item>
                <CircularProgress size={40} color="success" />
              </Grid>
              <Grid item>
                <div>Loading Products...</div>
              </Grid>
            </Grid>
          )}

          {!load && !success && (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              className="loading"
            >
              <Grid item>
                <div>No Products Found</div>
              </Grid>
            </Grid>
          )}

          {/* After loading render the product on the page */}
          <Grid item ml={1} my={2}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 1, md: 1 }}
            >
              {success === true &&
                data.data.map((item) => (
                  <Grid item xs={6} sm={6} md={3} key={item._id}>
                    <ProductCard product={item} handleAddToCart={(selectedItem) => handleCart(selectedItem._id)} />
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>

        {logIn_NameIsPresent && (

          <Grid item md={3} xs={12} style={{ backgroundColor: "#E9F5E1" }} mb={2}>

            <Cart products={data.data} items={data.items} handleQuantity={handleQuantity} />

          </Grid>
        )}
      </Grid>
      {/* {success === false && <div>No products Found</div>} */}

      <Footer />
    </div>
  );
};

export default Products;
