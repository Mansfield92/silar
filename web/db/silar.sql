-- phpMyAdmin SQL Dump
-- version 4.4.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 13, 2015 at 11:52 PM
-- Server version: 5.6.26
-- PHP Version: 5.6.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `silar`
--

-- --------------------------------------------------------

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
CREATE TABLE IF NOT EXISTS `answer` (
  `id_answer` int(10) NOT NULL,
  `id_question` int(10) NOT NULL,
  `answer` varchar(200) COLLATE utf8_czech_ci NOT NULL,
  `correct` varchar(10) COLLATE utf8_czech_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Dumping data for table `answer`
--

INSERT INTO `answer` (`id_answer`, `id_question`, `answer`, `correct`) VALUES
(9, 4, 'Ano', 'false'),
(10, 4, 'Ne', 'true'),
(11, 5, 'Good song', 'false'),
(12, 5, 'Great song', 'true'),
(13, 5, 'Shit', 'false'),
(14, 6, 'Marian', 'true'),
(15, 6, 'Ja ', 'false'),
(16, 6, 'Nekdo jinej :)', 'false'),
(28, 11, 'Ano', 'true'),
(29, 12, '1', 'false'),
(30, 12, '2', 'true'),
(31, 12, '3', 'false'),
(32, 12, '4', 'false'),
(33, 13, 'Já', 'true'),
(34, 13, 'Marián', 'false'),
(35, 13, 'Tvoje máma', 'false'),
(36, 13, 'Moje máma', 'false'),
(37, 14, 'Nikol', 'true'),
(38, 14, 'Pája', 'true'),
(39, 14, 'Terka', 'true'),
(40, 14, 'Anie', 'true'),
(41, 15, 'Proč ne', 'false'),
(42, 15, 'Protože bagr', 'false'),
(43, 15, 'Mám rád challenge', 'true'),
(44, 16, 'Ano', 'true'),
(45, 16, 'Ne', 'false'),
(46, 17, 'Ano', 'true'),
(47, 17, 'Ne', 'false'),
(48, 18, 'Ano', 'true'),
(49, 18, 'Ne', 'false'),
(50, 19, 'Ano', 'true'),
(51, 19, 'Ne', 'false'),
(52, 20, 'Ano', 'true'),
(53, 20, 'Ne', 'false'),
(54, 20, 'Mozna', 'true');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
CREATE TABLE IF NOT EXISTS `questions` (
  `id_question` int(10) NOT NULL,
  `question_name` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `points` int(10) NOT NULL,
  `id_test` int(10) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id_question`, `question_name`, `points`, `id_test`) VALUES
(4, 'Kdo je pan', 5, 17),
(5, 'Miss Atomic bomb?', 3, 17),
(6, 'Kdyz whisky, tak s ledem?', 3, 17),
(11, 'Jsem pan?', 4, 20),
(12, '1+1', 2, 20),
(13, 'Kdo je pán', 5, 21),
(14, 'Jakou z těchto dívek jsem píchal', 4, 21),
(15, 'Proč to dělám v nodejs?', 7, 21),
(16, 'Stihnes to? :D', 2, 22),
(17, 'Ano', 5, 23),
(18, 'Otazk', 5, 24),
(19, 'Otazka 2', 3, 24),
(20, 'Dalsi otazka', 4, 24);

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
CREATE TABLE IF NOT EXISTS `results` (
  `id_result` int(10) NOT NULL,
  `id_user` int(10) NOT NULL,
  `id_test` int(10) NOT NULL,
  `points` varchar(20) COLLATE utf8_czech_ci NOT NULL,
  `splnen` varchar(10) COLLATE utf8_czech_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Dumping data for table `results`
--

INSERT INTO `results` (`id_result`, `id_user`, `id_test`, `points`, `splnen`) VALUES
(10, 2, 20, '0/6', 'false'),
(11, 2, 17, '3/11', 'false'),
(12, 2, 24, '12/12', 'true'),
(13, 3, 24, '12/12', 'true'),
(14, 3, 22, '2/2', 'true'),
(15, 3, 21, '9/16', 'false'),
(16, 3, 20, '6/6', 'true'),
(17, 2, 22, '2/2', 'true'),
(18, 2, 23, '5/5', 'true'),
(19, 2, 21, '16/16', 'true');

-- --------------------------------------------------------

--
-- Table structure for table `tests`
--

DROP TABLE IF EXISTS `tests`;
CREATE TABLE IF NOT EXISTS `tests` (
  `id_test` int(10) NOT NULL,
  `name` varchar(64) COLLATE utf8_czech_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Dumping data for table `tests`
--

INSERT INTO `tests` (`id_test`, `name`) VALUES
(23, 'Coze?'),
(20, 'Dopici'),
(22, 'Expired'),
(24, 'Novej'),
(17, 'Test1'),
(21, 'Test3');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int(10) NOT NULL,
  `nick` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `pw` varchar(100) COLLATE utf8_czech_ci NOT NULL,
  `fullname` varchar(64) COLLATE utf8_czech_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `nick`, `pw`, `fullname`) VALUES
(1, 'admin', '3e3a378c63aa1e55e3e9ae9d2bdcd6a1', 'Son of a bitch'),
(2, 'pica', '97edfa43843271c6a4146d888ba9696f', 'Konomrd :D'),
(3, 'user', '3e3a378c63aa1e55e3e9ae9d2bdcd6a1', 'Uzivatel psi kunda');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answer`
--
ALTER TABLE `answer`
  ADD PRIMARY KEY (`id_answer`),
  ADD KEY `index_answer` (`id_question`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id_question`),
  ADD KEY `fore-test` (`id_test`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`id_result`),
  ADD KEY `for-test` (`id_test`),
  ADD KEY `for-user` (`id_user`);

--
-- Indexes for table `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`id_test`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answer`
--
ALTER TABLE `answer`
  MODIFY `id_answer` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=55;
--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id_question` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `id_result` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `tests`
--
ALTER TABLE `tests`
  MODIFY `id_test` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `answer`
--
ALTER TABLE `answer`
  ADD CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`id_question`) REFERENCES `questions` (`id_question`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`id_test`) REFERENCES `tests` (`id_test`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `results`
--
ALTER TABLE `results`
  ADD CONSTRAINT `results_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `results_ibfk_2` FOREIGN KEY (`id_test`) REFERENCES `tests` (`id_test`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
