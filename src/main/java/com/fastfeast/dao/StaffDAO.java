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