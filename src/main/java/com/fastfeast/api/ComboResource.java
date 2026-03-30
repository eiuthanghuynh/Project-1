package com.fastfeast.api;

import com.fastfeast.dao.ComboDAO;
import com.fastfeast.model.Combo;

import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;
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

    @GET
    @Path("/top")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTopCombos(@DefaultValue("5") @QueryParam("limit") int limit) {

        if (limit <= 0) {
            limit = 5;
        } else if (limit > 50) {
            limit = 50;
        }

        List<Combo> topCombos = comboDAO.getTopCombo(limit);

        if (topCombos == null || topCombos.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.ok(topCombos).build();
    }

    @GET
    @Path("/daily")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDailyCombo() {
        LocalDate today = LocalDate.now();
        int currentDayOfWeek = today.getDayOfWeek().getValue();
        List<Combo> dailyCombos = comboDAO.getDailyCombo(currentDayOfWeek);

        if (dailyCombos == null || dailyCombos.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.ok(dailyCombos).build();
    }

    @DELETE
    @Path("/{combo_id}")
    public Response deleteCombo(@PathParam("combo_id") String combo_id) {
        comboDAO.deleteCombo(combo_id);
        return Response.ok().build();
    }
}