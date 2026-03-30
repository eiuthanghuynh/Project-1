package com.fastfeast.api;

import com.fastfeast.dao.CheckoutDAO;
import com.fastfeast.dto.*;
import com.fastfeast.model.OrderDetail;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/api/checkout")
public class CheckoutServlet extends HttpServlet {

    private final CheckoutDAO checkoutDAO = new CheckoutDAO();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        req.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            CheckoutRequest request = mapper.readValue(req.getInputStream(), CheckoutRequest.class);

            if (request.getCustomer() == null || request.getItems() == null || request.getItems().isEmpty()
                    || request.getPaymentMethod() == null || request.getPaymentMethod().trim().isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST); // Lỗi 400
                resp.getWriter()
                        .write("{\"error\":\"Thiếu thông tin khách hàng, món ăn hoặc phương thức thanh toán\"}");
                return;
            }

            CustomerDTO c = request.getCustomer();
            List<OrderDetail> orderDetails = new ArrayList<>();

            for (OrderItemDTO item : request.getItems()) {
                OrderDetail od = new OrderDetail();
                od.setProduct_id(item.getProduct_id());
                od.setCombo_id(item.getCombo_id());
                od.setQuantity(item.getQuantity());
                od.setPrice(new BigDecimal(item.getPrice().toString()));
                od.setDiscount(BigDecimal.ZERO);
                od.setNote(item.getNote() != null ? item.getNote() : "");

                orderDetails.add(od);
            }

            String generatedOrderId = checkoutDAO.checkout(
                    c.getCustomer_name(),
                    c.getPhone(),
                    c.getEmail(),
                    c.getAddress(),
                    orderDetails,
                    request.getPaymentMethod());

            if (generatedOrderId != null && !generatedOrderId.trim().isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_CREATED);
                String jsonResponse = String.format(
                        "{\"message\":\"Đặt hàng thành công\", \"status\":\"success\", \"order_id\":\"%s\"}",
                        generatedOrderId);
                resp.getWriter().write(jsonResponse);
            } else {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resp.getWriter().write("{\"error\":\"Lưu đơn hàng thất bại tại Database\"}");
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