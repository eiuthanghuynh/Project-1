package com.fastfeast.dto;

import java.math.BigDecimal;

public class OrderItemDTO {
    private String product_id;
    private String combo_id;
    private int quantity;
    private BigDecimal price;
    private String note;

    public String getProduct_id() {
        return product_id;
    }

    public String getCombo_id() {
        return combo_id;
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

    public void setProduct_id(String product_id) {
        this.product_id = product_id;
    }

    public void setCombo_id(String combo_id) {
        this.combo_id = combo_id;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setNote(String note) {
        this.note = note;
    }

}
