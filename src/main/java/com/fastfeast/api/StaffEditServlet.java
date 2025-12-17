package com.fastfeast.api;

import com.fastfeast.dao.StaffDAO;
import com.fastfeast.model.Staff;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;

@WebServlet("/upload/staff/edit")
@MultipartConfig
public class StaffEditServlet extends HttpServlet {

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

            String currentUsername = (String) session.getAttribute("staff_username");
            int currentRole = (Integer) session.getAttribute("staff_role");

            String staffId = req.getParameter("staff_id");
            String username = req.getParameter("staff_username");
            String password = req.getParameter("staff_password");
            String name = req.getParameter("staff_name");
            String email = req.getParameter("staff_email");
            int role = Integer.parseInt(req.getParameter("role"));

            if (staffId == null || username == null || name == null) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Thiếu dữ liệu");
                return;
            }

            if (currentRole == 1) {
                if (role != 2) {
                    resp.sendError(HttpServletResponse.SC_FORBIDDEN, "Manager chỉ được sửa nhân viên");
                    return;
                }
                if (username.equals(currentUsername)) {
                    resp.sendError(HttpServletResponse.SC_FORBIDDEN, "Không được sửa chính mình");
                    return;
                }
            }

            Staff staff = new Staff();
            staff.setStaff_id(staffId);
            staff.setStaff_username(username);
            staff.setStaff_name(name);
            staff.setStaff_email(email);
            staff.setRole(role);

            if (password != null && !password.isBlank()) {
                staff.setStaff_password(password);
            }

            boolean success = staffDAO.updateStaff(staff);

            if (success) {
                resp.setStatus(HttpServletResponse.SC_OK);
            } else {
                resp.sendError(500, "Cập nhật thất bại");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(500, e.getMessage());
        }
    }
}
