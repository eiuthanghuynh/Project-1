USE fastfood_db;

INSERT INTO customer (customer_name, phone, email, address) VALUES
('Nguyễn Văn An', '0905123456', 'vanan@gmail.com', 'Quận 1, TP.HCM'),
('Trần Thị Bích', '0906234567', 'bichtran@gmail.com', 'Quận 2, TP.HCM'),
('Lê Văn Cường', '0917123987', 'cuongle@gmail.com', 'Quận 3, TP.HCM'),
('Phạm Thị Dung', '0909345612', 'dungpham@gmail.com', 'Quận 4, TP.HCM'),
('Hoàng Anh Tuấn', '0905567890', 'tuanhoang@gmail.com', 'Quận 5, TP.HCM'),
('Ngô Minh Hải', '0911234567', 'hainm@gmail.com', 'Quận 7, TP.HCM'),
('Bùi Thị Lan', '0908123987', 'lanbui@gmail.com', 'Quận 10, TP.HCM'),
('Võ Đức Minh', '0919988776', 'minhvo@gmail.com', 'Quận 12, TP.HCM'),
('Phan Thị Hương', '0908877665', 'huongphan@gmail.com', 'Quận Gò Vấp, TP.HCM'),
('Lưu Thị Nga', '0912233445', 'ngaluu@gmail.com', 'Huyện Hóc Môn, TP.HCM'),
('Đặng Văn Tài', '0903344556', 'taidang@gmail.com', 'Thủ Đức, TP.HCM'),
('Nguyễn Thị Oanh', '0904433221', 'oanhnguyen@gmail.com', 'Phường Thủ Dầu Một, TP.HCM'),
('Lê Đức Kiên', '0911345678', 'kienle@gmail.com', 'Phường Thủ Dầu Một, TP.HCM'),
('Trương Văn Hòa', '0905654321', 'hoatruong@gmail.com', 'Phường Dĩ An, TP.HCM'),
('Phạm Hồng Nhung', '0907878787', 'nhungpham@gmail.com', 'Phường Dĩ An, TP.HCM'),
('Đỗ Thị Mai', '0906767676', 'maidt@gmail.com', 'Huyện Củ Chi, TP.HCM'),
('Vũ Văn Nam', '0912233666', 'namvu@gmail.com', 'Huyện Củ Chi, TP.HCM'),
('Nguyễn Thị Hà', '0911445566', 'hanguyen@gmail.com', 'Phường Thuận An, TP.HCM'),
('Trần Quốc Dũng', '0902233445', 'dungtran@gmail.com', 'Phường Thuận An, TP.HCM'),
('Phan Đức Lộc', '0909988776', 'locphan@gmail.com', 'Phường Thuận An, TP.HCM');

INSERT INTO staff (staff_username, staff_password, staff_name, staff_email, role) VALUES
('admin', '123456', 'Trần Quản Trị', 'admin@fastfood.vn', 0),
('manager1', '123456', 'Trần Quản Lý', 'manager1@fastfood.vn', 1),
('manager2', '123456', 'Lê Quản Lý', 'manager2@fastfood.vn', 1),
('staff1', '123456', 'Hoàng Anh', 'staff1@fastfood.vn', 2),
('staff2', '123456', 'Nguyễn Minh', 'staff2@fastfood.vn', 2),
('staff3', '123456', 'Phạm Hòa', 'staff3@fastfood.vn', 2),
('staff4', '123456', 'Vũ Hương', 'staff4@fastfood.vn', 2),
('staff5', '123456', 'Trần Dũng', 'staff5@fastfood.vn', 2);

INSERT INTO category (category_name) VALUES
('Pizza'),
('Burrito'),
('Tacos'),
('Hamburger');

