package com.fastfeast.dao;

import com.fastfeast.model.OrderDetail;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class OrderDetailDAO {
    private static final String JDBC_URL = System.getenv("JDBC_URL");
    private static final String JDBC_USER = System.getenv("JDBC_USER");
    private static final String JDBC_PASSWORD = System.getenv("JDBC_PASSWORD");

    // public boolean createOrderDetail(OrderDetail detail) {
    // String sql = """
    // INSERT INTO order_detail
    // (order_id, product_id, quantity, price, subtotal, discount, note)
    // VALUES (?, ?, ?, ?, ?, ?, ?)
    // """;

    // try {
    // Class.forName("com.mysql.cj.jdbc.Driver");

    // try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER,
    // JDBC_PASSWORD);
    // PreparedStatement stmt = conn.prepareStatement(sql)) {

    // stmt.setString(1, detail.getOrder_id());
    // stmt.setString(2, detail.getProduct_id());
    // stmt.setInt(3, detail.getQuantity());
    // stmt.setBigDecimal(4, detail.getPrice());
    // stmt.setBigDecimal(5, detail.getSubtotal());
    // stmt.setBigDecimal(6, detail.getDiscount());
    // stmt.setString(7, detail.getNote());

    // return stmt.executeUpdate() > 0;
    // }

    // } catch (SQLException | ClassNotFoundException e) {
    // e.printStackTrace();
    // }
    // return false;
    // }

    public List<OrderDetail> getOrderDetails(String orderId) {
        List<OrderDetail> details = new ArrayList<>();
        String sql = """
                    SELECT od.*, p.product_name, c.combo_name
                    FROM order_detail od
                    LEFT JOIN product p ON od.product_id = p.product_id
                    LEFT JOIN combo c ON od.combo_id = c.combo_id
                    WHERE od.order_id = ?
                """;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, orderId);

                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        OrderDetail detail = new OrderDetail();
                        detail.setOrder_id(rs.getString("order_id"));
                        detail.setProduct_id(rs.getString("product_id"));
                        detail.setCombo_id(rs.getString("combo_id"));
                        detail.setQuantity(rs.getInt("quantity"));
                        detail.setPrice(rs.getBigDecimal("price"));
                        detail.setSubtotal(rs.getBigDecimal("subtotal"));
                        detail.setDiscount(rs.getBigDecimal("discount"));
                        detail.setNote(rs.getString("note"));
                        String comboName = rs.getString("combo_name");
                        String productName = rs.getString("product_name");

                        if (comboName != null) {
                            detail.setCombo_name(comboName);
                            detail.setType("combo");
                        } else {
                            detail.setProduct_name(productName);
                            detail.setType("product");
                        }

                        details.add(detail);
                    }
                }
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return details;
    }
}
