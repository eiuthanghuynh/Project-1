package com.fastfeast.model;

import java.util.List;

public class Combo {
    private String combo_id;
    private String combo_name;
    private String combo_description;
    private double price;
    private String image_url;
    private List<String> product_ids;
    private int day_of_week;

    public Combo() {
    }

    public Combo(String combo_id, String combo_name, double price) {
        this.combo_id = combo_id;
        this.combo_name = combo_name;
        this.price = price;
    }

    public Combo(String combo_id, String combo_name, String combo_description, double price, String image_url) {
        this.combo_id = combo_id;
        this.combo_name = combo_name;
        this.combo_description = combo_description;
        this.price = price;
        this.image_url = image_url;
    }

    public String getCombo_id() {
        return combo_id;
    }

    public void setCombo_id(String combo_id) {
        this.combo_id = combo_id;
    }

    public String getCombo_name() {
        return combo_name;
    }

    public void setCombo_name(String combo_name) {
        this.combo_name = combo_name;
    }

    public String getCombo_description() {
        return combo_description;
    }

    public void setCombo_description(String combo_description) {
        this.combo_description = combo_description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getImage_url() {
        return image_url;
    }

    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }

    public List<String> getProduct_ids() {
        return product_ids;
    }

    public void setProduct_ids(List<String> product_ids) {
        this.product_ids = product_ids;
    }

    public int getDay_of_week() {
        return day_of_week;
    }

    public void setDay_of_week(int day_of_week) {
        this.day_of_week = day_of_week;
    }
}