package com.fastfeast.dao;

import com.fastfeast.model.Product;
import java.sql.*;
import java.util.*;

public class ProductDAO {
    private static final String JDBC_URL = System.getenv("JDBC_URL");
    private static final String JDBC_USER = System.getenv("JDBC_USER");
    private static final String JDBC_PASSWORD = System.getenv("JDBC_PASSWORD");

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

    public List<Product> getTopProduct(int top) {
        List<Product> products = new ArrayList<>();
        String sql = "SELECT p.product_id, p.product_name, p.product_description, p.price, p.image_url, p.category_id "
                +
                "FROM product p " +
                "JOIN order_detail od ON p.product_id = od.product_id " +
                "JOIN orders o ON od.order_id = o.order_id " +
                "WHERE o.order_status = 'Completed' " +
                "GROUP BY p.product_id, p.product_name, p.product_description, p.price, p.image_url, p.category_id " +
                "ORDER BY SUM(od.subtotal) DESC " +
                "LIMIT ?";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setInt(1, top);

                try (ResultSet rs = stmt.executeQuery()) {
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
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        return products;
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
