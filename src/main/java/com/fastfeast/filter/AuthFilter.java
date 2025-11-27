package com.fastfeast.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;

public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        HttpSession session = request.getSession(false);
        String path = request.getRequestURI();

        if (path.endsWith(".css") || path.endsWith(".js") || path.endsWith(".png") || path.endsWith(".jpg")) {
            chain.doFilter(req, res);
            return;
        }

        // Kiểm tra session khi vào các trang liên quan tới staff
        if (path.startsWith("/fastfeast/staff/")) {
            if (session != null && session.getAttribute("staff_username") != null) {
                chain.doFilter(req, res);
                return;
            } else {
                response.sendRedirect(request.getContextPath() + "/login");
                return;
            }
        }
        chain.doFilter(req, res);
    }
}