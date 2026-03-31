package com.fastfeast.api;

import com.fastfeast.dao.OrderDAO;
import com.fastfeast.dao.OrderDetailDAO;
import com.fastfeast.model.Order;
import com.fastfeast.model.OrderDetail;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Map;

@Path("/orders")
public class OrderResource {

    private OrderDAO orderDAO = new OrderDAO();
    private OrderDetailDAO orderDetailDAO = new OrderDetailDAO();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Order> getOrders() {
        return orderDAO.getAllOrders();
    }

    @GET
    @Path("/{order_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOrderByID(@PathParam("order_id") String order_id) {
        Order order = orderDAO.getOrder(order_id);
        if (order == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Order not found")
                    .build();
        }
        return Response.ok(order).build();
    }

    @GET
    @Path("/{order_id}/details")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOrderDetails(@PathParam("order_id") String order_id) {

        if (order_id == null || order_id.trim().isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Mã đơn hàng không hợp lệ")
                    .build();
        }

        List<OrderDetail> details = orderDetailDAO.getOrderDetails(order_id);

        if (details == null || details.isEmpty()) {
            return Response.ok("[]").build();
        }

        return Response.ok(details).build();
    }

    @POST
    @Path("/update-status")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateOrderStatus(Map<String, String> payload) {
        String orderId = payload.get("order_id");
        String status = payload.get("order_status");

        if (orderId == null || status == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("success", false, "message", "Thiếu dữ liệu"))
                    .type("application/json; charset=UTF-8")
                    .build();
        }

        boolean success = orderDAO.updateOrderStatus(orderId, status);

        if (success) {
            return Response.ok(Map.of("success", true))
                    .type("application/json; charset=UTF-8")
                    .build();
        } else {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("success", false, "message", "Cập nhật thất bại"))
                    .type("application/json; charset=UTF-8")
                    .build();
        }
    }
}
