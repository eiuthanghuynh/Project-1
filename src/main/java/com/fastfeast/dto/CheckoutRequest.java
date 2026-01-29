package com.fastfeast.dto;

import java.util.List;

public class CheckoutRequest {
    private CustomerDTO customer;
    private List<OrderItemDTO> items;

    public CustomerDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerDTO customer) {
        this.customer = customer;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }
}