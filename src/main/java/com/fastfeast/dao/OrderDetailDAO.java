package com.fastfeast.dao;

import com.fastfeast.model.OrderDetail;

import java.sql.*;

public class OrderDetailDAO {
    private static final String JDBC_URL = System.getenv("JDBC_URL");
    private static final String JDBC_USER = System.getenv("JDBC_USER");
    private static final String JDBC_PASSWORD = System.getenv("JDBC_PASSWORD");

    public boolean createOrderDetail(OrderDetail detail) {
        String sql = """
                    INSERT INTO order_detail
                    (order_id, product_id, quantity, price, subtotal, discount, note)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, detail.getOrder_id());
                stmt.setString(2, detail.getProduct_id());
                stmt.setInt(3, detail.getQuantity());
                stmt.setBigDecimal(4, detail.getPrice());
                stmt.setBigDecimal(5, detail.getSubtotal());
                stmt.setBigDecimal(6, detail.getDiscount());
                stmt.setString(7, detail.getNote());

                return stmt.executeUpdate() > 0;
            }

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return false;
    }
}
