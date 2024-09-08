-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306:3306
-- Generation Time: Sep 08, 2024 at 08:08 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ssquickhelper`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `payment_mode` varchar(255) DEFAULT NULL,
  `transection_id` varchar(255) DEFAULT NULL,
  `upi` varchar(255) DEFAULT NULL,
  `cash` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `payment_mode`, `transection_id`, `upi`, `cash`, `createdAt`, `updatedAt`) VALUES
(1, 'cash', NULL, NULL, '7000', '2024-09-08 11:01:17', '2024-09-08 11:01:17');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `mobileNo` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `role`, `mobileNo`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'Nursid Ansari', 'locifar@gmail.com', 'admin', '89765432', '12312', '2024-02-12 19:02:30', '2024-02-12 19:02:30'),
(2, 'Helpers Admin', 'superadmin@helpers.com', 'Super Admin', '', '$2b$10$h7bjHC61oGCefd1k8IyLTuseECTBxA4lKjtHbvs9IzECfmzhD7yXe', '2024-02-13 16:34:37', '2024-07-30 07:41:36'),
(3, 'Doctor', '', 'service', '7081002501', '12345', '2024-02-13 17:11:25', '2024-02-13 17:11:25');

-- --------------------------------------------------------

--
-- Table structure for table `admin_roles`
--

CREATE TABLE `admin_roles` (
  `id` int(11) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `Dashboard` tinyint(1) DEFAULT NULL,
  `Attendence` tinyint(1) DEFAULT NULL,
  `AttendenceEmployee` tinyint(1) DEFAULT NULL,
  `AttendenceServiceProvider` tinyint(1) DEFAULT NULL,
  `AttendenceReport` tinyint(1) DEFAULT NULL,
  `AttendenceModify` tinyint(1) DEFAULT NULL,
  `Expenses` tinyint(1) DEFAULT NULL,
  `AddHeadExpence` tinyint(1) DEFAULT NULL,
  `AddExpense` tinyint(1) DEFAULT NULL,
  `AddCollections` tinyint(1) DEFAULT NULL,
  `TodaysReport` tinyint(1) DEFAULT NULL,
  `AllTransactionReport` tinyint(1) DEFAULT NULL,
  `ManageHR` tinyint(1) DEFAULT NULL,
  `ManageEmployee` tinyint(1) DEFAULT NULL,
  `ManageServiceProvider` tinyint(1) DEFAULT NULL,
  `ManageService` tinyint(1) DEFAULT NULL,
  `ManagePage` tinyint(1) DEFAULT NULL,
  `ManageTestimonial` tinyint(1) DEFAULT NULL,
  `ManageOffer` tinyint(1) DEFAULT NULL,
  `ManagePost` tinyint(1) DEFAULT NULL,
  `ManageAdvertisement` tinyint(1) DEFAULT NULL,
  `Customer` tinyint(1) DEFAULT NULL,
  `ManageCustomer` tinyint(1) DEFAULT NULL,
  `ManageHistory` tinyint(1) DEFAULT NULL,
  `MonthlyMembers` tinyint(1) DEFAULT NULL,
  `ManageEnquiry` tinyint(1) DEFAULT NULL,
  `RolesAndPermission` tinyint(1) DEFAULT NULL,
  `ManageMonthService` tinyint(1) NOT NULL,
  `Profile` varchar(255) DEFAULT NULL,
  `Analytics` tinyint(1) DEFAULT NULL,
  `Complain` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin_roles`
--

INSERT INTO `admin_roles` (`id`, `role`, `Dashboard`, `Attendence`, `AttendenceEmployee`, `AttendenceServiceProvider`, `AttendenceReport`, `AttendenceModify`, `Expenses`, `AddHeadExpence`, `AddExpense`, `AddCollections`, `TodaysReport`, `AllTransactionReport`, `ManageHR`, `ManageEmployee`, `ManageServiceProvider`, `ManageService`, `ManagePage`, `ManageTestimonial`, `ManageOffer`, `ManagePost`, `ManageAdvertisement`, `Customer`, `ManageCustomer`, `ManageHistory`, `MonthlyMembers`, `ManageEnquiry`, `RolesAndPermission`, `ManageMonthService`, `Profile`, `Analytics`, `Complain`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 'admin', 1, 1, '2024-02-15 17:13:12', '2024-06-09 20:11:42');

-- --------------------------------------------------------

--
-- Table structure for table `advertisements`
--

CREATE TABLE `advertisements` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `gst_no` varchar(255) DEFAULT NULL,
  `payment` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `start_date` varchar(255) DEFAULT NULL,
  `end_date` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `block` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `advertisements`
--

