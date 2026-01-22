package com.fastfeast.dao;

import java.sql.*;
import java.util.*;

public class DashboardDAO {
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/fastfood_db";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "!Thang1407";

    public Map<String, Object> getKPI() throws Exception {
        Map<String, Object> result = new HashMap<>();

        String sql = """
                    SELECT
                        (SELECT COUNT(*) FROM orders) AS total_orders,
                        (SELECT COUNT(*) FROM customer) AS total_customers,
                        (SELECT IFNULL(SUM(od.subtotal), 0) FROM orders o JOIN order_detail od ON o.order_id = od.order_id WHERE o.order_status = "Completed") AS total_revenue,
                        (SELECT COUNT(*) FROM product) AS total_products
                """;

        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                PreparedStatement stmt = conn.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery()) {

            if (rs.next()) {
                result.put("totalOrders", rs.getInt("total_orders"));
                result.put("totalCustomers", rs.getInt("total_customers"));
                result.put("totalRevenue", rs.getDouble("total_revenue"));
                result.put("totalProducts", rs.getInt("total_products"));
            }
        }
        return result;
    }

    public List<Map<String, Object>> getOrderStatusSummary() throws Exception {
        List<Map<String, Object>> list = new ArrayList<>();

        String sql = """
                    SELECT order_status, COUNT(*) AS total
                    FROM orders
                    GROUP BY order_status
                """;

        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                PreparedStatement stmt = conn.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                row.put("order_status", rs.getString("order_status"));
                row.put("total", rs.getInt("total"));
                list.add(row);
            }
        }
        return list;
    }

    public List<Map<String, Object>> getRecentOrders() throws Exception {
        List<Map<String, Object>> list = new ArrayList<>();

        String sql = """
                    SELECT o.order_id, c.customer_name, o.order_date, o.order_status,
                           SUM(od.subtotal) AS total_price
                    FROM orders o
                    LEFT JOIN customer c ON o.customer_id = c.customer_id
                    LEFT JOIN order_detail od ON o.order_id = od.order_id
                    GROUP BY o.order_id
                    ORDER BY o.order_date DESC
                    LIMIT 5
                """;

        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                PreparedStatement stmt = conn.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                row.put("order_id", rs.getString("order_id"));
                row.put("customer_name", rs.getString("customer_name"));
                row.put("order_date", rs.getTimestamp("order_date"));
                row.put("order_status", rs.getString("order_status"));
                row.put("total_price", rs.getDouble("total_price"));
                list.add(row);
            }
        }
        return list;
    }

    public List<Map<String, Object>> getTopProducts() throws Exception {
        List<Map<String, Object>> list = new ArrayList<>();

        String sql = """
                    SELECT p.product_name, SUM(od.quantity) AS sold
                    FROM order_detail od
                    JOIN product p ON od.product_id = p.product_id
                    GROUP BY p.product_id
                    ORDER BY sold DESC
                    LIMIT 5
                """;

        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                PreparedStatement stmt = conn.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                row.put("product_name", rs.getString("product_name"));
                row.put("sold", rs.getInt("sold"));
                list.add(row);
            }
        }
        return list;
    }
}