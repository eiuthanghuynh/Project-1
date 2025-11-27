package com.fastfeast.api;

import com.fastfeast.dao.StaffDAO;
import com.fastfeast.model.Staff;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;

@Path("/staff")
public class StaffResource {

    private StaffDAO staffDAO = new StaffDAO();

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(Map<String, String> credentials, @Context HttpServletRequest request) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Staff staff = staffDAO.checkLogin(username, password);

        Map<String, Object> response = new HashMap<>();

        // Tài khoản không hợp lệ
        if (staff == null) {
            response.put("success", false);
            response.put("message", "Tài khoản hoặc mật khẩu sai");
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(response)
                    .type("application/json; charset=UTF-8")
                    .build();
        }

        // Tài khoản hợp lệ, tạo session
        HttpSession session = request.getSession(true);
        session.setAttribute("staff_username", staff.getStaff_username());
        session.setAttribute("staff_name", staff.getStaff_name());
        session.setAttribute("staff_role", staff.getRole());

        response.put("success", true);
        response.put("staff_name", staff.getStaff_name());
        response.put("role", staff.getRole());

        return Response.ok(response)
                .type("application/json; charset=UTF-8")
                .build();
    }

    @GET
    @Path("/session-info")
    @Produces(MediaType.APPLICATION_JSON)
    public Response sessionInfo(@Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Map<String, Object> response = new HashMap<>();

        if (session == null || session.getAttribute("staff_username") == null) {
            response.put("auth", false);
            return Response.ok(response)
                    .type("application/json; charset=UTF-8")
                    .build();
        }

        response.put("auth", true);
        response.put("username", session.getAttribute("staff_username"));
        response.put("name", session.getAttribute("staff_name"));
        response.put("role", session.getAttribute("staff_role"));

        return Response.ok(response)
                .type("application/json; charset=UTF-8")
                .build();
    }

    @POST
    @Path("/logout")
    @Produces(MediaType.APPLICATION_JSON)
    public Response logout(@Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        return Response.ok(Map.of("success", true))
                .type("application/json; charset=UTF-8")
                .build();
    }
}