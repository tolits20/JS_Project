-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 21, 2025 at 10:59 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `item_name`, `item_price`, `item_desc`, `item_img`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Monggol Pencil No.5', 9.00, 'this is a pencil recommended for bitch', 'storage/items/main/dashboard-1751900024772.jpg', '2025-07-05 15:03:28', '2025-07-09 08:14:22', NULL),
(2, 'cigarettes', 8.00, 'This material is recommended for ultra pro artist', 'storage/items/main/Screenshot 2025-07-08 202340-1752219398235.png', '2025-07-05 15:03:28', '2025-07-11 14:41:46', NULL),
(10, 'Hawk', 1000.00, 'Nagshashabushabu si levi', 'storage/items/main/pakyu-1752729965548.png', '2025-07-17 13:24:33', '2025-07-17 13:27:22', NULL),
(11, 'fsdfsdf', 33333.00, 'asdasdasdasd', NULL, '2025-07-19 14:43:01', NULL, NULL),
(12, 'asdasdasd', 123.00, 'asdasdasdasd', NULL, '2025-07-19 14:43:10', NULL, NULL),
(13, 'asdasdasdasd', 99999999.99, 'eeeeeeeeeeee', NULL, '2025-07-19 14:43:23', NULL, NULL),
(14, '333dsd', 3333.00, 'wdfssdfsfdsdf', NULL, '2025-07-19 14:43:32', NULL, NULL),
(15, 'sdvsdvsdvds', 222.00, 'asdasdsadasd', NULL, '2025-07-19 14:43:39', NULL, NULL),
(16, 'asdadasdasdasd', 222.00, 'asdasdasd', NULL, '2025-07-19 14:43:50', NULL, NULL),
(17, 'asdasdasd', 23333.00, 'asdasdasdasd', NULL, '2025-07-19 14:44:39', NULL, NULL),
(18, 'asdasdasdasd', 333.00, 'asdasdasda', NULL, '2025-07-19 14:44:52', NULL, NULL),
(19, '333', 3434.00, 'asdasdasdasda', NULL, '2025-07-19 14:46:13', NULL, NULL);

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
(1, 2),
(10, 2);

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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderlines`
--

INSERT INTO `orderlines` (`orderline_id`, `order_id`, `item_id`, `qty`, `order_price`) VALUES
(3, 1, 2, 2, 25.00),
(4, 2, 1, 1, 25.00),
(5, 3, 2, 11, 232.00),
(6, 4, 1, 23, 123.00),
(7, 1, 1, 2, 50.00),
(8, 6, 18, 2, 666.00),
(9, 7, 2, 5, 40.00),
(10, 8, 2, 5, 40.00),
(11, 9, 18, 1, 333.00),
(12, 10, 18, 1, 333.00),
(13, 11, 16, 1, 222.00),
(14, 12, 18, 1, 333.00),
(15, 13, 17, 1, 23333.00),
(16, 14, 18, 1, 333.00),
(17, 15, 17, 1, 23333.00),
(18, 16, 18, 1, 333.00),
(19, 16, 17, 1, 23333.00),
(20, 17, 16, 2, 444.00),
(21, 18, 19, 3, 10302.00),
(22, 19, 18, 10, 3330.00),
(23, 20, 18, 2, 666.00),
(24, 21, 18, 1, 333.00),
(25, 22, 18, 1, 333.00),
(26, 23, 18, 1, 333.00),
(27, 24, 18, 1, 333.00),
(28, 25, 13, 1, 99999999.99),
(29, 26, 16, 1, 222.00),
(30, 27, 16, 1, 222.00),
(31, 28, 18, 1, 333.00),
(32, 29, 18, 1, 333.00),
(33, 30, 18, 1, 333.00),
(34, 31, 10, 1, 1000.00),
(35, 32, 10, 1, 1000.00),
(36, 33, 18, 1, 333.00),
(37, 34, 1, 1, 9.00);

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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `order_status`, `order_placed`) VALUES
(1, 18, 'delivered', '2025-07-09 00:00:00'),
(2, 6, 'shipped', '2025-07-09 00:00:00'),
(3, 17, 'refunded', '2025-07-09 00:00:00'),
(4, 21, 'pending', '2025-07-09 00:00:00'),
(5, 6, 'pending', '2025-07-09 15:22:33'),
(6, 25, 'pending', '2025-07-20 16:00:32'),
(7, 25, 'pending', '2025-07-20 16:02:53'),
(8, 25, 'pending', '2025-07-20 16:18:52'),
(9, 25, 'pending', '2025-07-20 16:32:36'),
(10, 25, 'pending', '2025-07-20 16:51:57'),
(11, 25, 'pending', '2025-07-20 16:57:06'),
(12, 24, 'cancelled', '2025-07-20 18:20:30'),
(13, 24, 'cancelled', '2025-07-20 18:59:05'),
(14, 24, 'pending', '2025-07-20 19:08:37'),
(15, 24, 'pending', '2025-07-20 20:06:35'),
(16, 24, 'pending', '2025-07-20 20:34:05'),
(17, 24, 'cancelled', '2025-07-20 21:04:42'),
(18, 24, 'cancelled', '2025-07-20 21:21:51'),
(19, 24, 'cancelled', '2025-07-20 21:28:37'),
(20, 24, 'cancelled', '2025-07-20 21:53:09'),
(21, 24, 'pending', '2025-07-20 22:03:42'),
(22, 24, 'cancelled', '2025-07-20 22:04:01'),
(23, 24, 'pending', '2025-07-21 00:43:32'),
(24, 24, 'shipped', '2025-07-21 01:28:23'),
(25, 24, 'shipped', '2025-07-21 01:40:23'),
(26, 24, 'pending', '2025-07-21 01:45:20'),
(27, 24, 'pending', '2025-07-21 01:46:46'),
(28, 24, 'pending', '2025-07-21 01:51:25'),
(29, 24, 'cancelled', '2025-07-21 01:52:27'),
(30, 24, 'pending', '2025-07-21 01:54:23'),
(31, 24, 'shipped', '2025-07-21 02:06:58'),
(32, 24, 'shipped', '2025-07-21 02:31:54'),
(33, 24, 'shipped', '2025-07-21 13:20:21'),
(34, 24, 'shipped', '2025-07-21 14:16:24');

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
  KEY `fk_review_user` (`user_id`),
  KEY `fk_review_item` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `item_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 24, 18, 5, 'gyyyyy', '2025-07-21 01:31:39', '2025-07-21 14:15:24'),