INSERT INTO product (product_name, product_description, price, image_url, category_id) VALUES
('Pizza Margherita', 'Pizza truyền thống với phô mai Mozzarella và cà chua', 120000, NULL, 'CA0000001'),
('Pizza Hải sản', 'Pizza hải sản tươi ngon với mực, tôm và phô mai', 150000, NULL, 'CA0000001'),
('Pizza Thịt xông khói', 'Pizza với thịt xông khói và phô mai cheddar', 130000, NULL, 'CA0000001'),
('Burrito Bò', 'Burrito nhân thịt bò, đậu và phô mai', 90000, NULL, 'CA0000002'),
('Burrito Gà', 'Burrito gà nướng cùng rau và sốt chua cay', 85000, NULL, 'CA0000002'),
('Tacos Bò Cay', 'Tacos với thịt bò cay và rau tươi', 70000, NULL, 'CA0000003'),
('Tacos Gà Phô Mai', 'Tacos nhân gà và phô mai tan chảy', 75000, NULL, 'CA0000003'),
('Hamburger Phô Mai', 'Burger với bò nướng và phô mai cheddar', 95000, NULL, 'CA0000004'),
('Hamburger Gà Giòn', 'Burger gà chiên giòn với rau và sốt mayonnaise', 90000, NULL, 'CA0000004'),
('Hamburger Bò BBQ', 'Burger bò nướng BBQ đậm đà', 100000, NULL, 'CA0000004');

INSERT INTO orders (customer_id, order_date, order_status) VALUES
('C0000001', '2025-10-01 10:00:00', 'Completed'),
('C0000002', '2025-10-02 12:30:00', 'Completed'),
('C0000003', '2025-10-03 18:20:00', 'Completed'),
('C0000004', '2025-10-04 09:45:00', 'Completed'),
('C0000005', '2025-10-05 19:15:00', 'Completed'),
('C0000006', '2025-10-06 11:10:00', 'Completed'),
('C0000007', '2025-10-07 13:40:00', 'Completed'),
('C0000008', '2025-10-08 16:25:00', 'Completed'),
('C0000009', '2025-10-09 17:05:00', 'Completed'),
('C0000010', '2025-10-10 14:50:00', 'Completed'),
('C0000011', '2025-10-11 19:00:00', 'Completed'),
('C0000012', '2025-10-12 09:30:00', 'Completed'),
('C0000013', '2025-10-13 18:45:00', 'Completed'),
('C0000014', '2025-10-14 20:10:00', 'Completed'),
('C0000015', '2025-10-15 10:00:00', 'Completed'),
('C0000016', '2025-10-16 15:20:00', 'Completed'),
('C0000017', '2025-10-17 12:00:00', 'Completed'),
('C0000018', '2025-10-18 13:30:00', 'Completed'),
('C0000019', '2025-10-19 17:00:00', 'Completed'),
('C0000020', '2025-10-20 11:00:00', 'Completed');

INSERT INTO order_detail VALUES
('O0000001', 'P0000001', 1, 120000, 120000, 0, NULL),
('O0000001', 'P0000008', 1, 95000, 95000, 0, NULL),
('O0000002', 'P0000002', 2, 150000, 300000, 0.1, NULL),
('O0000003', 'P0000004', 1, 90000, 90000, 0, NULL),
('O0000003', 'P0000010', 1, 100000, 100000, 0.05, NULL),
('O0000004', 'P0000006', 2, 70000, 140000, 0, NULL),
('O0000005', 'P0000009', 1, 90000, 90000, 0, NULL),
('O0000006', 'P0000001', 1, 120000, 120000, 0.05, NULL),
('O0000007', 'P0000007', 2, 75000, 150000, 0, NULL),
('O0000008', 'P0000002', 1, 150000, 150000, 0.1, NULL),
('O0000009', 'P0000004', 3, 90000, 270000, 0, NULL),
('O0000010', 'P0000010', 2, 100000, 200000, 0.05, NULL),
('O0000011', 'P0000005', 1, 85000, 85000, 0, NULL),
('O0000012', 'P0000003', 1, 130000, 130000, 0, NULL),
('O0000013', 'P0000008', 1, 95000, 95000, 0, NULL),
('O0000014', 'P0000009', 2, 90000, 180000, 0.1, NULL),
('O0000015', 'P0000006', 1, 70000, 70000, 0, NULL),
('O0000016', 'P0000002', 1, 150000, 150000, 0, NULL),
('O0000017', 'P0000004', 1, 90000, 90000, 0, NULL),
('O0000018', 'P0000010', 1, 100000, 100000, 0.05, NULL),
('O0000019', 'P0000001', 2, 120000, 240000, 0, NULL),
('O0000020', 'P0000008', 1, 95000, 95000, 0.1, NULL);