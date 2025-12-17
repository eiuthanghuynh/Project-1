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
                    PreparedStatement stmt = conn.prepareStatement(sql);
                    ResultSet rs = stmt.executeQuery()) {

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

    public Product getProduct(String product_id) {
        Product product = new Product();
        String sql = "SELECT product_id, product_name, product_description, price, image_url, category_id FROM product WHERE product_id = ?";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, product_id);
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        product.setProduct_id(rs.getString("product_id"));
                        product.setProduct_name(rs.getString("product_name"));
                        product.setPrice(rs.getDouble("price"));
                        product.setProduct_description(rs.getString("product_description"));
                        product.setImage_url(rs.getString("image_url"));
                        product.setCategory_id(rs.getString("category_id"));
                        return product;
                    }
                }
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        return null;
    }

    public boolean createProduct(Product product) {
        String sql = "INSERT INTO product (product_id, product_name, product_description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?)";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, product.getProduct_id());
                stmt.setString(2, product.getProduct_name());
                stmt.setString(3, product.getProduct_description());
                stmt.setDouble(4, product.getPrice());
                stmt.setString(5, product.getImage_url());
                stmt.setString(6, product.getCategory_id());

                return stmt.executeUpdate() > 0;
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean editProduct(Product product) {
        String sql = "UPDATE product SET product_name = ?, product_description = ?, price = ?, image_url = ?, category_id = ? WHERE product_id = ?";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, product.getProduct_name());
                stmt.setString(2, product.getProduct_description());
                stmt.setDouble(3, product.getPrice());
                stmt.setString(4, product.getImage_url());
                stmt.setString(5, product.getCategory_id());
                stmt.setString(6, product.getProduct_id());

                return stmt.executeUpdate() > 0;
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteProduct(String product_id) {
        String sql = "DELETE FROM product WHERE product_id = ?";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, product_id);

                return stmt.executeUpdate() > 0;
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return false;
    }
}
