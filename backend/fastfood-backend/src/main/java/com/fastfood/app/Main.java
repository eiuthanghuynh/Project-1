package com.fastfood.app;

import com.fastfood.app.dao.ProductDAO;
import com.fastfood.app.model.Product;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        ProductDAO dao = new ProductDAO();
        List<Product> productList = dao.getAllProducts();
        for (Product p : productList) {
            System.out.println("ID: " + p.getProduct_id());
            System.out.println("Name: " + p.getProduct_name());
            System.out.println("Price: " + p.getPrice());
            System.out.println("Description: " + p.getProduct_description());
            System.out.println("Image: " + p.getImage_url());
            System.out.println("Category ID: " + p.getCategory_id() + "\n");
        }
    }
}