package com.fastfeast.api;

import com.fastfeast.dao.CheckoutDAO;
import com.fastfeast.dto.*;
import com.fastfeast.model.OrderDetail;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        try {
            CheckoutRequest request = mapper.readValue(req.getInputStream(), CheckoutRequest.class);
            CustomerDTO c = request.getCustomer();
            List<OrderDetail> orderDetails = new ArrayList<>();

            for (OrderItemDTO item : request.getItems()) {
                OrderDetail od = new OrderDetail();
                od.setProduct_id(item.getProduct_id());
                od.setQuantity(item.getQuantity());
                od.setPrice(item.getPrice());
                od.setDiscount(BigDecimal.ZERO);
                od.setNote(item.getNote());

                orderDetails.add(od);
            }

            boolean success = checkoutDAO.checkout(c.getCustomer_name(), c.getPhone(), c.getEmail(), c.getAddress(),
                    orderDetails);

            if (success) {
                resp.setStatus(HttpServletResponse.SC_CREATED);
                resp.getWriter().write("{\"message\":\"Đặt hàng thành công\"}");
            } else {
                resp.sendError(500, "Đặt hàng thất bại");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(400, "Dữ liệu đặt hàng không hợp lệ");
        }
    }
}
