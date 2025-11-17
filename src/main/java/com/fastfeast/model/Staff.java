package com.fastfeast.model;

public class Staff {
    private String staff_id;
    private String staff_username;
    private String staff_password;
    private String staff_name;
    private String staff_email;
    private int role;

    public Staff(String staff_id, String staff_username, String staff_password, int role) {
        this.staff_id = staff_id;
        this.staff_username = staff_username;
        this.staff_password = staff_password;
        this.role = role;
    }

    public String getStaff_id() {
        return staff_id;
    }

    public void setStaff_id(String staff_id) {
        this.staff_id = staff_id;
    }

    public String getStaff_username() {
        return staff_username;
    }

    public void setStaff_username(String staff_username) {
        this.staff_username = staff_username;
    }

    public String getStaff_password() {
        return staff_password;
    }

    public void setStaff_password(String staff_password) {
        this.staff_password = staff_password;
    }

    public String getStaff_name() {
        return staff_name;
    }

    public void setStaff_name(String staff_name) {
        this.staff_name = staff_name;
    }

    public String getStaff_email() {
        return staff_email;
    }

    public void setStaff_email(String staff_email) {
        this.staff_email = staff_email;
    }

    public int getRole() {
        return role;
    }

    public void setRole(int role) {
        this.role = role;
    }

}
