import torch
torch.backends.cudnn.benchmark = True


if __name__ == '__main__':
    from ultralytics import YOLO
    import torch

    # Проверка доступности CUDA (необязательно)
    print(f"CUDA Available: {torch.cuda.is_available()}")
    print(f"Number of CUDA Devices: {torch.cuda.device_count()}")
    if torch.cuda.is_available():
        print(f"CUDA Device Name: {torch.cuda.get_device_name(0)}")

    



    # Загрузка модели YOLOv12n
    model = YOLO('yolov12s.pt')

    # Обучение модели на вашем наборе данных
    results = model.train(data='custom_data\data.yaml', epochs=50, imgsz=640, batch=16, device=0) # Используем GPU 0Ф