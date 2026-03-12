package com.fastfeast.api;

import com.fastfeast.dao.ComboDAO;
import com.fastfeast.model.Combo;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/combos")
public class ComboResource {

    private ComboDAO comboDAO = new ComboDAO();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Combo> getCombos() {
        return comboDAO.getAllCombos();
    }

    @GET
    @Path("/{combo_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCombo(@PathParam("combo_id") String combo_id) {
        Combo combo = comboDAO.getCombo(combo_id);

        if (combo == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Không tìm thấy combo")
                    .build();
        }

        return Response.ok(combo).build();
    }
}