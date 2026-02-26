package com.fastfeast.api;

import com.fastfeast.dao.VietQRResource;
import com.fastfeast.dao.OrderDAO;
import com.fastfeast.model.Order;
import org.json.JSONObject;

import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/api/payment/qr")
@MultipartConfig
public class PaymentServlet extends HttpServlet {

    private OrderDAO orderDAO = new OrderDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        try {
            String order_id = req.getParameter("order_id");
            String amountStr = req.getParameter("amount");

            if (order_id == null || amountStr == null) {
                throw new IllegalArgumentException("Parameter null");
            }

            int amount = Integer.parseInt(amountStr);
            if (amount <= 0) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Số tiền không hợp lệ");
                return;
            }

            Order order = orderDAO.getOrder(order_id);
            if (order == null) {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Order không tồn tại");
                return;
            }

            JSONObject vietqrResponse = VietQRResource.generateQR(order_id, amount);

            if (!"00".equals(vietqrResponse.getString("code"))) {
                throw new RuntimeException("Lỗi từ VietQR");
            }

            JSONObject data = vietqrResponse.getJSONObject("data");

            JSONObject result = new JSONObject();
            result.put("success", true);
            result.put("order_id", order_id);
            result.put("qrDataURL", data.getString("qrDataURL"));

            resp.getWriter().write(result.toString());

        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Amount không hợp lệ");
        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(500, e.getMessage());
        }
    }
}