package com.fastfeast.api;

import java.util.Map;

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
            return Response.status(500).entity(Map.of("error", "Không thể tải dữ liệu KPI")).build();
        }
    }

    @GET
    @Path("/order-status")
    public Response getOrderStatus() {
        try {
            return Response.ok(dashboardDAO.getOrderStatusSummary()).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(Map.of("error", "Không thể tải dữ liệu trạng thái order")).build();
        }
    }

    @GET
    @Path("/recent-orders")
    public Response getRecentOrders() {
        try {
            return Response.ok(dashboardDAO.getRecentOrders()).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(Map.of("error", "Không thể tải dữ liệu order gần đây")).build();
        }
    }

    @GET
    @Path("/top-products")
    public Response getTopProducts() {
        try {
            return Response.ok(dashboardDAO.getTopProducts()).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(Map.of("error", "Không thể tải dữ liệu top sản phẩm")).build();
        }
    }

    @GET
    @Path("/chart/orders")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getChart(@QueryParam("range") String range) {
        try {
            if (range == null || range.isBlank()) {
                range = "7d";
            }

            return Response.ok(dashboardDAO.getChart(range)).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(Map.of("error", "Không thể tải dữ liệu biểu đồ do lỗi server")).build();
        }
    }
}