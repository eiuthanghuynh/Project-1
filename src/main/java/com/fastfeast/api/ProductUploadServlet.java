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

@WebServlet("/upload/products")
@MultipartConfig(fileSizeThreshold = 1024 * 1024, maxFileSize = 5 * 1024 * 1024, maxRequestSize = 10 * 1024 * 1024)
public class ProductUploadServlet extends HttpServlet {

    private ProductDAO productDAO = new ProductDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        try {
            String name = req.getParameter("product_name");
            String description = req.getParameter("product_description");
            double price = Double.parseDouble(req.getParameter("price"));
            String categoryId = req.getParameter("category_id");

            Part imagePart = req.getPart("image");

            String fileName = Paths.get(imagePart.getSubmittedFileName())
                    .getFileName().toString();
            String newFileName = System.currentTimeMillis() + "_" + fileName;

            String uploadPath = getServletContext()
                    .getRealPath("/assets/product");

            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists())
                uploadDir.mkdirs();

            imagePart.write(uploadPath + File.separator + newFileName);

            String imageUrl = "./assets/product/" + newFileName;

            Product product = new Product();
            product.setProduct_name(name);
            product.setProduct_description(description);
            product.setPrice(price);
            product.setCategory_id(categoryId);
            product.setImage_url(imageUrl);

            productDAO.createProduct(product);

            resp.setStatus(HttpServletResponse.SC_CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(500, e.getMessage());
        }
    }
}
