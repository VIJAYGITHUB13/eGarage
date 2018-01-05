-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 05, 2018 at 04:41 PM
-- Server version: 10.1.25-MariaDB
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `egarage`
--

-- --------------------------------------------------------

--
-- Table structure for table `jos_app`
--

CREATE TABLE `jos_app` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `display_name` text NOT NULL,
  `acronym` text NOT NULL,
  `version` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_app`
--

INSERT INTO `jos_app` (`id`, `name`, `display_name`, `acronym`, `version`) VALUES
(1, 'egarage', 'eGarage', 'eG', '1.0');

-- --------------------------------------------------------

--
-- Table structure for table `jos_bootstrap_css`
--

CREATE TABLE `jos_bootstrap_css` (
  `id` int(11) NOT NULL,
  `type` text NOT NULL,
  `display_name` text NOT NULL,
  `contextual_color` text NOT NULL,
  `contextual_bgcolor` text NOT NULL,
  `container_bgcolor` text NOT NULL,
  `container_border_color` text NOT NULL,
  `container_hover_color` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_bootstrap_css`
--

INSERT INTO `jos_bootstrap_css` (`id`, `type`, `display_name`, `contextual_color`, `contextual_bgcolor`, `container_bgcolor`, `container_border_color`, `container_hover_color`) VALUES
(1, 'default', 'Default', '#777', '#fff', '#fff', '#ccc', '#e6e6e6'),
(2, 'primary', 'Primary', '#337ab7', '#337ab7', '#337ab7', '#2e6da4', '#286090'),
(3, 'info', 'Info', '#31708f', '#d9edf7', '#5bc0de', '#46b8da', '#31b0d5'),
(4, 'warning', 'Warning', '#8a6d3b', '#fcf8e3', '#f0ad4e', '#eea236', '#ec971f'),
(5, 'success', 'Success', '#3c763d', '#dff0d8', '#5cb85c', '#4cae4c', '#449d44'),
(6, 'danger', 'Danger', '#a94442', '#f2dede', '#d9534f', '#d43f3a', '#c9302c');

-- --------------------------------------------------------

--
-- Table structure for table `jos_countries`
--

CREATE TABLE `jos_countries` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `display_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_countries`
--

INSERT INTO `jos_countries` (`id`, `name`, `display_name`) VALUES
(1, 'india', 'India');

-- --------------------------------------------------------

--
-- Table structure for table `jos_districts`
--

