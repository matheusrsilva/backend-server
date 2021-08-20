-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema pastebin
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pastebin
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pastebin` DEFAULT CHARACTER SET latin1 ;
USE `pastebin` ;

-- -----------------------------------------------------
-- Table `pastebin`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pastebin`.`user` ;

CREATE TABLE IF NOT EXISTS `pastebin`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  `fullname` VARCHAR(100) NOT NULL,
  `date_of_birth` DATE NULL DEFAULT NULL,
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `pastebin`.`post`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pastebin`.`post` ;

CREATE TABLE IF NOT EXISTS `pastebin`.`post` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `content` TEXT NOT NULL,
  `private` TINYINT(4) NULL DEFAULT NULL,
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_post_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `pastebin`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_post_user` ON `pastebin`.`post` (`user_id` ASC);


-- -----------------------------------------------------
-- Table `pastebin`.`token`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pastebin`.`token` ;

CREATE TABLE IF NOT EXISTS `pastebin`.`token` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `token` VARCHAR(45) NOT NULL,
  `expiration` DATETIME NOT NULL,
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_token_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `pastebin`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE UNIQUE INDEX `token_UNIQUE` ON `pastebin`.`token` (`token` ASC);

CREATE INDEX `fk_token_user1_idx` ON `pastebin`.`token` (`user_id` ASC);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
