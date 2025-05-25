from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import torch
from ultralytics import YOLO
from utils.object_tracking import ObjectTracking
import io
import json

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене замените на конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Инициализация модели и трекера
model = YOLO("yolov12m.pt")
objectTracking = ObjectTracking()
deepsort = objectTracking.initialize_deepsort()

@app.post("/detect")
async def detect_animals(file: UploadFile = File(...)):
    # Чтение изображения из запроса
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Обработка кадра
    results = model.predict(frame, conf=0.25)
    
    # Подготовка данных для трекера
    xywh_bboxs = []
    confs = []
    oids = []
    
    for result in results:
        boxes = result.boxes
        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            cx, cy = int((x1 + x2)/2), int((y1 + y2)/2)
            bbox_width = abs(x1 - x2)
            bbox_height = abs(y1 - y2)
            xcycwh = [cx, cy, bbox_width, bbox_height]
            xywh_bboxs.append(xcycwh)
            conf = float(box.conf[0])
            confs.append(conf)
            classNameInt = int(box.cls[0])
            oids.append(classNameInt)
    
    # Трекинг объектов
    detections = []
    if xywh_bboxs:
        xywhs = torch.tensor(xywh_bboxs)
        confidence = torch.tensor(confs)
        outputs = deepsort.update(xywhs, confidence, oids, frame)
        
        if len(outputs) > 0:
            for output in outputs:
                x1, y1, x2, y2, track_id, class_id = output
                detections.append({
                    "bbox": [int(x1), int(y1), int(x2), int(y2)],
                    "track_id": int(track_id),
                    "class_id": int(class_id),
                    "class_name": ['coyote', 'saiga-antilopa', 'pig', 'deer'][int(class_id)]
                })
    
    return {"detections": detections}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 