CREATE TABLE `charword` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `version` int NOT NULL,
  `charWordId` varchar(255) NOT NULL,
  `charId` int NOT NULL,
  `data` json NOT NULL COMMENT '干员台词数据，对应character_table',
  UNIQUE INDEX `IDX_bcfee1e078a3ce38ebd1147b50` (`charWordId`),
  PRIMARY KEY (`id`)
) ENGINE = InnoDB