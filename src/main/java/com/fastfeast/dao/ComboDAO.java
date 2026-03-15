package com.fastfeast.dao;

import com.fastfeast.model.Combo;
import java.sql.*;
import java.util.*;

public class ComboDAO {
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/fastfood_db";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "!Thang1407";

    public List<Combo> getAllCombos() {
        List<Combo> combos = new ArrayList<>();
        String sql = "SELECT combo_id, combo_name, combo_description, price, image_url FROM combo";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql);
                    ResultSet rs = stmt.executeQuery()) {

                while (rs.next()) {
                    Combo combo = new Combo(
                            rs.getString("combo_id"),
                            rs.getString("combo_name"),
                            rs.getDouble("price"));
                    combo.setCombo_description(rs.getString("combo_description"));
                    combo.setImage_url(rs.getString("image_url"));
                    combo.setProduct_ids(getProductIdsByCombo(conn, combo.getCombo_id()));

                    combos.add(combo);
                }
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        return combos;
    }

    public Combo getCombo(String combo_id) {
        Combo combo = new Combo();
        String sql = "SELECT combo_id, combo_name, combo_description, price, image_url FROM combo WHERE combo_id = ?";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, combo_id);
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        combo.setCombo_id(rs.getString("combo_id"));
                        combo.setCombo_name(rs.getString("combo_name"));
                        combo.setPrice(rs.getDouble("price"));
                        combo.setCombo_description(rs.getString("combo_description"));
                        combo.setImage_url(rs.getString("image_url"));
                        combo.setProduct_ids(getProductIdsByCombo(conn, combo_id));

                        return combo;
                    }
                }
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        return null;
    }

    public boolean createCombo(Combo combo) {
        // 1. Câu lệnh lấy ID lớn nhất hiện tại
        String sqlGetId = "SELECT combo_id FROM combo ORDER BY combo_id DESC LIMIT 1";
        // 2. Câu lệnh insert Combo
        String sqlInsertCombo = "INSERT INTO combo (combo_id, combo_name, combo_description, price, image_url) VALUES (?, ?, ?, ?, ?)";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
                conn.setAutoCommit(false);

                try {
                    // Trick lỏ lấy combo_id
                    String nextId = "PC0001";
                    try (PreparedStatement stmtId = conn.prepareStatement(sqlGetId);
                            ResultSet rs = stmtId.executeQuery()) {
                        if (rs.next()) {
                            String lastId = rs.getString("combo_id");
                            int num = Integer.parseInt(lastId.substring(2));
                            nextId = String.format("PC%04d", num + 1);
                        }
                    }

                    try (PreparedStatement stmtCombo = conn.prepareStatement(sqlInsertCombo)) {
                        stmtCombo.setString(1, nextId);
                        stmtCombo.setString(2, combo.getCombo_name());
                        stmtCombo.setString(3, combo.getCombo_description());
                        stmtCombo.setDouble(4, combo.getPrice());
                        stmtCombo.setString(5, combo.getImage_url());
                        stmtCombo.executeUpdate();
                    }

                    if (combo.getProduct_ids() != null && !combo.getProduct_ids().isEmpty()) {
                        insertComboProducts(conn, nextId, combo.getProduct_ids());
                    }

                    conn.commit();
                    return true;

                } catch (SQLException e) {
                    conn.rollback();
                    e.printStackTrace();
                    return false;
                } finally {
                    conn.setAutoCommit(true);
                }
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean editCombo(Combo combo) {
        String sqlUpdateCombo = "UPDATE combo SET combo_name = ?, combo_description = ?, price = ?, image_url = ? WHERE combo_id = ?";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {

                conn.setAutoCommit(false);

                try {

                    try (PreparedStatement stmtCombo = conn.prepareStatement(sqlUpdateCombo)) {
                        stmtCombo.setString(1, combo.getCombo_name());
                        stmtCombo.setString(2, combo.getCombo_description());
                        stmtCombo.setDouble(3, combo.getPrice());
                        stmtCombo.setString(4, combo.getImage_url());
                        stmtCombo.setString(5, combo.getCombo_id());
                        stmtCombo.executeUpdate();
                    }

                    deleteComboProducts(conn, combo.getCombo_id());

                    if (combo.getProduct_ids() != null && !combo.getProduct_ids().isEmpty()) {
                        insertComboProducts(conn, combo.getCombo_id(), combo.getProduct_ids());
                    }

                    conn.commit();
                    return true;

                } catch (SQLException e) {
                    conn.rollback();
                    e.printStackTrace();
                    return false;
                } finally {
                    conn.setAutoCommit(true);
                }
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteCombo(String combo_id) {
        String sql = "DELETE FROM combo WHERE combo_id = ?";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
                deleteComboProducts(conn, combo_id);

                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, combo_id);
                    return stmt.executeUpdate() > 0;
                }
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return false;
    }

    private List<String> getProductIdsByCombo(Connection conn, String comboId) throws SQLException {
        List<String> productIds = new ArrayList<>();
        String sql = "SELECT product_id FROM combo_product WHERE combo_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, comboId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    productIds.add(rs.getString("product_id"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return productIds;
    }

    private void insertComboProducts(Connection conn, String comboId, List<String> productIds) throws SQLException {
        String sql = "INSERT INTO combo_product (combo_id, product_id) VALUES (?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (String productId : productIds) {
                stmt.setString(1, comboId);
                stmt.setString(2, productId);
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    private void deleteComboProducts(Connection conn, String comboId) throws SQLException {
        String sql = "DELETE FROM combo_product WHERE combo_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, comboId);
            stmt.executeUpdate();
        }
    }
}