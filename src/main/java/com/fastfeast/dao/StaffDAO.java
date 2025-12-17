package com.fastfeast.dao;

import com.fastfeast.model.Staff;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import at.favre.lib.crypto.bcrypt.BCrypt;

public class StaffDAO {

    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/fastfood_db";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "!Thang1407";

    public List<Staff> getAllStaff() {
        List<Staff> staffs = new ArrayList<>();
        String sql = "SELECT staff_id, staff_username, staff_name, staff_email, role FROM staff";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery(sql)) {

                while (rs.next()) {
                    Staff staff = new Staff(
                            rs.getString("staff_id"),
                            rs.getString("staff_username"),
                            rs.getString("staff_name"),
                            rs.getString("staff_email"),
                            rs.getInt("role"));
                    staffs.add(staff);
                }

            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        return staffs;
    }

    public Staff getStaffById(String staffId) {
        Staff staff = new Staff();
        String sql = "SELECT staff_id, staff_username, staff_name, staff_email, role FROM staff WHERE staff_id = ?";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, staffId);

                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        staff.setStaff_id(rs.getString("staff_id"));
                        staff.setStaff_username(rs.getString("staff_username"));
                        staff.setStaff_name(rs.getString("staff_name"));
                        staff.setStaff_email(rs.getString("staff_email"));
                        staff.setRole(rs.getInt("role"));
                        return staff;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean createStaff(Staff staff) {
        String sql = """
                INSERT INTO staff (staff_username, staff_password, staff_name, staff_email, role)
                VALUES (?, ?, ?, ?, ?)
                """;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            String hashedPassword = BCrypt.withDefaults()
                    .hashToString(12, staff.getStaff_password().toCharArray());

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, staff.getStaff_username());
                stmt.setString(2, hashedPassword);
                stmt.setString(3, staff.getStaff_name());
                stmt.setString(4, staff.getStaff_email());
                stmt.setInt(5, staff.getRole());

                return stmt.executeUpdate() > 0;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateStaff(Staff staff) {
        boolean hasPassword = staff.getStaff_password() != null && !staff.getStaff_password().isBlank();

        String sql = hasPassword
                ? "UPDATE staff SET staff_username=?, staff_password=?, staff_name=?, staff_email=?, role=? WHERE staff_id=?"
                : "UPDATE staff SET staff_username=?, staff_name=?, staff_email=?, role=? WHERE staff_id=?";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                int index = 1;

                stmt.setString(index++, staff.getStaff_username());

                if (hasPassword) {
                    String hashedPassword = BCrypt.withDefaults()
                            .hashToString(12, staff.getStaff_password().toCharArray());
                    stmt.setString(index++, hashedPassword);
                }

                stmt.setString(index++, staff.getStaff_name());
                stmt.setString(index++, staff.getStaff_email());
                stmt.setInt(index++, staff.getRole());
                stmt.setString(index, staff.getStaff_id());

                return stmt.executeUpdate() > 0;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteStaff(String staffId) {
        String sql = "DELETE FROM staff WHERE staff_id = ?";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, staffId);
                return stmt.executeUpdate() > 0;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public Staff checkLogin(String username, String password) {
        String sql = "SELECT * FROM staff WHERE staff_username=?";
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, username);

                ResultSet rs = stmt.executeQuery();
                if (rs.next()) {
                    String hashedPassword = rs.getString("staff_password");

                    BCrypt.Result result = BCrypt.verifyer().verify(password.toCharArray(), hashedPassword);
                    if (result.verified) {
                        Staff staff = new Staff(
                                rs.getString("staff_id"),
                                rs.getString("staff_username"),
                                rs.getString("staff_name"),
                                rs.getString("staff_email"),
                                rs.getInt("role"));
                        staff.setStaff_password(rs.getString("staff_password"));
                        return staff;
                    }
                }
            }

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }
}