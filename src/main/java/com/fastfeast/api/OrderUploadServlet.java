package com.fastfeast.api;

import com.fastfeast.dao.OrderDAO;
import com.fastfeast.model.Order;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;

@WebServlet("/upload/orders")
public class OrderUploadServlet extends HttpServlet {

    private OrderDAO orderDAO = new OrderDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        try {
            String order_id = req.getParameter("order_id");
            String customer_id = req.getParameter("customer_id");

            if (order_id == null || customer_id == null) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Thiếu dữ liệu");
                return;
            }

            Order order = new Order();
            order.setOrder_id(order_id);
            order.setCustomer_id(customer_id);

            orderDAO.createOrder(order);

            resp.setStatus(HttpServletResponse.SC_CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(500, e.getMessage());
        }
    }
}
