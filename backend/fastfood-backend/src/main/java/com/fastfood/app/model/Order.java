package main.java.com.fastfood.app.model;

import java.util.GregorianCalendar;

public class Order {
    private String order_id;
    private String customer_id;
    private GregorianCalendar order_date;
    private String order_status;
    private double total_price;
    private String note;

    public Order(String order_id, String customer_id, GregorianCalendar order_date, double total_price) {
        this.order_id = order_id;
        this.customer_id = customer_id;
        this.order_date = order_date;
        this.total_price = total_price;
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

    public double getTotal_price() {
        return total_price;
    }

    public void setTotal_price(double total_price) {
        this.total_price = total_price;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

}
