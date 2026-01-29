package com.fastfeast.dao;

import com.fastfeast.model.*;

import java.math.BigDecimal;
import java.sql.*;
import java.util.List;

public class CheckoutDAO {
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/fastfood_db";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "!Thang1407";

    public boolean checkout(String customerName, String phone, String email, String address, List<OrderDetail> items) {
        String customerSql = "INSERT INTO customer (customer_name, phone, email, address) VALUES (?, ?, ?, ?)";
        String orderSql = "INSERT INTO orders (customer_id, order_status) VALUES (?, ?)";
        String orderDetailSql = """
                    INSERT INTO order_detail
                    (order_id, product_id, quantity, price, subtotal, discount, note)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        String getCustomerIdSql = "SELECT customer_id FROM customer ORDER BY customer_id DESC LIMIT 1";
        String getOrderIdSql = "SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1";

        Connection conn = null;

        // Thêm customer vào database
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
            conn.setAutoCommit(false);

            try (PreparedStatement stmt = conn.prepareStatement(customerSql)) {

                stmt.setString(1, customerName);
                stmt.setString(2, phone);
                stmt.setString(3, email);
                stmt.setString(4, address);
                stmt.executeUpdate();
            }
            String customerId;
            try (PreparedStatement stmt = conn.prepareStatement(getCustomerIdSql);
                    ResultSet rs = stmt.executeQuery()) {

                if (!rs.next()) {
                    throw new SQLException("Can't get Customer ID");
                }
                customerId = rs.getString("customer_id");
            }

            // Thêm order mới vào database
            try (PreparedStatement stmt = conn.prepareStatement(orderSql)) {

                stmt.setString(1, customerId);
                stmt.setString(2, "Preparing");
                stmt.executeUpdate();
            }
            String orderId;
            try (PreparedStatement stmt = conn.prepareStatement(getOrderIdSql);
                    ResultSet rs = stmt.executeQuery()) {

                if (!rs.next()) {
                    throw new SQLException("Can't get Order ID");
                }
                orderId = rs.getString("order_id");
            }

            // Thêm từng món vào database (order_detail)
            try (PreparedStatement stmt = conn.prepareStatement(orderDetailSql)) {
                for (OrderDetail item : items) {
                    BigDecimal discount = BigDecimal.ZERO;
                    if (item.getDiscount() != null) {
                        discount = item.getDiscount();
                    }
                    BigDecimal subtotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                            .subtract(discount);
                    stmt.setString(1, orderId);
                    stmt.setString(2, item.getProduct_id());
                    stmt.setInt(3, item.getQuantity());
                    stmt.setBigDecimal(4, item.getPrice());
                    stmt.setBigDecimal(5, subtotal);
                    stmt.setBigDecimal(6, discount);
                    stmt.setString(7, item.getNote());

                    stmt.addBatch();
                }
                stmt.executeBatch();
            }

            conn.commit();
            return true;
        } catch (Exception e) {
            try {
                if (conn != null) {
                    conn.rollback();
                }
            } catch (Exception i) {
            }

            e.printStackTrace();
            return false;
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (Exception i) {
            }
        }
    }
}
