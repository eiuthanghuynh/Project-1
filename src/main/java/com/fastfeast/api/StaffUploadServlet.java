package com.fastfeast.api;

import com.fastfeast.dao.StaffDAO;
import com.fastfeast.model.Staff;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;

@WebServlet("/upload/staff")
@MultipartConfig
public class StaffUploadServlet extends HttpServlet {

    private StaffDAO staffDAO = new StaffDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        try {
            HttpSession session = req.getSession(false);
            if (session == null || session.getAttribute("staff_username") == null) {
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Vui lòng đăng nhập");
                return;
            }

            Integer currentRole = (Integer) session.getAttribute("staff_role");

            String username = req.getParameter("staff_username");
            String password = req.getParameter("staff_password");
            String name = req.getParameter("staff_name");
            String email = req.getParameter("staff_email");
            int role = Integer.parseInt(req.getParameter("role"));

            if (username == null || password == null || name == null) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Thiếu dữ liệu");
                return;
            }

            if (currentRole == 1 && role != 2) {
                resp.sendError(HttpServletResponse.SC_FORBIDDEN, "Manager chỉ được tạo nhân viên");
                return;
            }

            Staff staff = new Staff();
            staff.setStaff_username(username);
            staff.setStaff_password(password);
            staff.setStaff_name(name);
            staff.setStaff_email(email);
            staff.setRole(role);

            boolean success = staffDAO.createStaff(staff);

            if (success) {
                resp.setStatus(HttpServletResponse.SC_CREATED);
            } else {
                resp.sendError(500, "Không thể tạo nhân viên");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(500, e.getMessage());
        }
    }
}
