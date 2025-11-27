package com.fastfeast.api;

import com.fastfeast.dao.ProductDAO;
import com.fastfeast.model.Product;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/products")
public class ProductResource {

    private ProductDAO productDAO = new ProductDAO();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getProducts() {
        return productDAO.getAllProducts();
    }
}