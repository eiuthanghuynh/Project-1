package com.fastfeast.model;

import java.util.GregorianCalendar;

public class Order {
    private String order_id;
    private String customer_id;
    private String customer_name;
    private GregorianCalendar order_date;
    private String order_status;

    public Order() {
    }

    public Order(String order_id, String customer_id, GregorianCalendar order_date, String order_status) {
        this.order_id = order_id;
        this.customer_id = customer_id;
        this.order_date = order_date;
        this.order_status = order_status;
    }

    public String getOrder_id() {
        return order_id;
    }

    public void setOrder_id(String order_id) {
        this.order_id = order_id;
    }

    public String getCustomer_id() {
        return customer_id;
    }

    public void setCustomer_id(String customer_id) {
        this.customer_id = customer_id;
    }

    public String getCustomer_name() {
        return customer_name;
    }

    public void setCustomer_name(String customer_name) {
        this.customer_name = customer_name;
    }

    public GregorianCalendar getOrder_date() {
        return order_date;
    }

    public void setOrder_date(GregorianCalendar order_date) {
        this.order_date = order_date;
    }

    public String getOrder_status() {
        return order_status;
    }

    public void setOrder_status(String order_status) {
        this.order_status = order_status;
    }
}
