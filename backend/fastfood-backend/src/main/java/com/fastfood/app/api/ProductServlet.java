package com.fastfood.app.api;

import com.fastfood.app.dao.ProductDAO;
import com.fastfood.app.model.Product;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/api/products")
public class ProductServlet extends HttpServlet {

    private ProductDAO productDAO = new ProductDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        List<Product> products = productDAO.getAllProducts();

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        PrintWriter out = resp.getWriter();
        out.print(new Gson().toJson(products));
        out.flush();
    }
}