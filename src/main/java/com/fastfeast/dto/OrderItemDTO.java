package com.fastfeast.dto;

import java.math.BigDecimal;

public class OrderItemDTO {
    private String product_id;
    private int quantity;
    private BigDecimal price;
    private String note;

    public String getProduct_id() {
        return product_id;
    }

    public int getQuantity() {
        return quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getNote() {
        return note;
    }
}
