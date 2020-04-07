# badass_api

**Get Started**
```
pip install -r requirements.txt
python app.py

set up the database name as root,password as BreakingBad(or change in app.py app.config['SQLALCHEMY_DATABASE_URI'])
create a schema named adaptive_learning

after first runing the server,go to url: /init
```
**API List** (all apis support base64 and file):
- [POST] /register: register face
- [GET] /register: get registered list
- [POST] /recognize: recognize face in image
- [POST] /detect: detect faces in image
