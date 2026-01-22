package com.fastfeast.api;

import com.fastfeast.dao.CustomerDAO;
import com.fastfeast.model.Customer;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;

@WebServlet("/upload/customer")
public class CustomerUploadServlet extends HttpServlet {

    private CustomerDAO customerDAO = new CustomerDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        try {
            String name = req.getParameter("customer_name");
            String phone = req.getParameter("phone");
            String email = req.getParameter("email");
            String address = req.getParameter("address");

            if (name == null || name.isBlank()) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Thiếu tên khách hàng");
                return;
            }

            Customer customer = new Customer();
            customer.setCustomer_name(name);
            customer.setPhone(phone);
            customer.setEmail(email);
            customer.setAddress(address);

            customerDAO.createCustomer(customer);

            resp.setStatus(HttpServletResponse.SC_CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(500, e.getMessage());
        }
    }
}
