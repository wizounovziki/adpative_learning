# -*- coding: utf-8 -*-
# @Author: User
# @Date:   2019-12-10 14:51:50
# @Last Modified by:   fyr91
# @Last Modified time: 2019-12-10 18:24:36
from app import app, tf_session, ort_session, fa
import cv2, os, dlib, pickle
from utils.utils import *
from utils.base64_encoder import decode
import numpy as np
import tensorflow as tf

tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)

def register_face(filename, using_file=True, base64_string=None):
    input_name = ort_session.get_inputs()[0].name
    embedding_filename  =  f"{filename.split('.')[0]}.pkl"
    embedding_path = os.path.join(app.config['EMBEDDING_FOLDER'], embedding_filename)

    try:
        if using_file:
            raw_img = cv2.imread(os.path.join(app.config['IMAGE_UPLOAD_FOLDER'], filename))
        else:
            raw_img = decode(base64_string)

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

        # if face detected
        if boxes.shape[0] > 0:
            x1, y1, x2, y2 = boxes[0,:]
            gray = cv2.cvtColor(raw_img, cv2.COLOR_BGR2GRAY)
            aligned_face = fa.align(raw_img, gray, dlib.rectangle(left = x1, top=y1, right=x2, bottom=y2))
            aligned_face = cv2.resize(aligned_face, (112,112))

            aligned_face = aligned_face - 127.5
            aligned_face = aligned_face * 0.0078125


            images_placeholder = tf_session.graph.get_tensor_by_name("input:0")
            embeddings = tf_session.graph.get_tensor_by_name("embeddings:0")
            phase_train_placeholder = tf_session.graph.get_tensor_by_name("phase_train:0")

            feed_dict = { images_placeholder: [aligned_face], phase_train_placeholder:False }
            embeds = tf_session.run(embeddings, feed_dict=feed_dict)

            with open(embedding_path, "wb") as f:
                pickle.dump(embeds[0], f)
            return embedding_filename
        else:
            return None
    except:
        if os.path.exists(embedding_path):
            os.remove(embedding_path)
        return None



