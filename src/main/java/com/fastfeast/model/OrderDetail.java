package com.fastfeast.model;

import java.math.BigDecimal;

public class OrderDetail {
    private String order_id;
    private String product_id;
    private String combo_id;
    private int quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
    private BigDecimal discount = BigDecimal.ZERO;
    private String note;

    public OrderDetail() {
    }

    public OrderDetail(String order_id, String product_id, String combo_id, int quantity, BigDecimal price) {
        this.order_id = order_id;
        if (product_id != null) {
            this.product_id = product_id;
        }
        if (combo_id != null) {
            this.combo_id = combo_id;
        }
        this.quantity = quantity;
        this.price = price;
    }

    public String getOrder_id() {
        return order_id;
    }

    public void setOrder_id(String order_id) {
        this.order_id = order_id;
    }

    public String getProduct_id() {
        return product_id;
    }

    public void setProduct_id(String product_id) {
        this.product_id = product_id;
    }

    public String getCombo_id() {
        return combo_id;
    }

    public void setCombo_id(String combo_id) {
        this.combo_id = combo_id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
