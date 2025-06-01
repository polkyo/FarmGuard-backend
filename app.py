import gradio as gr
import cv2
import tempfile
import numpy as np
from ultralytics import YOLO

def process_image(image, model_path, image_size, conf_threshold):
    if model_path == "custom":
        model = YOLO(r"C:\yolov12\runs\detect\train35\weights\best.pt")
    else:
        model = YOLO(model_path)
    
    results = model.predict(source=image, imgsz=image_size, conf=conf_threshold)
    annotated_image = results[0].plot()
    return annotated_image

def process_video(video_path, model_path, image_size, conf_threshold):
    if model_path == "custom":
        model = YOLO(r"C:\yolov12\runs\detect\train35\weights\best.pt")
    else:
        model = YOLO(model_path)
    
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    output_path = tempfile.mktemp(suffix=".mp4")
    fourcc = cv2.VideoWriter_fourcc(*'avc1')
    out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        results = model.predict(source=frame, imgsz=image_size, conf=conf_threshold)
        annotated_frame = results[0].plot()
        out.write(annotated_frame)
    
    cap.release()
    out.release()
    return output_path

def app():
    with gr.Blocks() as demo:
        with gr.Row():
            with gr.Column():
                image = gr.Image(type="numpy", label="Image", visible=True)
                video = gr.Video(label="Video", visible=False)
                input_type = gr.Radio(
                    choices=["Image", "Video"],
                    value="Image",
                    label="Input Type",
                )
                model_id = gr.Dropdown(
                    label="Model",
                    choices=["custom"],
                    value="custom",
                )
                image_size = gr.Slider(
                    label="Image Size",
                    minimum=320,
                    maximum=1280,
                    step=32,
                    value=640,
                )
                conf_threshold = gr.Slider(
                    label="Confidence Threshold",
                    minimum=0.0,
                    maximum=1.0,
                    step=0.05,
                    value=0.25,
                )
                detect_button = gr.Button(value="Detect Objects")

            with gr.Column():
                output_image = gr.Image(type="numpy", label="Annotated Image", visible=True)
                output_video = gr.Video(label="Annotated Video", visible=False)

        def update_visibility(input_type):
            return {
                image: gr.update(visible=input_type == "Image"),
                video: gr.update(visible=input_type == "Video"),
                output_image: gr.update(visible=input_type == "Image"),
                output_video: gr.update(visible=input_type == "Video")
            }

        input_type.change(
            fn=update_visibility,
            inputs=[input_type],
            outputs=[image, video, output_image, output_video],
        )

        def run_inference(image, video, model_id, image_size, conf_threshold, input_type):
            if input_type == "Image":
                if image is None:
                    return None, None
                result = process_image(image, model_id, image_size, conf_threshold)
                return result, None
            else:
                if video is None:
                    return None, None
                result = process_video(video, model_id, image_size, conf_threshold)
                return None, result

        detect_button.click(
            fn=run_inference,
            inputs=[image, video, model_id, image_size, conf_threshold, input_type],
            outputs=[output_image, output_video],
        )
        
        return demo

if __name__ == '__main__':
    app().launch()