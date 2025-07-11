-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 11, 2025 at 04:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `auretta_db`
--
CREATE DATABASE IF NOT EXISTS `auretta_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `auretta_db`;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'cat1'),
(2, 'cat2');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE IF NOT EXISTS `items` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_name` varchar(255) NOT NULL,
  `item_price` double(10,2) NOT NULL,
  `item_desc` text NOT NULL,
  `item_img` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `item_name`, `item_price`, `item_desc`, `item_img`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Monggol Pencil No.5', 9.00, 'this is a pencil recommended for bitch', 'storage/items/main/dashboard-1751900024772.jpg', '2025-07-05 15:03:28', '2025-07-09 08:14:22', NULL),
(2, 'cigarettes', 8.00, 'This material is recommended for ultra pro artist', 'storage/items/main/Screenshot 2025-07-08 202340-1752219398235.png', '2025-07-05 15:03:28', '2025-07-11 14:41:46', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `item_category`
--

CREATE TABLE IF NOT EXISTS `item_category` (
  `item_id` int(20) NOT NULL,
  `category_id` int(20) NOT NULL,
  KEY `fk_item_id` (`item_id`),
  KEY `fk_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_category`
--

INSERT INTO `item_category` (`item_id`, `category_id`) VALUES
(2, 2),
(1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `item_gallery`
--

CREATE TABLE IF NOT EXISTS `item_gallery` (
  `img_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `item_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`img_id`),
  KEY `item_gallery_fk` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_gallery`
--

INSERT INTO `item_gallery` (`img_id`, `item_id`, `item_path`) VALUES
(10, 2, 'storage/items/gallery/upload_docu-1751972058580.jpg'),
(14, 1, 'storage/items/gallery/reports-1751973031245.jpg'),
(15, 1, 'storage/items/gallery/upload_docu-1751973031250.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `orderlines`
--

CREATE TABLE IF NOT EXISTS `orderlines` (
  `orderline_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `order_price` double(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`orderline_id`),
  KEY `fk_orderline_orders` (`order_id`),
  KEY `fk_orderline_item` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderlines`
--

INSERT INTO `orderlines` (`orderline_id`, `order_id`, `item_id`, `qty`, `order_price`) VALUES
(3, 1, 2, 2, 25.00),
(4, 2, 1, 1, 25.00),
(5, 3, 2, 11, 232.00),
(6, 4, 1, 23, 123.00),
(7, 1, 1, 2, 50.00);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `order_status` enum('pending','shipped','cancelled','refunded','delivered') NOT NULL DEFAULT 'pending',
  `order_placed` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`order_id`),
  KEY `fk_orders_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `order_status`, `order_placed`) VALUES
(1, 18, 'shipped', '2025-07-09 00:00:00'),
(2, 6, 'cancelled', '2025-07-09 00:00:00'),
(3, 17, 'refunded', '2025-07-09 00:00:00'),
(4, 21, 'pending', '2025-07-09 00:00:00'),
(5, 6, 'pending', '2025-07-09 15:22:33');

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

CREATE TABLE IF NOT EXISTS `stocks` (
  `stock_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  PRIMARY KEY (`stock_id`),
  KEY `fk_stock_item_id` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`stock_id`, `item_id`, `qty`) VALUES
(1, 2, 5),
(2, 1, 35);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `contact` varchar(20) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `img` text DEFAULT NULL,
  `token` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_unique` (`email`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `token_unique` (`token`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `name`, `email`, `password`, `role`, `contact`, `city`, `is_active`, `img`, `token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(6, 'levi asher penaverde', 'sample@gmail.com', '$2b$10$Fn5n7qLqxNqrKwkBMySrv.iAGKHUL5J/AcpKHYVrz1FmBxfHYAqQS', 'admin', '09385736287', 'taguig', 1, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjo2LCJpYXQiOjE3NTIyMzk3MDAsImV4cCI6MTc1MjI1MDUwMH0.3cdhDkUOlbc73-Vh1Rk_-F-O03vCAR8bThYbzhouOX4', '2025-06-29 12:48:49', NULL, NULL),
(10, 'Hans Ivan', 'hans@sample.com', '$2b$10$YHDn16X.GwQEgOl/lF6Rj.dv6FZXCq2ap2AdLgibxtAx6a3LWyi22', 'admin', '09385736288', 'taguig', 1, NULL, NULL, '2025-07-04 20:27:19', NULL, NULL),
(17, 'jyren', 'jyren@gmail.com', '$2b$10$63T5hde9dO6MUQYlvEaSROZBhbxEqWWO29DBEtyUkO/wCFGwvKMWi', 'user', NULL, NULL, 0, NULL, NULL, '2025-07-04 20:45:42', NULL, NULL),
(18, 'allan roi', 'allanmonforte@gmail.com', '$2b$10$071uU54GkiPtJE5kMjZOz.HkAg4mFARIXj.iv6Hfk76aYUbL6p0pa', 'user', '09385736286', 'taguig', 1, 'storage/images/login-1751901365243.jpg', NULL, '2025-07-04 20:46:25', NULL, NULL),
(21, 'user1', 'user1@gmail.com', '$2b$10$wlFR3WKASV2bqOg8ur8c7.NoDx9YO3VngBHR7h1OI5JMmfdtHuHsy', 'user', '', '', 1, NULL, NULL, '2025-07-05 12:12:25', NULL, NULL),
(22, 'user2', 'user2@gmail.com', '$2b$10$M7ZsWaF66Zah/NpvcwQajOReyVtSovhQNx2WbdcyIu6AmKrnCKAAy', 'user', NULL, NULL, 1, NULL, NULL, '2025-07-05 12:12:49', NULL, '2025-07-09 11:22:00'),
(23, 'user3', 'user3@gmail.com', '$2b$10$etnFAJtcexZYUZebUwCh8..VVycAIice4B2e2Zmsud20/UvXU7VRW', 'user', NULL, NULL, 0, NULL, NULL, '2025-07-05 12:13:23', NULL, '2025-07-09 11:20:11');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `item_category`
--
ALTER TABLE `item_category`
  ADD CONSTRAINT `fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_item_id` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `item_gallery`
--
ALTER TABLE `item_gallery`
  ADD CONSTRAINT `item_gallery_fk` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orderlines`
--
ALTER TABLE `orderlines`
  ADD CONSTRAINT `fk_orderline_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_orderline_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `fk_stock_item_id` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
