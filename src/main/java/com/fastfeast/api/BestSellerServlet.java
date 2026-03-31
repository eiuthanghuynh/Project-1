package com.fastfeast.api;

import com.fastfeast.dao.BestSellerDAO;
import com.fastfeast.model.Combo;
import com.fastfeast.model.Product;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/bestseller")
public class BestSellerServlet extends HttpServlet {

    private final BestSellerDAO bestSellerDAO = new BestSellerDAO();
    private final ObjectMapper mapper = new ObjectMapper();

    public static class BestSellerRequest {
        private List<String> product_ids;
        private List<String> combo_ids;

        public List<String> getProduct_ids() {
            return product_ids;
        }

        public void setProduct_ids(List<String> product_ids) {
            this.product_ids = product_ids;
        }

        public List<String> getCombo_ids() {
            return combo_ids;
        }

        public void setCombo_ids(List<String> combo_ids) {
            this.combo_ids = combo_ids;
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            List<Product> products = bestSellerDAO.getBestSellerProducts();
            List<Combo> combos = bestSellerDAO.getBestSellerCombos();

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("products", products);
            responseData.put("combos", combos);
            mapper.writeValue(resp.getWriter(), responseData);

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"Lỗi tải danh sách Best Seller: " + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        req.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            BestSellerRequest request = mapper.readValue(req.getInputStream(), BestSellerRequest.class);

            if (request == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\":\"Thiếu thông tin danh sách sản phẩm hoặc combo\"}");
                return;
            }

            boolean isSuccess = bestSellerDAO.updateBestSellers(request.getProduct_ids(), request.getCombo_ids());

            if (isSuccess) {
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("{\"message\":\"Cập nhật Best Seller thành công\", \"status\":\"success\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resp.getWriter().write("{\"error\":\"Lưu thay đổi thất bại tại Database\"}");
            }

        } catch (MismatchedInputException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Sai định dạng dữ liệu: " + e.getMessage() + "\"}");
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Lỗi xử lý: " + e.getMessage() + "\"}");
        }
    }
}