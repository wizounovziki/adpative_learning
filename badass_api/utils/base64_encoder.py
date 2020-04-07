# -*- coding: utf-8 -*-
# @Author: User
# @Date:   2019-12-10 16:41:58
# @Last Modified by:   fyr91
# @Last Modified time: 2019-12-11 12:22:41
import base64, cv2
from PIL import Image
from io import BytesIO, StringIO
import numpy as np

def encode(filepath):
    with open(filepath, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())
    return encoded_string

def decode(base64_string):
    byte_img = base64.b64decode(base64_string)
    pimg = Image.open(BytesIO(byte_img))
    return cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)
