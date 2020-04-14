# -*- coding: utf-8 -*-
# @Author: User
# @Date:   2019-11-28 14:36:19
# @Last Modified by:   fyr91
# @Last Modified time: 2019-12-10 18:13:03
import os, json, dlib, pickle, sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from imutils import face_utils
import onnxruntime as ort
import tensorflow as tf
from utils.eye_gazing.gaze_tracking import GazeTracking
import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from keras.models import load_model
from waitress import serve

import cv2

tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)

app = Flask(__name__)

app.config['EASY_EYE_GAZING'] = './models/distraction_model/shape_predictor_68_face_landmarks.dat'
app.config['EMBEDDING_FOLDER'] = './storage/embeddings'
app.config['META_FOLDER'] = './storage/identity_meta'
app.config['IMAGE_UPLOAD_FOLDER'] = './storage/uploads/images'
# mysql config
# 'debian-sys-maint'+':'+'yGdsPQQ7Zl7lVUCi'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://debian-sys-maint:yGdsPQQ7Zl7lVUCi@localhost/adaptive_learning'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# for adaptive test
app.config['SECRET_KEY'] = 'top_secret123xxxyyy'
app.config['PERMANENT_SESSION_LIFETIME'] =  datetime.timedelta(minutes=10)

# set up to connect mysqldb
db = SQLAlchemy(app)
ma = Marshmallow(app)
CORS(app)

if not os.path.exists(app.config['EMBEDDING_FOLDER']):
    print(' * Creating embedding folder')
    os.makedirs(app.config['EMBEDDING_FOLDER'])
if not os.path.exists(app.config['META_FOLDER']):
    print(' * Creating meta folder')
    os.makedirs(app.config['META_FOLDER'])
if not os.path.exists(app.config['IMAGE_UPLOAD_FOLDER']):
    print(' * Creating image upload folder')
    os.makedirs(app.config['IMAGE_UPLOAD_FOLDER'])

# initialize
print(" * Loading face detection model")
# ort_session = ort.InferenceSession(app.config['FACE_DETECTION_MODEL'])
print(" * Loading face aligner")
# shape_predictor = dlib.shape_predictor(app.config['FACIAL_LANDMARK'])
print(' * Loading face recognition model')

print(" * Loading eye gazing model")
eye_predictor = dlib.shape_predictor(app.config['EASY_EYE_GAZING'])

print(" * Loading distraction model")
emotion_model = load_model('./models/distraction_model/emotion_recognition.h5')
detector = dlib.get_frontal_face_detector()
faceCascade = cv2.CascadeClassifier('./models/distraction_model/haarcascade_frontalface_default.xml')

# tf_session_hourglass = tf.Session()
# saver_hourglass = tf.train.import_meta_graph(os.path.join(app.config['EYE_GAZING_HOURGLASS'], 'model-4203370.meta'))
# saver_hourglass.restore(tf_session_hourglass,os.path.join(app.config['EYE_GAZING_HOURGLASS'], 'model-4203370'))
# tf_session_radius = tf.Session()
# saver_radius = tf.train.import_meta_graph(os.path.join(app.config['EYE_GAZING_RADIUS'], 'model-4203370.meta'))
# saver_radius.restore(tf_session_radius,os.path.join(app.config['EYE_GAZING_RADIUS'], 'model-4203370'))

print(' * Loading existing embeddings')
embeddings_meta = []
embeddings = []
for file in os.listdir(app.config['META_FOLDER']):
    with open(os.path.join(app.config['META_FOLDER'], file), "r") as f:
        data = json.load(f)
        embeddings_meta.append(data)
        file_path = os.path.join(app.config['EMBEDDING_FOLDER'], data['embedding'])
        embeddings.append(pickle.load(open(file_path, 'rb')))

if __name__ == '__main__':
    from apis import register_api
    app.register_blueprint(register_api)

    from apis import detect_face_api
    app.register_blueprint(detect_face_api)

    # from api import track_face_api
    # app.register_blueprint(track_face_api)

    from apis import recognize_face_api
    app.register_blueprint(recognize_face_api)

    from apis import eye_gazing_api
    app.register_blueprint(eye_gazing_api)
    
    
    from apis import head_motion_api
    app.register_blueprint(head_motion_api)
    
    from apis import adaptive_api
    app.register_blueprint(adaptive_api)

    from apis import init_api
    app.register_blueprint(init_api)

    from apis import question_init_api
    app.register_blueprint(question_init_api)

    from apis import quiz_log_api
    app.register_blueprint(quiz_log_api)

    from apis import test_api
    app.register_blueprint(test_api)

    from apis import portrait_api
    app.register_blueprint(portrait_api)

    # from apis import anxiety_level_api
    # app.register_blueprint(anxiety_level_api)

    # from apis import student_skill_level_api
    # app.register_blueprint(student_skill_level_api)

    # from apis import question_difficulty_api
    # app.register_blueprint(question_difficulty_api)

    # from apis import anxiety_correct_api
    # app.register_blueprint(anxiety_correct_api)

    from apis import quiz_details_api
    app.register_blueprint(quiz_details_api)

    from apis import student_details_api
    app.register_blueprint(student_details_api)

    from apis import student_list_api
    app.register_blueprint(student_list_api)

    from apis import distraction_api
    app.register_blueprint(distraction_api)

    # app.run(host='0.0.0.0', port=5000, debug=False,threaded=True)
    serve(app, host='0.0.0.0', port=7777)
    
