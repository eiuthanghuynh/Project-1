package com.fastfeast.api;

import com.fastfeast.dao.StaffDAO;
import com.fastfeast.model.Staff;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;

@WebServlet("/upload/staff/delete")
public class StaffDeleteServlet extends HttpServlet {

    private StaffDAO staffDAO = new StaffDAO();

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
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
            Staff staffToDelete = staffDAO.getStaffById(staffId);
            if (staffToDelete == null) {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Nhân viên không tồn tại");
                return;
            }

            String targetUsername = staffToDelete.getStaff_username();
            int targetRole = staffToDelete.getRole();

            if (currentRole == 1) {
                if (targetRole != 2) {
                    resp.sendError(HttpServletResponse.SC_FORBIDDEN, "Manager chỉ được xóa nhân viên");
                    return;
                }
                if (targetUsername.equals(currentUsername)) {
                    resp.sendError(HttpServletResponse.SC_FORBIDDEN, "Không được xóa chính mình");
                    return;
                }
            }

            boolean success = staffDAO.deleteStaff(staffId);

            if (success) {
                resp.setStatus(HttpServletResponse.SC_OK);
            } else {
                resp.sendError(500, "Xóa thất bại");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(500, e.getMessage());
        }
    }
}
