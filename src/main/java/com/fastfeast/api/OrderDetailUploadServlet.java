package com.fastfeast.api;

import com.fastfeast.dao.OrderDetailDAO;
import com.fastfeast.model.OrderDetail;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.math.BigDecimal;

@WebServlet("/upload/order-detail")
public class OrderDetailUploadServlet extends HttpServlet {

    private OrderDetailDAO orderDetailDAO = new OrderDetailDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        try {

            String orderId = req.getParameter("order_id");
            String productId = req.getParameter("product_id");
            int quantity = Integer.parseInt(req.getParameter("quantity"));
            BigDecimal price = new BigDecimal(req.getParameter("price"));

            String note = null;
            BigDecimal discount = BigDecimal.ZERO;

            if (req.getParameter("note") != null && !req.getParameter("note").isBlank()) {
                note = req.getParameter("note");
            }

            if (req.getParameter("discount") != null && !req.getParameter("discount").isBlank()) {
                discount = new BigDecimal(req.getParameter("discount"));
            }

            if (orderId == null || productId == null || quantity <= 0) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Thiếu dữ liệu");
                return;
            }

            // Dự phòng, nếu frontend đã tính subtotal trước thì không cần
            BigDecimal subtotal = price
                    .multiply(BigDecimal.valueOf(quantity))
                    .subtract(discount);

            OrderDetail detail = new OrderDetail();
            detail.setOrder_id(orderId);
            detail.setProduct_id(productId);
            detail.setQuantity(quantity);
            detail.setPrice(price);
            detail.setSubtotal(subtotal);
            detail.setDiscount(discount);
            detail.setNote(note);

            orderDetailDAO.createOrderDetail(detail);

            resp.setStatus(HttpServletResponse.SC_CREATED);
        } catch (NumberFormatException e) {
            resp.sendError(400, "Sai định dạng số");
        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(500, e.getMessage());
        }
    }
}