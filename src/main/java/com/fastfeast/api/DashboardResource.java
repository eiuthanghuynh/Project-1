package com.fastfeast.api;

import com.fastfeast.dao.DashboardDAO;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/dashboard")
@Produces(MediaType.APPLICATION_JSON)
public class DashboardResource {

    private DashboardDAO dashboardDAO = new DashboardDAO();

    @GET
    @Path("/kpi")
    public Response getKPI() {
        try {
            return Response.ok(dashboardDAO.getKPI()).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

    @GET
    @Path("/order-status")
    public Response getOrderStatus() {
        try {
            return Response.ok(dashboardDAO.getOrderStatusSummary()).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

    @GET
    @Path("/recent-orders")
    public Response getRecentOrders() {
        try {
            return Response.ok(dashboardDAO.getRecentOrders()).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

    @GET
    @Path("/top-products")
    public Response getTopProducts() {
        try {
            return Response.ok(dashboardDAO.getTopProducts()).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }
}