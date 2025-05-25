import os
import glob

def has_class_one(annotation_file):
    """Проверяет, содержит ли файл аннотации хотя бы один объект класса 1."""
    with open(annotation_file, 'r') as f:
        for line in f:
            parts = line.strip().split()
            if parts and parts[0] == '2':
                return True
    return False

def find_image_file(image_dir, base_name):
    """Находит файл изображения с заданным базовым именем в директории."""
    extensions = ['.jpg', '.jpeg', '.png']  # Добавьте другие расширения, если необходимо
    for ext in extensions:
        image_path = os.path.join(image_dir, base_name + ext)
        if os.path.exists(image_path):
            return image_path
    return None

def process_dataset_part(images_path, labels_path):
    """Обрабатывает файлы аннотаций и удаляет соответствующие изображения, если нет класса 1."""
    annotation_files = glob.glob(os.path.join(labels_path, '*.txt'))
    print(f"Обработка файлов в: {labels_path}")
    deleted_count = 0
    for annotation_file in annotation_files:
        if not has_class_one(annotation_file):
            base_name = os.path.splitext(os.path.basename(annotation_file))[0]
            image_file = find_image_file(images_path, base_name)

            if image_file:
                try:
                    os.remove(annotation_file)
                    os.remove(image_file)
                    print(f"Удалены: {annotation_file}, {image_file}")
                    deleted_count += 1
                except OSError as e:
                    print(f"Ошибка при удалении {annotation_file} или {image_file}: {e}")
            else:
                print(f"Предупреждение: Не найдено соответствующее изображение для {annotation_file}")
                try:
                    os.remove(annotation_file)
                    print(f"Удален только файл аннотации: {annotation_file}")
                    deleted_count += 1
                except OSError as e:
                    print(f"Ошибка при удалении {annotation_file}: {e}")
    print(f"Завершено для: {labels_path}. Удалено {deleted_count} пар файлов (аннотация + изображение).")

if __name__ == "__main__":
    dataset_root = "C:\yolov12\custom data"  # Замените на фактический путь к корневой папке датасета

    train_images_path = os.path.join(dataset_root, "train", "images")
    train_labels_path = os.path.join(dataset_root, "train", "labels")
    val_images_path = os.path.join(dataset_root, "val", "images")
    val_labels_path = os.path.join(dataset_root, "val", "labels")
    test_images_path = os.path.join(dataset_root, "test", "images")
    test_labels_path = os.path.join(dataset_root, "test", "labels")

    process_dataset_part(train_images_path, train_labels_path)
    process_dataset_part(val_images_path, val_labels_path)
    process_dataset_part(test_images_path, test_labels_path)

    print("Обработка всех частей датасета завершена.")