CREATE TABLE `jos_districts` (
  `id` int(11) NOT NULL,
  `state_id` int(11) NOT NULL COMMENT 'jos_states.id',
  `name` text NOT NULL,
  `display_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_districts`
--

INSERT INTO `jos_districts` (`id`, `state_id`, `name`, `display_name`) VALUES
(1, 1, 'nicobar', 'Nicobar'),
(2, 1, 'north_and_middle_andaman', 'North and Middle Andaman'),
(3, 1, 'south_andaman', 'South Andaman'),
(4, 2, 'anantapur', 'Anantapur'),
(5, 2, 'chittoor', 'Chittoor'),
(6, 2, 'east_godavari', 'East Godavari'),
(7, 2, 'guntur', 'Guntur'),
(8, 2, 'kadapa', 'Kadapa'),
(9, 2, 'krishna', 'Krishna'),
(10, 2, 'kurnool', 'Kurnool'),
(11, 2, 'prakasam', 'Prakasam'),
(12, 2, 'sri_potti_sriramulu_nellore', 'Sri Potti Sriramulu Nellore'),
(13, 2, 'srikakulam', 'Srikakulam'),
(14, 2, 'visakhapatnam', 'Visakhapatnam'),
(15, 2, 'vizianagaram', 'Vizianagaram'),
(16, 2, 'west_godavari', 'West Godavari'),
(17, 3, 'anjaw', 'Anjaw'),
(18, 3, 'changlang', 'Changlang'),
(19, 3, 'dibang_valley', 'Dibang Valley'),
(20, 3, 'east_kameng', 'East Kameng'),
(21, 3, 'east_siang', 'East Siang'),
(22, 3, 'kurung_kumey', 'Kurung Kumey'),
(23, 3, 'lohit', 'Lohit'),
(24, 3, 'longding', 'Longding'),
(25, 3, 'lower_dibang_valley', 'Lower Dibang Valley'),
(26, 3, 'lower_subansiri', 'Lower Subansiri'),
(27, 3, 'papum_pare', 'Papum Pare'),
(28, 3, 'tawang', 'Tawang'),
(29, 3, 'tirap', 'Tirap'),
(30, 3, 'upper_siang', 'Upper Siang'),
(31, 3, 'upper_subansiri', 'Upper Subansiri'),
(32, 3, 'west_kameng', 'West Kameng'),
(33, 3, 'west_siang', 'West Siang'),
(34, 4, 'baksa', 'Baksa'),
(35, 4, 'barpeta', 'Barpeta'),
(36, 4, 'bongaigaon', 'Bongaigaon'),
(37, 4, 'cachar', 'Cachar'),
(38, 4, 'chirang', 'Chirang'),
(39, 4, 'darrang', 'Darrang'),
(40, 4, 'dhemaji', 'Dhemaji'),
(41, 4, 'dhubri', 'Dhubri'),
(42, 4, 'dibrugarh', 'Dibrugarh'),
(43, 4, 'dima_hasao', 'Dima Hasao'),
(44, 4, 'goalpara', 'Goalpara'),
(45, 4, 'golaghat', 'Golaghat'),
(46, 4, 'hailakandi', 'Hailakandi'),
(47, 4, 'jorhat', 'Jorhat'),
(48, 4, 'kamrup', 'Kamrup'),
(49, 4, 'kamrup_metropolitan', 'Kamrup Metropolitan'),
(50, 4, 'karbi_anglong', 'Karbi Anglong'),
(51, 4, 'karimganj', 'Karimganj'),
(52, 4, 'kokrajhar', 'Kokrajhar'),
(53, 4, 'lakhimpur', 'Lakhimpur'),
(54, 4, 'morigaon', 'Morigaon'),
(55, 4, 'nagaon', 'Nagaon'),
(56, 4, 'nalbari', 'Nalbari'),
(57, 4, 'sivasagar', 'Sivasagar'),
(58, 4, 'sonitpur', 'Sonitpur'),
(59, 4, 'tinsukia', 'Tinsukia'),
(60, 4, 'udalguri', 'Udalguri'),
(61, 5, 'araria', 'Araria'),
(62, 5, 'arwal', 'Arwal'),
(63, 5, 'aurangabad', 'Aurangabad'),
(64, 5, 'banka', 'Banka'),
(65, 5, 'begusarai', 'Begusarai'),
(66, 5, 'bhagalpur', 'Bhagalpur'),
(67, 5, 'bhojpur', 'Bhojpur'),
(68, 5, 'buxar', 'Buxar'),
(69, 5, 'darbhanga', 'Darbhanga'),
(70, 5, 'east_champaran', 'East Champaran'),
(71, 5, 'gaya', 'Gaya'),
(72, 5, 'gopalganj', 'Gopalganj'),
(73, 5, 'jamui', 'Jamui'),
(74, 5, 'jehanabad', 'Jehanabad'),
(75, 5, 'kaimur', 'Kaimur'),
(76, 5, 'katihar', 'Katihar'),
(77, 5, 'khagaria', 'Khagaria'),
(78, 5, 'kishanganj', 'Kishanganj'),
(79, 5, 'lakhisarai', 'Lakhisarai'),
(80, 5, 'madhepura', 'Madhepura'),
(81, 5, 'madhubani', 'Madhubani'),
(82, 5, 'munger', 'Munger'),
(83, 5, 'muzaffarpur', 'Muzaffarpur'),
(84, 5, 'nalanda', 'Nalanda'),
(85, 5, 'nawada', 'Nawada'),
(86, 5, 'patna', 'Patna'),
(87, 5, 'purnia', 'Purnia'),
(88, 5, 'rohtas', 'Rohtas'),
(89, 5, 'saharsa', 'Saharsa'),
(90, 5, 'samastipur', 'Samastipur'),
(91, 5, 'saran', 'Saran'),
(92, 5, 'sheikhpura', 'Sheikhpura'),
(93, 5, 'sheohar', 'Sheohar'),
(94, 5, 'sitamarhi', 'Sitamarhi'),
(95, 5, 'siwan', 'Siwan'),
(96, 5, 'supaul', 'Supaul'),
(97, 5, 'vaishali', 'Vaishali'),
(98, 5, 'west_champaran', 'West Champaran'),
(99, 6, 'chandigarh', 'Chandigarh'),
(100, 7, 'balod', 'Balod'),
(101, 7, 'baloda_bazar', 'Baloda Bazar'),
(102, 7, 'balrampur', 'Balrampur'),
(103, 7, 'bastar', 'Bastar'),
(104, 7, 'bemetara', 'Bemetara'),
(105, 7, 'bijapur', 'Bijapur'),
(106, 7, 'bilaspur', 'Bilaspur'),
(107, 7, 'dantewada', 'Dantewada'),
(108, 7, 'dhamtari', 'Dhamtari'),
(109, 7, 'durg', 'Durg'),
(110, 7, 'gariaband', 'Gariaband'),
(111, 7, 'janjgir-champa', 'Janjgir-Champa'),
(112, 7, 'jashpur', 'Jashpur'),
(113, 7, 'kabirdham_(formerly_kawardha)', 'Kabirdham (formerly Kawardha)'),
(114, 7, 'kanker', 'Kanker'),
(115, 7, 'kondagaon', 'Kondagaon'),
(116, 7, 'korba', 'Korba'),
(117, 7, 'koriya', 'Koriya'),
(118, 7, 'mahasamund', 'Mahasamund'),
(119, 7, 'mungeli', 'Mungeli'),
(120, 7, 'narayanpur', 'Narayanpur'),
(121, 7, 'raigarh', 'Raigarh'),
(122, 7, 'raipur', 'Raipur'),
(123, 7, 'rajnandgaon', 'Rajnandgaon'),
(124, 7, 'sukma', 'Sukma'),
(125, 7, 'surajpur', 'Surajpur'),
(126, 7, 'surguja', 'Surguja'),
(127, 8, 'dadra_and_nagar_haveli', 'Dadra and Nagar Haveli'),
(128, 9, 'daman', 'Daman'),
(129, 9, 'diu', 'Diu'),
(130, 10, 'central_delhi', 'Central Delhi'),
(131, 10, 'east_delhi', 'East Delhi'),
(132, 10, 'new_delhi', 'New Delhi'),
(133, 10, 'north_delhi', 'North Delhi'),
(134, 10, 'north_east_delhi', 'North East Delhi'),
(135, 10, 'north_west_delhi', 'North West Delhi'),
(136, 10, 'shahdara', 'Shahdara'),
(137, 10, 'south_delhi', 'South Delhi'),
(138, 10, 'south_east_delhi', 'South East Delhi'),
(139, 10, 'south_west_delhi', 'South West Delhi'),
(140, 10, 'west_delhi', 'West Delhi'),
(141, 11, 'north_goa', 'North Goa'),
(142, 11, 'south_goa', 'South Goa'),
(143, 12, 'ahmedabad', 'Ahmedabad'),
(144, 12, 'amreli_district', 'Amreli district'),
(145, 12, 'anand', 'Anand'),
(146, 12, 'aravalli', 'Aravalli'),
(147, 12, 'banaskantha', 'Banaskantha'),
(148, 12, 'bharuch', 'Bharuch'),
(149, 12, 'bhavnagar', 'Bhavnagar'),
(150, 12, 'botad', 'Botad'),
(151, 12, 'chhota_udaipur', 'Chhota Udaipur'),
(152, 12, 'dahod', 'Dahod'),
(153, 12, 'dang', 'Dang'),
(154, 12, 'devbhoomi_dwarka', 'Devbhoomi Dwarka'),
(155, 12, 'gandhinagar', 'Gandhinagar'),
(156, 12, 'gir_somnath', 'Gir Somnath'),
(157, 12, 'jamnagar', 'Jamnagar'),
(158, 12, 'junagadh', 'Junagadh'),
(159, 12, 'kheda', 'Kheda'),
(160, 12, 'kutch', 'Kutch'),
(161, 12, 'mahisagar', 'Mahisagar'),
(162, 12, 'mehsana', 'Mehsana'),
(163, 12, 'morbi', 'Morbi'),
(164, 12, 'narmada', 'Narmada'),
(165, 12, 'navsari', 'Navsari'),
(166, 12, 'panchmahal', 'Panchmahal'),
(167, 12, 'patan', 'Patan'),
(168, 12, 'porbandar', 'Porbandar'),
(169, 12, 'rajkot', 'Rajkot'),
(170, 12, 'sabarkantha', 'Sabarkantha'),
(171, 12, 'surat', 'Surat'),
(172, 12, 'surendranagar', 'Surendranagar'),
(173, 12, 'tapi', 'Tapi'),
(174, 12, 'vadodara', 'Vadodara'),
(175, 12, 'valsad', 'Valsad'),
(176, 13, 'ambala', 'Ambala'),
(177, 13, 'bhiwani', 'Bhiwani'),
(178, 13, 'faridabad', 'Faridabad'),
(179, 13, 'fatehabad', 'Fatehabad'),
(180, 13, 'gurgaon', 'Gurgaon'),
(181, 13, 'hissar', 'Hissar'),
(182, 13, 'jhajjar', 'Jhajjar'),
(183, 13, 'jind', 'Jind'),
(184, 13, 'kaithal', 'Kaithal'),
(185, 13, 'karnal', 'Karnal'),
(186, 13, 'kurukshetra', 'Kurukshetra'),
(187, 13, 'mahendragarh', 'Mahendragarh'),
(188, 13, 'mewat', 'Mewat'),
(189, 13, 'palwal', 'Palwal'),
(190, 13, 'panchkula', 'Panchkula'),
(191, 13, 'panipat', 'Panipat'),
(192, 13, 'rewari', 'Rewari'),
(193, 13, 'rohtak', 'Rohtak'),
(194, 13, 'sirsa', 'Sirsa'),
(195, 13, 'sonipat', 'Sonipat'),
(196, 13, 'yamuna_nagar', 'Yamuna Nagar'),
(197, 14, 'bilaspur', 'Bilaspur'),
(198, 14, 'chamba', 'Chamba'),
(199, 14, 'hamirpur', 'Hamirpur'),
(200, 14, 'kangra', 'Kangra'),
(201, 14, 'kinnaur', 'Kinnaur'),
(202, 14, 'kullu', 'Kullu'),
(203, 14, 'lahaul_and_spiti', 'Lahaul and Spiti'),
(204, 14, 'mandi', 'Mandi'),
(205, 14, 'shimla', 'Shimla'),
(206, 14, 'sirmaur', 'Sirmaur'),
(207, 14, 'solan', 'Solan'),
(208, 14, 'una', 'Una'),
(209, 15, 'anantnag', 'Anantnag'),
(210, 15, 'badgam', 'Badgam'),
(211, 15, 'bandipora', 'Bandipora'),
(212, 15, 'baramulla', 'Baramulla'),
(213, 15, 'doda', 'Doda'),
(214, 15, 'ganderbal', 'Ganderbal'),
(215, 15, 'jammu', 'Jammu'),
(216, 15, 'kargil', 'Kargil'),
(217, 15, 'kathua', 'Kathua'),
(218, 15, 'kishtwar', 'Kishtwar'),
(219, 15, 'kulgam', 'Kulgam'),
(220, 15, 'kupwara', 'Kupwara'),
(221, 15, 'leh', 'Leh'),
(222, 15, 'poonch', 'Poonch'),
(223, 15, 'pulwama', 'Pulwama'),
(224, 15, 'rajouri', 'Rajouri'),
(225, 15, 'ramban', 'Ramban'),
(226, 15, 'reasi', 'Reasi'),
(227, 15, 'samba', 'Samba'),
(228, 15, 'shopian', 'Shopian'),
(229, 15, 'srinagar', 'Srinagar'),
(230, 15, 'udhampur', 'Udhampur'),
(231, 16, 'bokaro', 'Bokaro'),
(232, 16, 'chatra', 'Chatra'),
(233, 16, 'deoghar', 'Deoghar'),
(234, 16, 'dhanbad', 'Dhanbad'),
(235, 16, 'dumka', 'Dumka'),
(236, 16, 'east_singhbhum', 'East Singhbhum'),
(237, 16, 'garhwa', 'Garhwa'),
(238, 16, 'giridih', 'Giridih'),
(239, 16, 'godda', 'Godda'),
(240, 16, 'gumla', 'Gumla'),
(241, 16, 'hazaribag', 'Hazaribag'),
(242, 16, 'jamtara', 'Jamtara'),
(243, 16, 'khunti', 'Khunti'),
(244, 16, 'koderma', 'Koderma'),
(245, 16, 'latehar', 'Latehar'),
(246, 16, 'lohardaga', 'Lohardaga'),
(247, 16, 'pakur', 'Pakur'),
(248, 16, 'palamu', 'Palamu'),
(249, 16, 'ramgarh', 'Ramgarh'),
(250, 16, 'ranchi', 'Ranchi'),
(251, 16, 'sahibganj', 'Sahibganj'),
(252, 16, 'seraikela_kharsawan', 'Seraikela Kharsawan'),
(253, 16, 'simdega', 'Simdega'),
(254, 16, 'west_singhbhum', 'West Singhbhum'),
(255, 17, 'bagalkot', 'Bagalkot'),
(256, 17, 'bangalore_rural', 'Bangalore Rural'),
(257, 17, 'bangalore_urban', 'Bangalore Urban'),
(258, 17, 'belgaum', 'Belgaum'),
(259, 17, 'bellary', 'Bellary'),
(260, 17, 'bidar', 'Bidar'),
(261, 17, 'chamarajnagar', 'Chamarajnagar'),
(262, 17, 'chikkaballapur', 'Chikkaballapur'),
(263, 17, 'chikkamagaluru', 'Chikkamagaluru'),
(264, 17, 'chitradurga', 'Chitradurga'),
(265, 17, 'dakshina_kannada', 'Dakshina Kannada'),
(266, 17, 'davanagere', 'Davanagere'),
(267, 17, 'dharwad', 'Dharwad'),
(268, 17, 'gadag', 'Gadag'),
(269, 17, 'gulbarga', 'Gulbarga'),
(270, 17, 'hassan', 'Hassan'),
(271, 17, 'haveri_district', 'Haveri district'),
(272, 17, 'kodagu', 'Kodagu'),
(273, 17, 'kolar', 'Kolar'),
(274, 17, 'koppal', 'Koppal'),
(275, 17, 'mandya', 'Mandya'),
(276, 17, 'mysore', 'Mysore'),
(277, 17, 'raichur', 'Raichur'),
(278, 17, 'ramanagara', 'Ramanagara'),
(279, 17, 'shimoga', 'Shimoga'),
(280, 17, 'tumkur', 'Tumkur'),
(281, 17, 'udupi', 'Udupi'),
(282, 17, 'uttara_kannada', 'Uttara Kannada'),
(283, 17, 'vijayapura', 'Vijayapura'),
(284, 17, 'yadgir', 'Yadgir'),
(285, 18, 'alappuzha', 'Alappuzha'),
(286, 18, 'ernakulam', 'Ernakulam'),
(287, 18, 'idukki', 'Idukki'),
(288, 18, 'kannur', 'Kannur'),
(289, 18, 'kasaragod', 'Kasaragod'),
(290, 18, 'kollam', 'Kollam'),
(291, 18, 'kottayam', 'Kottayam'),
(292, 18, 'kozhikode', 'Kozhikode'),
(293, 18, 'malappuram', 'Malappuram'),
(294, 18, 'palakkad', 'Palakkad'),
(295, 18, 'pathanamthitta', 'Pathanamthitta'),
(296, 18, 'thiruvananthapuram', 'Thiruvananthapuram'),
(297, 18, 'thrissur', 'Thrissur'),
(298, 18, 'wayanad', 'Wayanad'),
(299, 19, 'lakshadweep', 'Lakshadweep'),
(300, 20, 'agar', 'Agar'),
(301, 20, 'alirajpur', 'Alirajpur'),
(302, 20, 'anuppur', 'Anuppur'),
(303, 20, 'ashok_nagar', 'Ashok Nagar'),
(304, 20, 'balaghat', 'Balaghat'),
(305, 20, 'barwani', 'Barwani'),
(306, 20, 'betul', 'Betul'),
(307, 20, 'bhind', 'Bhind'),
(308, 20, 'bhopal', 'Bhopal'),
(309, 20, 'burhanpur', 'Burhanpur'),
(310, 20, 'chhatarpur', 'Chhatarpur'),
(311, 20, 'chhindwara', 'Chhindwara'),
(312, 20, 'damoh', 'Damoh'),
(313, 20, 'datia', 'Datia'),
(314, 20, 'dewas', 'Dewas'),
(315, 20, 'dhar', 'Dhar'),
(316, 20, 'dindori', 'Dindori'),
(317, 20, 'guna', 'Guna'),
(318, 20, 'gwalior', 'Gwalior'),
(319, 20, 'harda', 'Harda'),
(320, 20, 'hoshangabad', 'Hoshangabad'),
(321, 20, 'indore', 'Indore'),
(322, 20, 'jabalpur', 'Jabalpur'),
(323, 20, 'jhabua', 'Jhabua'),
(324, 20, 'katni', 'Katni'),
(325, 20, 'khandwa_(east_nimar)', 'Khandwa (East Nimar)'),
(326, 20, 'khargone_(west_nimar)', 'Khargone (West Nimar)'),
(327, 20, 'mandla', 'Mandla'),
(328, 20, 'mandsaur', 'Mandsaur'),
(329, 20, 'morena', 'Morena'),
(330, 20, 'narsinghpur', 'Narsinghpur'),
(331, 20, 'neemuch', 'Neemuch'),
(332, 20, 'panna', 'Panna'),
(333, 20, 'raisen', 'Raisen'),
(334, 20, 'rajgarh', 'Rajgarh'),
(335, 20, 'ratlam', 'Ratlam'),
(336, 20, 'rewa', 'Rewa'),
(337, 20, 'sagar', 'Sagar'),
(338, 20, 'satna', 'Satna'),
(339, 20, 'sehore', 'Sehore'),
(340, 20, 'seoni', 'Seoni'),
(341, 20, 'shahdol', 'Shahdol'),
(342, 20, 'shajapur', 'Shajapur'),
(343, 20, 'sheopur', 'Sheopur'),
(344, 20, 'shivpuri', 'Shivpuri'),
(345, 20, 'sidhi', 'Sidhi'),
(346, 20, 'singrauli', 'Singrauli'),
(347, 20, 'tikamgarh', 'Tikamgarh'),
(348, 20, 'ujjain', 'Ujjain'),
(349, 20, 'umaria', 'Umaria'),
(350, 20, 'vidisha', 'Vidisha'),
(351, 21, 'ahmednagar', 'Ahmednagar'),
(352, 21, 'akola', 'Akola'),
(353, 21, 'amravati', 'Amravati'),
(354, 21, 'aurangabad', 'Aurangabad'),
(355, 21, 'beed', 'Beed'),
(356, 21, 'bhandara', 'Bhandara'),
(357, 21, 'buldhana', 'Buldhana'),
(358, 21, 'chandrapur', 'Chandrapur'),
(359, 21, 'dhule', 'Dhule'),
(360, 21, 'gadchiroli', 'Gadchiroli'),
(361, 21, 'gondia', 'Gondia'),
(362, 21, 'hingoli', 'Hingoli'),
(363, 21, 'jalgaon', 'Jalgaon'),
(364, 21, 'jalna', 'Jalna'),
(365, 21, 'kolhapur', 'Kolhapur'),
(366, 21, 'latur', 'Latur'),
(367, 21, 'mumbai_city', 'Mumbai City'),
(368, 21, 'mumbai_suburban', 'Mumbai suburban'),
(369, 21, 'nagpur', 'Nagpur'),
(370, 21, 'nanded', 'Nanded'),
(371, 21, 'nandurbar', 'Nandurbar'),
(372, 21, 'nashik', 'Nashik'),
(373, 21, 'osmanabad', 'Osmanabad'),
(374, 21, 'palghar', 'Palghar'),
(375, 21, 'parbhani', 'Parbhani'),
(376, 21, 'pune', 'Pune'),
(377, 21, 'raigad', 'Raigad'),
(378, 21, 'ratnagiri', 'Ratnagiri'),
(379, 21, 'sangli', 'Sangli'),
(380, 21, 'satara', 'Satara'),
(381, 21, 'sindhudurg', 'Sindhudurg'),
(382, 21, 'solapur', 'Solapur'),
(383, 21, 'thane', 'Thane'),
(384, 21, 'wardha', 'Wardha'),
(385, 21, 'washim', 'Washim'),
(386, 21, 'yavatmal', 'Yavatmal'),
(387, 22, 'bishnupur', 'Bishnupur'),
(388, 22, 'chandel', 'Chandel'),
(389, 22, 'churachandpur', 'Churachandpur'),
(390, 22, 'imphal_east', 'Imphal East'),
(391, 22, 'imphal_west', 'Imphal West'),
(392, 22, 'senapati', 'Senapati'),
(393, 22, 'tamenglong', 'Tamenglong'),
(394, 22, 'thoubal', 'Thoubal'),
(395, 22, 'ukhrul', 'Ukhrul'),
(396, 23, 'east_garo_hills', 'East Garo Hills'),
(397, 23, 'east_jaintia_hills', 'East Jaintia Hills'),
(398, 23, 'east_khasi_hills', 'East Khasi Hills'),
(399, 23, 'north_garo_hills', 'North Garo Hills'),
(400, 23, 'ri_bhoi', 'Ri Bhoi'),
(401, 23, 'south_garo_hills', 'South Garo Hills'),
(402, 23, 'south_west_garo_hills', 'South West Garo Hills'),
(403, 23, 'south_west_khasi_hills', 'South West Khasi Hills'),
(404, 23, 'west_garo_hills', 'West Garo Hills'),
(405, 23, 'west_jaintia_hills', 'West Jaintia Hills'),
(406, 23, 'west_khasi_hills', 'West Khasi Hills'),
(407, 24, 'aizawl', 'Aizawl'),
(408, 24, 'champhai', 'Champhai'),
(409, 24, 'dimapur', 'Dimapur'),
(410, 24, 'kiphire', 'Kiphire'),
(411, 24, 'kohima', 'Kohima'),
(412, 24, 'kolasib', 'Kolasib'),
(413, 24, 'lawngtlai', 'Lawngtlai'),
(414, 24, 'longleng', 'Longleng'),
(415, 24, 'lunglei', 'Lunglei'),
(416, 24, 'mamit', 'Mamit'),
(417, 24, 'mokokchung', 'Mokokchung'),
(418, 24, 'mon', 'Mon'),
(419, 24, 'peren', 'Peren'),
(420, 24, 'phek', 'Phek'),
(421, 24, 'saiha', 'Saiha'),
(422, 24, 'serchhip', 'Serchhip'),
(423, 24, 'tuensang', 'Tuensang'),
(424, 24, 'wokha', 'Wokha'),
(425, 24, 'zunheboto', 'Zunheboto'),
(426, 25, 'angul', 'Angul'),
(427, 25, 'balangir', 'Balangir'),
(428, 25, 'balasore', 'Balasore'),
(429, 25, 'bargarh_(baragarh)', 'Bargarh (Baragarh)'),
(430, 25, 'bhadrak', 'Bhadrak'),
(431, 25, 'boudh_(bauda)', 'Boudh (Bauda)'),
(432, 25, 'cuttack', 'Cuttack'),
(433, 25, 'debagarh_(deogarh)', 'Debagarh (Deogarh)'),
(434, 25, 'dhenkanal', 'Dhenkanal'),
(435, 25, 'gajapati', 'Gajapati'),
(436, 25, 'ganjam', 'Ganjam'),
(437, 25, 'jagatsinghpur', 'Jagatsinghpur'),
(438, 25, 'jajpur', 'Jajpur'),
(439, 25, 'jharsuguda', 'Jharsuguda'),
(440, 25, 'kalahandi', 'Kalahandi'),
(441, 25, 'kandhamal', 'Kandhamal'),
(442, 25, 'kendrapara', 'Kendrapara'),
(443, 25, 'kendujhar_(keonjhar)', 'Kendujhar (Keonjhar)'),
(444, 25, 'khordha', 'Khordha'),
(445, 25, 'koraput', 'Koraput'),
(446, 25, 'malkangiri', 'Malkangiri'),
(447, 25, 'mayurbhanj', 'Mayurbhanj'),
(448, 25, 'nabarangpur', 'Nabarangpur'),
(449, 25, 'nayagarh', 'Nayagarh'),
(450, 25, 'nuapada', 'Nuapada'),
(451, 25, 'puri', 'Puri'),
(452, 25, 'rayagada', 'Rayagada'),
(453, 25, 'sambalpur', 'Sambalpur'),
(454, 25, 'subarnapur_(sonepur)', 'Subarnapur (Sonepur)'),
(455, 25, 'sundargarh', 'Sundargarh'),
(456, 26, 'karaikal', 'Karaikal'),
(457, 26, 'mahe', 'Mahe'),
(458, 26, 'pondicherry', 'Pondicherry'),
(459, 26, 'yanam', 'Yanam'),
(460, 27, 'amritsar', 'Amritsar'),
(461, 27, 'barnala', 'Barnala'),
(462, 27, 'bathinda', 'Bathinda'),
(463, 27, 'faridkot', 'Faridkot'),
(464, 27, 'fatehgarh_sahib', 'Fatehgarh Sahib'),
(465, 27, 'fazilka', 'Fazilka'),
(466, 27, 'firozpur', 'Firozpur'),
(467, 27, 'gurdaspur', 'Gurdaspur'),
(468, 27, 'hoshiarpur', 'Hoshiarpur'),
(469, 27, 'jalandhar', 'Jalandhar'),
(470, 27, 'kapurthala', 'Kapurthala'),
(471, 27, 'ludhiana', 'Ludhiana'),
(472, 27, 'mansa', 'Mansa'),
(473, 27, 'moga', 'Moga'),
(474, 27, 'pathankot', 'Pathankot'),
(475, 27, 'patiala', 'Patiala'),
(476, 27, 'rupnagar', 'Rupnagar'),
(477, 27, 'sahibzada_ajit_singh_nagar', 'Sahibzada Ajit Singh Nagar'),
(478, 27, 'sangrur', 'Sangrur'),
(479, 27, 'shahid_bhagat_singh_nagar', 'Shahid Bhagat Singh Nagar'),
(480, 27, 'sri_muktsar_sahib', 'Sri Muktsar Sahib'),
(481, 27, 'tarn_taran', 'Tarn Taran'),
(482, 28, 'ajmer', 'Ajmer'),
(483, 28, 'alwar', 'Alwar'),
(484, 28, 'banswara', 'Banswara'),
(485, 28, 'baran', 'Baran'),
(486, 28, 'barmer', 'Barmer'),
(487, 28, 'bharatpur', 'Bharatpur'),
(488, 28, 'bhilwara', 'Bhilwara'),
(489, 28, 'bikaner', 'Bikaner'),
(490, 28, 'bundi', 'Bundi'),
(491, 28, 'chittorgarh', 'Chittorgarh'),
(492, 28, 'churu', 'Churu'),
(493, 28, 'dausa', 'Dausa'),
(494, 28, 'dholpur', 'Dholpur'),
(495, 28, 'dungapur', 'Dungapur'),
(496, 28, 'ganganagar', 'Ganganagar'),
(497, 28, 'hanumangarh', 'Hanumangarh'),
(498, 28, 'jaipur', 'Jaipur'),
(499, 28, 'jaisalmer', 'Jaisalmer'),
(500, 28, 'jalore', 'Jalore'),
(501, 28, 'jhalawar', 'Jhalawar'),
(502, 28, 'jhunjhunu', 'Jhunjhunu'),
(503, 28, 'jodhpur', 'Jodhpur'),
(504, 28, 'karauli', 'Karauli'),
(505, 28, 'kota', 'Kota'),
(506, 28, 'nagaur', 'Nagaur'),
(507, 28, 'pali', 'Pali'),
(508, 28, 'pratapgarh', 'Pratapgarh'),
(509, 28, 'rajsamand', 'Rajsamand'),
(510, 28, 'sawai_madhopur', 'Sawai Madhopur'),
(511, 28, 'sikar', 'Sikar'),
(512, 28, 'sirohi', 'Sirohi'),
(513, 28, 'tonk', 'Tonk'),
(514, 28, 'udaipur', 'Udaipur'),
(515, 29, 'east_sikkim', 'East Sikkim'),
(516, 29, 'north_sikkim', 'North Sikkim'),
(517, 29, 'south_sikkim', 'South Sikkim'),
(518, 29, 'west_sikkim', 'West Sikkim'),
(519, 30, 'ariyalur', 'Ariyalur'),
(520, 30, 'chennai', 'Chennai'),
(521, 30, 'coimbatore', 'Coimbatore'),
(522, 30, 'cuddalore', 'Cuddalore'),
(523, 30, 'dharmapuri', 'Dharmapuri'),
(524, 30, 'dindigul', 'Dindigul'),
(525, 30, 'erode', 'Erode'),
(526, 30, 'kanchipuram', 'Kanchipuram'),
(527, 30, 'kanyakumari', 'Kanyakumari'),
(528, 30, 'karur', 'Karur'),
(529, 30, 'krishnagiri', 'Krishnagiri'),
(530, 30, 'madurai', 'Madurai'),
(531, 30, 'nagapattinam', 'Nagapattinam'),
(532, 30, 'namakkal', 'Namakkal'),
(533, 30, 'nilgiris', 'Nilgiris'),
(534, 30, 'perambalur', 'Perambalur'),
(535, 30, 'pudukkottai', 'Pudukkottai'),
(536, 30, 'ramanathapuram', 'Ramanathapuram'),
(537, 30, 'salem', 'Salem'),
(538, 30, 'sivaganga', 'Sivaganga'),
(539, 30, 'thanjavur', 'Thanjavur'),
(540, 30, 'theni', 'Theni'),
(541, 30, 'thoothukudi', 'Thoothukudi'),
(542, 30, 'tiruchirappalli', 'Tiruchirappalli'),
(543, 30, 'tirunelveli', 'Tirunelveli'),
(544, 30, 'tirupur', 'Tirupur'),
(545, 30, 'tiruvallur', 'Tiruvallur'),
(546, 30, 'tiruvannamalai', 'Tiruvannamalai'),
(547, 30, 'tiruvarur', 'Tiruvarur'),
(548, 30, 'vellore', 'Vellore'),
(549, 30, 'viluppuram', 'Viluppuram'),
(550, 30, 'virudhunagar', 'Virudhunagar'),
(551, 31, 'adilabad', 'Adilabad'),
(552, 31, 'hyderabad', 'Hyderabad'),
(553, 31, 'karimnagar', 'Karimnagar'),
(554, 31, 'khammam', 'Khammam'),
(555, 31, 'mahbubnagar', 'Mahbubnagar'),
(556, 31, 'medak', 'Medak'),
(557, 31, 'nalgonda', 'Nalgonda'),
(558, 31, 'nizamabad', 'Nizamabad'),
(559, 31, 'ranga_reddy', 'Ranga Reddy'),
(560, 31, 'warangal', 'Warangal'),
(561, 32, 'dhalai', 'Dhalai'),
(562, 32, 'gomati', 'Gomati'),
(563, 32, 'khowai', 'Khowai'),
(564, 32, 'north_tripura', 'North Tripura'),
(565, 32, 'sepahijala', 'Sepahijala'),
(566, 32, 'south_tripura', 'South Tripura'),
(567, 32, 'unokoti', 'Unokoti'),
(568, 32, 'west_tripura', 'West Tripura'),
(569, 33, 'agra', 'Agra'),
(570, 33, 'aligarh', 'Aligarh'),
(571, 33, 'allahabad', 'Allahabad'),
(572, 33, 'ambedkar_nagar', 'Ambedkar Nagar'),
(573, 33, 'amethi_(chhatrapati_shahuji_maharaj_nagar)', 'Amethi (Chhatrapati Shahuji Maharaj Nagar)'),
(574, 33, 'auraiya', 'Auraiya'),
(575, 33, 'azamgarh', 'Azamgarh'),
(576, 33, 'bagpat', 'Bagpat'),
(577, 33, 'bahraich', 'Bahraich'),
(578, 33, 'ballia', 'Ballia'),
(579, 33, 'balrampur', 'Balrampur'),
(580, 33, 'banda', 'Banda'),
(581, 33, 'barabanki', 'Barabanki'),
(582, 33, 'bareilly', 'Bareilly'),
(583, 33, 'basti', 'Basti'),
(584, 33, 'bijnor', 'Bijnor'),
(585, 33, 'budaun', 'Budaun'),
(586, 33, 'bulandshahr', 'Bulandshahr'),
(587, 33, 'chandauli', 'Chandauli'),
(588, 33, 'chitrakoot', 'Chitrakoot'),
(589, 33, 'deoria', 'Deoria'),
(590, 33, 'etah', 'Etah'),
(591, 33, 'etawah', 'Etawah'),
(592, 33, 'faizabad', 'Faizabad'),
(593, 33, 'farrukhabad', 'Farrukhabad'),
(594, 33, 'fatehpur', 'Fatehpur'),
(595, 33, 'firozabad', 'Firozabad'),
(596, 33, 'gautam_buddh_nagar', 'Gautam Buddh Nagar'),
(597, 33, 'ghaziabad', 'Ghaziabad'),
(598, 33, 'ghazipur', 'Ghazipur'),
(599, 33, 'gonda', 'Gonda'),
(600, 33, 'gorakhpur', 'Gorakhpur'),
(601, 33, 'hamirpur', 'Hamirpur'),
(602, 33, 'hapur_(panchsheel_nagar)', 'Hapur (Panchsheel Nagar)'),
(603, 33, 'hardoi', 'Hardoi'),
(604, 33, 'hathras_(mahamaya_nagar)', 'Hathras (Mahamaya Nagar)'),
(605, 33, 'jalaun', 'Jalaun'),
(606, 33, 'jaunpur_district', 'Jaunpur district'),
(607, 33, 'jhansi', 'Jhansi'),
(608, 33, 'jyotiba_phule_nagar', 'Jyotiba Phule Nagar'),
(609, 33, 'kannauj', 'Kannauj'),
(610, 33, 'kanpur_dehat_(ramabai_nagar)', 'Kanpur Dehat (Ramabai Nagar)'),
(611, 33, 'kanpur_nagar', 'Kanpur Nagar'),
(612, 33, 'kanshi_ram_nagar', 'Kanshi Ram Nagar'),
(613, 33, 'kaushambi', 'Kaushambi'),
(614, 33, 'kushinagar', 'Kushinagar'),
(615, 33, 'lakhimpur_kheri', 'Lakhimpur Kheri'),
(616, 33, 'lalitpur', 'Lalitpur'),
(617, 33, 'lucknow', 'Lucknow'),
(618, 33, 'maharajganj', 'Maharajganj'),
(619, 33, 'mahoba', 'Mahoba'),
(620, 33, 'mainpuri', 'Mainpuri'),
(621, 33, 'mathura', 'Mathura'),
(622, 33, 'mau', 'Mau'),
(623, 33, 'meerut', 'Meerut'),
(624, 33, 'mirzapur', 'Mirzapur'),
(625, 33, 'moradabad', 'Moradabad'),
(626, 33, 'muzaffarnagar', 'Muzaffarnagar'),
(627, 33, 'pilibhit', 'Pilibhit'),
(628, 33, 'pratapgarh', 'Pratapgarh'),
(629, 33, 'raebareli', 'Raebareli'),
(630, 33, 'rampur', 'Rampur'),
(631, 33, 'saharanpur', 'Saharanpur'),
(632, 33, 'sambhal(bheem_nagar)', 'Sambhal(Bheem Nagar)'),
(633, 33, 'sant_kabir_nagar', 'Sant Kabir Nagar'),
(634, 33, 'sant_ravidas_nagar', 'Sant Ravidas Nagar'),
(635, 33, 'shahjahanpur', 'Shahjahanpur'),
(636, 33, 'shamli', 'Shamli'),
(637, 33, 'shravasti', 'Shravasti'),
(638, 33, 'siddharthnagar', 'Siddharthnagar'),
(639, 33, 'sitapur', 'Sitapur'),
(640, 33, 'sonbhadra', 'Sonbhadra'),
(641, 33, 'sultanpur', 'Sultanpur'),
(642, 33, 'unnao', 'Unnao'),
(643, 33, 'varanasi', 'Varanasi'),
(644, 34, 'almora', 'Almora'),
(645, 34, 'bageshwar', 'Bageshwar'),
(646, 34, 'chamoli', 'Chamoli'),
(647, 34, 'champawat', 'Champawat'),
(648, 34, 'dehradun', 'Dehradun'),
(649, 34, 'haridwar', 'Haridwar'),
(650, 34, 'nainital', 'Nainital'),
(651, 34, 'pauri_garhwal', 'Pauri Garhwal'),
(652, 34, 'pithoragarh', 'Pithoragarh'),
(653, 34, 'rudraprayag', 'Rudraprayag'),
(654, 34, 'tehri_garhwal', 'Tehri Garhwal'),
(655, 34, 'udham_singh_nagar', 'Udham Singh Nagar'),
(656, 34, 'uttarkashi', 'Uttarkashi'),
(657, 35, 'alipurduar', 'Alipurduar'),
(658, 35, 'bankura', 'Bankura'),
(659, 35, 'bardhaman', 'Bardhaman'),
(660, 35, 'birbhum', 'Birbhum'),
(661, 35, 'cooch_behar', 'Cooch Behar'),
(662, 35, 'dakshin_dinajpur', 'Dakshin Dinajpur'),
(663, 35, 'darjeeling', 'Darjeeling'),
(664, 35, 'hooghly', 'Hooghly'),
(665, 35, 'howrah', 'Howrah'),
(666, 35, 'jalpaiguri', 'Jalpaiguri'),
(667, 35, 'kolkata', 'Kolkata'),
(668, 35, 'maldah', 'Maldah'),
(669, 35, 'murshidabad', 'Murshidabad'),
(670, 35, 'nadia', 'Nadia'),
(671, 35, 'north_24_parganas', 'North 24 Parganas'),
(672, 35, 'paschim_medinipur', 'Paschim Medinipur'),
(673, 35, 'purba_medinipur', 'Purba Medinipur'),
(674, 35, 'purulia', 'Purulia'),
(675, 35, 'south_24_parganas', 'South 24 Parganas'),
(676, 35, 'uttar_dinajpur', 'Uttar Dinajpur');

-- --------------------------------------------------------

--
-- Table structure for table `jos_establishments`
--

CREATE TABLE `jos_establishments` (
  `id` int(11) NOT NULL,
  `code` text NOT NULL,
  `name` text NOT NULL,
  `display_name` text NOT NULL,
  `address` text NOT NULL,
  `contact` text NOT NULL,
  `logo` text NOT NULL,
  `modified_by` int(11) NOT NULL COMMENT 'jos_users.id',
  `modified_on` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jos_menus`
--

CREATE TABLE `jos_menus` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL COMMENT 'jos_menus.id',
  `name` text NOT NULL,
  `display_name` text NOT NULL,
  `path` text NOT NULL,
  `display_order` int(11) NOT NULL,
  `envi` int(1) NOT NULL COMMENT 'Index: 0, Window: 1',
  `rwd` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_menus`
--

INSERT INTO `jos_menus` (`id`, `parent_id`, `name`, `display_name`, `path`, `display_order`, `envi`, `rwd`) VALUES
(1, 0, 'home', 'Home', 'public', 1, 0, ''),
(2, 0, 'about_us', 'About us', 'public.aboutus', 2, 0, ''),
(3, 0, 'contact_us', 'Contact us', 'public.contactus', 3, 0, ''),
(4, 0, 'home', 'Home', 'home', 1, 1, ''),
(5, 0, 'users', 'Users', 'home.users', 2, 1, ''),
(6, 5, 'view', 'View', 'home.users.view', 1, 1, ''),
(7, 5, 'create', 'Create', 'home.users.create', 2, 1, ''),
(8, 5, 'bulk_upload', 'Bulk Upload', 'home.users.upload', 3, 1, ''),
(9, 0, 'service_requests', 'Service Requests', 'home.requests', 3, 1, ''),
(10, 9, 'view', 'View', 'home.requests.view', 1, 1, ''),
(11, 9, 'create', 'Create', 'home.requests.create', 2, 1, ''),
(12, 0, 'manage', 'Manage', 'home.manage', 4, 1, ''),
(14, 12, 'storage_items', 'Storage Items', 'home.manage.storageitems', 2, 1, ''),
(15, 12, 'suppliers', 'Suppliers', 'home.manage.suppliers', 3, 1, ''),
(16, 0, 'accounts', 'Accounts', 'home.accounts', 5, 1, ''),
(17, 16, 'purchase_order', 'Purchase Order', 'home.accounts.purchaseorder', 1, 1, ''),
(18, 0, 'reports', 'Reports', 'home.reports', 6, 1, ''),
(19, 18, 'orders', 'Orders', 'home.reports.orders', 1, 1, ''),
(20, 18, 'orders_by_duration', 'Orders by Duration', 'home.reports.ordersbyduration', 2, 1, ''),
(21, 18, 'invoices_by_duration', 'Invoices by Duration', 'home.reports.invoicesbyduration', 3, 1, ''),
(22, 12, 'menus', 'Menus', 'home.manage.menus', 4, 1, ''),
(23, 9, 'quotation', 'Quotation', 'home.requests.quotation', 3, 1, ''),
(24, 0, 'misc', 'Misc', 'home.misc', 7, 1, ''),
(25, 24, 'resetpassword', 'Reset Password', 'home.misc.resetpassword', 1, 1, ''),
(26, 24, 'establishment', 'Establishment', 'home.misc.establishment', 2, 1, '');

-- --------------------------------------------------------

--
-- Table structure for table `jos_menus_ucategories`
--

CREATE TABLE `jos_menus_ucategories` (
  `id` int(11) NOT NULL,
  `user_subcat_id` int(11) NOT NULL COMMENT 'jos_user_category_details.id',
  `menu_id` int(11) NOT NULL COMMENT 'jos_menus.id'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_menus_ucategories`
--

INSERT INTO `jos_menus_ucategories` (`id`, `user_subcat_id`, `menu_id`) VALUES
(1, 1, 12),
(2, 2, 12),
(3, 1, 22),
(4, 2, 22),
(5, 1, 5),
(6, 1, 6),
(7, 1, 7);

-- --------------------------------------------------------

--
-- Table structure for table `jos_requests`
--

CREATE TABLE `jos_requests` (
  `id` int(11) NOT NULL,
  `request_id` text NOT NULL,
  `status_id` int(11) NOT NULL COMMENT 'jos_req_statuses.id',
  `client_id` int(11) NOT NULL COMMENT 'jos_users.id',
  `created_by` int(11) NOT NULL COMMENT 'jos_users.id',
  `created_on` datetime NOT NULL,
  `modified_by` int(11) NOT NULL COMMENT 'jos_users.id',
  `modified_on` datetime NOT NULL,
  `assignee` int(11) NOT NULL COMMENT 'jos_users.id',
  `approver` int(11) NOT NULL COMMENT 'jos_users.id'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jos_req_jobs`
--

CREATE TABLE `jos_req_jobs` (
  `id` int(11) NOT NULL,
  `req_id` int(11) NOT NULL COMMENT 'jos_requests.id',
  `job_type_id` int(11) NOT NULL COMMENT 'jos_req_job_types.id',
  `client_remark` text NOT NULL,
  `assignee_remark` text NOT NULL,
  `item_id` int(11) NOT NULL COMMENT 'jos_storage_items.id',
  `item_quantity` int(11) NOT NULL,
  `item_quantity_details` text NOT NULL,
  `item_price` float NOT NULL,
  `item_discount` float NOT NULL,
  `item_total` float NOT NULL,
  `service_charge` float NOT NULL,
  `vat` float NOT NULL,
  `total` float NOT NULL,
  `started_on` datetime NOT NULL,
  `ended_on` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jos_req_job_types`
--

CREATE TABLE `jos_req_job_types` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `created_by` int(11) NOT NULL COMMENT 'jos_users.id',
  `created_on` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jos_req_statuses`
--

CREATE TABLE `jos_req_statuses` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `display_name` text NOT NULL,
  `css_id` int(11) NOT NULL COMMENT 'jos_bootstrap_css.id',
  `created_by` int(11) NOT NULL COMMENT 'jos_users.id',
  `created_on` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_req_statuses`
--

INSERT INTO `jos_req_statuses` (`id`, `name`, `display_name`, `css_id`, `created_by`, `created_on`) VALUES
(1, 'assigned', 'Assigned', 3, 1, '0000-00-00 00:00:00'),
(2, 'inprogress', 'InProgress', 4, 1, '0000-00-00 00:00:00'),
(3, 'closed', 'Closed', 5, 1, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `jos_req_vehicles`
--

CREATE TABLE `jos_req_vehicles` (
  `id` int(11) NOT NULL,
  `req_id` int(11) NOT NULL COMMENT 'jos_requests.id',
  `vehicle_type` text NOT NULL,
  `vehicle_no` text NOT NULL,
  `model_no` text NOT NULL,
  `chasis_no` text NOT NULL,
  `engine_no` text NOT NULL,
  `manufactured_year` int(4) NOT NULL,
  `odometer_reading` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jos_states`
--

CREATE TABLE `jos_states` (
  `id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL COMMENT 'jos_countries.id',
  `name` text NOT NULL,
  `display_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_states`
--

INSERT INTO `jos_states` (`id`, `country_id`, `name`, `display_name`) VALUES
(1, 1, 'andaman_and_nicobar', 'Andaman and Nicobar'),
(2, 1, 'andhra_pradesh', 'Andhra Pradesh'),
(3, 1, 'arunachal_pradesh', 'Arunachal Pradesh'),
(4, 1, 'assam', 'Assam'),
(5, 1, 'bihar', 'Bihar'),
(6, 1, 'chandigarh', 'Chandigarh'),
(7, 1, 'chhattisgarh', 'Chhattisgarh'),
(8, 1, 'dadra_and_nagar_haveli', 'Dadra and Nagar Haveli'),
(9, 1, 'daman_and_diu', 'Daman and Diu'),
(10, 1, 'delhi', 'Delhi'),
(11, 1, 'goa', 'Goa'),
(12, 1, 'gujarat', 'Gujarat'),
(13, 1, 'haryana', 'Haryana'),
(14, 1, 'himachal_pradesh', 'Himachal Pradesh'),
(15, 1, 'jammu_and_kashmir', 'Jammu and Kashmir'),
(16, 1, 'jharkhand', 'Jharkhand'),
(17, 1, 'karnataka', 'Karnataka'),
(18, 1, 'kerala', 'Kerala'),
(19, 1, 'lakshadweep', 'Lakshadweep'),
(20, 1, 'madhya_pradesh', 'Madhya Pradesh'),
(21, 1, 'maharashtra', 'Maharashtra'),
(22, 1, 'manipur', 'Manipur'),
(23, 1, 'meghalaya', 'Meghalaya'),
(24, 1, 'mizoram', 'Mizoram'),
(25, 1, 'odisha', 'Odisha'),
(26, 1, 'puducherry', 'Puducherry'),
(27, 1, 'punjab', 'Punjab'),
(28, 1, 'rajasthan', 'Rajasthan'),
(29, 1, 'sikkim', 'Sikkim'),
(30, 1, 'tamil_nadu', 'Tamil Nadu'),
(31, 1, 'telangana', 'Telangana'),
(32, 1, 'tripura', 'Tripura'),
(33, 1, 'uttar_pradesh', 'Uttar Pradesh'),
(34, 1, 'uttarakhand', 'Uttarakhand'),
(35, 1, 'west_bengal', 'West Bengal');

-- --------------------------------------------------------

--
-- Table structure for table `jos_storage_items`
--

CREATE TABLE `jos_storage_items` (
  `id` int(11) NOT NULL,
  `cat_id` int(11) NOT NULL COMMENT 'jos_storage_item_categories.id',
  `code` text NOT NULL,
  `name` text NOT NULL,
  `display_name` text NOT NULL,
  `created_by` int(11) NOT NULL COMMENT 'jos_users.id',
  `created_on` datetime NOT NULL,
  `modified_by` int(11) NOT NULL COMMENT 'jos_users.id',
  `modified_on` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jos_storage_item_categories`
--

CREATE TABLE `jos_storage_item_categories` (
  `id` int(11) NOT NULL,
  `code` text NOT NULL,
  `name` text NOT NULL,
  `display_name` text NOT NULL,
  `created_by` int(11) NOT NULL COMMENT 'jos_users.id',
  `created_on` datetime NOT NULL,
  `modified_by` int(11) NOT NULL COMMENT 'jos_users.id',
  `modified_on` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jos_storage_item_invoices`
--

CREATE TABLE `jos_storage_item_invoices` (
  `id` int(11) NOT NULL,
  `code` text NOT NULL,
  `sup_id` int(11) NOT NULL COMMENT 'jos_suppliers.id',
  `item_id` int(11) NOT NULL COMMENT 'jos_storage_items.id',
  `quantity` int(11) NOT NULL,
  `price` float NOT NULL,
  `service_tax` float NOT NULL,
  `total` float NOT NULL,
  `offer_price` float NOT NULL,
  `ordered_by` int(11) NOT NULL COMMENT 'jos_users.id',
  `ordered_on` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jos_storage_item_payments`
--

CREATE TABLE `jos_storage_item_payments` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL COMMENT 'jos_storage_item_invoices.id',
  `payment_mode` int(11) NOT NULL COMMENT 'jos_storage_item_payment_modes.id',
  `cheque_no` int(10) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_amount` float NOT NULL,
  `paid_by` int(11) NOT NULL COMMENT 'jos_users.id'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jos_storage_item_payment_modes`
--

CREATE TABLE `jos_storage_item_payment_modes` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `display_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_storage_item_payment_modes`
--

INSERT INTO `jos_storage_item_payment_modes` (`id`, `name`, `display_name`) VALUES
(1, 'cash', 'Cash'),
(2, 'cheque', 'Cheque');

-- --------------------------------------------------------

--
-- Table structure for table `jos_storage_item_sold`
--

CREATE TABLE `jos_storage_item_sold` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL COMMENT 'jos_storage_item_invoices.id',
  `quantity_count` int(11) NOT NULL,
  `is_sold` int(1) NOT NULL COMMENT 'Unsold: 0, Sold: 1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jos_suppliers`
--

CREATE TABLE `jos_suppliers` (
  `id` int(11) NOT NULL,
  `code` text NOT NULL,
  `name` text NOT NULL,
  `display_name` text NOT NULL,
  `contact_no` text NOT NULL,
  `email_id` text NOT NULL,
  `address` text NOT NULL,
  `created_by` int(11) NOT NULL COMMENT 'jos_users.id',
  `created_on` datetime NOT NULL,
  `modified_by` int(11) NOT NULL COMMENT 'jos_users.id',
  `modified_on` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jos_users`
--

CREATE TABLE `jos_users` (
  `id` int(11) NOT NULL,
  `user_cat_id` int(11) NOT NULL COMMENT 'jos_user_categories.id',
  `user_subcat_id` int(11) NOT NULL COMMENT 'jos_user_category_details.id',
  `name` text NOT NULL,
  `display_name` text NOT NULL,
  `username` varchar(25) NOT NULL,
  `tpassword` varchar(25) NOT NULL,
  `password` text NOT NULL,
  `created_by` int(11) NOT NULL COMMENT 'jos_users.id',
  `created_on` datetime NOT NULL,
  `modified_by` int(11) NOT NULL COMMENT 'jos_users.id',
  `modified_on` datetime NOT NULL,
  `last_logged_on` datetime NOT NULL,
  `block` int(1) NOT NULL DEFAULT '0' COMMENT 'Active: 0, Inactive: 1',
  `visiting_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_users`
--

INSERT INTO `jos_users` (`id`, `user_cat_id`, `user_subcat_id`, `name`, `display_name`, `username`, `tpassword`, `password`, `created_by`, `created_on`, `modified_by`, `modified_on`, `last_logged_on`, `block`, `visiting_count`) VALUES
(1, 1, 1, 'super_admin', 'Super Admin', 'EGE0001', 'password', '5f4dcc3b5aa765d61d8327deb882cf99', 1, '2017-03-01 00:00:00', 1, '2017-07-15 23:52:40', '2018-01-05 21:04:11', 0, 1013);

-- --------------------------------------------------------

--
-- Table structure for table `jos_user_categories`
--

CREATE TABLE `jos_user_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(25) NOT NULL,
  `display_name` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_user_categories`
--

INSERT INTO `jos_user_categories` (`id`, `name`, `display_name`) VALUES
(1, 'superadmin', 'Superadmin'),
(2, 'admin', 'Admin'),
(3, 'employee', 'Employee'),
(4, 'client', 'Client');

-- --------------------------------------------------------

--
-- Table structure for table `jos_user_category_details`
--

CREATE TABLE `jos_user_category_details` (
  `id` int(11) NOT NULL,
  `user_cat_id` int(11) NOT NULL COMMENT 'jos_user_categories.id',
  `name` text NOT NULL,
  `display_name` text NOT NULL,
  `display_order` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_user_category_details`
--

INSERT INTO `jos_user_category_details` (`id`, `user_cat_id`, `name`, `display_name`, `display_order`) VALUES
(1, 1, 'superadmin', 'Superadmin', 1),
(2, 2, 'admin', 'Admin', 1),
(3, 3, 'employee', 'Employee', 1),
(4, 4, 'client', 'Client', 1),
(8, 3, 'receptionist', 'Receptionist', 2),
(9, 3, 'supervisor', 'Supervisor', 3),
(10, 3, 'technician', 'Technician', 4),
(11, 3, 'mechanic', 'Mechanic', 5);

-- --------------------------------------------------------

--
-- Table structure for table `jos_user_contact`
--

CREATE TABLE `jos_user_contact` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'jos_users.id',
  `mobile_no` bigint(10) NOT NULL,
  `alt_mobile_no` bigint(10) NOT NULL,
  `email_id` text NOT NULL,
  `alt_email_id` text NOT NULL,
  `present_add_line1` text NOT NULL,
  `present_add_line2` text NOT NULL,
  `present_add_landmark` text NOT NULL,
  `present_add_country_id` int(11) NOT NULL COMMENT 'jos_countries.id',
  `present_add_state_id` int(11) NOT NULL COMMENT 'jos_states.id',
  `present_add_district_id` int(11) NOT NULL COMMENT 'jos_districts.id',
  `present_add_pincode` bigint(20) NOT NULL,
  `permanent_add_line1` text NOT NULL,
  `permanent_add_line2` text NOT NULL,
  `permanent_add_landmark` text NOT NULL,
  `permanent_add_country_id` int(11) NOT NULL COMMENT 'jos_countries.id',
  `permanent_add_state_id` int(11) NOT NULL COMMENT 'jos_states.id',
  `permanent_add_district_id` int(11) NOT NULL COMMENT 'jos_districts.id',
  `permanent_add_pincode` bigint(6) NOT NULL,
  `company` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_user_contact`
--

INSERT INTO `jos_user_contact` (`id`, `user_id`, `mobile_no`, `alt_mobile_no`, `email_id`, `alt_email_id`, `present_add_line1`, `present_add_line2`, `present_add_landmark`, `present_add_country_id`, `present_add_state_id`, `present_add_district_id`, `present_add_pincode`, `permanent_add_line1`, `permanent_add_line2`, `permanent_add_landmark`, `permanent_add_country_id`, `permanent_add_state_id`, `permanent_add_district_id`, `permanent_add_pincode`, `company`) VALUES
(1, 1, 9988776655, 9888776655, 'ege0001@gmail.com', 'ege1001@gmail.com', '1-123', '2-123', 'Nanda Nagar', 0, 0, 0, 0, 'a', '', '', 0, 0, 0, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `jos_user_employee_details`
--

CREATE TABLE `jos_user_employee_details` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'jos_users_id',
  `salary` float NOT NULL COMMENT 'Salary per annum',
  `leave_balance` int(11) NOT NULL,
  `extra_hours_worked` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_user_employee_details`
--

INSERT INTO `jos_user_employee_details` (`id`, `user_id`, `salary`, `leave_balance`, `extra_hours_worked`) VALUES
(1, 1, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `jos_user_personal_details`
--

CREATE TABLE `jos_user_personal_details` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'jos_users.id',
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `gender` int(1) NOT NULL COMMENT 'Male: 0, Female: 1',
  `dob` date NOT NULL,
  `place_of_birth` text NOT NULL,
  `marital_status` int(1) NOT NULL COMMENT 'Unmarried: 0, Married: 1',
  `photo_id_proof_name` text NOT NULL,
  `photo_id_proof_id` text NOT NULL,
  `address_id_proof_name` text NOT NULL,
  `address_id_proof_id` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jos_user_personal_details`
--

INSERT INTO `jos_user_personal_details` (`id`, `user_id`, `first_name`, `last_name`, `gender`, `dob`, `place_of_birth`, `marital_status`, `photo_id_proof_name`, `photo_id_proof_id`, `address_id_proof_name`, `address_id_proof_id`) VALUES
(1, 1, 'Super', 'Admin', 0, '2013-08-01', '', 0, '', '', '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jos_app`
--
ALTER TABLE `jos_app`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_bootstrap_css`
--
ALTER TABLE `jos_bootstrap_css`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_countries`
--
ALTER TABLE `jos_countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_districts`
--
ALTER TABLE `jos_districts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `state_id` (`state_id`);

--
-- Indexes for table `jos_establishments`
--
ALTER TABLE `jos_establishments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_menus`
--
ALTER TABLE `jos_menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_menus_ucategories`
--
ALTER TABLE `jos_menus_ucategories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indexes for table `jos_requests`
--
ALTER TABLE `jos_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jos_requests_ibfk_1` (`status_id`),
  ADD KEY `jos_requests_ibfk_2` (`client_id`),
  ADD KEY `jos_requests_ibfk_3` (`created_by`),
  ADD KEY `jos_requests_ibfk_4` (`assignee`),
  ADD KEY `jos_requests_ibfk_5` (`approver`);

--
-- Indexes for table `jos_req_jobs`
--
ALTER TABLE `jos_req_jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jos_req_jobs_ibfk_1` (`req_id`),
  ADD KEY `jos_req_jobs_ibfk_2` (`job_type_id`);

--
-- Indexes for table `jos_req_job_types`
--
ALTER TABLE `jos_req_job_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jos_req_job_types_ibfk_1` (`created_by`);

--
-- Indexes for table `jos_req_statuses`
--
ALTER TABLE `jos_req_statuses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jos_req_statuses_ibfk_1` (`created_by`);

--
-- Indexes for table `jos_req_vehicles`
--
ALTER TABLE `jos_req_vehicles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jos_req_vehicles_ibfk_1` (`req_id`);

--
-- Indexes for table `jos_states`
--
ALTER TABLE `jos_states`
  ADD PRIMARY KEY (`id`),
  ADD KEY `country_id` (`country_id`);

--
-- Indexes for table `jos_storage_items`
--
ALTER TABLE `jos_storage_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_storage_item_categories`
--
ALTER TABLE `jos_storage_item_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_storage_item_invoices`
--
ALTER TABLE `jos_storage_item_invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_storage_item_payments`
--
ALTER TABLE `jos_storage_item_payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_storage_item_payment_modes`
--
ALTER TABLE `jos_storage_item_payment_modes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_storage_item_sold`
--
ALTER TABLE `jos_storage_item_sold`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_suppliers`
--
ALTER TABLE `jos_suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_users`
--
ALTER TABLE `jos_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_cat_id` (`user_cat_id`);

--
-- Indexes for table `jos_user_categories`
--
ALTER TABLE `jos_user_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_user_category_details`
--
ALTER TABLE `jos_user_category_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_user_contact`
--
ALTER TABLE `jos_user_contact`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `jos_user_employee_details`
--
ALTER TABLE `jos_user_employee_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jos_user_personal_details`
--
ALTER TABLE `jos_user_personal_details`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jos_app`
--
ALTER TABLE `jos_app`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `jos_bootstrap_css`
--
ALTER TABLE `jos_bootstrap_css`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `jos_countries`
--
ALTER TABLE `jos_countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `jos_districts`
--
ALTER TABLE `jos_districts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=677;
--
-- AUTO_INCREMENT for table `jos_establishments`
--
ALTER TABLE `jos_establishments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `jos_menus`
--
ALTER TABLE `jos_menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT for table `jos_menus_ucategories`
--
ALTER TABLE `jos_menus_ucategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `jos_requests`
--
ALTER TABLE `jos_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `jos_req_jobs`
--
ALTER TABLE `jos_req_jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `jos_req_job_types`
--
ALTER TABLE `jos_req_job_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `jos_req_statuses`
--
ALTER TABLE `jos_req_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `jos_req_vehicles`
--
ALTER TABLE `jos_req_vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `jos_states`
--
ALTER TABLE `jos_states`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
--
-- AUTO_INCREMENT for table `jos_storage_items`
--
ALTER TABLE `jos_storage_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `jos_storage_item_categories`
--
ALTER TABLE `jos_storage_item_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `jos_storage_item_invoices`
--
ALTER TABLE `jos_storage_item_invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `jos_storage_item_payments`
--
ALTER TABLE `jos_storage_item_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `jos_storage_item_payment_modes`
--
ALTER TABLE `jos_storage_item_payment_modes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `jos_storage_item_sold`
--
ALTER TABLE `jos_storage_item_sold`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `jos_suppliers`
--
ALTER TABLE `jos_suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `jos_users`
--
ALTER TABLE `jos_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `jos_user_categories`
--
ALTER TABLE `jos_user_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `jos_user_category_details`
--
ALTER TABLE `jos_user_category_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `jos_user_contact`
--
ALTER TABLE `jos_user_contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `jos_user_employee_details`
--
ALTER TABLE `jos_user_employee_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `jos_user_personal_details`
--
ALTER TABLE `jos_user_personal_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `jos_districts`
--
ALTER TABLE `jos_districts`
  ADD CONSTRAINT `jos_districts_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `jos_states` (`id`);

--
-- Constraints for table `jos_menus_ucategories`
--
ALTER TABLE `jos_menus_ucategories`
  ADD CONSTRAINT `jos_menus_ucategories_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `jos_menus` (`id`);

--
-- Constraints for table `jos_requests`
--
ALTER TABLE `jos_requests`
  ADD CONSTRAINT `jos_requests_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `jos_req_statuses` (`id`),
  ADD CONSTRAINT `jos_requests_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `jos_users` (`id`),
  ADD CONSTRAINT `jos_requests_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `jos_users` (`id`),
  ADD CONSTRAINT `jos_requests_ibfk_4` FOREIGN KEY (`assignee`) REFERENCES `jos_users` (`id`),
  ADD CONSTRAINT `jos_requests_ibfk_5` FOREIGN KEY (`approver`) REFERENCES `jos_users` (`id`);

--
-- Constraints for table `jos_req_jobs`
--
ALTER TABLE `jos_req_jobs`
  ADD CONSTRAINT `jos_req_jobs_ibfk_1` FOREIGN KEY (`req_id`) REFERENCES `jos_requests` (`id`),
  ADD CONSTRAINT `jos_req_jobs_ibfk_2` FOREIGN KEY (`job_type_id`) REFERENCES `jos_req_job_types` (`id`);

--
-- Constraints for table `jos_req_job_types`
--
ALTER TABLE `jos_req_job_types`
  ADD CONSTRAINT `jos_req_job_types_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `jos_users` (`id`);

--
-- Constraints for table `jos_req_statuses`
--
ALTER TABLE `jos_req_statuses`
  ADD CONSTRAINT `jos_req_statuses_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `jos_users` (`id`);

--
-- Constraints for table `jos_req_vehicles`
--
ALTER TABLE `jos_req_vehicles`
  ADD CONSTRAINT `jos_req_vehicles_ibfk_1` FOREIGN KEY (`req_id`) REFERENCES `jos_requests` (`id`);

--
-- Constraints for table `jos_states`
--
ALTER TABLE `jos_states`
  ADD CONSTRAINT `jos_states_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `jos_countries` (`id`);

--
-- Constraints for table `jos_users`
--
ALTER TABLE `jos_users`
  ADD CONSTRAINT `jos_users_ibfk_1` FOREIGN KEY (`user_cat_id`) REFERENCES `jos_user_categories` (`id`);

--
-- Constraints for table `jos_user_contact`
--
ALTER TABLE `jos_user_contact`
  ADD CONSTRAINT `jos_user_contact_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `jos_users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
