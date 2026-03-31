package com.fastfeast.dao;

import com.fastfeast.model.Combo;
import com.fastfeast.model.Product;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

public class BestSellerDAO {
    private static final String JDBC_URL = System.getenv("JDBC_URL");
    private static final String JDBC_USER = System.getenv("JDBC_USER");
    private static final String JDBC_PASSWORD = System.getenv("JDBC_PASSWORD");

    public List<Product> getBestSellerProducts() {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT * FROM product WHERE is_bestseller = 1 LIMIT 4";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement ps = conn.prepareStatement(sql);
                    ResultSet rs = ps.executeQuery()) {

                while (rs.next()) {
                    Product p = new Product();
                    p.setProduct_id(rs.getString("product_id"));
                    p.setProduct_name(rs.getString("product_name"));
                    p.setProduct_description(rs.getString("product_description"));
                    p.setPrice(rs.getDouble("price"));
                    p.setImage_url(rs.getString("image_url"));
                    list.add(p);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    // Lấy 2 combo bán chạy nhất
    public List<Combo> getBestSellerCombos() {
        List<Combo> list = new ArrayList<>();
        String sql = "SELECT * FROM combo WHERE is_bestseller = 1 LIMIT 2";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                    PreparedStatement ps = conn.prepareStatement(sql);
                    ResultSet rs = ps.executeQuery()) {

                while (rs.next()) {
                    Combo c = new Combo();
                    c.setCombo_id(rs.getString("combo_id"));
                    c.setCombo_name(rs.getString("combo_name"));
                    c.setCombo_description(rs.getString("combo_description"));
                    c.setPrice(rs.getDouble("price"));
                    c.setImage_url(rs.getString("image_url"));
                    list.add(c);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean updateBestSellers(List<String> productIds, List<String> comboIds) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
                conn.setAutoCommit(false);

                try {
                    try (PreparedStatement resetP = conn.prepareStatement("UPDATE product SET is_bestseller = 0");
                            PreparedStatement resetC = conn.prepareStatement("UPDATE combo SET is_bestseller = 0")) {
                        resetP.executeUpdate();
                        resetC.executeUpdate();
                    }

                    if (productIds != null && !productIds.isEmpty()) {
                        String pSql = "UPDATE product SET is_bestseller = 1 WHERE product_id IN ("
                                + buildPlaceholders(productIds.size()) + ")";
                        try (PreparedStatement ps1 = conn.prepareStatement(pSql)) {
                            for (int i = 0; i < productIds.size(); i++) {
                                ps1.setString(i + 1, productIds.get(i));
                            }
                            ps1.executeUpdate();
                        }
                    }

                    if (comboIds != null && !comboIds.isEmpty()) {
                        String cSql = "UPDATE combo SET is_bestseller = 1 WHERE combo_id IN ("
                                + buildPlaceholders(comboIds.size()) + ")";
                        try (PreparedStatement ps2 = conn.prepareStatement(cSql)) {
                            for (int i = 0; i < comboIds.size(); i++) {
                                ps2.setString(i + 1, comboIds.get(i));
                            }
                            ps2.executeUpdate();
                        }
                    }

                    conn.commit();
                    return true;
                } catch (SQLException ex) {
                    conn.rollback();
                    ex.printStackTrace();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    private String buildPlaceholders(int count) {
        return String.join(",", Collections.nCopies(count, "?"));
    }
}