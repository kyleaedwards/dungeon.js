# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.17)
# Database: mud
# Generation Time: 2017-03-19 05:36:54 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table roles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `role` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;

INSERT INTO `roles` (`id`, `role`)
VALUES
	(1,'player'),
	(2,'creator'),
	(3,'admin');

/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table room_connections
# ------------------------------------------------------------

DROP TABLE IF EXISTS `room_connections`;

CREATE TABLE `room_connections` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fromId` int(11) unsigned NOT NULL,
  `toId` int(11) unsigned NOT NULL,
  `direction` varchar(11) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

LOCK TABLES `room_connections` WRITE;
/*!40000 ALTER TABLE `room_connections` DISABLE KEYS */;

INSERT INTO `room_connections` (`id`, `fromId`, `toId`, `direction`)
VALUES
	(12,1,14,'south'),
	(13,14,1,'north'),
	(14,14,15,'south'),
	(15,15,14,'north'),
	(16,14,16,'up'),
	(17,16,14,'down');

/*!40000 ALTER TABLE `room_connections` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rooms
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rooms`;

CREATE TABLE `rooms` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `shortDesc` varchar(140) DEFAULT NULL,
  `longDesc` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;

INSERT INTO `rooms` (`id`, `shortDesc`, `longDesc`)
VALUES
	(1,'The Center of the Universe','It appears that you are in a minuscule broom closet in the basement of a hotel, but something deep inside your soul tells you this is the exact center of the universe.'),
	(14,'Dark Hallway','A dark hallway leads through the basement between a broom closet and the laundry room. The hanging light bulb flickers like a scene straight out of the horror film, but there\'s probably nothing to be scared of. Stairs lead up to the lobby.'),
	(15,'Laundry Room','A few machines churn dirty laundry in gray water, and the smell of bleach burns your nostrils. You can\'t help wonder why you\'re down here.'),
	(16,'The Lobby','You\'re in a ritzy hotel lobby decorated with a lot of brass and teak. Sure, it\'s not the most fashionable furnishings at the moment, but you can tell at some point, people really went wild for this stuff. There\'s set of stairs that lead down to the basement.');

/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table sessions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `token` varchar(36) NOT NULL DEFAULT '',
  `expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;

INSERT INTO `sessions` (`id`, `userId`, `token`, `expires`)
VALUES
	(45,2,'577aaff5-d4b2-4109-8eb3-96609d794352','2017-03-20 00:35:45'),
	(46,1,'b1359179-1d50-4c49-976f-f109a9e6d299','2017-03-20 00:35:42');

/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_roles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_roles`;

CREATE TABLE `user_roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `roleId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;

INSERT INTO `user_roles` (`id`, `userId`, `roleId`)
VALUES
	(1,1,1),
	(2,1,2),
	(3,1,3),
	(8,2,1),
	(9,2,2),
	(10,2,3);

/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_rooms
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_rooms`;

CREATE TABLE `user_rooms` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `roomId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

LOCK TABLES `user_rooms` WRITE;
/*!40000 ALTER TABLE `user_rooms` DISABLE KEYS */;

INSERT INTO `user_rooms` (`id`, `userId`, `roomId`)
VALUES
	(1,1,1),
	(7,2,1);

/*!40000 ALTER TABLE `user_rooms` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `handle` varchar(16) NOT NULL DEFAULT '',
  `lastLoggedIn` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `password` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `handle`, `lastLoggedIn`, `createdAt`, `password`)
VALUES
	(1,'kyle','2017-03-19 04:25:59','2017-02-27 00:30:35','$2a$10$IcS1TRouF/VfZ/tILV/2mevG70y0RDfncFG3nW11AxmBDA4eOmpeC'),
	(2,'admin','2017-03-19 04:25:59','2017-02-27 21:57:30','$2a$10$GqYv.izQ/qLHw60Umdc5duRLMBl7dgfNjmeIilLiBF90lYmrVpgeK');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
