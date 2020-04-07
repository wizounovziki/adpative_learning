from app import ma,db

class Results(db.Model):
    __tablename__ = "results"
    id = db.Column(db.Integer, primary_key=True)
    time_stamp = db.Column(db.DECIMAL(10,0),nullable = True)
    method = db.Column(db.String(255),nullable = True)
    inference = db.Column(db.String(255),nullable = True)
    student_id = db.Column(db.String(255),nullable = False)

class ResultsSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = (
            "id",
            "time_stamp",
            "method",
            "inference",
            "student_id"
        )
results_schema = ResultsSchema()
results_schemas =  ResultsSchema(many=True)