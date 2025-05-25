import os
import glob

def change_class_to_one(annotation_file):
    """Изменяет индекс класса 0 на 1 в файле аннотации YOLO."""
    with open(annotation_file, 'r') as f:
        lines = f.readlines()

    updated_lines = []
    for line in lines:
        parts = line.strip().split()
        if parts and parts[0] == '1':
            parts[0] = '3'
            updated_lines.append(" ".join(parts) + "\n")
        elif parts:
            updated_lines.append(line) # Если класс не 0, оставляем как есть
        else:
            updated_lines.append("\n") # Сохраняем пустые строки

    with open(annotation_file, 'w') as f:
        f.writelines(updated_lines)

def process_dataset_part(labels_path):
    """Обрабатывает файлы аннотаций в указанной папке."""
    annotation_files = glob.glob(os.path.join(labels_path, '*.txt'))
    print(f"Обработка файлов в: {labels_path}")
    for file in annotation_files:
        change_class_to_one(file)
    print(f"Завершено для: {labels_path}")

if __name__ == "__main__":
    dataset_root = "C:\\Users\\User\\Downloads\\deer"  # Замените на фактический путь к корневой папке датасета

    train_labels_path = os.path.join(dataset_root, "train", "labels")
    val_labels_path = os.path.join(dataset_root, "valid", "labels")
    test_labels_path = os.path.join(dataset_root, "test", "labels")

    process_dataset_part(train_labels_path)
    process_dataset_part(val_labels_path)
    process_dataset_part(test_labels_path)

    print("Обработка всех файлов аннотаций завершена.")