(2, 24, 10, 4, '4454545455', '2025-07-21 02:08:42', '2025-07-21 14:15:54'),
(3, 24, 1, 1, 'zxczxczxczxc', '2025-07-21 14:16:52', NULL);

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
(1, 2, -5),
(2, 1, 34),
(5, 10, 53),
(6, 11, 333),
(7, 12, 1234),
(8, 13, 3332),
(9, 14, 4444),
(10, 15, 33232),
(11, 16, 117),
(12, 17, 1108),
(13, 18, 3331),
(14, 19, 4340);

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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `name`, `email`, `password`, `role`, `contact`, `city`, `is_active`, `img`, `token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(6, 'levi asher penaverde', 'sample@gmail.com', '$2b$10$Fn5n7qLqxNqrKwkBMySrv.iAGKHUL5J/AcpKHYVrz1FmBxfHYAqQS', 'admin', '09385736287', 'taguig', 1, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjo2LCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTI5MTUzNjIsImV4cCI6MTc1MjkyNjE2Mn0.znPNl27AFXAolLER1Uj0NEVQi4e_4KOlbzwWw8-mkmA', '2025-06-29 12:48:49', NULL, NULL),
(10, 'Hans Ivan', 'hans@sample.com', '$2b$10$YHDn16X.GwQEgOl/lF6Rj.dv6FZXCq2ap2AdLgibxtAx6a3LWyi22', 'admin', '09385736288', 'taguig', 1, NULL, NULL, '2025-07-04 20:27:19', NULL, NULL),
(17, 'jyren', 'jyren@gmail.com', '$2b$10$63T5hde9dO6MUQYlvEaSROZBhbxEqWWO29DBEtyUkO/wCFGwvKMWi', 'user', NULL, NULL, 0, NULL, NULL, '2025-07-04 20:45:42', NULL, NULL),
(18, 'allan roi badingna', 'allanmonforte@gmail.com', '$2b$10$071uU54GkiPtJE5kMjZOz.HkAg4mFARIXj.iv6Hfk76aYUbL6p0pa', 'user', '09385736286', 'taguig', 0, 'storage/images/John-Rawls-1752915255632.png', NULL, '2025-07-04 20:46:25', NULL, NULL),
(21, 'user1', 'user1@gmail.com', '$2b$10$wlFR3WKASV2bqOg8ur8c7.NoDx9YO3VngBHR7h1OI5JMmfdtHuHsy', 'user', '', '', 1, NULL, NULL, '2025-07-05 12:12:25', NULL, NULL),
(22, 'user2', 'user2@gmail.com', '$2b$10$M7ZsWaF66Zah/NpvcwQajOReyVtSovhQNx2WbdcyIu6AmKrnCKAAy', 'user', NULL, NULL, 1, NULL, NULL, '2025-07-05 12:12:49', NULL, '2025-07-09 11:22:00'),
(23, 'user3', 'user3@gmail.com', '$2b$10$etnFAJtcexZYUZebUwCh8..VVycAIice4B2e2Zmsud20/UvXU7VRW', 'user', NULL, NULL, 0, NULL, NULL, '2025-07-05 12:13:23', NULL, '2025-07-09 11:20:11'),
(24, 'user one', 'user@example.com', '$2b$10$qhOADfMHeKQzVu9AT4Dp0eNPcsfo3LEWUCv32YcBPUjrPJ0pGMOMG', 'user', NULL, NULL, 1, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyNCwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTMwODYwMjQsImV4cCI6MTc1MzA5NjgyNH0.4DZMyXcJBHjukG4qTeZFuUjtLOEP1HMT-Lr0PuAZBkA', '2025-07-16 23:23:41', NULL, NULL),
(25, 'userrrr', 'user12@example.com', '$2b$10$2yAaQtYnWRaijFXKa3XPi.tOlYeiEooJe8EVwRGRrUMhu3ru9ml0a', 'user', NULL, NULL, 1, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyNSwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTMwODYwMTgsImV4cCI6MTc1MzA5NjgxOH0.U7FTKGxuBArx3srKt0geRFKqJOEDD-oi_CosrPIJwFk', '2025-07-19 17:08:02', NULL, NULL);

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
