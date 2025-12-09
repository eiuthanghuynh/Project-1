package com.fastfeast.api;

import com.fastfeast.dao.OrderDAO;
import com.fastfeast.model.Order;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/orders")
public class OrderResource {

    private OrderDAO orderDAO = new OrderDAO();

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
}
