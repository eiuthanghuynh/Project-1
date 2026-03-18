package com.fastfeast.api;

import com.fastfeast.dao.ComboDAO;
import com.fastfeast.model.Combo;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;

@WebServlet("/upload/combos/edit")
@MultipartConfig
public class ComboEditServlet extends HttpServlet {

    private ComboDAO comboDAO = new ComboDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        try {
            String id = req.getParameter("combo_id");
            String name = req.getParameter("combo_name");
            String description = req.getParameter("combo_description");
            double price = Double.parseDouble(req.getParameter("price"));

            Part imagePart = req.getPart("image");

            Combo combo = comboDAO.getCombo(id);

            if (imagePart != null && imagePart.getSize() > 0) {
                String fileName = Paths.get(imagePart.getSubmittedFileName())
                        .getFileName().toString();
                String newFileName = System.currentTimeMillis() + "_" + fileName;

                String uploadPath = getServletContext()
                        .getRealPath("/assets/combo");

                new File(uploadPath).mkdirs();
                imagePart.write(uploadPath + File.separator + newFileName);

                combo.setImage_url("./assets/combo/" + newFileName);
            }

            combo.setCombo_name(name);
            combo.setCombo_description(description);
            combo.setPrice(price);

            String[] productIdsArray = req.getParameterValues("product_ids");
            if (productIdsArray != null && productIdsArray.length > 0) {
                combo.setProduct_ids(Arrays.asList(productIdsArray));
            } else {
                combo.setProduct_ids(new ArrayList<>());
            }
            boolean isSuccess = comboDAO.editCombo(combo);

            if (isSuccess) {
                resp.setStatus(HttpServletResponse.SC_CREATED);
                resp.setContentType("application/json");
                resp.setCharacterEncoding("UTF-8");
                resp.getWriter().write("{\"success\": true}");
            } else {
                resp.sendError(500, "Không thể lưu combo vào cơ sở dữ liệu");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(500, e.getMessage());
        }
    }
}