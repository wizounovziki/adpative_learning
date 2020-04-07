# -*- coding: utf-8 -*-
# @Author: User
# @Date:   2019-12-10 16:33:38
# @Last Modified by:   User
# @Last Modified time: 2019-12-10 17:08:19
from app import app, ort_session
from utils.utils import *
import cv2

def detect_face(raw_img):
    input_name = ort_session.get_inputs()[0].name

    h, w, _ = raw_img.shape
    img = cv2.cvtColor(raw_img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (640, 480))
    img_mean = np.array([127, 127, 127])
    img = (img - img_mean) / 128
    img = np.transpose(img, [2, 0, 1])
    img = np.expand_dims(img, axis=0)
    img = img.astype(np.float32)

    confidences, boxes = ort_session.run(None, {input_name: img})
    boxes, labels, probs = predict(w, h, confidences, boxes, 0.7)
    return boxes
