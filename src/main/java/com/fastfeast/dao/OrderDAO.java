package com.fastfeast.dao;

import com.fastfeast.model.Order;
import java.sql.*;
import java.util.*;

public class OrderDAO {
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/fastfood_db";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "!Thang1407";

    public List<Order> getAllOrders() {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT o.order_id, o.customer_id, c.customer_name, o.order_date, o.order_status FROM orders o JOIN customer c ON c.customer_id = o.customer_id";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery(sql)) {

                while (rs.next()) {
                    Timestamp ts = rs.getTimestamp("o.order_date");
                    GregorianCalendar gc = new GregorianCalendar();
                    gc.setTimeInMillis(ts.getTime());
                    Order order = new Order(
                            rs.getString("o.order_id"),
                            rs.getString("o.customer_id"),
                            gc,
                            rs.getString("o.order_status"));
                    order.setCustomer_name(rs.getString("c.customer_name"));
                    orders.add(order);
                }
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        return orders;
    }

    public Order getOrder(String order_id) {
        Order order = new Order();
        String sql = "SELECT o.order_id, o.customer_id, c.customer_name, o.order_date, o.order_status FROM orders o JOIN customer c ON c.customer_id = o.customer_id WHERE o.order_id = \""
                + order_id + "\"";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery(sql)) {

                while (rs.next()) {
                    Timestamp ts = rs.getTimestamp("o.order_date");
                    GregorianCalendar gc = new GregorianCalendar();
                    gc.setTimeInMillis(ts.getTime());
                    order.setOrder_id(rs.getString("o.order_id"));
                    order.setCustomer_id(rs.getString("o.customer_id"));
                    order.setCustomer_name(rs.getString("c.customer_name"));
                    order.setOrder_date(gc);
                    order.setOrder_status(rs.getString("o.order_status"));
                }
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        return order;
    }

    public boolean createOrder(Order order) {
        String sql = "INSERT INTO orders (customer_id, order_status) VALUES (?, ?)";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, order.getCustomer_id());
                stmt.setString(2, "Preparing");

                return stmt.executeUpdate() > 0;
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateOrderStatus(String orderId, String status) {
        String sql = "UPDATE orders SET order_status=? WHERE order_id=?";
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, status);
                stmt.setString(2, orderId);
                return stmt.executeUpdate() > 0;
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return false;
    }
}
