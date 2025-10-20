package main.java.com.fastfood.app.model;

public class Admin {
    private String admin_id;
    private String admin_username;
    private String admin_password;
    private String admin_name;

    public Admin(String admin_id, String admin_username, String admin_password) {
        this.admin_id = admin_id;
        this.admin_username = admin_username;
        this.admin_password = admin_password;
    }

    public String getAdmin_id() {
        return admin_id;
    }

    public void setAdmin_id(String admin_id) {
        this.admin_id = admin_id;
    }

    public String getAdmin_username() {
        return admin_username;
    }

    public void setAdmin_username(String admin_username) {
        this.admin_username = admin_username;
    }

    public String getAdmin_password() {
        return admin_password;
    }

    public void setAdmin_password(String admin_password) {
        this.admin_password = admin_password;
    }

    public String getAdmin_name() {
        return admin_name;
    }

    public void setAdmin_name(String admin_name) {
        this.admin_name = admin_name;
    }

}
