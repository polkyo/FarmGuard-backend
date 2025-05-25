import os

def contains_segmentation_labels(label_file):
    """Проверяет, содержит ли файл метки полигональной сегментации."""
    try:
        with open(label_file, 'r') as f:
            for line in f:
                parts = line.strip().split()
                # Если в строке больше 5 чисел, вероятно, это сегментация
                if len(parts) > 5:
                    return True
        return False
    except FileNotFoundError:
        return False
    except Exception as e:
        print(f"Ошибка при чтении файла {label_file}: {e}")
        return False

def find_and_delete_mixed_label_files(data_dirs):
    """Находит и удаляет файлы изображений и меток, содержащие метки сегментации."""
    total_deleted_count = 0
    for data_dir in data_dirs:
        images_dir = os.path.join(data_dir, "images")
        labels_dir = os.path.join(data_dir, "labels")
        deleted_count = 0

        if not os.path.exists(images_dir) or not os.path.exists(labels_dir):
            print(f"Предупреждение: Папки 'images' или 'labels' не найдены в директории: {data_dir}")
            continue

        print(f"\nОбработка директории: {data_dir}")

        for filename in os.listdir(labels_dir):
            if filename.endswith(".txt"):
                label_file_path = os.path.join(labels_dir, filename)
                if contains_segmentation_labels(label_file_path):
                    image_name_without_ext = os.path.splitext(filename)[0]
                    possible_image_extensions = ['.jpg', '.jpeg', '.png']
                    image_deleted = False

                    for ext in possible_image_extensions:
                        image_file_path = os.path.join(images_dir, image_name_without_ext + ext)
                        if os.path.exists(image_file_path):
                            try:
                                os.remove(image_file_path)
                                print(f"  Удалено изображение: {image_file_path}")
                                image_deleted = True
                                break
                            except Exception as e:
                                print(f"  Ошибка при удалении изображения {image_file_path}: {e}")

                    try:
                        os.remove(label_file_path)
                        print(f"  Удалена метка (содержащая сегментацию): {label_file_path}")
                        deleted_count += 1
                    except Exception as e:
                        print(f"  Ошибка при удалении метки {label_file_path}: {e}")

        print(f"  В директории {data_dir} удалено {deleted_count} пар файлов (изображение + метка с сегментацией).")
        total_deleted_count += deleted_count

    print(f"\nВсего удалено {total_deleted_count} пар файлов во всех обработанных директориях.")

if __name__ == "__main__":
    data_directories = [
        "C:/yolov12/custom data/train",      # <--- Укажите правильный путь
        "C:/yolov12/custom data/valid",      # <--- Укажите правильный путь (если есть)
        "C:/yolov12/custom data/test"       # <--- Укажите правильный путь (если есть)
    ]

    find_and_delete_mixed_label_files(data_directories)