package com.fastfeast.api;

import com.fastfeast.dao.ProductDAO;
import com.fastfeast.model.Product;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

@WebServlet("/upload/products/edit")
@MultipartConfig
public class ProductEditServlet extends HttpServlet {

    private ProductDAO productDAO = new ProductDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        try {
            String id = req.getParameter("product_id");
            String name = req.getParameter("product_name");
            String description = req.getParameter("product_description");
            double price = Double.parseDouble(req.getParameter("price"));
            String categoryId = req.getParameter("category_id");

            Part imagePart = req.getPart("image");

            Product product = productDAO.getProduct(id);

            if (imagePart != null && imagePart.getSize() > 0) {
                String fileName = Paths.get(imagePart.getSubmittedFileName())
                        .getFileName().toString();
                String newFileName = System.currentTimeMillis() + "_" + fileName;

                String uploadPath = getServletContext()
                        .getRealPath("/assets/product");

                new File(uploadPath).mkdirs();
                imagePart.write(uploadPath + File.separator + newFileName);

                product.setImage_url("./assets/product/" + newFileName);
            }

            product.setProduct_name(name);
            product.setProduct_description(description);
            product.setPrice(price);
            product.setCategory_id(categoryId);

            productDAO.editProduct(product);

            resp.setStatus(HttpServletResponse.SC_OK);

        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(500, e.getMessage());
        }
    }
}
