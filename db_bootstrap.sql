-- ========================================================================
-- Usuario Delilah Resto
-- ========================================================================
CREATE USER IF NOT EXISTS 'delilahresto_db_user'@'localhost' IDENTIFIED BY 'delilahresto_db_pass';

-- ========================================================================
-- Creación de la BD de Delilah Resto
-- ========================================================================
DROP DATABASE IF EXISTS delilahresto;
CREATE DATABASE delilahresto;

-- ========================================================================
-- Otorgamiento de privilegios al usuario sobre la BD
-- ========================================================================
GRANT ALL PRIVILEGES ON delilahresto. * TO 'delilahresto_db_user'@'localhost';

-- ========================================================================
-- Creación de las tablas del schema delilahresto
-- ========================================================================
USE delilahresto;
-- ====================== Tabla de usuarios ===============================
CREATE TABLE `user` (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(50) NOT NULL,
    user_name VARCHAR(25) UNIQUE NOT NULL,
    email VARCHAR(25) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(100) NOT NULL,
    `password` VARCHAR(25) NOT NULL,
    is_admin BOOLEAN NOT NULL
);
-- ========================= Tabla de productos ===========================
CREATE TABLE product (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(100),
    price INT UNSIGNED NOT NULL
);
-- ========================== Tabla de pedidos ============================
CREATE TABLE orders (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `description` VARCHAR(50),
    total_value INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    payment ENUM('Efectivo', 'Débito', 'Crédito') NOT NULL,
    state ENUM('Nuevo', 'Confirmado', 'Preparando', 'Enviando', 'Entregado', 'Cancelado') NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES `user` (id)
        ON DELETE NO ACTION ON UPDATE CASCADE
);
-- =============== Tabla de productos por pedido ==========================
CREATE TABLE order_products (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_id INT UNSIGNED NOT NULL,
    order_id INT UNSIGNED NOT NULL,
    product_quantity INT UNSIGNED NOT NULL,
    CONSTRAINT fk_product FOREIGN KEY (product_id)
        REFERENCES product (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_order FOREIGN KEY (order_id)
        REFERENCES orders (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ========================================================================
-- Inserción de usuarios
-- ========================================================================
INSERT INTO user(full_name, user_name, email, phone, address, password, is_admin) values
('Delilah Admin','delilah-admin','admin@delilah.com','43210987','Oficinas Delilah Restó','Admin-123!',1);
INSERT INTO user(full_name, user_name, email, phone, address, password, is_admin) values
('Tester McTesting','delilah-tester','tester@delilah.com','123456789','Av. Testing # 13-21','T3st_P4ss',0);
INSERT INTO user(full_name, user_name, email, phone, address, password, is_admin) values
('User McTesting','delilah-user','user@delilah.com','124356789','Av. Testing # 31-12','T3st_P4ss',0);

-- ========================================================================
-- Inserción de productos
-- ========================================================================
INSERT INTO product(name, description, price) values
('Hamburguesa del poder','Una hamburguesa con todos los poderes nórdicos',15000);
INSERT INTO product(name, description, price) values
('Pizza del poder','Una pizza con todos los poderes romanos',19000);
INSERT INTO product(name, description, price) values
('Perro del poder','Un perro caliente con todos los poderes gringos',12000);

-- ========================================================================
-- Inserción de pedidos
-- ========================================================================
INSERT INTO orders(description, total_value, user_id, payment, state) values
('HamX1,PizX1',34000,2,'Efectivo','Entregado');
INSERT INTO orders(description, total_value, user_id, payment, state) values
('HamX2',30000,3,'Efectivo','Enviando');
INSERT INTO orders(description, total_value, user_id, payment, state) values
('HamX2,PerX2',54000,2,'Crédito','Confirmado');
-- ========================================================================
-- Inserción de productos por pedido
-- ========================================================================
INSERT INTO order_products(product_id, order_id, product_quantity) values
(1,1,1);
INSERT INTO order_products(product_id, order_id, product_quantity) values
(2,1,1);
INSERT INTO order_products(product_id, order_id, product_quantity) values
(1,2,2);
INSERT INTO order_products(product_id, order_id, product_quantity) values
(1,3,2);
INSERT INTO order_products(product_id, order_id, product_quantity) values
(3,3,2);