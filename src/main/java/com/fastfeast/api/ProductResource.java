package com.fastfeast.api;

import com.fastfeast.dao.ProductDAO;
import com.fastfeast.model.Product;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/products")
public class ProductResource {

    private ProductDAO productDAO = new ProductDAO();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getProducts() {
        return productDAO.getAllProducts();
    }

    @GET
    @Path("/{product_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProduct(@PathParam("product_id") String product_id) {
        Product product = productDAO.getProduct(product_id);

        if (product == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Không tìm thấy product")
                    .build();
        }

        return Response.ok(product).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createProduct(Product product) {
        boolean success = productDAO.createProduct(product);
        
        if (!success) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Không thể tạo product")
                    .build();
        }

        return Response.status(Response.Status.CREATED)
                .entity(product)
                .build();
    }

    @PUT
    @Path("/{product_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response editProduct(@PathParam("product_id") String product_id, Product product) {
        product.setProduct_id(product_id);
        productDAO.editProduct(product);
        return Response.ok()
                .entity(product)
                .build();
    }

    @DELETE
    @Path("/{product_id}")
    public Response deleteProduct(@PathParam("product_id") String product_id) {
        productDAO.deleteProduct(product_id);
        return Response.ok().build();
    }
}