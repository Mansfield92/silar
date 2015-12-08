-- phpMyAdmin SQL Dump
-- version 4.0.4.1
-- http://www.phpmyadmin.net
--
-- Počítač: 127.0.0.1
-- Vygenerováno: Úte 08. pro 2015, 18:19
-- Verze serveru: 5.6.11
-- Verze PHP: 5.5.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Databáze: `silar`
--
CREATE DATABASE IF NOT EXISTS `silar` DEFAULT CHARACTER SET utf8 COLLATE utf8_czech_ci;
USE `silar`;

-- --------------------------------------------------------

--
-- Struktura tabulky `answer`
--

CREATE TABLE IF NOT EXISTS `answer` (
  `id_answer` int(10) NOT NULL AUTO_INCREMENT,
  `id_question` int(10) NOT NULL,
  `answer` varchar(200) COLLATE utf8_czech_ci NOT NULL,
  `correct` varchar(10) COLLATE utf8_czech_ci NOT NULL,
  `points` int(5) NOT NULL,
  PRIMARY KEY (`id_answer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Struktura tabulky `questions`
--

CREATE TABLE IF NOT EXISTS `questions` (
  `id_question` int(10) NOT NULL AUTO_INCREMENT,
  `question_name` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `id_test` int(10) NOT NULL,
  PRIMARY KEY (`id_question`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Struktura tabulky `results`
--

CREATE TABLE IF NOT EXISTS `results` (
  `id_result` int(10) NOT NULL AUTO_INCREMENT,
  `id_user` int(10) NOT NULL,
  `id_test` int(10) NOT NULL,
  `points` int(5) NOT NULL,
  PRIMARY KEY (`id_result`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Struktura tabulky `tests`
--

CREATE TABLE IF NOT EXISTS `tests` (
  `id_test` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `timelimit` int(5) NOT NULL,
  PRIMARY KEY (`id_test`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Struktura tabulky `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int(10) NOT NULL AUTO_INCREMENT,
  `nick` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `pw` varchar(100) COLLATE utf8_czech_ci NOT NULL,
  `fullname` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `nick` (`nick`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci AUTO_INCREMENT=3 ;

--
-- Vypisuji data pro tabulku `users`
--

INSERT INTO `users` (`id_user`, `nick`, `pw`, `fullname`) VALUES
(1, 'admin', '3e3a378c63aa1e55e3e9ae9d2bdcd6a1', 'Son of a bitch'),
(2, 'pica', '97edfa43843271c6a4146d888ba9696f', 'Konomrd :D');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
