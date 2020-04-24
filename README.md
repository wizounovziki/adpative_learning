# adpative_learning
dashboard client with relating back-end codes


## front-end part:dashboard_app

In the directory, you can run:

### `npm install`

Install the necessary modules for front-end,when meet problems,simply run 
`npm audit fix` or follow the fixing instruction.
You might need a sudo in linux.

### `npm start`

Run the front-end,take port 3000 as a default.

## back-end part:badass_api

### pip install -r requirements.txt 
In the directory,run it to install the libraries for back-end.We are using cuda 10 if need gpu,so you might have to change some libs if you are using the different version of cuda.
There might be some missing libs in the txt file,please try to implement accordingly.
There might be situationns when dlib is not installed successfully.Please run `pip install cmake` and then `pip install dlib` manually.

### install mysql and set up
In app.py you can found `app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://debian-sys-                      maint:yGdsPQQ7Zl7lVUCi@localhost/adaptive_learning'`;
In api.py you can found `adt_db = adt.dataBase('debian-sys-maint','yGdsPQQ7Zl7lVUCi','adaptive_learning')`.
In this two place you can replace the username and password to your own.Actually the one in api.py is not used so far.
Then create a schema named "adaptive_learning"

### init for the database
In directory run `python app.py` to start the back-end.It is taking port 5000,you can change it in app.py.
Then make a post request `localhost:5000/init` to create tables for dashboard;
     make a get request `localhost:5000/question_init` to fill in sample quiz data so that you can start the app.
You can find the question files in `badass_api/adaptive/Math`,you can modify with you own quiz,but have to follow the format.








