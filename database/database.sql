CREATE DATABASE IF NOT EXISTS project_db;
USE project_db;

CREATE TABLE customers (
    customer_id VARCHAR(20) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255)
);

CREATE TABLE admins (
    admin_id VARCHAR(20) PRIMARY KEY,
    admin_username VARCHAR(50) UNIQUE NOT NULL,
    admin_password VARCHAR(255) NOT NULL,
    admin_name VARCHAR(100),
);

CREATE TABLE categories (
    category_id VARCHAR(20) PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

CREATE TABLE products (
    product_id VARCHAR(20) PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
	product_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    category_id VARCHAR(20),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE orders (
    order_id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    order_date DATETIME NOT NULL,
    order_status VARCHAR(20),
    total_price DECIMAL(10,2) NOT NULL,
    note VARCHAR(255),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE order_details (
    order_id VARCHAR(20),
    product_id VARCHAR(20),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);