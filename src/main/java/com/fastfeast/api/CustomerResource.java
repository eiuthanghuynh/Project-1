package com.fastfeast.api;

import com.fastfeast.dao.CustomerDAO;
import com.fastfeast.model.Customer;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/customer")
public class CustomerResource {

    private CustomerDAO customerDAO = new CustomerDAO();

    @GET
    @Path("/{customer_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCustomer(@PathParam("customer_id") String customer_id) {
        Customer customer = customerDAO.getCustomer(customer_id);

        if (customer == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Không tìm thấy customer")
                    .build();
        }

        return Response.ok(customer).build();
    }

    @GET
    @Path("/id")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCustomerId(
            @QueryParam("customer_name") String customer_name,
            @QueryParam("phone") String phone) {
        String customer_id = customerDAO.getCustomerId(customer_name, phone);

        if (customer_id == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Không tìm thấy customer id")
                    .build();
        }

        return Response.ok(customer_id).build();
    }
}
