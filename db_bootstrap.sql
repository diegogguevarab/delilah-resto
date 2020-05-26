-- ========================================================================
-- Usuario Delilah Resto
-- ========================================================================
CREATE USER 'delilahresto_db_user'@'localhost' IDENTIFIED BY 'delilahresto_db_pass';

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
    user_name VARCHAR(25) NOT NULL,
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
    price VARCHAR(20) NOT NULL
);
-- ========================== Tabla de pedidos ============================
CREATE TABLE `order` (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `description` VARCHAR(50),
    user_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES `user` (id)
        ON DELETE NO ACTION ON UPDATE CASCADE
);
-- =============== Tabla de productos por pedido ==========================
CREATE TABLE order_products (
    product_id INT UNSIGNED NOT NULL,
    order_id INT UNSIGNED NOT NULL,
    product_quantity INT UNSIGNED NOT NULL,
    CONSTRAINT fk_product FOREIGN KEY (product_id)
        REFERENCES product (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_order FOREIGN KEY (order_id)
        REFERENCES `order` (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
-- ========================================================================