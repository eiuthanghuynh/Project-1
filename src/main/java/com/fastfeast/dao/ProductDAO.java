package com.fastfeast.dao;

import com.fastfeast.model.Product;
import java.sql.*;
import java.util.*;

public class ProductDAO {
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/fastfood_db";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "!Thang1407";

    public List<Product> getAllProducts() {
        List<Product> products = new ArrayList<>();
        String sql = "SELECT product_id, product_name, product_description, price, image_url, category_id FROM product";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery(sql)) {

                while (rs.next()) {
                    Product product = new Product(
                            rs.getString("product_id"),
                            rs.getString("product_name"),
                            rs.getDouble("price"));
                    product.setProduct_description(rs.getString("product_description"));
                    product.setImage_url(rs.getString("image_url"));
                    product.setCategory_id(rs.getString("category_id"));
                    products.add(product);
                }

            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        return products;
    }
}
