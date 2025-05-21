-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2025 at 09:09 AM
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
-- Database: `zomer_cafe`
--

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `category` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`id`, `category`, `name`, `description`, `price`, `image_url`, `created_at`) VALUES
(2, 'Coffee', 'Americano', 'Hot black coffee with bold taste.', 10000.00, NULL, '2025-05-14 20:26:59'),
(3, 'Coffee', 'Cappuccino', 'Espresso with steamed milk and foam.', 12000.00, NULL, '2025-05-14 20:26:59'),
(4, 'Coffee', 'Kopi Karamel', 'Sweet caramel coffee blend.', 12000.00, NULL, '2025-05-14 20:26:59'),
(5, 'Coffee', 'Tubruk', 'Traditional Indonesian black coffee.', 5000.00, NULL, '2025-05-14 20:26:59'),
(6, 'Coffee', 'Zomer Signature', 'Specialty house coffee.', 10000.00, NULL, '2025-05-14 20:26:59'),
(7, 'Non Coffee', 'Es Cokelat', 'Iced chocolate beverage.', 12000.00, NULL, '2025-05-14 20:26:59'),
(8, 'Non Coffee', 'Es Setrup Beri', 'Iced berry syrup drink.', 10000.00, NULL, '2025-05-14 20:26:59'),
(9, 'Non Coffee', 'Es Susu', 'Iced milk drink.', 12000.00, NULL, '2025-05-14 20:26:59'),
(10, 'Non Coffee', 'Es Teh', 'Iced tea.', 5000.00, NULL, '2025-05-14 20:26:59'),
(11, 'Non Coffee', 'Es Teh Leci', 'Iced tea with lychee flavor.', 8000.00, NULL, '2025-05-14 20:26:59'),
(12, 'Non Coffee', 'Es Teh Tarik', 'Iced pulled tea.', 10000.00, NULL, '2025-05-14 20:26:59'),
(13, 'Non Coffee', 'Green Tea', 'Matcha-based iced drink.', 15000.00, NULL, '2025-05-14 20:26:59'),
(14, 'Non Coffee', 'Milo T-Rex', 'Iced Milo with topping.', 15000.00, NULL, '2025-05-14 20:26:59'),
(15, 'Non Coffee', 'Suhe', 'Iced traditional herbal drink.', 10000.00, NULL, '2025-05-14 20:26:59'),
(16, 'Non Coffee', 'Taro', 'Iced taro milk drink.', 10000.00, NULL, '2025-05-14 20:26:59'),
(17, 'Non Coffee', 'Thai Tea', 'Iced Thai-style milk tea.', 12000.00, NULL, '2025-05-14 20:26:59'),
(18, 'Non Coffee', 'Air Mineral', 'Bottled mineral water.', 2500.00, NULL, '2025-05-14 20:26:59'),
(19, 'Non Coffee', 'Extra Espresso Shot', 'Add-on espresso shot.', 3000.00, NULL, '2025-05-14 20:26:59'),
(20, 'Foods', 'Baxo Tahu Goreng', 'Fried tofu meatballs.', 12000.00, NULL, '2025-05-14 20:26:59'),
(21, 'Foods', 'Beef Burger', 'Juicy beef burger with sauce.', 12000.00, NULL, '2025-05-14 20:26:59'),
(22, 'Foods', 'Mie Goreng Spesial', 'Special fried noodles.', 10000.00, NULL, '2025-05-14 20:26:59'),
(23, 'Foods', 'Mie Kuah Spesial', 'Special soup noodles.', 10000.00, NULL, '2025-05-14 20:26:59'),
(24, 'Foods', 'Nasi Telur Mayo', 'Rice with egg and mayo.', 10000.00, NULL, '2025-05-14 20:26:59'),
(25, 'Foods', 'Robak (Cokelat & Srikaya)', 'Sweet roti bakar with chocolate & srikaya.', 12000.00, NULL, '2025-05-14 20:26:59'),
(26, 'Foods', 'Robak Telur', 'Savory roti bakar with egg.', 15000.00, NULL, '2025-05-14 20:26:59'),
(27, 'Foods', 'Kikil Sapi', 'Beef tendon stew.', 25000.00, NULL, '2025-05-14 20:26:59'),
(28, 'Foods', 'Krengsengan Sapi', 'Spiced beef dish.', 25000.00, NULL, '2025-05-14 20:26:59'),
(29, 'Foods', 'Extra Nasi Putih', 'Additional white rice.', 5000.00, NULL, '2025-05-14 20:26:59'),
(30, 'Foods', 'Extra Patty', 'Additional meat patty.', 8000.00, NULL, '2025-05-14 20:26:59'),
(31, 'Foods', 'Extra Telur', 'Additional egg.', 5000.00, NULL, '2025-05-14 20:26:59');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `items` text NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `guests` int(11) NOT NULL,
  `table` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
