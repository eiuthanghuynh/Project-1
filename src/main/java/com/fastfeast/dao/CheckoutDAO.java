package com.fastfeast.dao;

import com.fastfeast.model.*;

import java.math.BigDecimal;
import java.sql.*;
import java.util.List;

public class CheckoutDAO {
    private static final String JDBC_URL = System.getenv("JDBC_URL");
    private static final String JDBC_USER = System.getenv("JDBC_USER");
    private static final String JDBC_PASSWORD = System.getenv("JDBC_PASSWORD");

    public String checkout(String customerName, String phone, String email, String address, List<OrderDetail> items,
            String paymentMethod) {

        String customerSql = "INSERT INTO customer (customer_id, customer_name, phone, email, address) VALUES ('', ?, ?, ?, ?)";
        String getCustomerIdSql = "SELECT customer_id FROM customer ORDER BY customer_id DESC LIMIT 1";

        String orderSql = "INSERT INTO orders (order_id, customer_id, total_amount, order_status) VALUES ('', ?, ?, ?)";
        String getOrderIdSql = "SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1";

        String orderDetailSql = """
                    INSERT INTO order_detail
                    (order_id, product_id, combo_id, quantity, price, subtotal, discount, note)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        String paymentSql = "INSERT INTO payment (payment_id, order_id, payment_method, amount, payment_status) VALUES ('', ?, ?, ?, ?)";

        Connection conn = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
            conn.setAutoCommit(false);

            BigDecimal totalAmount = BigDecimal.ZERO;
            for (OrderDetail item : items) {
                BigDecimal discount = item.getDiscount() != null ? item.getDiscount() : BigDecimal.ZERO;
                BigDecimal subtotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                        .subtract(discount);
                totalAmount = totalAmount.add(subtotal);
            }

            String customerId = "";
            String orderId = "";

            try (PreparedStatement stmt = conn.prepareStatement(customerSql)) {
                stmt.setString(1, customerName);
                stmt.setString(2, phone);
                stmt.setString(3, email);
                stmt.setString(4, address);
                stmt.executeUpdate();
            }
            // Fetch lại ID vừa tạo
            try (PreparedStatement stmt = conn.prepareStatement(getCustomerIdSql);
                    ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    customerId = rs.getString("customer_id");
                } else {
                    throw new SQLException("Không thể lấy Customer ID vừa tạo.");
                }
            }

            try (PreparedStatement stmt = conn.prepareStatement(orderSql)) {
                stmt.setString(1, customerId);
                stmt.setBigDecimal(2, totalAmount);
                stmt.setString(3, "Pending");
                stmt.executeUpdate();
            }
            // Fetch lại ID vừa tạo
            try (PreparedStatement stmt = conn.prepareStatement(getOrderIdSql);
                    ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    orderId = rs.getString("order_id");
                } else {
                    throw new SQLException("Không thể lấy Order ID vừa tạo.");
                }
            }

            try (PreparedStatement stmt = conn.prepareStatement(orderDetailSql)) {
                for (OrderDetail item : items) {
                    BigDecimal discount = item.getDiscount() != null ? item.getDiscount() : BigDecimal.ZERO;
                    BigDecimal subtotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                            .subtract(discount);

                    stmt.setString(1, orderId);
                    if (item.getProduct_id() != null && !item.getProduct_id().trim().isEmpty()) {
                        stmt.setString(2, item.getProduct_id());
                        stmt.setNull(3, java.sql.Types.VARCHAR);
                    } else if (item.getCombo_id() != null && !item.getCombo_id().trim().isEmpty()) {
                        stmt.setNull(2, java.sql.Types.VARCHAR);
                        stmt.setString(3, item.getCombo_id());
                    } else {
                        throw new SQLException("Dữ liệu giỏ hàng bị lỗi: Không có cả Product ID lẫn Combo ID");
                    }
                    stmt.setInt(4, item.getQuantity());
                    stmt.setBigDecimal(5, item.getPrice());
                    stmt.setBigDecimal(6, subtotal);
                    stmt.setBigDecimal(7, discount);
                    stmt.setString(8, item.getNote());
                    stmt.addBatch();
                }
                stmt.executeBatch();
            }

            try (PreparedStatement stmt = conn.prepareStatement(paymentSql)) {
                stmt.setString(1, orderId);
                stmt.setString(2, paymentMethod);
                stmt.setBigDecimal(3, totalAmount);
                String initialPayStatus = paymentMethod.equalsIgnoreCase("Cash") ? "Completed" : "Pending";
                stmt.setString(4, initialPayStatus);
                stmt.executeUpdate();
            }

            conn.commit();
            return orderId;

        } catch (Exception e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            e.printStackTrace();
            return null;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }
    }
}