-- MySQL dump 10.13  Distrib 8.0.37, for Win64 (x86_64)
--
-- Host: localhost    Database: nourimate_mysql
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_tokens`
--

DROP TABLE IF EXISTS `auth_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_tokens` (
  `token_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `access_token_expiry` datetime DEFAULT NULL,
  `refresh_token_expiry` datetime DEFAULT NULL,
  PRIMARY KEY (`token_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `auth_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_tokens`
--

LOCK TABLES `auth_tokens` WRITE;
/*!40000 ALTER TABLE `auth_tokens` DISABLE KEYS */;
INSERT INTO `auth_tokens` VALUES (1,8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImVtYWlsIjoiYW5na2FzYXB1cmFAZ21haWwuY29tIiwiaWF0IjoxNzE1NTU0MDY3LCJleHAiOjE3MTU1NTQ5Njd9.9f_taK9MqZjC28xEg6vUJGAjzSBi0cxl7nLya80GYiA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImVtYWlsIjoiYW5na2FzYXB1cmFAZ21haWwuY29tIiwiaWF0IjoxNzE1NTU0MDY3LCJleHAiOjE3MTYxNTg4Njd9.s-NXkc78pDMY7vBF50RiQ3DbkrnIlShQwtL3CBcY17w',NULL,NULL),(2,8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImVtYWlsIjoiYW5na2FzYXB1cmFAZ21haWwuY29tIiwiaWF0IjoxNzE1NTU0MjIzLCJleHAiOjE3MTU1NTUxMjN9.qyvahuIUFtAi2TF_FsbNcvxKRI8Mh0XcNdsJ3Vp2TL4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImVtYWlsIjoiYW5na2FzYXB1cmFAZ21haWwuY29tIiwiaWF0IjoxNzE1NTU0MjIzLCJleHAiOjE3MTYxNTkwMjN9.kL23l68hIrD4DmXB8ehvaY_InePWApv5GVuOKTM-vaU','2024-05-13 06:05:24','2024-05-20 05:50:24');
/*!40000 ALTER TABLE `auth_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phoneNumber` bigint DEFAULT NULL,
  `accessToken` varchar(45) DEFAULT NULL,
  `refreshToken` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Zulian','zuliangmail.com','zulian123',82721893569,'albinx','albiny'),(2,'Anggi','anggi@gmail.com','anggi888',80812121313,NULL,NULL),(3,'Dwi Anggraini','anggidwigmail.com','anggi888',82922121313,NULL,NULL),(5,'kontol','kontolah@gmail.com','$2b$10$h/Cr7KASxRPSGaNXtETmKOB5O8zQUmH8Y9ZdWaZVl3PZY3AmNMhN6',182233445566,NULL,NULL),(6,'Anggi','anggi@gmail.com','$2b$10$ByPoXqjbE2nTMhjlvULOou0nIUneXSZ27tAm4UdHg7I/EtE9dA0.a',182233445566,NULL,NULL),(7,'Alvin Yoga','aallvviinn7@gmail.com','$2b$10$HRoVejpoUEPrV0HmAExJbOp19NFksYZmMTIS7dkl2jntBwmqgpS2i',181218135118,NULL,NULL),(8,'Rionov Faddillah','angkasapura@gmail.com','$2b$10$jgo3pVgxs4avXlRWkC3yeuE7L2kziWYjTRGLrB8OteEUKAbcE8lkO',8909876234,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-13  5:59:07
