drop table if exists User;
CREATE TABLE User (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(320) NULL,
  PRIMARY KEY (id)
);