package com.fastfeast.dao;

import com.fastfeast.model.Customer;
import java.sql.*;

public class CustomerDAO {
    private static final String JDBC_URL = System.getenv("JDBC_URL");
    private static final String JDBC_USER = System.getenv("JDBC_USER");
    private static final String JDBC_PASSWORD = System.getenv("JDBC_PASSWORD");

    public Customer getCustomer(String customer_id) {
        Customer customer = new Customer();
        String sql = "SELECT * FROM customer WHERE customer_id = ?";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, customer_id);
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        customer.setCustomer_name(rs.getString("customer_name"));
                        customer.setPhone(rs.getString("phone"));
                        customer.setEmail(rs.getString("email"));
                        customer.setAddress(rs.getString("address"));
                    }
                }
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return customer;
    }

    public String getCustomerId(String customer_name, String phone) {
        String customer_id = null;
        String sql = "SELECT customer_id FROM customer WHERE customer_name = ? AND phone = ?";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, customer_name);
                stmt.setString(2, phone);

                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        customer_id = rs.getString("customer_id");
                    }
                }
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return customer_id;
    }

    public boolean createCustomer(Customer customer) {
        String sql = "INSERT INTO customer (customer_name, phone, email, address) VALUES (?, ?, ?, ?)";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, customer.getCustomer_name());
                stmt.setString(2, customer.getPhone());
                stmt.setString(3, customer.getEmail());
                stmt.setString(4, customer.getAddress());

                return stmt.executeUpdate() > 0;
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return false;
    }
}