INSERT INTO `advertisements` (`id`, `company_name`, `gst_no`, `payment`, `mobile`, `start_date`, `end_date`, `image`, `block`, `createdAt`, `updatedAt`) VALUES
(11, 'BPM KIDNEY CARE', 'BPM KIDNEY CARE', 'BPM KIDNEY CARE', '9839730378', '05-06-2019', '05-06-2020', 'IMG_20190605_155843.jpg', 1, '0000-00-00 00:00:00', '2024-06-25 04:14:03'),
(12, 'HELPER FOR YOUR SERVICES ', 'HELPER FOR YOUR SERVICES ', 'HELPER FOR YOUR SERVICES ', '9682077000', '05-06-2019', '05-06-2020', 'IMG_20190605_155503.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(13, 'HELPER FOR YOUR SERVICES ', 'HELPER FOR YOUR SERVICES ', 'HELPER FOR YOUR SERVICES ', '9682077000', '05-06-2019', '05-06-2020', 'IMG_20190605_155604.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(14, 'HELPER FOR YOUR SERVICES ', 'HELPER FOR YOUR SERVICES ', 'HELPER FOR YOUR SERVICES ', '9682077000', '05-06-2019', '05-06-2020', 'IMG_20190605_155642.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(15, 'SMS EDUCATION ', 'SMS EDUCATION ', 'SMS EDUCATION ', '8090004415', '05-06-2019', '05-06-2020', 'IMG_20190605_155702.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(16, 'METRO FLEX PRINTING ', 'METRO FLEX PRINTING ', 'METRO FLEX PRINTING ', '8840571417', '05-06-2019', '05-06-2020', 'IMG_20190605_155722.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(17, 'AVADH PATHOLOGY CENTRE ', 'AVADH PATHOLOGY CENTRE ', 'AVADH PATHOLOGY CENTRE ', '9794866043', '05-06-2019', '05-06-2020', 'IMG_20190605_155153.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(18, 'MARIGOLD ', 'MARIGOLD ', 'MARIGOLD ', '7052669966', '05-06-2019', '05-06-2020', 'IMG_20190605_155215.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(19, 'KALYANI JEWELS', 'KALYANI JEWELS', 'KALYANI JEWELS', '8604431313', '05-06-2019', '05-06-2020', 'IMG_20190605_155240.jpg', 0, '0000-00-00 00:00:00', '2024-06-25 18:26:21'),
(20, 'PHA JOB CONSULTANT ', 'PHA JOB CONSULTANT ', 'PHA JOB CONSULTANT ', '968077000', '05-06-2019', '05-06-2020', 'IMG_20190605_155301.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(21, 'CHAUBEY PROPERTIES', 'CHAUBEY PROPERTIES', 'CHAUBEY PROPERTIES', '9450662626', '05-06-2019', '05-06-2020', 'IMG_20190605_155320.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(22, 'ABHIGYAN ENTERPRISES', 'ABHIGYAN ENTERPRISES', 'ABHIGYAN ENTERPRISES', '9839648440', '05-06-2019', '05-06-2020', 'IMG_20190605_160050.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(23, 'AKASH COMPANY', 'AKASH COMPANY', 'AKASH COMPANY', '9161125088', '05-06-2019', '05-06-2020', 'IMG_20190605_160116.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(24, 'S.R UNISEX SALON', 'S.R UNISEX SALON', 'S.R UNISEX SALON', '9682084134', '05-06-2019', '05-06-2020', 'IMG_20190605_160135.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(25, 'DARPAN WELLNESS CENTRE', 'DARPAN WELLNESS CENTRE', 'DARPAN WELLNESS CENTRE', '8299652729', '05-06-2019', '05-06-2020', 'IMG_20190605_160150.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(26, 'MANNY MOTORS', 'MANNY MOTORS', 'MANNY MOTORS', '9415101212', '05-06-2019', '05-06-2020', 'IMG_20190605_160206.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(27, 'THE TYRE JUNCTION', 'THE TYRE JUNCTION', 'THE TYRE JUNCTION', '7081700051', '05-06-2019', '05-06-2020', 'IMG_20190605_160221.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(28, 'HOME DESIGN &CONSTRUCTION GROUP ', 'HOME DESIGN &CONSTRUCTION GROUP ', 'HOME DESIGN &CONSTRUCTION GROUP ', '9450072250', '05-06-2019', '05-06-2020', 'IMG_20190605_155915.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(29, 'SHIVA MEDICAL STORE ', '.', '0', '9919214164', '05-06-2019', '05-06-2019', 'IMG_20190605_155935.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(30, 'DENTAL SPA MULTISPECIALITY ', '.', '0', '8299652729', '05-06-2019', '05-06-2019', 'IMG_20190605_160010.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(31, 'RAJ & RAJ RESTAURANT ', '.', '1276212', '9336616175', '2019-06-15', '2019-06-22', 'pexels-photo-699466.jpeg', 1, '0000-00-00 00:00:00', '2024-04-07 19:03:53'),
(32, 'test', '4342', 'jndssdcjksnc', '7081002501', '2019-06-01', '2019-06-30', NULL, 1, '2024-04-07 18:51:00', '2024-04-07 19:00:26'),
(33, 'sujeet', 'hcjbsdjh453', '3200', '8457465748', '2024-09-07', '2024-09-08', 'Screenshot 2024-07-06 023712.png', 1, '2024-09-07 16:16:02', '2024-09-07 16:16:02');

-- --------------------------------------------------------

--
-- Table structure for table `alloted_items`
--

CREATE TABLE `alloted_items` (
  `id` int(11) NOT NULL,
  `allotdate` varchar(255) NOT NULL,
  `spname` varchar(255) NOT NULL,
  `item` varchar(255) NOT NULL,
  `aqty` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `alloted_items`
--

INSERT INTO `alloted_items` (`id`, `allotdate`, `spname`, `item`, `aqty`, `remark`, `createdAt`, `updatedAt`) VALUES
(2, '2022-09-13', 'Shubham Dhanuk', 'Tyre Polish', '1', 'For Car Wash', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, '2022-09-18', 'SHUBHAM DHANUK', 'RED HARPIC', '1', 'GIVEN BY  SARITA MAAM ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, '2022-09-19', 'Shubham Dhanuk', 'Acid Bottles', '6', 'Bathroom Cleaned 5', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, '2022-09-19', 'Shubham Dhanuk', 'RED HARPIC', '1', 'For Bathroom Cleaning', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(7, '2022-09-21', 'Shubham Dhanuk', 'Acid Bottles', '1', 'Given By Harshita', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(8, '2022-09-21', 'SHUBHAM DHANUK', 'Acid Bottles', '1', 'allot by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(9, '2022-09-22', 'MOHIT ', 'AMPIAR METTER ', '1', 'ALLOT BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(10, '2022-09-22', 'MOHIT ', 'PHYER ', '1', 'ALLOT BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(11, '2022-09-22', 'MOHIT ', 'NOSE PHYALER ', '1', 'ALLOT BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(12, '2022-09-22', 'MOHIT ', 'WIRE CUTTER', '1', 'ALLOT BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(13, '2022-09-22', 'MOHIT ', 'SCRUDRIVER  LARGE ', '1', 'ALLOT BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(14, '2022-09-22', 'MOHIT ', 'SRUDIVER SMALL', '1', 'ALLOT BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(15, '2022-09-22', 'MOHIT ', 'FILI', '1', 'ALLOT BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(16, '2022-09-22', 'MOHIT ', 'WIRE CUTTER', '1', 'ALLOT BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(17, '2022-09-22', 'MOHIT ', 'SRUDIVER SMALL', '1', 'ALLOT BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(18, '2022-09-22', 'MOHIT ', 'WIRE CUTTER', '1', 'ALLOT BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(19, '2022-09-22', 'MOHIT ', 'SRUDRIVER  MEDIUM ', '1', 'ALLOTED  BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(20, '2022-09-22', 'MOHIT ', 'SRUDIVER SMALL', '1', 'ALLOT BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(21, '2022-09-23', 'SHUBHAM DHANUK', 'Acid Bottles', '1', 'allotted by harshita  ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(22, '2022-09-24', 'subhuman ', 'steel scotch ', '4', 'allotted by harshita  ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(23, '2022-09-24', 'subhuman ', 'Acid Bottles', '1', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(24, '2022-09-24', 'ayush', 'hand scotch ', '2', 'alloted by harshita', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(25, '2022-09-24', 'ayush', 'Acid Bottles', '1', 'alloted by harshita', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(26, '2022-09-24', 'ayush', 'steel scotch ', '4', 'alloted by harshita', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(27, '2022-09-27', 'SHUBHAM DHANUK', 'Acid Bottles', '1', 'allotted  by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(28, '2022-09-30', 'SHUBHAM DHANUK', 'Acid Bottles', '2', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(29, '2022-09-30', 'ayush', 'Acid Bottles', '1', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(30, '2022-09-30', 'Vijay ', 'bathroom brush ', '1', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(31, '2022-09-30', 'SHUBHAM DHANUK', 'bathroom brush ', '1', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(32, '2022-09-30', 'ayush', 'bathroom brush ', '1', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(33, '2022-09-30', 'ayush', 'Colin', '1', 'allotted by harshitz', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(35, '2022-09-30', 'ritesh ', 'fom spanch ', '2', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(36, '2022-09-30', 'Vijay ', 'BLUE HARPIC', '1', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(37, '2022-09-30', 'Vijay ', 'RED HARPIC', '1', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(38, '2022-09-30', 'Vijay ', 'hand scotch ', '1', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(39, '2022-09-30', 'Vijay ', 'steel scotch ', '2', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(40, '2022-09-30', 'SHUBHAM DHANUK', 'hand scotch ', '3', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(41, '2022-09-30', 'Vijay ', 'steel scotch ', '5', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(42, '2022-09-30', 'Vijay ', 'RED HARPIC', '1', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(43, '2022-09-30', 'SHUBHAM DHANUK', 'TOWEL', '2', 'ALLOTED BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(44, '2022-09-30', 'SHUBHAM DHANUK', 'Colin', '1', 'ALLOTED BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(45, '2022-09-30', 'SHUBHAM DHANUK', 'bathroom brush ', '1', 'ALLOTED BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(46, '2022-09-30', 'SHUBHAM DHANUK', 'TOWEL', '1', 'ALLOTED BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(47, '2022-10-02', 'jatin ', 'Acid Bottles', '2', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(48, '2022-10-04', 'lavkesh ', 'TOWEL', '2', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(49, '2022-10-08', '1', 'hand scotch ', '1', 'allotted by harshita', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(50, '2022-10-08', '1', 'Acid Bottles', '1', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(51, '2022-10-09', 'manjeet ', 'fom spanch ', '1', 'allotted  by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(52, '0000-00-00', 'SHUBHAM DHANUK', 'Acid Bottles', '2', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(53, '2022-10-09', 'SHUBHAM DHANUK', 'Acid Bottles', '2', 'allotted by harshita', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(54, '2022-10-11', 'jatin ', 'Colin', '1', 'allotted by harshita', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(55, '0000-00-00', 'ARUN ', 'TOWEL', '1', 'ALLOTED BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(56, '2022-10-16', 'SHUBHAM DHANUK', 'Acid Bottles', '1', 'ALLOTED BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(57, '0000-00-00', 'AKHILESH ', 'TOWEL', '1', 'ALLOTED BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(58, '2022-10-16', 'manjeet ', 'Acid Bottles', '1', 'ALLOTED BY HARSHITA ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(59, '0000-00-00', 'manjeet ', 'Acid Bottles', '2', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(60, '2022-10-19', 'ayush', 'Colin', '4', 'allotted by harshita', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(61, '2022-10-19', 'jatin ', 'Acid Bottles', '2', ' allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(62, '0000-00-00', 'SHUBHAM DHANUK', 'Acid Bottles', '3', 'alloted by harshita', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(63, '0000-00-00', 'SHUBHAM DHANUK', 'Acid Bottles', '8', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(64, '0000-00-00', 'SHUBHAM DHANUK', 'hand scotch ', '2', 'allotted by harshita ', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `availabilities`
--

CREATE TABLE `availabilities` (
  `id` int(11) NOT NULL,
  `date` varchar(255) DEFAULT NULL,
  `emp_id` varchar(255) DEFAULT NULL,
  `09:00-09:30` varchar(255) DEFAULT NULL,
  `09:30-10:00` varchar(255) DEFAULT NULL,
  `10:00-10:30` varchar(255) DEFAULT NULL,
  `10:30-11:00` varchar(255) DEFAULT NULL,
  `11:00-11:30` varchar(255) DEFAULT NULL,
  `11:30-12:00` varchar(255) DEFAULT NULL,
  `12:00-12:30` varchar(255) DEFAULT NULL,
  `12:30-01:00` varchar(255) DEFAULT NULL,
  `01:00-01:30` varchar(255) DEFAULT NULL,
  `01:30-02:00` varchar(255) DEFAULT NULL,
  `02:00-02:30` varchar(255) DEFAULT NULL,
  `02:30-03:00` varchar(255) DEFAULT NULL,
  `03:00-03:30` varchar(255) DEFAULT NULL,
  `03:30-04:00` varchar(255) DEFAULT NULL,
  `04:00-04:30` varchar(255) DEFAULT NULL,
  `04:30-05:00` varchar(255) DEFAULT NULL,
  `05:00-05:30` varchar(255) DEFAULT NULL,
  `05:30-06:00` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `availabilities`
--

INSERT INTO `availabilities` (`id`, `date`, `emp_id`, `09:00-09:30`, `09:30-10:00`, `10:00-10:30`, `10:30-11:00`, `11:00-11:30`, `11:30-12:00`, `12:00-12:30`, `12:30-01:00`, `01:00-01:30`, `01:30-02:00`, `02:00-02:30`, `02:30-03:00`, `03:00-03:30`, `03:30-04:00`, `04:00-04:30`, `04:30-05:00`, `05:00-05:30`, `05:30-06:00`, `createdAt`, `updatedAt`) VALUES
(1, '2024-09-08', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-08 07:32:56', '2024-09-08 07:58:08'),
(2, '2024-09-08', '3', 'HOME CLEANING SERVICE-00001', 'Fridge-00002', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-08 07:50:41', '2024-09-08 08:15:51'),
(3, '2024-09-08', '6', 'leave', 'leave', 'leave', 'leave', 'leave', 'leave', 'leave', 'leave', 'leave', 'leave', 'leave', 'leave', 'leave', 'leave', 'leave', 'leave', 'leave', 'leave', '2024-09-08 10:36:14', '2024-09-08 11:14:14'),
(4, '2024-09-08', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'HOME CLEANING SERVICE-00003', 'bathroom cleaning -00005', '2024-09-08 10:58:43', '2024-09-08 12:13:17'),
(5, '2024-09-08', '7', 'Carpenter-00006', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Plumber-00004', NULL, NULL, NULL, '2024-09-08 11:42:53', '2024-09-08 12:15:37');

-- --------------------------------------------------------

--
-- Table structure for table `back_office_roles`
--

CREATE TABLE `back_office_roles` (
  `id` int(11) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `Dashboard` tinyint(1) DEFAULT NULL,
  `Attendence` tinyint(1) DEFAULT NULL,
  `Availability` tinyint(1) NOT NULL DEFAULT 0,
  `AttendenceEmployee` tinyint(1) DEFAULT NULL,
  `AttendenceServiceProvider` tinyint(1) DEFAULT NULL,
  `AttendenceReport` tinyint(1) DEFAULT NULL,
  `AttendenceModify` tinyint(1) DEFAULT NULL,
  `Expenses` tinyint(1) DEFAULT NULL,
  `AddHeadExpence` tinyint(1) DEFAULT NULL,
  `AddExpense` tinyint(1) DEFAULT NULL,
  `AddCollections` tinyint(1) DEFAULT NULL,
  `TodaysReport` tinyint(1) DEFAULT NULL,
  `AllTransactionReport` tinyint(1) DEFAULT NULL,
  `ManageHR` tinyint(1) DEFAULT NULL,
  `ManageEmployee` tinyint(1) DEFAULT NULL,
  `ManageServiceProvider` tinyint(1) DEFAULT NULL,
  `ManageService` tinyint(1) DEFAULT NULL,
  `ManagePage` tinyint(1) DEFAULT NULL,
  `ManageTestimonial` tinyint(1) DEFAULT NULL,
  `ManageOffer` tinyint(1) DEFAULT NULL,
  `ManagePost` tinyint(1) DEFAULT NULL,
  `ManageAdvertisement` tinyint(1) DEFAULT NULL,
  `Customer` tinyint(1) DEFAULT NULL,
  `ManageCustomer` tinyint(1) DEFAULT NULL,
  `ManageHistory` tinyint(1) DEFAULT NULL,
  `MonthlyMembers` tinyint(1) DEFAULT NULL,
  `ManageMonthService` tinyint(1) NOT NULL,
  `ManageEnquiry` tinyint(1) DEFAULT NULL,
  `RolesAndPermission` tinyint(1) DEFAULT NULL,
  `Profile` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `back_office_roles`
--

INSERT INTO `back_office_roles` (`id`, `role`, `Dashboard`, `Attendence`, `Availability`, `AttendenceEmployee`, `AttendenceServiceProvider`, `AttendenceReport`, `AttendenceModify`, `Expenses`, `AddHeadExpence`, `AddExpense`, `AddCollections`, `TodaysReport`, `AllTransactionReport`, `ManageHR`, `ManageEmployee`, `ManageServiceProvider`, `ManageService`, `ManagePage`, `ManageTestimonial`, `ManageOffer`, `ManagePost`, `ManageAdvertisement`, `Customer`, `ManageCustomer`, `ManageHistory`, `MonthlyMembers`, `ManageMonthService`, `ManageEnquiry`, `RolesAndPermission`, `Profile`, `createdAt`, `updatedAt`) VALUES
(1, 'office', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 'backoffice', '2024-02-15 17:16:45', '2024-02-15 17:16:45');

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE `collections` (
  `id` int(11) NOT NULL,
  `serviceProvider` varchar(255) NOT NULL,
  `serviceName` varchar(255) NOT NULL,
  `paymentMethod` varchar(255) NOT NULL,
  `expenseType` varchar(255) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `personName` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `timeIn` varchar(255) NOT NULL,
  `timeOut` varchar(255) NOT NULL,
  `orderNo` varchar(255) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `complain`
--

CREATE TABLE `complain` (
  `id` int(11) NOT NULL,
  `order_no` varchar(255) DEFAULT NULL,
  `user_type` varchar(255) DEFAULT NULL,
  `booktime` varchar(255) DEFAULT NULL,
  `bookdate` varchar(255) DEFAULT NULL,
  `service_name` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `service_address` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `problem_des` varchar(255) DEFAULT NULL,
  `cust_id` varchar(255) DEFAULT NULL,
  `issapproved` int(11) DEFAULT NULL,
  `suprvisor_id` varchar(255) DEFAULT NULL,
  `servicep_id` varchar(255) DEFAULT NULL,
  `paymethod` varchar(255) DEFAULT NULL,
  `totalamt` varchar(255) DEFAULT NULL,
  `piadamt` varchar(255) DEFAULT NULL,
  `netpayamt` varchar(255) DEFAULT NULL,
  `reservprovider` varchar(255) DEFAULT NULL,
  `review` varchar(255) DEFAULT NULL,
  `admin_approve` int(11) DEFAULT NULL,
  `pending` int(11) DEFAULT NULL,
  `cust_remark` varchar(255) DEFAULT NULL,
  `servp_remark` varchar(255) DEFAULT NULL,
  `suerv_remark` varchar(255) DEFAULT NULL,
  `admin_remark` varchar(255) DEFAULT NULL,
  `bakof_remark` varchar(255) DEFAULT NULL,
  `sueadmin_remark` varchar(255) DEFAULT NULL,
  `cancle_reson` varchar(255) DEFAULT NULL,
  `service_status` varchar(255) DEFAULT NULL,
  `reotrans` varchar(255) DEFAULT NULL,
  `checkstatus` int(11) DEFAULT NULL,
  `checkintime` varchar(255) DEFAULT NULL,
  `checkouttime` varchar(255) DEFAULT NULL,
  `land_mark` varchar(255) DEFAULT NULL,
  `vehicle_inventory` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `complain`
--

INSERT INTO `complain` (`id`, `order_no`, `user_type`, `booktime`, `bookdate`, `service_name`, `city`, `service_address`, `pincode`, `problem_des`, `cust_id`, `issapproved`, `suprvisor_id`, `servicep_id`, `paymethod`, `totalamt`, `piadamt`, `netpayamt`, `reservprovider`, `review`, `admin_approve`, `pending`, `cust_remark`, `servp_remark`, `suerv_remark`, `admin_remark`, `bakof_remark`, `sueadmin_remark`, `cancle_reson`, `service_status`, `reotrans`, `checkstatus`, `checkintime`, `checkouttime`, `land_mark`, `vehicle_inventory`, `createdAt`, `updatedAt`) VALUES
(1, NULL, 'Regular', '10:00 AM', '2024-07-25', 'Plumbing Services', 'New York', '456 Service Avenue', NULL, 'Leaking faucet in kitchen', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Near Park', NULL, '2024-07-22 19:10:27', '2024-07-22 19:10:27'),
(2, '50826', 'urgent', '03:17', '2024-07-23', 'Security Guard', 'Lucknow', 'ALASKA', NULL, 'here is some problem ', '941', NULL, NULL, 'Mohb. Arbza', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'polytechnoc', NULL, '2024-07-23 19:45:26', '2024-07-24 18:31:39'),
(3, '50826', 'regular', '01:43', '2024-07-24', 'Security Guard', 'Lucknow', 'Lucknow', NULL, 'this is for testing ', '941', NULL, 'jhsdcbjh', 'Mohb. Arbza', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'polytechnoc', NULL, '2024-07-24 18:11:56', '2024-07-24 18:43:22'),
(4, '50842', 'regular', '02:42', '2024-07-26', 'Plumber', 'Lucknow', 'lucknow', NULL, 'this is for testing ', '941', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'polytechnoc', NULL, '2024-07-24 19:09:59', '2024-07-24 19:09:59');

-- --------------------------------------------------------

--
-- Table structure for table `customerids`
--

CREATE TABLE `customerids` (
  `id` int(11) NOT NULL,
  `seq` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `gender` enum('Female','Male','Other','') DEFAULT NULL,
  `age` bigint(20) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `land_mark` varchar(300) DEFAULT NULL,
  `location` varchar(300) DEFAULT NULL,
  `mobile` varchar(300) DEFAULT NULL,
  `tel_no` bigint(20) DEFAULT NULL,
  `office_no` varchar(300) DEFAULT NULL,
  `alternate_no` bigint(20) DEFAULT NULL,
  `aadhar_no` bigint(20) DEFAULT NULL,
  `occupation` varchar(300) DEFAULT NULL,
  `designation` varchar(300) DEFAULT NULL,
  `own_house` varchar(300) DEFAULT NULL,
  `dob` datetime DEFAULT NULL,
  `doa` varchar(300) DEFAULT NULL,
  `spouse_name` varchar(300) DEFAULT NULL,
  `spouse_name1` varchar(300) DEFAULT NULL,
  `spouse_dob1` datetime DEFAULT NULL,
  `spouse_name2` varchar(300) DEFAULT NULL,
  `spouse_dob2` datetime DEFAULT NULL,
  `spouse_dob` varchar(300) DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  `payment` bigint(20) DEFAULT NULL,
  `discount_amount` int(11) DEFAULT NULL,
  `recieved_amount` int(11) DEFAULT NULL,
  `balance_amount` int(11) DEFAULT NULL,
  `payment_method` varchar(300) DEFAULT NULL,
  `service` varchar(255) DEFAULT NULL,
  `service1` varchar(255) DEFAULT NULL,
  `service2` varchar(255) DEFAULT NULL,
  `service3` varchar(255) DEFAULT NULL,
  `service4` varchar(255) DEFAULT NULL,
  `service5` varchar(255) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `reference` varchar(200) DEFAULT NULL,
  `familyMember` varchar(200) DEFAULT NULL,
  `membership` varchar(200) DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT NULL,
  `member_id` varchar(200) DEFAULT NULL,
  `is_block` tinyint(1) DEFAULT NULL,
  `todate` datetime DEFAULT NULL,
  `validtodate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `user_id`, `gender`, `age`, `address`, `land_mark`, `location`, `mobile`, `tel_no`, `office_no`, `alternate_no`, `aadhar_no`, `occupation`, `designation`, `own_house`, `dob`, `doa`, `spouse_name`, `spouse_name1`, `spouse_dob1`, `spouse_name2`, `spouse_dob2`, `spouse_dob`, `image`, `payment`, `discount_amount`, `recieved_amount`, `balance_amount`, `payment_method`, `service`, `service1`, `service2`, `service3`, `service4`, `service5`, `username`, `reference`, `familyMember`, `membership`, `is_approved`, `member_id`, `is_block`, `todate`, `validtodate`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Male', 50, '1/69, Sarda nagar, lko', 'lko', 'lko', '9839135093', NULL, NULL, NULL, NULL, NULL, NULL, 'Own House', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, '2024-09-08 05:51:32', '2024-09-08 05:51:32'),
(2, 2, 'Male', 40, '344, Sec-K, Ashiyana Lko', '', '', '9451055028', 0, '', 0, 0, '', '', 'undefined', '0000-00-00 00:00:00', '', NULL, '', '0000-00-00 00:00:00', '', '0000-00-00 00:00:00', NULL, 'null', 0, 0, 0, 0, 'undefined', NULL, '', '', '', '', '', NULL, '', '', 'undefined', NULL, 'HM20002', NULL, NULL, NULL, '2024-09-08 06:03:47', '2024-09-08 06:07:46'),
(4, 4, 'Male', 40, 'Nagesshwer Mandir m  1163', '', '', '7620008590', 0, '', 0, 0, '', '', 'Own House', '0000-00-00 00:00:00', '', NULL, '', '0000-00-00 00:00:00', '', '0000-00-00 00:00:00', NULL, 'codebolt_application.png', 0, 0, 0, 0, 'undefined', NULL, '', '', '', '', '', NULL, '', '', 'new_member', NULL, 'HM20003', NULL, NULL, NULL, '2024-09-08 06:10:46', '2024-09-08 06:11:52'),
(5, 5, 'Male', 20, 'south city house no 141 - block -A', 'south city house no 141 - block -A', 'Lucknow', '7985256371', NULL, NULL, NULL, NULL, NULL, NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'null', NULL, NULL, NULL, NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, '2024-09-08 06:17:13', '2024-09-08 06:17:13'),
(6, 6, '', 0, 'B-2/1, sector H, LDA Colony Lko', '', '', '8595320836', 0, '', 0, 0, '', '', 'undefined', '0000-00-00 00:00:00', '', NULL, '', '0000-00-00 00:00:00', '', '0000-00-00 00:00:00', NULL, 'employee.png', 0, 0, 0, 0, 'undefined', NULL, '', '', '', '', '', NULL, '', '', 'undefined', NULL, 'HM20004', NULL, NULL, NULL, '2024-09-08 06:20:27', '2024-09-08 06:22:07'),
(8, 8, 'Female', 0, '2/3amarpali bihar near rajdhani hospital', 'lko', 'lko', '9569858743', 0, '', 0, 0, '', '', 'undefined', '0000-00-00 00:00:00', '', NULL, '', '0000-00-00 00:00:00', '', '0000-00-00 00:00:00', NULL, 'null', 0, 0, 0, 0, 'undefined', NULL, '', '', '', '', '', NULL, '', '', 'undefined', NULL, 'HM20005', NULL, NULL, NULL, '2024-09-08 10:28:37', '2024-09-08 10:29:18'),
(9, 9, 'Male', 0, '561/28, Sindhu Nagar Colony, krishna Nagar , Lukconow ', '', '', '9839012344', 0, '', 0, 0, '', '', 'undefined', '0000-00-00 00:00:00', '', NULL, '', '0000-00-00 00:00:00', '', '0000-00-00 00:00:00', NULL, 'null', 0, 0, 0, 0, 'undefined', NULL, '', '', '', '', '', NULL, '', '', 'undefined', NULL, 'HM20006', NULL, NULL, NULL, '2024-09-08 11:33:20', '2024-09-08 12:12:42'),
(10, 10, '', NULL, 'vrindavan yojana', NULL, NULL, '9535771072', NULL, NULL, NULL, NULL, NULL, NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'null', NULL, NULL, NULL, NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, '2024-09-08 11:36:39', '2024-09-08 11:36:39'),
(11, 11, 'Male', NULL, 'sadar lko', NULL, NULL, '9839088882', NULL, NULL, NULL, NULL, NULL, NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'null', NULL, NULL, NULL, NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'undefined', NULL, 'HM20007', NULL, NULL, NULL, '2024-09-08 11:57:43', '2024-09-08 11:57:43'),
(12, 12, NULL, NULL, 'LKo', NULL, NULL, '8700801798', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-08 12:15:37', '2024-09-08 12:15:37');

-- --------------------------------------------------------

--
-- Table structure for table `cust_addposts`
--

CREATE TABLE `cust_addposts` (
  `id` int(11) NOT NULL,
  `cust_id` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `property` varchar(255) DEFAULT NULL,
  `from_date` varchar(255) DEFAULT '0',
  `end_date` varchar(255) DEFAULT NULL,
  `issapproved` tinyint(1) DEFAULT 0,
  `refrance_name` varchar(255) DEFAULT NULL,
  `direct` tinyint(1) DEFAULT 0,
  `block` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `is_approved`, `createdAt`, `updatedAt`) VALUES
(1, 'Office', 1, '2019-04-22 11:27:38', '2024-01-04 18:07:50'),
(2, 'Helper', 1, '2019-04-22 11:30:47', '2024-01-04 18:07:50'),
(3, 'Technician', 1, '2024-01-04 12:56:46', '2024-03-07 19:03:00');

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `department_id`, `name`, `guard_name`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Supper Admin', 'api', '2024-01-07 13:13:07', '2024-01-07 13:13:07'),
(2, 1, 'Superviser', 'api', '2024-01-07 13:13:42', '2024-01-07 13:13:42'),
(3, 1, 'Service Provider', 'api', '2024-01-07 13:13:55', '2024-01-07 13:13:55'),
(7, 1, 'Customer', 'api', '2024-01-30 04:06:00', '2024-01-30 04:06:00'),
(8, 1, 'Back Office', 'api', '2024-01-30 05:07:57', '2024-01-30 05:07:57'),
(9, 1, 'Admin', 'api', '2024-03-27 18:30:45', '2024-03-27 18:30:45');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `designation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `mobile_no` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `aadhar_no` varchar(255) DEFAULT NULL,
  `pan_no` varchar(255) DEFAULT NULL,
  `doj` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `emp_id` varchar(255) DEFAULT NULL,
  `alterno` varchar(10) DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `about` text DEFAULT NULL,
  `f_name` varchar(255) DEFAULT NULL,
  `f_mobile` varchar(255) DEFAULT NULL,
  `v_name` varchar(255) DEFAULT NULL,
  `v_date` date DEFAULT NULL,
  `m_mobile` varchar(255) DEFAULT NULL,
  `m_name` varchar(255) DEFAULT NULL,
  `document1_name` varchar(255) DEFAULT NULL,
  `adhar_image` varchar(255) DEFAULT NULL,
  `document2_name` varchar(255) DEFAULT NULL,
  `pan_image` varchar(255) DEFAULT NULL,
  `document3_name` varchar(255) DEFAULT NULL,
  `document3` varchar(255) DEFAULT NULL,
  `salary` int(11) NOT NULL,
  `duty_hours` varchar(255) NOT NULL,
  `week_off` varchar(255) NOT NULL,
  `is_block` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `department_id`, `designation_id`, `user_id`, `name`, `mobile_no`, `gender`, `email`, `aadhar_no`, `pan_no`, `doj`, `image`, `address`, `emp_id`, `alterno`, `is_approved`, `about`, `f_name`, `f_mobile`, `v_name`, `v_date`, `m_mobile`, `m_name`, `document1_name`, `adhar_image`, `document2_name`, `pan_image`, `document3_name`, `document3`, `salary`, `duty_hours`, `week_off`, `is_block`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, 0, 'AKHILESH', '6386037517', '', '', '', '', '0000-00-00 00:00:00', NULL, '', 'EMP0001', '', 0, '', '', '', '', '0000-00-00', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '', '', 0, '2024-09-08 06:53:23', '2024-09-08 08:01:00'),
(2, 1, 2, 0, 'DURGESH ', '9555250582', '', '', '', '', '0000-00-00 00:00:00', NULL, '', 'EMP0002', '', 0, '', '', '', '', '0000-00-00', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '', 'FRIDAY', 0, '2024-09-08 06:56:06', '2024-09-08 06:56:06'),
(3, 1, 2, 0, 'MADHU RATHOR', '7307676622', '', '', '', '', '0000-00-00 00:00:00', NULL, '', 'EMP0003', '', 0, '', '', '', '', '0000-00-00', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '', 'FRIDAY', 0, '2024-09-08 06:57:52', '2024-09-08 06:57:52'),
(4, 1, 2, 0, 'Sarita ', '9682076999', '', '', '', '', '0000-00-00 00:00:00', NULL, '', 'EMP0004', '', 0, '', '', '', '', '0000-00-00', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '', '', 0, '2024-09-08 10:34:04', '2024-09-08 10:34:04');

-- --------------------------------------------------------

--
-- Table structure for table `empservices`
--

CREATE TABLE `empservices` (
  `id` int(11) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `mobile_no` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `enquiries`
--

CREATE TABLE `enquiries` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `refName` varchar(255) DEFAULT NULL,
  `mobileNo` varchar(10) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `service` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enquiries`
--

INSERT INTO `enquiries` (`id`, `name`, `email`, `refName`, `mobileNo`, `message`, `address`, `service`, `createdAt`, `updatedAt`) VALUES
(1, 'Madhusudhan ', '', 'Khushbu Ma\'am', '7290900835', 'I want clean Bathroom', '', 'bathroom cleaning ', '2024-09-08 06:24:59', '2024-09-08 06:24:59');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `expHead` varchar(255) NOT NULL,
  `paymentMethod` varchar(255) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `personName` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `expense_heads`
--

CREATE TABLE `expense_heads` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `expense_heads`
--

INSERT INTO `expense_heads` (`id`, `name`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Tea', 1, '2023-12-27 16:45:34', '2024-07-28 02:53:39'),
(2, 'GPN', 1, '2023-12-27 16:45:34', '2023-12-27 16:46:17'),
(4, 'office expenss', 1, '2023-12-27 16:45:34', '2023-12-27 16:46:17'),
(5, 'Book', 1, '2023-12-27 16:45:34', '2023-12-27 16:46:17'),
(6, 'MISC Expense', 1, '2023-12-27 16:45:34', '2023-12-27 16:46:17'),
(7, 'petrol', 1, '2023-12-27 16:45:34', '2023-12-27 16:46:17'),
(8, 'advance ', 1, '2023-12-27 16:45:34', '2023-12-27 16:46:17'),
(9, 'medical', 1, '2023-12-27 16:45:34', '2023-12-27 16:46:17'),
(10, 'food', 1, '2023-12-27 16:45:34', '2023-12-27 16:46:17'),
(11, 'repairs', 1, '2023-12-27 16:45:34', '2023-12-27 16:46:17'),
(12, 'client expense', 1, '2023-12-27 16:45:34', '2023-12-27 16:46:17'),
(13, 'Travel Expenses', 1, '2023-12-28 08:09:53', '2023-12-28 08:09:53');

-- --------------------------------------------------------

--
-- Table structure for table `inventories`
--

CREATE TABLE `inventories` (
  `id` int(11) NOT NULL,
  `item` varchar(255) NOT NULL,
  `qty` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inventories`
--

INSERT INTO `inventories` (`id`, `item`, `qty`, `createdAt`, `updatedAt`) VALUES
(6, 'RED HARPIC', '11', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(7, 'BLUE HARPIC', '12', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(8, 'Vehicle 2631', '1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(9, 'Vehicle 5591', '1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(10, 'Vehicle 9310', '1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(11, 'Vehicle 4741', '0', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(12, 'Vehicle 2618', '1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(13, 'Vehicle 0120', '1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(14, 'Vehicle 7216', '0', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(15, 'Vehicle Personal', '1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(16, 'Acid Bottles', '18', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(17, 'Colin', '23', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(18, 'SCRUDRIVER  LARGE ', '0', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(19, 'SRUDRIVER  MEDIUM ', '0', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(20, 'SRUDIVER SMALL', '-2', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(21, 'SCRUDIVER TESTER', '1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(22, 'FILI', '0', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(23, 'WIRE CUTTER', '-2', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(24, 'NOSE PHYALER ', '0', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(25, 'PHYER ', '0', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(26, 'AMPIAR METTER ', '0', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(27, 'Acid Bottles', '0', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(28, 'tails brush ', '15', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(29, 'steel scotch ', '5', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(30, 'hand scotch ', '11', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(31, 'fom spanch ', '6', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(32, 'bathroom air pocket ', '2', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(33, 'bathroom brush ', '6', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(35, 'Vehicle ', '3', '2024-04-22 03:26:36', '2024-04-22 03:26:36'),
(36, 'Vehicle ', '3', '2024-04-22 03:26:55', '2024-04-22 03:26:55'),
(37, 'Test Items ', '3', '2024-04-22 08:32:41', '2024-04-22 08:32:41'),
(38, 'Watter Bottals', '5', '2024-09-08 11:04:48', '2024-09-08 11:04:48');

-- --------------------------------------------------------

--
-- Table structure for table `localities`
--

CREATE TABLE `localities` (
  `id` int(11) NOT NULL,
  `location_name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `localities`
--

INSERT INTO `localities` (`id`, `location_name`, `createdAt`, `updatedAt`) VALUES
(1, 'Aashiana', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'Aishbagh', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 'Alambagh', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, 'Alamnagar', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 'Aliganj', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(6, 'Amar Shaheed Path', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(7, 'Amausi', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(8, 'Arjunganj', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(9, 'Arya Nagar', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(10, 'Balaganj', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(11, 'Charbagh', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(12, 'Chinhat', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(13, 'Dalibagh Colony', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(14, 'Daliganj', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(15, 'Deva Road', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(16, 'Faizabad Road', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(17, 'Ghazipur', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(18, 'Goila', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(19, 'Gomti Nagar', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(20, 'Gudamba Thaana Road', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(21, 'HAL', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(22, 'Hazratganj', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(23, 'Husainabad', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(24, 'Hussainganj', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(25, 'IIM Road', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(26, 'Indira Nagar', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(27, 'Jankipuram', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(28, 'Kanpur Road', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(29, 'Kursi Road', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(30, 'Lalbagh', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(31, 'Mahanagar', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(32, 'Sector-14', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(33, 'Sector-18', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(34, 'Sector-B', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(35, 'Sector-D', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(36, 'Telibagh', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(37, 'Thakurganj', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(38, 'The Mall Avenue', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(39, 'Tilak Marg', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(40, 'Triveni Nagar', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(41, 'Uattardhona', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(42, 'Utrathia', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(43, 'Vasant Kunj', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(44, 'Vibhuti Khand', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(45, 'Vikas Nagar', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(46, 'Vineet Khand', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(47, 'VIP Road', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(48, 'Vishesh Khand', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(49, 'Vivekanand Puri', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(50, 'Vrindavan Yojana', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(51, 'Wazirganj', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(52, 'Yahiaganj', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `service` varchar(255) NOT NULL,
  `service_type` varchar(255) DEFAULT NULL,
  `bill` decimal(10,2) DEFAULT NULL,
  `last_pay_date` datetime DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `name`, `service`, `service_type`, `bill`, `last_pay_date`, `remark`, `createdAt`, `updatedAt`) VALUES
(5, 'Ajay Singh ', '1', '0', '2000.00', '2022-09-11 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(6, 'Ankur Soni ', '1', '0', '1000.00', '2022-09-03 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(7, 'Durgesh ', '1', '0', '1000.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(8, 'Umang shukla', '1', '0', '1200.00', '2022-09-05 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(9, 'Vishal dixit', '1', '0', '1000.00', '2022-09-04 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(10, 'Mukul verma', '2', '0', '1800.00', '2022-09-03 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(11, 'Rajeev', '1', '0', '1000.00', '2022-09-05 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(12, 'Deepali', '2', '0', '1000.00', '2022-09-05 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(13, 'Prateek verma', '1', '0', '800.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(14, 'Usha', '1', '0', '1300.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(15, 'Haribhajan', '1', '0', '1200.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(16, 'Shreyansh', '1', '0', '1000.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(17, 'Sharad tiwari', '2', '0', '1000.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(18, 'Rakesh sinha', '1', '0', '1000.00', '2022-09-16 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(19, 'Sonia', '1', '0', '1550.00', '2022-09-01 00:00:00', 'Unpaid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(20, 'Sunil sissodiya', '1', '0', '800.00', '2022-09-01 00:00:00', 'Unpaid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(21, 'Aditya Tiwaari', '1', '0', '1000.00', '2022-09-01 00:00:00', 'Unpaid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(22, 'Rohit', '1', '0', '800.00', '2022-09-03 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(23, 'Sanjay Mishra', '1', '0', '1000.00', '2022-09-07 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(24, 'Ashish verma', '1', '0', '1000.00', '2022-09-07 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(25, 'Ashish Tiwari', '1', '0', '12000.00', '2022-09-01 00:00:00', 'Pending last 12 month', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(26, 'Seema chand', '1', '0', '1000.00', '2022-09-01 00:00:00', 'Unpaid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(27, 'Vinod', '1', '0', '1000.00', '2022-09-02 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(28, 'Anjani kumar', '1', '0', '1200.00', '2022-09-01 00:00:00', 'Unpaid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(29, 'Hemang', '2', '0', '1500.00', '2022-09-06 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(30, 'Naman Gupta', '3', '0', '2500.00', '2022-09-06 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(31, 'Kushnagar', '1', '0', '1000.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(32, 'Renu Tripathi', '1', '0', '1200.00', '2022-09-01 00:00:00', 'Unpaid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(33, 'Surya', '1', '0', '1000.00', '2022-09-01 00:00:00', 'Unpaid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(34, 'Shubham', '1', '0', '1000.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(35, 'Anand Gaur', '1', '0', '800.00', '2022-09-07 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(36, 'Vivek', '1', '0', '800.00', '2022-09-01 00:00:00', 'Unpaid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(37, 'Aryan ', '1', '0', '800.00', '2022-09-10 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(38, 'Vikash Tiwari', '1', '0', '800.00', '2022-09-06 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(39, 'Sharad Kannaujiya', '1', '0', '1000.00', '2022-09-02 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(40, 'Mohit Chhabra', '1', '0', '1000.00', '2022-09-04 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(41, 'Yogesh Chhabra', '1', '0', '1000.00', '2022-09-04 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(42, 'Upanyansh', '1', '0', '1000.00', '2022-09-02 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(43, 'Shakuntala', '1', '0', '1000.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(44, 'Anoop Trivedi', '2', '0', '1000.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(45, 'Archanan Devi', '1', '0', '1000.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(46, 'Atul', '1', '0', '1000.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(47, 'Shivita Goel', '1', '0', '1000.00', '2022-09-02 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(48, 'Mohini', '1', '0', '1300.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(49, 'Vinay Gupta', '1', '0', '1200.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(50, 'Meenu Khare', '2', '0', '1800.00', '2022-09-03 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(51, 'R.M. Verma', '1', '0', '330.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(52, 'Medhraj', '1', '0', '10000.00', '2022-09-01 00:00:00', 'Unpaid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(53, 'Aman Tiwari', '1', '0', '1000.00', '2022-09-10 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(54, 'Nilansh ', '1', '0', '1000.00', '2022-09-09 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(55, 'Anuj', '1', '0', '1200.00', '2022-09-01 00:00:00', 'Paid', '2024-01-06 08:39:11', '2024-01-06 08:39:37'),
(56, 'MISHRI LAL SAHU', '2', '1,4', '100.00', '2022-09-16 00:00:00', 'Correcting Account', '2024-01-07 11:30:03', '2024-01-07 11:30:03');

-- --------------------------------------------------------

--
-- Table structure for table `monthlyservices`
--

CREATE TABLE `monthlyservices` (
  `id` int(11) NOT NULL,
  `cust_name` varchar(255) NOT NULL,
  `mobile_no` varchar(255) NOT NULL,
  `monthlyServices` varchar(255) DEFAULT NULL,
  `serviceType` varchar(255) DEFAULT NULL,
  `serviceServeType` varchar(255) DEFAULT NULL,
  `service_provider` varchar(255) DEFAULT NULL,
  `selectedTimeSlot` varchar(255) DEFAULT NULL,
  `serviceFees` decimal(10,2) DEFAULT NULL,
  `feesPaidDateTime` date DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `specialInterest` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `new_customers`
--

CREATE TABLE `new_customers` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `ref_name` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `mobileno` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `remark` varchar(1000) NOT NULL,
  `remark1` varchar(1000) NOT NULL,
  `cancle` int(11) NOT NULL,
  `closed` int(11) NOT NULL,
  `continue` int(11) NOT NULL,
  `ismember` tinyint(1) NOT NULL DEFAULT 0,
  `refrance_name` varchar(200) NOT NULL,
  `direct` int(11) NOT NULL,
  `issapproved` int(11) NOT NULL,
  `block` int(11) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `new_customers`
--

INSERT INTO `new_customers` (`id`, `name`, `ref_name`, `email`, `mobileno`, `password`, `remark`, `remark1`, `cancle`, `closed`, `continue`, `ismember`, `refrance_name`, `direct`, `issapproved`, `block`, `create_date`) VALUES
(1, 'Adv ALOK TIWARI ', '', '', '9839135093', 'Adv ALOK TIWARI ', '', '', 0, 0, 0, 0, '', 0, 0, 0, '2024-09-08 05:51:32'),
(2, 'Rachan Dixit', '', '', '9451055028', 'Rachan Dixit', '', '', 0, 0, 0, 0, '', 0, 0, 0, '2024-09-08 06:03:47'),
(4, 'Ashok Nirmrani', '', 'Ashok@gmail.com', '7620008590', 'Ashok Nirmrani', '', '', 0, 0, 0, 0, '', 0, 0, 0, '2024-09-08 06:11:52'),
(5, 'Ashish Bajpai', '', '', '7985256371', 'Ashish Bajpai', '', '', 0, 0, 0, 0, '', 0, 0, 0, '2024-09-08 06:17:13'),
(6, 'Rupesh ', '', '', '8595320836', 'Rupesh ', '', '', 0, 0, 0, 0, '', 0, 0, 0, '2024-09-08 06:20:27'),
(8, 'Gita Misra ', '', '', '9569858743', 'Gita Misra ', '', '', 0, 0, 0, 0, '', 0, 0, 0, '2024-09-08 10:28:37'),
(9, 'umesh shukla', '', '', '9839012344', 'umesh shukla', '', '', 0, 0, 0, 0, '', 0, 0, 0, '2024-09-08 12:12:42'),
(10, 'atul', '', '', '9535771072', 'atul', '', '', 0, 0, 0, 0, '', 0, 0, 0, '2024-09-08 11:36:39'),
(11, 'samir', '', '', '9839088882', 'samir', '', '', 0, 0, 0, 0, '', 0, 0, 0, '2024-09-08 11:57:43'),
(12, 'Shyam', '', '', '8700801798', '', '', '', 0, 0, 0, 0, '', 0, 0, 0, '2024-09-08 12:15:37');

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `block` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `offers`
--

INSERT INTO `offers` (`id`, `description`, `image`, `is_approved`, `block`, `createdAt`, `updatedAt`) VALUES
(5, 'Free Carwash', 'WhatsApp_Image_2019-05-15_at_11_48_44.jpeg', 1, 1, '2019-05-28 07:14:18', '2024-04-06 20:37:07'),
(6, 'Bill Deposit', 'WhatsApp_Image_2019-05-15_at_13_57_54.jpeg', 1, 1, '2019-05-28 07:14:29', '2024-06-25 04:21:08'),
(7, 'Bathroom Cleaning ', 'WhatsApp_Image_2019-05-15_at_13_57_53.jpeg', 1, 0, '2021-06-01 07:07:15', '0000-00-00 00:00:00'),
(9, 'Free Past control', 'WhatsApp_Image_2019-05-16_at_14_27_26.jpeg', 0, 0, '2021-06-01 07:07:13', '2024-04-06 20:39:31'),
(10, 'Beautician Service', 'WhatsApp_Image_2019-05-28_at_12_42_38.jpeg', 1, 0, '2019-05-28 07:14:08', '0000-00-00 00:00:00'),
(11, 'plumber service', 'WhatsApp_Image_2019-08-07_at_1_56_20_PM.jpeg', 1, 0, '2021-06-01 07:07:07', '0000-00-00 00:00:00'),
(13, 'csjkdcbs cjkds ncs', 'IMG20230925133123.jpg', 0, 0, '2024-04-06 21:19:01', '2024-04-06 21:19:45'),
(14, 'this is for Admin', 'IMG20230925133119 (4).jpg', 0, 0, '2024-04-06 21:22:19', '2024-04-06 21:33:59');

-- --------------------------------------------------------

--
-- Table structure for table `ordernos`
--

CREATE TABLE `ordernos` (
  `id` int(11) NOT NULL,
  `seq` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_no` varchar(255) DEFAULT NULL,
  `user_type` varchar(255) DEFAULT NULL,
  `booktime` varchar(255) DEFAULT NULL,
  `bookdate` varchar(255) DEFAULT NULL,
  `service_name` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `service_address` varchar(255) DEFAULT NULL,
  `alterno` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `problem_des` varchar(255) DEFAULT NULL,
  `cust_id` varchar(255) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `issapproved` int(11) DEFAULT NULL,
  `emp_status` int(11) DEFAULT NULL,
  `emp_id` varchar(255) DEFAULT NULL,
  `allot_time_range` varchar(255) DEFAULT NULL,
  `suprvisor_id` varchar(255) DEFAULT NULL,
  `serstatus` int(11) DEFAULT NULL,
  `servicep_id` varchar(255) DEFAULT NULL,
  `approx_duration` varchar(255) DEFAULT NULL,
  `paymethod` varchar(255) DEFAULT NULL,
  `totalamt` varchar(255) DEFAULT NULL,
  `piadamt` varchar(255) DEFAULT NULL,
  `netpayamt` varchar(255) DEFAULT NULL,
  `reservprovider` varchar(255) DEFAULT NULL,
  `review` varchar(255) DEFAULT NULL,
  `admin_approve` tinyint(1) DEFAULT 0,
  `pending` int(11) DEFAULT NULL,
  `cust_remark` varchar(255) DEFAULT NULL,
  `servp_remark` varchar(255) DEFAULT NULL,
  `suerv_remark` varchar(255) DEFAULT NULL,
  `admin_remark` varchar(255) DEFAULT NULL,
  `bakof_remark` varchar(255) DEFAULT NULL,
  `sueadmin_remark` varchar(255) DEFAULT NULL,
  `cancle_reson` varchar(255) DEFAULT NULL,
  `service_status` varchar(255) DEFAULT NULL,
  `reotrans` varchar(255) DEFAULT NULL,
  `checkstatus` int(11) DEFAULT NULL,
  `checkintime` varchar(255) DEFAULT NULL,
  `checkouttime` varchar(255) DEFAULT NULL,
  `land_mark` varchar(255) DEFAULT NULL,
  `vehicle_inventory` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_no`, `user_type`, `booktime`, `bookdate`, `service_name`, `city`, `service_address`, `alterno`, `pincode`, `problem_des`, `cust_id`, `create_date`, `issapproved`, `emp_status`, `emp_id`, `allot_time_range`, `suprvisor_id`, `serstatus`, `servicep_id`, `approx_duration`, `paymethod`, `totalamt`, `piadamt`, `netpayamt`, `reservprovider`, `review`, `admin_approve`, `pending`, `cust_remark`, `servp_remark`, `suerv_remark`, `admin_remark`, `bakof_remark`, `sueadmin_remark`, `cancle_reson`, `service_status`, `reotrans`, `checkstatus`, `checkintime`, `checkouttime`, `land_mark`, `vehicle_inventory`, `createdAt`, `updatedAt`) VALUES
(1, '00001', 'Regular', '13:02', '2020-09-08', 'HOME CLEANING SERVICE', '', NULL, '', '', '', '6', NULL, NULL, NULL, NULL, '09:30-10:00', 'AKHILESH', NULL, 'RITESH', '', 'Cash', '0', '1000', '1000', NULL, NULL, 1, 3, NULL, NULL, NULL, NULL, NULL, 'Order Completed ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-08 07:32:56', '2024-09-08 08:31:18'),
(2, '00002', NULL, '13:45', '2024-09-08', 'Fridge', 'Lucknow', NULL, '', NULL, '', '5', NULL, NULL, NULL, NULL, '09:30-10:00', 'AKHILESH', NULL, 'RITESH', '', 'Cash', '50', '150', '200', NULL, NULL, 1, 3, NULL, NULL, NULL, NULL, NULL, 'Order successfull completed ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-08 08:15:51', '2024-09-08 10:47:09'),
(3, '00003', 'Booking', '16:05', '2024-09-08', 'HOME CLEANING SERVICE', 'lko', NULL, '', NULL, '', '8', NULL, NULL, NULL, NULL, '04:00-04:30', 'DURGESH ', NULL, 'Rajan ', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-08 10:36:14', '2024-09-08 10:43:30'),
(4, '00004', NULL, '17:12', '2024-09-08', 'Plumber', NULL, NULL, '', NULL, '', '10', NULL, NULL, NULL, NULL, '04:00-04:30', 'MADHU RATHOR', NULL, 'akshay ', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, 5, NULL, NULL, NULL, NULL, NULL, NULL, 'customer is not picked the call', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-08 11:42:53', '2024-09-08 11:43:32'),
(5, '00005', NULL, '17:42', '2024-09-08', 'bathroom cleaning ', '', NULL, '', NULL, '', '9', NULL, NULL, NULL, NULL, '05:30-06:00', 'DURGESH ', NULL, 'PRANSHANT ', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-08 12:13:17', '2024-09-08 12:13:17');

-- --------------------------------------------------------

--
-- Table structure for table `order_process`
--

CREATE TABLE `order_process` (
  `id` int(11) NOT NULL,
  `order_no` int(11) DEFAULT NULL,
  `membership` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `zip_code` int(11) DEFAULT NULL,
  `registered_id` varchar(255) DEFAULT NULL,
  `service_des` varchar(255) DEFAULT NULL,
  `approx_duration` varchar(255) DEFAULT NULL,
  `supervisor_name` varchar(255) DEFAULT NULL,
  `lst_serv_date` varchar(255) DEFAULT NULL,
  `lst_serv_type` varchar(255) DEFAULT NULL,
  `services` varchar(255) DEFAULT NULL,
  `serviceDateTime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order_process`
--

INSERT INTO `order_process` (`id`, `order_no`, `membership`, `name`, `email`, `age`, `mobile`, `address`, `city`, `zip_code`, `registered_id`, `service_des`, `approx_duration`, `supervisor_name`, `lst_serv_date`, `lst_serv_type`, `services`, `serviceDateTime`) VALUES
(1, 50825, NULL, 'Shyam', NULL, NULL, '7081002501', 'lucknow', NULL, NULL, '941', NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-25 17:32:01'),
(2, 50826, NULL, 'Shyam', NULL, NULL, '7081002501', 'lucknow', NULL, NULL, '941', NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-25 17:43:23'),
(3, 50827, NULL, 'Shyam', NULL, NULL, '7081002501', 'lucknow', NULL, NULL, '941', NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-25 17:45:59'),
(4, 50828, NULL, 'Shyam', NULL, NULL, '7081002501', 'lucknow', NULL, NULL, '941', NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-25 17:46:43'),
(5, 50829, NULL, 'Shyam', 'nursid299@gmail.com', 21, '7081002501', 'lucknow', 'Lucknow', 0, '941', '', '', '', '2024-07-25', 'bathroom cleaning ', 'washing machine ', '0000-00-00 00:00:00'),
(6, 50830, NULL, 'Shyam', 'nursid299@gmail.com', 21, '7081002501', 'lucknow', 'Lucknow', 0, '941', 'i want a person who help me to walk my dog', '', '', '2024-07-25', 'washing machine ', 'Dog Walk', '0000-00-00 00:00:00'),
(7, 50831, NULL, 'Shyam', 'nursid299@gmail.com', 21, '7081002501', 'lucknow', 'Lucknow', 0, '941', '', '', '', '2024-07-25', 'Dog Walk', 'washing machine ', '2024-07-26 22:55:00'),
(8, 50832, NULL, 'Shyam', 'nursid299@gmail.com', 21, '7081002501', 'lucknow', 'Lucknow', 0, '941', '', '', '', '2024-07-25', 'washing machine ', 'body massage', '2024-07-26 23:03:00'),
(9, 50833, NULL, 'mobasshir  hussain', '', 32, '9879878952', 'Bihar', '', 0, '958', 'this is for testing ', '', '', '', '', 'Gas stove/ cylinder/ burner service', '2024-07-26 17:38:00'),
(10, 50834, NULL, 'Sujeet yadaw', 'sujeet@gmail.com', 25, '8763864732', 'Gajipur', '', 0, '959', '', '', '', '', '', 'washing machine ', '2024-07-20 20:39:00');

-- --------------------------------------------------------

--
-- Table structure for table `otps`
--

CREATE TABLE `otps` (
  `id` int(11) NOT NULL,
  `otp` varchar(255) NOT NULL,
  `otpid` varchar(255) NOT NULL,
  `otpExpireTime` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `otps`
--

INSERT INTO `otps` (`id`, `otp`, `otpid`, `otpExpireTime`, `createdAt`, `updatedAt`) VALUES
(1, '1737', '1|1|32281408092401284906920530477', '2024-09-08 07:59:30', '2024-09-08 07:58:50', '2024-09-08 07:58:50'),
(2, '5447', '1|1|32281408092401295987275170980', '2024-09-08 08:00:41', '2024-09-08 08:00:01', '2024-09-08 08:00:01'),
(3, '5523', '1|1|32281408092401303449775170957', '2024-09-08 08:01:15', '2024-09-08 08:00:35', '2024-09-08 08:00:35'),
(4, '2436', '1|1|32281408092401311268475170812', '2024-09-08 08:01:53', '2024-09-08 08:01:13', '2024-09-08 08:01:13'),
(5, '6199', '1|1|32281408092401381202475170897', '2024-09-08 08:08:53', '2024-09-08 08:08:13', '2024-09-08 08:08:13'),
(6, '7995', '1|1|32281408092401400077920530650', '2024-09-08 08:10:41', '2024-09-08 08:10:01', '2024-09-08 08:10:01'),
(7, '8647', '1|1|32281408092401411360666220840', '2024-09-08 08:11:54', '2024-09-08 08:11:14', '2024-09-08 08:11:14'),
(8, '1418', '1|1|32281408092401421241275170882', '2024-09-08 08:12:53', '2024-09-08 08:12:13', '2024-09-08 08:12:13'),
(9, '4188', '1|1|32281408092401561301975170303', '2024-09-08 08:26:54', '2024-09-08 08:26:14', '2024-09-08 08:26:14'),
(10, '7240', '1|1|32281408092401570937020530835', '2024-09-08 08:27:50', '2024-09-08 08:27:10', '2024-09-08 08:27:10'),
(11, '1012', '1|1|32281408092402015941908360730', '2024-09-08 08:32:40', '2024-09-08 08:32:00', '2024-09-08 08:32:00'),
(12, '5277', '1|1|32281408092404115162805820364', '2024-09-08 10:42:32', '2024-09-08 10:41:52', '2024-09-08 10:41:52'),
(13, '6067', '1|1|32281408092404400304705820479', '2024-09-08 11:10:44', '2024-09-08 11:10:04', '2024-09-08 11:10:04');

-- --------------------------------------------------------

--
-- Table structure for table `our_customers`
--

CREATE TABLE `our_customers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `land_mark` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `tel_no` varchar(255) DEFAULT NULL,
  `office_no` varchar(255) DEFAULT NULL,
  `alternate_no` varchar(255) DEFAULT NULL,
  `aadhar_no` varchar(255) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `own_house` varchar(255) DEFAULT NULL,
  `dob` datetime DEFAULT NULL,
  `doa` datetime DEFAULT NULL,
  `spouse_dob1` datetime DEFAULT NULL,
  `spouse_name2` varchar(255) DEFAULT NULL,
  `spouse_name` varchar(255) DEFAULT NULL,
  `spouse_name1` varchar(255) DEFAULT NULL,
  `spouse_dob2` datetime DEFAULT NULL,
  `spouse_dob` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `refrence` varchar(255) DEFAULT NULL,
  `payment` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `received_amount` decimal(10,2) DEFAULT NULL,
  `balance_amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `service` varchar(255) DEFAULT NULL,
  `service1` varchar(255) DEFAULT NULL,
  `service2` varchar(255) DEFAULT NULL,
  `service3` varchar(255) DEFAULT NULL,
  `service4` varchar(255) DEFAULT NULL,
  `service5` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT NULL,
  `member_id` varchar(255) DEFAULT NULL,
  `is_block` tinyint(1) DEFAULT NULL,
  `todate` datetime DEFAULT NULL,
  `validtodate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `our_customers`
--

INSERT INTO `our_customers` (`id`, `user_id`, `gender`, `age`, `address`, `land_mark`, `location`, `mobile`, `tel_no`, `office_no`, `alternate_no`, `aadhar_no`, `occupation`, `designation`, `own_house`, `dob`, `doa`, `spouse_dob1`, `spouse_name2`, `spouse_name`, `spouse_name1`, `spouse_dob2`, `spouse_dob`, `image`, `refrence`, `payment`, `discount_amount`, `received_amount`, `balance_amount`, `payment_method`, `service`, `service1`, `service2`, `service3`, `service4`, `service5`, `username`, `is_approved`, `member_id`, `is_block`, `todate`, `validtodate`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Male', 0, 'D5-359/360, Sec-D, Kanpur Road Lda Colony', 'Ganga Childrens Hospital', 'Lucknow, Uttar Pradesh, India', '7607770786', '8423777773', '8618349016', '9695071465', '00000000000', '***', '***', '1', NULL, '2024-11-18 00:00:00', NULL, '', 'Verasha Kaura', '', NULL, NULL, NULL, 'WhatsApp_Image_2019-05-12_at_12_06_56.jpeg', '1000.00', '0.00', '1000.00', '0.00', 'Cash', '4', NULL, NULL, NULL, NULL, NULL, 'SUMI', 1, NULL, 1, NULL, NULL, '2024-01-06 06:43:32', '2024-01-10 09:07:10');

-- --------------------------------------------------------

--
-- Table structure for table `serviceproviderattendance`
--

CREATE TABLE `serviceproviderattendance` (
  `id` int(11) NOT NULL,
  `servp_id` varchar(255) NOT NULL,
  `in_date` date NOT NULL,
  `check_in` time DEFAULT NULL,
  `out_date` date DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `createdby` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `message` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `serviceName` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `details` varchar(255) DEFAULT NULL,
  `adminStatus` varchar(255) DEFAULT NULL,
  `block` tinyint(1) DEFAULT NULL,
  `service_role` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `serviceName`, `icon`, `image`, `details`, `adminStatus`, `block`, `service_role`, `createdAt`, `updatedAt`) VALUES
(1, 'Electrician', 'fa fa-lightbulb-o', 'ElectricianServices.png', 'Provides electrical repair and installation services for residential and commercial properties. Services include wiring, fixture installation, electrical panel upgrades, and troubleshooting.', '1', 1, 3, '2021-03-06 07:48:24', '2024-07-22 16:30:31'),
(2, 'Plumber', 'fa fa-wrench', 'PlumberServices.png', 'Professional plumbing services for residential and commercial properties, including repairs, installations, and maintenance. Our experienced plumbers are available 24/7 to handle emergencies such as leaks, clogs, and burst pipes. We also offer routine ser', '0', 0, 3, '2019-06-01 07:44:17', '2024-06-25 18:25:47'),
(3, 'Car Servicing', 'fa fa-car', 'CarServicing.png', 'Comprehensive car servicing and maintenance, including oil changes, tire rotations, and diagnostics. Our certified mechanics use the latest technology to ensure your vehicle runs smoothly and efficiently. Services also include brake repairs, engine tuning', '0', 1, 2, '2019-05-11 07:04:57', '2024-03-31 18:52:06'),
(4, 'Travels & Driver', 'fa fa-bus', 'Travel&Driver.png', 'Provides comprehensive transportation solutions with a variety of vehicles and professional drivers. Offers services for daily commutes, long-distance travel, and special occasions, available 24/7.', '0', 1, 3, '2019-05-11 07:05:00', '2024-03-31 18:52:07'),
(5, 'Security Guard', 'fa fa-shield', 'SecurityGuard.png', 'Trained security guards for residential, commercial, and event security, ensuring safety and peace of mind. Our security personnel are equipped to handle a variety of situations, from routine surveillance to emergency response. We offer customized securit', '0', 1, 2, '2019-05-11 07:04:19', '2024-03-31 18:52:09'),
(6, 'Doctors', 'fa fa-user-md', 'Doctors.png', 'Connects patients with qualified medical practitioners across various specialties for routine check-ups, specialist consultations, and emergency care. Offers in-person, telemedicine, and home visit options.', '0', 1, 3, '2019-05-11 07:05:13', '2024-03-31 18:52:11'),
(7, 'Medicine', 'fa fa-medkit', 'Medicine.png', 'Wide range of pharmaceutical products and medications, including prescription and over-the-counter drugs. Our pharmacy stocks the latest medications and health products, ensuring you get what you need for your health and well-being. We also offer medicati', '0', 0, 3, '2019-05-11 07:05:25', '2024-02-24 21:51:27'),
(8, 'Cobbler', 'fa fa-scissors', 'cobbler.jpg', 'Provides expert shoe repair and maintenance using high-quality materials and traditional techniques. Services include shoe cleaning, polishing, conditioning, and custom fitting adjustments for all types of footwear.', '0', 0, 3, '2019-05-11 07:05:34', '2024-02-24 21:51:27'),
(9, 'Dry Cleaning', 'fa fa-male', 'Drycleaner.jpg', 'Offers professional garment cleaning using advanced techniques and eco-friendly solvents. Services include dry cleaning, laundry, pressing, and minor alterations for everyday clothing and special occasion wear.', '0', 0, 2, '2019-05-11 07:05:46', '2024-02-24 21:51:27'),
(10, 'Day to Day Supply', 'fa fa-calendar-check-o', 'DayTodaySupply.png', 'Essential daily supplies and groceries delivered to your doorstep, ensuring convenience and quality. We offer a wide selection of fresh produce, dairy products, household items, and personal care products. Our delivery service is fast and reliable, with f', '0', 0, 2, '2019-05-11 07:05:55', '2024-02-24 21:51:27'),
(11, 'Beautician', 'fa fa-female', 'BeautySalon.png', 'Provides a wide range of beauty treatments, including haircuts, styling, facials, and makeup. Uses high-quality products and techniques for personalized services tailored to individual needs.', '1', 0, 3, '2021-03-06 07:50:46', '2024-02-24 21:51:27'),
(12, 'Restaurants', 'fa fa-cutlery', 'ResturantService.png', 'Variety of dining options, from fast food to fine dining, offering delicious meals and excellent service. Our restaurants cater to all tastes and preferences, with diverse menus featuring local and international cuisine. Whether you are looking for a quic', '0', 0, 3, '2019-05-11 07:07:42', '2024-02-24 21:51:27'),
(13, 'Nurses', 'fa fa-user-md', 'Nurses.png', 'Professional nursing services for home care, hospitals, and clinics, providing compassionate and skilled care. Our nurses are highly trained and experienced in a range of healthcare needs, from post-surgery care to chronic illness management. Services inc', '0', 0, 3, '2019-05-11 07:07:55', '2024-02-24 21:51:27'),
(14, 'Carpenter', 'fa fa-paint-brush', 'PlumberServices.png', 'Offers professional woodwork and furniture services, including repairs, custom creations, and installations. Skilled carpenters ensure quality craftsmanship for residential and commercial projects.', '1', 0, 3, '2021-03-06 07:47:30', '2024-02-24 21:51:27'),
(15, 'Interior Designer', 'fa fa-building', 'InteriorDesigner.png', 'Creative and professional interior design services to transform your spaces into beautiful and functional environments. Our designers work closely with clients to understand their vision and preferences, offering personalized design solutions. Services in', '0', 0, 3, '2019-05-11 07:07:32', '2024-02-24 21:51:27'),
(16, 'Catering ', 'fa fa-shopping-basket', 'Catering.png', 'Catering services for events, parties, and gatherings, offering a variety of cuisines and customized menus. Our catering team is dedicated to providing delicious food and impeccable service for all types of events, from intimate dinners to large banquets.', '0', 0, 3, '2019-05-11 07:07:22', '2024-02-24 21:51:27'),
(17, 'Marriage Lawn', 'fa fa-hotel', 'MarriageLawn.png', 'Beautifully landscaped marriage lawns for weddings and special occasions, providing a perfect venue for your celebrations. Our lawns offer ample space, stunning views, and all the amenities needed for a memorable event. Services include event planning, de', '0', 0, 3, '2019-05-11 07:07:11', '2024-02-24 21:51:27'),
(18, 'Gardening', 'fa fa-tree', 'PlumberServices.png', 'Provides gardening and landscaping services, including planting, maintenance, and design. Ensures beautiful and healthy gardens for residential and commercial properties.', '0', 0, 2, '2019-05-11 07:06:45', '2024-02-24 21:51:27'),
(19, 'Computer Repairing', 'fa fa-desktop', 'PlumberServices.png', 'Offers repair and maintenance services for computers and laptops, including hardware and software troubleshooting, upgrades, and data recovery. Ensures efficient and reliable performance.', '0', 0, 3, '2019-05-11 07:06:27', '2024-02-24 21:51:27'),
(20, 'Mobile Repairing', 'fa fa-mobile', 'PlumberServices.png', 'Provides repair services for mobile phones and tablets, including screen replacements, battery issues, and software problems. Ensures quick and reliable fixes for all major brands.', '0', 0, 3, '2019-05-11 07:06:13', '2024-02-24 21:51:27'),
(21, 'Pathology Services', 'fa fa-hospital-o', 'PlumberServices.png', 'Conducts medical tests and provides diagnostic reports, including blood tests, imaging, and other laboratory services. Ensures accurate and timely results for effective healthcare.', '0', 0, 3, '2019-05-13 10:40:31', '2024-02-24 21:51:27'),
(22, 'Loan Services', 'fa fa-bank', 'PlumberServices.png', 'Assists with obtaining personal, home, and business loans. Offers guidance through the application process and ensures favorable terms and rates.', '0', 1, 3, '2019-05-13 10:40:30', '2024-03-31 18:56:12'),
(23, 'Tiffin Services', 'fa fa-hotel', 'PlumberServices.png', 'Provides home-cooked meal delivery services, offering nutritious and delicious food. Ideal for busy individuals, students, and professionals.', '0', 0, 3, '2019-05-11 07:08:52', '2024-02-24 21:51:27'),
(24, 'Rented House', 'fa fa-home', 'PlumberServices.png', 'Lists houses available for rent, catering to various needs and budgets. Provides detailed property information and assistance with the rental process.', '0', 0, 3, '2019-05-11 07:08:41', '2024-02-24 21:51:27'),
(25, 'Rented Shop', 'fa fa-shopping-cart', 'PlumberServices.png', 'Lists commercial spaces available for rent, suitable for businesses of all sizes. Offers detailed information and support throughout the rental process.', '0', 0, 3, '2019-05-11 07:08:27', '2024-02-24 21:51:27'),
(26, 'Tailor', 'fa fa-street-view', 'PlumberServices.png', 'Offers custom tailoring and alteration services, ensuring perfect fits and styles. Services include clothing repairs, adjustments, and bespoke creations.', '0', 0, 3, '2019-05-17 12:49:48', '2024-02-24 21:51:27'),
(29, 'Driver', 'fa fa-male', 'CarServicing.png', 'Provides professional driving services for hire, ensuring safe and timely transportation. Available for personal, business, and special occasion needs.', '0', 0, 3, '2019-05-22 12:54:56', '2024-02-24 21:51:27'),
(30, 'Maid/Servant', 'fa fa-male', 'PlumberServices.png', 'Offers domestic help for household chores, including cleaning, cooking, and laundry. Ensures reliable and trustworthy services for your home.', '0', 0, 2, '2019-05-22 12:55:00', '2024-02-24 21:51:27'),
(31, 'Barber', 'fa fa-scissors', 'BeautySalon.png', 'Provides haircut and grooming services for men, ensuring stylish and well-maintained looks. Includes haircuts, shaves, and beard trims.', '0', 0, 3, '2019-05-22 12:53:56', '2024-02-24 21:51:27'),
(32, 'Fabricators ', 'fa fa-wrench', 'PlumberServices.png', 'Specializes in metal fabrication and welding services, creating custom metal works for residential and commercial projects. Ensures precision and quality craftsmanship.', '0', 0, 2, '2019-05-23 13:29:16', '2024-02-24 21:51:27'),
(33, 'Hotel', 'fa fa-bed', 'PlumberServices.png', 'Lists accommodation options with various amenities, catering to different budgets and preferences. Provides detailed information and booking assistance.', '0', 0, 2, '2019-06-04 09:54:17', '2024-02-24 21:51:27'),
(34, 'Car Wash/ Car Dusting', '	fa fa-car', 'CarServicing.png', 'Provides car cleaning and detailing services, including exterior washing, interior cleaning, and waxing. Ensures your vehicle looks and feels like new.', '0', 0, 2, '2019-06-04 09:55:36', '2024-02-24 21:51:27'),
(35, 'RO', 'fa fa-filter', 'PlumberServices.png', 'Offers repair and maintenance services for reverse osmosis water purifiers, ensuring clean and safe drinking water. Includes filter replacement and system checks.', '0', 0, 3, '2019-06-05 12:31:38', '2024-02-24 21:51:27'),
(36, 'Mason ', 'fa fa-home', 'PlumberServices.png', 'Provides construction and repair services involving brick, stone, and concrete. Skilled masons ensure quality workmanship for residential and commercial projects.', '0', 0, 3, '2019-06-05 12:31:20', '2024-02-24 21:51:27'),
(37, 'Tiles ', 'fa fa-cubes', 'PlumberServices.png', 'Offers tiling services for floors, walls, and other surfaces. Includes installation, repair, and maintenance to ensure durable and aesthetically pleasing results.', '0', 0, 3, '2019-06-05 12:29:52', '2024-02-24 21:51:27'),
(38, 'Sweeper', 'fa fa-road', 'PlumberServices.png', 'Provides cleaning and janitorial services, ensuring clean and hygienic environments. Suitable for residential, commercial, and industrial properties.', '0', 0, 2, '2019-06-05 12:28:32', '2024-02-24 21:51:27'),
(39, 'AC Service ', 'fa fa-snowflake-o', 'AcRepair.png', 'Offers repair and maintenance services for air conditioners, ensuring efficient and reliable performance. Includes installation, cleaning, and troubleshooting.', '0', 0, 3, '2019-06-05 12:27:45', '2024-02-24 21:51:27'),
(40, 'Pest Control ', 'fa fa-bug', 'PlumberServices.png', 'Provides services to eliminate pests from homes and businesses, ensuring a safe and healthy environment. Includes treatment for insects, rodents, and other pests.', '0', 0, 2, '2019-06-08 08:36:00', '2024-02-24 21:51:27'),
(41, 'HOME DUSTING ', 'fa fa-trash-o', 'PlumberServices.png', 'Offers thorough dusting and cleaning services for homes, ensuring a clean and allergen-free environment. Includes dusting of furniture, surfaces, and hard-to-reach areas.', '0', 0, 2, '2019-06-18 11:07:23', '2024-02-24 21:51:27'),
(42, 'HOME SECURITY ( CCTV CAMERA)', 'fa fa-camera', 'PlumberServices.png', 'Comprehensive home security solutions including CCTV camera installation and monitoring. Our services ensure round-the-clock surveillance to protect your property and loved ones. We offer high-definition cameras, remote access, motion detection, and profe', '0', 0, 2, '2019-07-17 12:41:23', '2024-02-24 21:51:27'),
(43, 'bathroom cleaning ', 'fa fa- bathroom cleaning ', 'PlumberServices.png', 'Provides specialized cleaning services for bathrooms, ensuring thorough cleanliness and hygiene. Includes cleaning of fixtures, tiles, and surfaces.', '0', 0, 2, '2021-03-06 07:49:27', '2024-02-24 21:51:27'),
(44, 'water tank cleaning ', 'fa fa-water tank cleaning ', 'PlumberServices.png', 'Offers cleaning services for water storage tanks, ensuring clean and safe water. Includes removal of sludge, disinfection, and maintenance.', '0', 0, 2, '2021-03-06 07:49:05', '2024-02-24 21:51:27'),
(45, 'Kitchen Dusting', 'fa fa-car wash service , bathroom cleaning  home dusting', 'PlumberServices.png', 'Provides deep cleaning services for kitchen areas, ensuring cleanliness and hygiene. Includes cleaning of surfaces, appliances, and hard-to-reach areas.', '0', 0, 2, '2021-03-06 07:45:56', '2024-02-24 21:51:27'),
(46, 'Painter Service', 'fa fa-painter ', 'PlumberServices.png', 'Professional painting services for residential and commercial properties. Our painters provide expert preparation, quality painting, and meticulous clean-up. Services include interior and exterior painting, wall repairs, color consultation, and specialty ', '0', 0, 2, '2019-12-05 06:23:16', '2024-02-24 21:51:27'),
(47, 'fish aquarium service', 'akhilesh', 'PlumberServices.png', 'Provides maintenance and cleaning services for fish aquariums, ensuring a healthy environment for your aquatic pets. Includes water treatment, filter cleaning, and health checks.', '0', 0, 2, '2021-03-06 07:43:38', '2024-02-24 21:51:27'),
(48, 'body massage', 'fa fa ', 'PlumberServices.png', 'Offers professional body massage services, including various techniques to relax muscles, improve circulation, and relieve stress. Provides a rejuvenating and therapeutic experience.', '0', 0, 2, '2021-03-06 07:55:08', '2024-02-24 21:51:27'),
(49, 'Dog Walk', 'helper', 'PlumberServices.png', 'Provides dog walking services to ensure your pet gets regular exercise and outdoor time. Includes scheduled walks and personalized care for your dog\'s needs.', '0', 0, 2, '2021-06-04 12:50:34', '2024-02-24 21:51:27'),
(50, 'Gas stove/ cylinder/ burner service', 'helper', 'PlumberServices.png', 'Offers repair and maintenance services for gas stoves, cylinders, and burners. Ensures safe and efficient operation of your kitchen appliances.', '0', 0, 3, '2021-06-07 11:04:45', '2024-02-24 21:51:27'),
(51, 'Lighting', 'lighting', 'PlumberServices.png', 'Provides installation and maintenance services for lighting systems, including residential and commercial properties. Ensures efficient and aesthetically pleasing lighting solutions.', '0', 0, 3, '2022-02-07 12:22:56', '2024-02-24 21:51:27'),
(52, 'washing machine ', 'washing machine ', 'PlumberServices.png', 'Offers repair and maintenance services for washing machines, ensuring efficient and reliable performance. Includes troubleshooting, part replacements, and regular maintenance.', '0', 0, 2, '2022-09-08 05:12:50', '2024-02-24 21:51:27'),
(53, 'Fridge', 'Fridge', 'PlumberServices.png', 'Provides repair and maintenance services for refrigerators, ensuring optimal performance and longevity. Includes troubleshooting, part replacements, and regular maintenance.', '0', 1, 3, '2022-09-08 05:17:39', '2024-07-22 16:29:49'),
(54, 'HOME CLEANING SERVICE', 'HOME CLEANING SERVICE', 'PlumberServices.png', 'Offers comprehensive home cleaning services, including deep cleaning, regular maintenance, and special cleaning projects. Ensures a clean and healthy living environment.', '0', 0, 2, '2022-09-11 10:29:18', '2024-02-24 21:51:27');

-- --------------------------------------------------------

--
-- Table structure for table `service_providers`
--

CREATE TABLE `service_providers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `mobile_no` varchar(255) NOT NULL,
  `aadhar_no` varchar(255) NOT NULL,
  `pan_no` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `doj` datetime NOT NULL,
  `permanent_address` varchar(255) NOT NULL,
  `current_address` varchar(255) NOT NULL,
  `ref_name` varchar(255) NOT NULL,
  `ref_address` varchar(255) NOT NULL,
  `ref_aadhar_no` varchar(255) NOT NULL,
  `ref_mobile_no` varchar(255) NOT NULL,
  `ref_city` varchar(255) NOT NULL,
  `ref_area` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `service_id` varchar(255) DEFAULT NULL,
  `about` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `document1_name` varchar(255) DEFAULT NULL,
  `document1` varchar(255) DEFAULT NULL,
  `document2_name` varchar(255) DEFAULT NULL,
  `document2` varchar(255) DEFAULT NULL,
  `document3_name` varchar(255) DEFAULT NULL,
  `document3` varchar(255) DEFAULT NULL,
  `block_id` tinyint(1) NOT NULL DEFAULT 0,
  `work_as` varchar(255) DEFAULT NULL,
  `emp_type` varchar(255) DEFAULT NULL,
  `emp_id` int(11) DEFAULT NULL,
  `provider_type` varchar(255) DEFAULT NULL,
  `supervisor_type` varchar(255) DEFAULT NULL,
  `r1` varchar(255) DEFAULT NULL,
  `r5` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `service_providers`
--

INSERT INTO `service_providers` (`id`, `name`, `first_name`, `last_name`, `username`, `mobile_no`, `aadhar_no`, `pan_no`, `email`, `doj`, `permanent_address`, `current_address`, `ref_name`, `ref_address`, `ref_aadhar_no`, `ref_mobile_no`, `ref_city`, `ref_area`, `location`, `is_approved`, `service_id`, `about`, `image`, `password`, `document1_name`, `document1`, `document2_name`, `document2`, `document3_name`, `document3`, `block_id`, `work_as`, `emp_type`, `emp_id`, `provider_type`, `supervisor_type`, `r1`, `r5`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'LAVKESH', '', '', '', '7991726633', '', '', '', '0000-00-00 00:00:00', '', '', '', '', '', '', '', '', '', 0, '', '', 'null', '', '', 'null', '', 'null', '', '', 0, NULL, NULL, NULL, 'staff', 'HELPER', NULL, NULL, NULL, '2024-09-08 07:04:40', '2024-09-08 07:48:12'),
(2, 'Akash', '', '', '', '6307323766', '', '', '', '0000-00-00 00:00:00', '', '', '', '', '', '', '', '', '', 0, '', '', NULL, '', '', NULL, '', NULL, '', NULL, 0, NULL, NULL, NULL, 'staff', 'HELPER', NULL, NULL, NULL, '2024-09-08 07:18:26', '2024-09-08 07:48:07'),
(3, 'RITESH', '', '', '', '6207142053', '', '', '', '0000-00-00 00:00:00', '', '', '', '', '', '', '', '', '', 0, '', '', NULL, '', '', NULL, '', NULL, '', NULL, 0, NULL, NULL, NULL, 'staff', 'HELPER', NULL, NULL, NULL, '2024-09-08 07:23:13', '2024-09-08 07:48:03'),
(4, 'VIKASH', '', '', '', '7991276014', '', '', '', '0000-00-00 00:00:00', '', '', '', '', '', '', '', '', '', 0, '', '', NULL, '', '', NULL, '', NULL, '', NULL, 0, NULL, NULL, NULL, 'staff', 'HELPER', NULL, NULL, NULL, '2024-09-08 07:27:02', '2024-09-08 07:46:55'),
(5, 'PRANSHANT ', '', '', '', '8354966822', '', '', '', '0000-00-00 00:00:00', '', '', '', '', '', '', '', '', '', 0, '', '', NULL, '', '', NULL, '', NULL, '', NULL, 0, NULL, NULL, NULL, 'staff', 'HELPER', NULL, NULL, NULL, '2024-09-08 07:27:46', '2024-09-08 07:47:58'),
(6, 'Rajan ', '', '', '', '8887763992', '', '', '', '2024-08-29 00:00:00', '', '', '', '', '', '', '', '', '', 0, '', '', NULL, '', '', NULL, '', NULL, '', NULL, 0, NULL, NULL, NULL, 'staff', 'HELPER', NULL, NULL, NULL, '2024-09-08 10:35:10', '2024-09-08 10:39:46'),
(7, 'akshay ', '', '', '', '8874103587', '', '', '', '2024-01-10 00:00:00', 'lko', '', '', '', '', '', '', '', '', 0, '', '', NULL, '', '', NULL, '', NULL, '', NULL, 0, NULL, NULL, NULL, 'staff', 'Technician', NULL, NULL, NULL, '2024-09-08 11:41:22', '2024-09-08 11:41:41'),
(8, 'mohit', '', '', '', '9336178854', '', '', '', '0000-00-00 00:00:00', '', '', '', '', '', '', '', '', '', 0, '', '', NULL, '', '', NULL, '', NULL, '', NULL, 0, NULL, NULL, NULL, 'outsource', 'Technician', NULL, NULL, NULL, '2024-09-08 11:59:08', '2024-09-08 11:59:08');

-- --------------------------------------------------------

--
-- Table structure for table `service_provider_roles`
--

CREATE TABLE `service_provider_roles` (
  `id` int(11) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `Dashboard` tinyint(1) DEFAULT NULL,
  `Attendence` tinyint(1) DEFAULT NULL,
  `AttendenceEmployee` tinyint(1) DEFAULT NULL,
  `AttendenceServiceProvider` tinyint(1) DEFAULT NULL,
  `AttendenceReport` tinyint(1) DEFAULT NULL,
  `AttendenceModify` tinyint(1) DEFAULT NULL,
  `Expenses` tinyint(1) DEFAULT NULL,
  `AddHeadExpence` tinyint(1) DEFAULT NULL,
  `AddExpense` tinyint(1) DEFAULT NULL,
  `AddCollections` tinyint(1) DEFAULT NULL,
  `TodaysReport` tinyint(1) DEFAULT NULL,
  `AllTransactionReport` tinyint(1) DEFAULT NULL,
  `ManageHR` tinyint(1) DEFAULT NULL,
  `ManageEmployee` tinyint(1) DEFAULT NULL,
  `Availability` tinyint(1) NOT NULL DEFAULT 0,
  `ManageServiceProvider` tinyint(1) DEFAULT NULL,
  `ManageService` tinyint(1) DEFAULT NULL,
  `ManagePage` tinyint(1) DEFAULT NULL,
  `ManageTestimonial` tinyint(1) DEFAULT NULL,
  `ManageOffer` tinyint(1) DEFAULT NULL,
  `ManagePost` tinyint(1) DEFAULT NULL,
  `ManageAdvertisement` tinyint(1) DEFAULT NULL,
  `Customer` tinyint(1) DEFAULT NULL,
  `ManageCustomer` tinyint(1) DEFAULT NULL,
  `ManageHistory` tinyint(1) DEFAULT NULL,
  `MonthlyMembers` tinyint(1) DEFAULT NULL,
  `ManageEnquiry` tinyint(1) DEFAULT NULL,
  `RolesAndPermission` tinyint(1) DEFAULT NULL,
  `ManageMonthService` tinyint(1) NOT NULL,
  `Profile` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `service_provider_roles`
--

INSERT INTO `service_provider_roles` (`id`, `role`, `Dashboard`, `Attendence`, `AttendenceEmployee`, `AttendenceServiceProvider`, `AttendenceReport`, `AttendenceModify`, `Expenses`, `AddHeadExpence`, `AddExpense`, `AddCollections`, `TodaysReport`, `AllTransactionReport`, `ManageHR`, `ManageEmployee`, `Availability`, `ManageServiceProvider`, `ManageService`, `ManagePage`, `ManageTestimonial`, `ManageOffer`, `ManagePost`, `ManageAdvertisement`, `Customer`, `ManageCustomer`, `ManageHistory`, `MonthlyMembers`, `ManageEnquiry`, `RolesAndPermission`, `ManageMonthService`, `Profile`, `createdAt`, `updatedAt`) VALUES
(1, 'service', 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 'service Provider', '2024-02-15 17:22:25', '2024-08-12 19:42:19');

-- --------------------------------------------------------

--
-- Table structure for table `sp_services`
--

CREATE TABLE `sp_services` (
  `id` int(11) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `mobile_no` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `supervisorattendance`
--

CREATE TABLE `supervisorattendance` (
  `id` int(11) NOT NULL,
  `emp_id` varchar(255) NOT NULL,
  `in_date` date DEFAULT NULL,
  `check_in` time DEFAULT NULL,
  `out_date` date DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `createdby` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `message` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `supervisor_roles`
--

CREATE TABLE `supervisor_roles` (
  `id` int(11) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `Dashboard` tinyint(1) DEFAULT NULL,
  `Attendence` tinyint(1) DEFAULT NULL,
  `AttendenceEmployee` tinyint(1) DEFAULT NULL,
  `AttendenceServiceProvider` tinyint(1) DEFAULT NULL,
  `AttendenceReport` tinyint(1) DEFAULT NULL,
  `AttendenceModify` tinyint(1) DEFAULT NULL,
  `Expenses` tinyint(1) DEFAULT NULL,
  `AddHeadExpence` tinyint(1) DEFAULT NULL,
  `AddExpense` tinyint(1) DEFAULT NULL,
  `AddCollections` tinyint(1) DEFAULT NULL,
  `TodaysReport` tinyint(1) DEFAULT NULL,
  `AllTransactionReport` tinyint(1) DEFAULT NULL,
  `ManageHR` tinyint(1) DEFAULT NULL,
  `ManageEmployee` tinyint(1) DEFAULT NULL,
  `Availability` tinyint(1) NOT NULL DEFAULT 0,
  `ManageServiceProvider` tinyint(1) DEFAULT NULL,
  `ManageService` tinyint(1) DEFAULT NULL,
  `ManagePage` tinyint(1) DEFAULT NULL,
  `ManageTestimonial` tinyint(1) DEFAULT NULL,
  `ManageOffer` tinyint(1) DEFAULT NULL,
  `ManagePost` tinyint(1) DEFAULT NULL,
  `ManageAdvertisement` tinyint(1) DEFAULT NULL,
  `Customer` tinyint(1) DEFAULT NULL,
  `ManageCustomer` tinyint(1) DEFAULT NULL,
  `ManageHistory` tinyint(1) DEFAULT NULL,
  `MonthlyMembers` tinyint(1) DEFAULT NULL,
  `ManageEnquiry` tinyint(1) DEFAULT NULL,
  `RolesAndPermission` tinyint(1) DEFAULT NULL,
  `ManageMonthService` tinyint(1) NOT NULL,
  `Profile` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `supervisor_roles`
--

INSERT INTO `supervisor_roles` (`id`, `role`, `Dashboard`, `Attendence`, `AttendenceEmployee`, `AttendenceServiceProvider`, `AttendenceReport`, `AttendenceModify`, `Expenses`, `AddHeadExpence`, `AddExpense`, `AddCollections`, `TodaysReport`, `AllTransactionReport`, `ManageHR`, `ManageEmployee`, `Availability`, `ManageServiceProvider`, `ManageService`, `ManagePage`, `ManageTestimonial`, `ManageOffer`, `ManagePost`, `ManageAdvertisement`, `Customer`, `ManageCustomer`, `ManageHistory`, `MonthlyMembers`, `ManageEnquiry`, `RolesAndPermission`, `ManageMonthService`, `Profile`, `createdAt`, `updatedAt`) VALUES
(1, 'supervisor', 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'supervisor', '2024-02-15 17:18:54', '2024-08-12 19:42:09');

-- --------------------------------------------------------

--
-- Table structure for table `super_admin_roles`
--

CREATE TABLE `super_admin_roles` (
  `id` int(11) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `Dashboard` tinyint(1) DEFAULT NULL,
  `Attendence` tinyint(1) DEFAULT NULL,
  `Availability` tinyint(1) DEFAULT NULL,
  `AttendenceEmployee` tinyint(1) DEFAULT NULL,
  `AttendenceServiceProvider` tinyint(1) DEFAULT NULL,
  `AttendenceReport` tinyint(1) DEFAULT NULL,
  `AttendenceModify` tinyint(1) DEFAULT NULL,
  `Expenses` tinyint(1) DEFAULT NULL,
  `AddHeadExpence` tinyint(1) DEFAULT NULL,
  `AddExpense` tinyint(1) DEFAULT NULL,
  `AddCollections` tinyint(1) DEFAULT NULL,
  `TodaysReport` tinyint(1) DEFAULT NULL,
  `AllTransactionReport` tinyint(1) DEFAULT NULL,
  `ManageHR` tinyint(1) DEFAULT NULL,
  `ManageEmployee` tinyint(1) DEFAULT NULL,
  `ManageServiceProvider` tinyint(1) DEFAULT NULL,
  `ManageService` tinyint(1) DEFAULT NULL,
  `ManagePage` tinyint(1) DEFAULT NULL,
  `ManageTestimonial` tinyint(1) DEFAULT NULL,
  `ManageOffer` tinyint(1) DEFAULT NULL,
  `ManagePost` tinyint(1) DEFAULT NULL,
  `ManageAdvertisement` tinyint(1) DEFAULT NULL,
  `Customer` tinyint(1) DEFAULT NULL,
  `ManageCustomer` tinyint(1) DEFAULT NULL,
  `ManageHistory` tinyint(1) DEFAULT NULL,
  `MonthlyMembers` tinyint(1) DEFAULT NULL,
  `ManageEnquiry` tinyint(1) DEFAULT NULL,
  `RolesAndPermission` tinyint(1) DEFAULT NULL,
  `ManageMonthService` tinyint(1) NOT NULL,
  `Profile` varchar(255) DEFAULT NULL,
  `Complain` tinyint(1) DEFAULT 0,
  `OrderReports` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `super_admin_roles`
--

INSERT INTO `super_admin_roles` (`id`, `role`, `Dashboard`, `Attendence`, `Availability`, `AttendenceEmployee`, `AttendenceServiceProvider`, `AttendenceReport`, `AttendenceModify`, `Expenses`, `AddHeadExpence`, `AddExpense`, `AddCollections`, `TodaysReport`, `AllTransactionReport`, `ManageHR`, `ManageEmployee`, `ManageServiceProvider`, `ManageService`, `ManagePage`, `ManageTestimonial`, `ManageOffer`, `ManagePost`, `ManageAdvertisement`, `Customer`, `ManageCustomer`, `ManageHistory`, `MonthlyMembers`, `ManageEnquiry`, `RolesAndPermission`, `ManageMonthService`, `Profile`, `Complain`, `OrderReports`, `createdAt`, `updatedAt`) VALUES
(1, 'super', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'admin', 1, 1, '2024-02-15 17:20:27', '2024-02-15 17:20:27');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `occupation` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `about` varchar(255) NOT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `block` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `time_slot`
--

CREATE TABLE `time_slot` (
  `id` int(11) NOT NULL,
  `time_range` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `time_slot`
--

INSERT INTO `time_slot` (`id`, `time_range`, `createdAt`, `updatedAt`) VALUES
(1, '09:00-09:30', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(2, '09:30-10:00', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(3, '10:00-10:30', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(4, '10:30-11:00', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(5, '11:00-11:30', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(6, '11:30-12:00', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(7, '12:00-12:30', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(8, '12:30-01:00', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(10, '01:30-02:00', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(11, '02:00-02:30', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(12, '02:30-03:00', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(13, '03:00-03:30', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(14, '03:30-04:00', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(15, '04:00-04:30', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(16, '04:30-05:00', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(17, '05:00-05:30', '2024-07-30 01:00:55', '2024-07-30 01:00:55'),
(18, '05:30-06:00', '2024-07-30 01:00:55', '2024-07-30 01:00:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`);

--
-- Indexes for table `admin_roles`
--
ALTER TABLE `admin_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `advertisements`
--
ALTER TABLE `advertisements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `alloted_items`
--
ALTER TABLE `alloted_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `availabilities`
--
ALTER TABLE `availabilities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `back_office_roles`
--
ALTER TABLE `back_office_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `complain`
--
ALTER TABLE `complain`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customerids`
--
ALTER TABLE `customerids`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cust_addposts`
--
ALTER TABLE `cust_addposts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `empservices`
--
ALTER TABLE `empservices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enquiries`
--
ALTER TABLE `enquiries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expense_heads`
--
ALTER TABLE `expense_heads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventories`
--
ALTER TABLE `inventories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `localities`
--
ALTER TABLE `localities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `monthlyservices`
--
ALTER TABLE `monthlyservices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `new_customers`
--
ALTER TABLE `new_customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ordernos`
--
ALTER TABLE `ordernos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_process`
--
ALTER TABLE `order_process`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `otps`
--
ALTER TABLE `otps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `our_customers`
--
ALTER TABLE `our_customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `serviceproviderattendance`
--
ALTER TABLE `serviceproviderattendance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_providers`
--
ALTER TABLE `service_providers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_provider_roles`
--
ALTER TABLE `service_provider_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sp_services`
--
ALTER TABLE `sp_services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supervisorattendance`
--
ALTER TABLE `supervisorattendance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supervisor_roles`
--
ALTER TABLE `supervisor_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `super_admin_roles`
--
ALTER TABLE `super_admin_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `time_slot`
--
ALTER TABLE `time_slot`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `admin_roles`
--
ALTER TABLE `admin_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `advertisements`
--
ALTER TABLE `advertisements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `alloted_items`
--
ALTER TABLE `alloted_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `availabilities`
--
ALTER TABLE `availabilities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `back_office_roles`
--
ALTER TABLE `back_office_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `complain`
--
ALTER TABLE `complain`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customerids`
--
ALTER TABLE `customerids`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `cust_addposts`
--
ALTER TABLE `cust_addposts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `empservices`
--
ALTER TABLE `empservices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enquiries`
--
ALTER TABLE `enquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expense_heads`
--
ALTER TABLE `expense_heads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `inventories`
--
ALTER TABLE `inventories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `localities`
--
ALTER TABLE `localities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `monthlyservices`
--
ALTER TABLE `monthlyservices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `new_customers`
--
ALTER TABLE `new_customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `ordernos`
--
ALTER TABLE `ordernos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `order_process`
--
ALTER TABLE `order_process`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `otps`
--
ALTER TABLE `otps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `our_customers`
--
ALTER TABLE `our_customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `serviceproviderattendance`
--
ALTER TABLE `serviceproviderattendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `service_providers`
--
ALTER TABLE `service_providers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `service_provider_roles`
--
ALTER TABLE `service_provider_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sp_services`
--
ALTER TABLE `sp_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supervisorattendance`
--
ALTER TABLE `supervisorattendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supervisor_roles`
--
ALTER TABLE `supervisor_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `super_admin_roles`
--
ALTER TABLE `super_admin_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `time_slot`
--
ALTER TABLE `time_slot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
