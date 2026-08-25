
CREATE TABLE `employees` (
    `id` VARCHAR(191) NOT NULL,
    `employee_code` VARCHAR(32) NOT NULL,
    `full_name` VARCHAR(200) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `job_title` VARCHAR(150) NOT NULL,
    `country` CHAR(2) NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `hire_date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `employees_employee_code_key`(`employee_code`),
    INDEX `employees_country_idx`(`country`),
    INDEX `employees_department_idx`(`department`),
    INDEX `employees_status_idx`(`status`),
    INDEX `employees_full_name_idx`(`full_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `compensation_records` (
    `id` VARCHAR(191) NOT NULL,
    `employee_id` VARCHAR(191) NOT NULL,
    `annual_base` DECIMAL(14, 2) NOT NULL,
    `currency` CHAR(3) NOT NULL,
    `effective_from` DATE NOT NULL,
    `effective_to` DATE NULL,
    `notes` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `compensation_records_employee_id_effective_to_idx`(`employee_id`, `effective_to`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `fx_rates` (
    `id` VARCHAR(191) NOT NULL,
    `from_currency` CHAR(3) NOT NULL,
    `to_currency` CHAR(3) NOT NULL,
    `rate` DECIMAL(18, 8) NOT NULL,
    `as_of_date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `fx_rates_from_currency_to_currency_as_of_date_key`(`from_currency`, `to_currency`, `as_of_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


ALTER TABLE `compensation_records` ADD CONSTRAINT `compensation_records_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
