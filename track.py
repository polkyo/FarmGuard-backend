#Import All the Required Libraries
import cv2
import math
import time
import torch
from ultralytics import YOLO
from utils.object_tracking import ObjectTracking
objectTracking = ObjectTracking()
deepsort = objectTracking.initialize_deepsort()

#Create a Video Capture Object
cap = cv2.VideoCapture(r"C:\Users\User\Documents\FIXED.mp4")
model = YOLO(r"C:\yolov12\runs\detect\train35\weights\best.pt")
cocoClassNames = ['coyote', 'saiga-antilopa', 'pig', 'deer']
ctime = 0
ptime = 0
count = 0

# Get video properties
frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = int(cap.get(cv2.CAP_PROP_FPS))

# Initialize video writer
output_path = "output_video.mp4"
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

try:
    while True:
        xywh_bboxs = []
        confs = []
        oids = []
        outputs = []
        ret, frame = cap.read()
        if ret:
            count += 1
            print(f"Frame Count: {count}")
            results = model.predict(frame, conf = 0.25)
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy[0]
                    x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                    # Find the center coordinates of the bouding boxes
                    cx, cy = int((x1 + x2)/2), int((y1 + y2)/2)
                    #Find the height and width of the bounding boxes
                    bbox_width = abs(x1 - x2)
                    bbox_height = abs(y1 - y2)
                    xcycwh = [cx, cy, bbox_width, bbox_height]
                    xywh_bboxs.append(xcycwh)
                    conf = math.ceil(box.conf[0] * 100)/100
                    confs.append(conf)
                    classNameInt = int(box.cls[0])
                    oids.append(classNameInt)

            if xywh_bboxs:  # Проверяем, есть ли обнаруженные объекты
                xywhs = torch.tensor(xywh_bboxs)
                confidence = torch.tensor(confs)
                outputs = deepsort.update(xywhs, confidence, oids, frame)
                if len(outputs) > 0:
                    bbox_xyxy = outputs[:,:4]
                    identities = outputs[:,-2]
                    classID = outputs[:,-1]
                    objectTracking.draw_boxes(frame, bbox_xyxy, identities, classID)

            ctime = time.time()
            fps = 1 / (ctime - ptime)
            ptime = ctime
            cv2.putText(frame, f"FPS: {str(int(fps))}", (10, 50), cv2.FONT_HERSHEY_PLAIN, 3, (255,0,0), 3)
            cv2.putText(frame, f"Frame Count: {str(count)}", (10, 100), cv2.FONT_HERSHEY_PLAIN, 3, (255,0,255), 3)
            
            # Write the frame to the output video
            out.write(frame)
            
            cv2.imshow("Frame", frame)
            key = cv2.waitKey(1) & 0xFF
            if key == ord('1') or key == ord('q'):
                break
        else:
            break

finally:
    # Release everything
    cap.release()
    out.release()
    cv2.destroyAllWindows()
    cv2.waitKey(1)  # Additional wait to ensure windows are closed