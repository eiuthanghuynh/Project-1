CREATE DATABASE IF NOT EXISTS fastfood_db;
USE fastfood_db;

-- ########################################
-- Tạo table cho các entity
-- ########################################

CREATE TABLE customer (
    customer_id VARCHAR(20) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255)
);

CREATE TABLE staff (
    staff_id VARCHAR(20) PRIMARY KEY,
    staff_username VARCHAR(50) UNIQUE NOT NULL,
    staff_password VARCHAR(255) NOT NULL,
    staff_name VARCHAR(100),
    staff_email VARCHAR(100),
    role INT NOT NULL
);

CREATE TABLE category (
    category_id VARCHAR(10) PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

CREATE TABLE product (
    product_id VARCHAR(20) PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
	product_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    category_id VARCHAR(10),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE orders (
    order_id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(20),
    order_date DATETIME NOT NULL,
    order_status VARCHAR(20),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE order_detail (
    order_id VARCHAR(20),
    product_id VARCHAR(20),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2),
    note VARCHAR(255),
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ########################################
-- Tạo các trigger tự động cho các ID
-- customer_id: C...
-- staff_id: S...
-- category_id: CA...
-- product_id: P...
-- order_id: O...
-- ########################################

DELIMITER //
CREATE TRIGGER trg_before_insert_customer
BEFORE INSERT ON customer
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    DECLARE new_id VARCHAR(50);

    SELECT IFNULL(MAX(CAST(SUBSTRING(customer_id, 2) AS UNSIGNED)), 0) + 1 INTO next_id
    FROM customer;

    SET new_id = CONCAT('C', LPAD(next_id, 7, '0'));
    SET NEW.customer_id = new_id;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_before_insert_staff
BEFORE INSERT ON staff
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    DECLARE new_id VARCHAR(50);

    SELECT IFNULL(MAX(CAST(SUBSTRING(staff_id, 2) AS UNSIGNED)), 0) + 1 INTO next_id
    FROM staff;

    SET new_id = CONCAT('S', LPAD(next_id, 7, '0'));
    SET NEW.staff_id = new_id;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_before_insert_category
BEFORE INSERT ON category
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    DECLARE new_id VARCHAR(50);

    SELECT IFNULL(MAX(CAST(SUBSTRING(category_id, 3) AS UNSIGNED)), 0) + 1 INTO next_id
    FROM category;

    SET new_id = CONCAT('CA', LPAD(next_id, 2, '0'));
    SET NEW.category_id = new_id;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_before_insert_product
BEFORE INSERT ON product
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    DECLARE new_id VARCHAR(50);

    SELECT IFNULL(MAX(CAST(SUBSTRING(product_id, 2) AS UNSIGNED)), 0) + 1 INTO next_id
    FROM product;

    SET new_id = CONCAT('P', LPAD(next_id, 7, '0'));
    SET NEW.product_id = new_id;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_before_insert_order
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    DECLARE new_id VARCHAR(50);

    SELECT IFNULL(MAX(CAST(SUBSTRING(order_id, 2) AS UNSIGNED)), 0) + 1 INTO next_id
    FROM orders;

    SET new_id = CONCAT('O', LPAD(next_id, 7, '0'));
    SET NEW.order_id = new_id;
END//
DELIMITER ;