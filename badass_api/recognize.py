# -*- coding: utf-8 -*-
# @Author: User
# @Date:   2019-11-29 09:28:56
# @Last Modified by:   User
# @Last Modified time: 2019-12-04 17:06:34
import face_recognition
import numpy as np
import pickle
import json
import cv2
import os

def recognize(file_path):
    MAX_HEIGHT = 1080
    image = cv2.imread(file_path)
    (h,w) = image.shape[:2]
    image = cv2.resize(image, (int(MAX_HEIGHT/h*w), MAX_HEIGHT))
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(image)
    # cv2.imshow('image',image)
    # cv2.waitKey(0)
    if len(face_locations)>0:
        embedding = face_recognition.face_encodings(image, face_locations)[0]
    else:
        return {'id': None, 'name': None, 'unknown': True}
    ids, embedding_files = load_existing_embeddings()
    known_face_encodings = []
    for file in embedding_files:
        with open(file, "rb") as f:
            known_face_encodings.append(pickle.load(f))
    face_distances = face_recognition.face_distance(known_face_encodings, embedding)
    best_match_index = np.argmin(face_distances)
    if face_distances[best_match_index] < 0.4:
        result_folder = ids[best_match_index]
        with open(os.path.join("faces", result_folder, "meta.json")) as f:
            data = json.load(f)
        return data
    else:
        return {'id': None, 'name': None, 'unknown': True}

def load_existing_embeddings():
    with open("faces/meta.json", 'r') as f:
        meta_dict = json.load(f)
    embeddings = [(e['id'], e['embedding']) for e in meta_dict["embeddings"]]
    return list(zip(*embeddings))
