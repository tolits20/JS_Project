-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 21, 2025 at 12:34 PM
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
-- Table structure for table `activity_logs`
--

CREATE TABLE IF NOT EXISTS `activity_logs` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT,
  `activity` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`log_id`, `activity`, `created_at`) VALUES
(1, 'user create', '2025-07-20 11:38:34'),
(2, 'item update', '2025-07-20 12:01:58'),
(3, 'user update', '2025-07-20 12:02:52'),
(4, 'user update', '2025-07-20 12:02:56'),
(5, 'user update', '2025-07-20 12:02:59'),
(6, 'user update', '2025-07-20 12:03:00'),
(7, 'user update', '2025-07-20 12:03:01'),
(8, 'category create', '2025-07-20 13:06:39'),
(9, 'category create', '2025-07-20 13:07:36'),
(10, 'user delete', '2025-07-20 13:15:46'),
(11, 'user delete', '2025-07-20 13:15:51'),
(12, 'user delete', '2025-07-20 13:16:07'),
(13, 'user update', '2025-07-20 13:17:59'),
(14, 'category delete', '2025-07-20 13:26:05'),
(15, 'category delete', '2025-07-20 13:26:25'),
(16, 'category create', '2025-07-20 13:51:58'),
(17, 'category update', '2025-07-20 13:59:20'),
(18, 'category update', '2025-07-20 14:00:33'),
(19, 'category update', '2025-07-20 14:01:19'),
(20, 'category update', '2025-07-20 14:01:59'),
(21, 'category update', '2025-07-20 14:02:05'),
(22, 'category create', '2025-07-20 14:02:40'),
(23, 'category update', '2025-07-20 14:04:23'),
(24, 'item update', '2025-07-20 14:04:41'),
(25, 'category delete', '2025-07-20 14:10:12'),
(26, 'category delete', '2025-07-20 14:10:17'),
(27, 'item delete', '2025-07-20 14:10:43'),
(28, 'item delete', '2025-07-20 14:10:46'),
(29, 'item delete', '2025-07-20 14:10:50'),
(30, 'item delete', '2025-07-20 14:10:53'),
(31, 'item delete', '2025-07-20 14:11:31'),
(32, 'item delete', '2025-07-20 14:11:41'),
(33, 'item delete', '2025-07-20 14:16:37'),
(34, 'item delete', '2025-07-20 14:16:40'),
(35, 'item delete', '2025-07-20 14:23:21'),
(36, 'item create', '2025-07-20 14:23:44'),
(37, 'item update', '2025-07-20 14:24:01'),
(38, 'item update', '2025-07-20 14:24:08'),
(39, 'item delete', '2025-07-20 14:24:42'),
(40, 'item delete', '2025-07-20 14:24:46'),
(41, 'item create', '2025-07-20 14:26:23'),
(42, 'item update', '2025-07-20 14:26:29'),
(43, 'item update', '2025-07-20 14:26:36'),
(44, 'item delete', '2025-07-20 14:28:28'),
(45, 'item create', '2025-07-20 14:28:59'),
(46, 'item update', '2025-07-20 14:29:12'),
(47, 'item update', '2025-07-20 14:29:43'),
(48, 'item update', '2025-07-20 14:31:02'),
(49, 'item update', '2025-07-20 14:32:38'),
(50, 'category create', '2025-07-20 14:32:56'),
(51, 'item update', '2025-07-20 14:33:10'),
(52, 'item update', '2025-07-20 14:34:30'),
(53, 'item update', '2025-07-20 14:35:42'),
(54, 'item update', '2025-07-20 14:35:52'),
(55, 'item update', '2025-07-20 14:36:01'),
(56, 'orders update', '2025-07-20 17:06:00'),
(57, 'orders update', '2025-07-20 17:06:04'),
(58, 'user update', '2025-07-20 17:07:33'),
(59, 'user update', '2025-07-20 17:07:35'),
(60, 'item update', '2025-07-20 17:07:51'),
(61, 'user update', '2025-07-20 17:08:50'),
(62, 'user update', '2025-07-20 17:08:52'),
(63, 'user update', '2025-07-20 19:10:31'),
(64, 'user create', '2025-07-20 21:44:32');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'cat1'),
(2, 'cat2'),
(7, 'hardcoded');

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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `item_name`, `item_price`, `item_desc`, `item_img`, `created_at`, `updated_at`, `deleted_at`) VALUES
(14, 'mouse', 500.00, 'json test', NULL, '2025-07-16 08:59:57', '2025-07-20 14:34:30', NULL),
(16, 'phone', 1000.00, 'phone testing', 'storage/items/main/Screenshot 2025-07-09 191654-1752630935641.png', '2025-07-16 09:55:13', '2025-07-20 14:35:52', NULL),
(19, 'makeup', 23.00, 'esadasfdf', NULL, '2025-07-19 15:18:23', '2025-07-20 14:36:01', NULL),
(23, 'multer', 123.00, 'dsadasda', NULL, '2025-07-20 14:28:59', '2025-07-20 14:35:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `item_category`
--

CREATE TABLE IF NOT EXISTS `item_category` (
  `item_id` int(20) NOT NULL,
  `category_id` int(20) NOT NULL,
  UNIQUE KEY `item_id` (`item_id`),
  KEY `fk_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_category`
--

INSERT INTO `item_category` (`item_id`, `category_id`) VALUES
(19, 1),
(23, 2),
(14, 7),
(16, 7);

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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_gallery`
--

INSERT INTO `item_gallery` (`img_id`, `item_id`, `item_path`) VALUES
(28, 19, 'storage/items/gallery/Screenshot 2025-07-08 202340-1753002471228.png');

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
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderlines`
--

INSERT INTO `orderlines` (`orderline_id`, `order_id`, `item_id`, `qty`, `order_price`) VALUES
(3, 1, 19, 2, 25.00),
(4, 2, 23, 1, 25.00),
(5, 3, 14, 11, 232.00),
(6, 4, 16, 23, 123.00),
(7, 1, 14, 2, 50.00),
(8, 6, 23, 2, 246.00),
(9, 6, 19, 1, 23.00),
(10, 6, 16, 3, 3000.00),
(11, 6, 14, 5, 2500.00),
(12, 7, 19, 1, 23.00),
(13, 7, 16, 1, 1000.00),
(14, 8, 23, 1, 123.00),
(15, 8, 19, 1, 23.00),
(16, 8, 16, 1, 1000.00),
(17, 8, 14, 1, 500.00),
(18, 9, 23, 1, 123.00),
(19, 9, 19, 1, 23.00),
(20, 9, 16, 1, 1000.00),
(21, 9, 14, 1, 500.00),
(22, 10, 23, 1, 123.00),
(23, 10, 19, 1, 23.00),
(24, 10, 16, 1, 1000.00),
(25, 10, 14, 1, 500.00),
(26, 11, 23, 1, 123.00),
(27, 11, 19, 1, 23.00),
(28, 11, 16, 1, 1000.00),
(29, 11, 14, 1, 500.00),
(30, 12, 23, 1, 123.00),
(31, 12, 19, 1, 23.00),
(32, 12, 16, 1, 1000.00),
(33, 12, 14, 1, 500.00),
(34, 13, 23, 1, 123.00),
(35, 13, 19, 1, 23.00),
(36, 13, 16, 1, 1000.00),
(37, 13, 14, 1, 500.00),
(42, 15, 23, 1, 123.00),
(43, 15, 19, 1, 23.00),
(44, 15, 16, 1, 1000.00),
(45, 15, 14, 1, 500.00),
(62, 20, 23, 3, 369.00),
(63, 20, 19, 2, 46.00),
(64, 20, 16, 2, 2000.00),
(65, 20, 14, 3, 1500.00),
(66, 21, 23, 1, 123.00),
(67, 21, 19, 1, 23.00),
(68, 22, 16, 3, 3000.00),
(69, 22, 14, 5, 2500.00),
(70, 23, 16, 1, 1000.00),
(71, 24, 23, 1, 123.00),
(72, 24, 19, 1, 23.00);

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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `order_status`, `order_placed`) VALUES
(1, 18, 'pending', '2025-06-01 00:00:00'),
(2, 6, 'cancelled', '2025-07-09 00:00:00'),
(3, 17, 'delivered', '2025-05-08 00:00:00'),
(4, 21, 'shipped', '2025-07-09 00:00:00'),
(5, 6, 'pending', '2025-07-09 15:22:33'),
(6, 6, 'pending', '2025-07-20 19:13:33'),
(7, 6, 'pending', '2025-07-20 19:16:40'),
(8, 6, 'pending', '2025-07-20 19:24:35'),
(9, 6, 'pending', '2025-07-20 19:25:17'),
(10, 6, 'pending', '2025-07-20 19:25:43'),
(11, 6, 'pending', '2025-07-20 19:25:44'),
(12, 6, 'pending', '2025-07-20 19:25:44'),
(13, 6, 'pending', '2025-07-20 19:25:45'),
(15, 6, 'pending', '2025-07-20 19:26:26'),
(20, 6, 'pending', '2025-07-20 19:31:47'),
(21, 6, 'pending', '2025-07-20 19:34:57'),
(22, 6, 'pending', '2025-07-20 19:38:32'),
(23, 6, 'pending', '2025-07-20 19:42:01'),
(24, 6, 'pending', '2025-07-20 19:43:24');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_review_item` (`item_id`),
  KEY `fk_review_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `item_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 10, 16, 5, 'gyyyyy', '2025-07-21 01:31:39', '2025-07-21 14:15:24'),
(2, 10, 16, 4, '4454545455', '2025-07-21 02:08:42', '2025-07-21 14:15:54'),
(3, 10, 16, 1, 'zxczxczxczxc', '2025-07-21 14:16:52', NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`stock_id`, `item_id`, `qty`) VALUES
(5, 14, 25),
(7, 16, 28),
(10, 19, 218),
(14, 23, 109);

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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `name`, `email`, `password`, `role`, `contact`, `city`, `is_active`, `img`, `token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(6, 'levi asher penaverde', 'sample@gmail.com', '$2b$10$Fn5n7qLqxNqrKwkBMySrv.iAGKHUL5J/AcpKHYVrz1FmBxfHYAqQS', 'user', '09385736287', 'taguig', 1, 'storage/images/Screenshot 2025-07-17 233742-1752909373661.png', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjo2LCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzA4NzEwMiwiZXhwIjoxNzUzMDk3OTAyfQ.gNphPAWTKzkOlhz39tSMY1svx3CoQ6kXlaOX_3yKaMM', '2025-06-29 12:48:49', NULL, NULL),
(10, 'Hans Ivan', 'hans@sample.com', '$2b$10$YHDn16X.GwQEgOl/lF6Rj.dv6FZXCq2ap2AdLgibxtAx6a3LWyi22', 'admin', '09385736288', 'taguig', 1, 'storage/images/Screenshot 2025-07-14 220931-1752765398050.png', NULL, '2025-07-04 20:27:19', NULL, NULL),
(17, 'jyren', 'jyren@gmail.com', '$2b$10$63T5hde9dO6MUQYlvEaSROZBhbxEqWWO29DBEtyUkO/wCFGwvKMWi', 'user', NULL, NULL, 1, NULL, NULL, '2025-07-04 20:45:42', NULL, NULL),
(18, 'allan roi bading123', 'allanmonforte@gmail.com', '$2b$10$071uU54GkiPtJE5kMjZOz.HkAg4mFARIXj.iv6Hfk76aYUbL6p0pa', 'user', '09385736286', 'taguig', 1, 'storage/images/WIN_20241007_16_47_31_Pro-1752473098764.jpg', NULL, '2025-07-04 20:46:25', NULL, NULL),
(21, 'user1', 'user1@gmail.com', '$2b$10$wlFR3WKASV2bqOg8ur8c7.NoDx9YO3VngBHR7h1OI5JMmfdtHuHsy', 'user', '', '', 0, NULL, NULL, '2025-07-05 12:12:25', NULL, '2025-07-20 13:16:07'),
(22, 'user2', 'user2@gmail.com', '$2b$10$M7ZsWaF66Zah/NpvcwQajOReyVtSovhQNx2WbdcyIu6AmKrnCKAAy', 'user', NULL, NULL, 1, NULL, NULL, '2025-07-05 12:12:49', NULL, '2025-07-09 11:22:00'),
(23, 'user3', 'user3@gmail.com', '$2b$10$etnFAJtcexZYUZebUwCh8..VVycAIice4B2e2Zmsud20/UvXU7VRW', 'user', NULL, NULL, 0, NULL, NULL, '2025-07-05 12:13:23', NULL, '2025-07-09 11:20:11'),
(25, 'user4', 'user4@gmail.com', '$2b$10$/QD7O0OadHdq5LRULTs8uejlU62b7.ctRPUERfjSJrvTuBjq9AWIq', 'user', NULL, NULL, 0, NULL, NULL, '2025-07-15 21:33:25', NULL, '2025-07-17 13:56:27'),
(26, 'melvin', 'bading@gmail.com', '$2b$10$UuPnozZFcWEnlsXkDJ6FaOX1CeSJxHl9ka8uvfYCPVH33YssOsvkG', 'user', '', '', 0, 'storage/images/Screenshot 2025-07-09 191654-1752731721859.png', NULL, '2025-07-17 13:55:05', NULL, NULL),
(27, 'user5', 'user5@gmail.com', '$2b$10$GiTs908eXEh3m.SlaaRmVOp5z0fpt06p/7CR4f/PgWzUVLNH4vqXO', 'user', NULL, NULL, 0, NULL, NULL, '2025-07-20 11:36:26', NULL, '2025-07-20 13:15:51'),
(28, 'user7', 'user7@gmail.com', '$2b$10$pihWVaiodbxd8qamSl5cpe3Uuu0gtoOTlTQ3fSc6hm.WlPJnD7stW', 'user', NULL, NULL, 0, NULL, NULL, '2025-07-20 11:38:34', NULL, '2025-07-20 13:15:46');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `item_category`
--
ALTER TABLE `item_category`
  ADD CONSTRAINT `fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE,
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
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_review_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `fk_stock_item_id` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
