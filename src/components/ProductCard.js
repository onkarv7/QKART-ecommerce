import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  // console.log("product to be added to cart->", product)
  return (
    <Card className="card" key={product._id}>
      <CardMedia component="img" alt={product.name} image={product.image}/>
      {/* {console.log("product Card->", product._id)} */}
      <CardContent>
        <Typography gutterBottom variant="body" component="div">
          {product.name}
        </Typography>
        <Typography gutterBottom variant="body" component="div" color="text.primary">
          ${product.cost}
        </Typography>
        <Rating name="half-rating-read" defaultValue={product.rating} precision={0.5} readOnly />
      </CardContent>

      <CardActions>
        <Button size="small" variant="contained" fullWidth className="card-button" onClick={()=>handleAddToCart(product)}>ADD TO CART</Button>
      </CardActions>
      
    </Card>
  );
};

export default ProductCard;
