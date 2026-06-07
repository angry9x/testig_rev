-- Data Awal untuk Lanjar Mulia E-Commerce
USE lanjar_mulia_db;

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Admin Lanjar Mulia', 'admin@lanjarmulia.com', '081234567890', '$2b$12$gZvdVtP97AYPUzr7B1KKwuNH4/QqOc7OPsF9QnQX6QP1cyXiOptw.', 'admin', '2026-06-03 15:42:40', '2026-06-03 15:42:40');

-- Seeding table: categories
INSERT INTO `categories` (`id`, `name`, `description`, `created_at`) VALUES
(4, 'Sweet Lavender', 'Melon varietas Sweet Lavender', '2026-06-03 15:42:40'),
(5, 'Sweet Net', 'Melon varietas Sweet Net', '2026-06-03 15:42:40'),
(6, 'Reguler', 'Melon kualitas reguler', '2026-06-03 15:42:40'),
(7, 'Premium', 'Melon kualitas premium', '2026-06-03 15:42:40');

-- Seeding table: products
INSERT INTO `products` (`id`, `name`, `description`, `price`, `stock`, `image_url`, `is_available`, `created_at`, `updated_at`) VALUES
(1, 'Lavender Melon Premium', 'Melon Lavender Premium dengan kualitas terbaik, daging buah renyah, manis tinggi, dan aroma segar khas. Cocok untuk konsumsi premium maupun hadiah.', 40000.00, 0, '/static/images/20260606013412_Lavender_premium.png', 1, '2026-06-03 15:42:40', '2026-06-05 18:34:12'),
(2, 'Lavender Melon Reguler', 'Melon Lavender dengan rasa manis dan segar, tekstur juicy, serta kualitas baik untuk konsumsi sehari-hari dengan harga lebih ekonomis.', 35000.00, 0, '/static/images/20260606013433_Lavender_Reguler.png', 1, '2026-06-03 15:42:40', '2026-06-05 18:34:33'),
(3, 'Sweet Net Melon Premium', 'Melon Sweet Net Premium memiliki jaring yang rapi, rasa sangat manis, tekstur renyah, dan kesegaran optimal. Pilihan tepat untuk buah premium.', 35000.00, 0, '/static/images/20260606013448_SweetNet_Premium.png', 1, '2026-06-03 15:42:40', '2026-06-05 18:34:48'),
(5, 'Sweet Net Melon Reguler', 'Melon Sweet Net dengan rasa manis alami, segar, dan berair. Cocok untuk kebutuhan harian, jus, maupun salad buah dengan harga terjangkau', 30000.00, 0, '/static/images/20260606013511_SweetNet_Reguler.png', 1, '2026-06-03 15:42:40', '2026-06-05 18:35:11');

-- Seeding table: product_categories (Relasi Many-to-Many)
INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES
(1, 4),
(1, 7),
(2, 4),
(2, 6),
(3, 5),
(3, 7),
(5, 5),
(5, 6);

COMMIT;