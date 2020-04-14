# -*- coding: utf-8 -*-
# @Author: fyr91
# @Date:   2019-12-10 17:42:11
# @Last Modified by:   fyr91
# @Last Modified time: 2019-12-10 18:27:08
from utils.detect import detect_face
from app import app, tf_session, fa
import tensorflow as tf
from app import embeddings as saved_embeds
from app import embeddings_meta as meta
from copy import deepcopy
import cv2, dlib
import numpy as np

tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)

def recognize_face(raw_img):
    threshold = 0.7
    saved_meta = deepcopy(meta)

    boxes = detect_face(raw_img)
    # face detected
    faces = []
    boxes[boxes<0] = 0
    for i in range(boxes.shape[0]):
        box = boxes[i, :]
        x1, y1, x2, y2 = box

        gray = cv2.cvtColor(raw_img, cv2.COLOR_BGR2GRAY)
        aligned_face = fa.align(raw_img, gray, dlib.rectangle(left = x1, top=y1, right=x2, bottom=y2))
        aligned_face = cv2.resize(aligned_face, (112,112))

        aligned_face = aligned_face - 127.5
        aligned_face = aligned_face * 0.0078125

        faces.append(aligned_face)

    predictions = []

    if len(faces)>0:

        print(len(saved_embeds))

        images_placeholder = tf_session.graph.get_tensor_by_name("input:0")
        embeddings = tf_session.graph.get_tensor_by_name("embeddings:0")
        phase_train_placeholder = tf_session.graph.get_tensor_by_name("phase_train:0")

        faces = np.array(faces)
        feed_dict = { images_placeholder: faces, phase_train_placeholder:False }
        embeds = tf_session.run(embeddings, feed_dict=feed_dict)

        # prediciton using distance
        for n, embedding in enumerate(embeds):

            diff = np.subtract(np.array(saved_embeds), embedding)
            dist = np.sum(np.square(diff), 1)

            idx = np.argmin(dist)

            if dist[idx] < threshold:
                box = boxes[n, :]
                x1, y1, x2, y2 = box
                saved_meta[idx]['box'] = {'x1': int(x1), 'y1': int(y1), 'x2': int(x2), 'y2': int(y2)}
                predictions.append(saved_meta[idx])
            else:
                predictions.append({'name': "unknown"})

    return predictions

