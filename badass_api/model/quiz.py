from app import ma,db

class Quiz(db.Model):
    __tablename__ = "quiz_log"
    id = db.Column(db.Integer, primary_key=True)
    exam_id = db.Column(db.String(255),nullable = True)
    quiz_id = db.Column(db.String(255),nullable = True)
    student_id = db.Column(db.String(255),nullable = True)
    session_id = db.Column(db.String(255),nullable = True)
    details = db.Column(db.JSON)

class QuizSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = (
            "id",
            "exam_id",
            "quiz_id",
            "student_id",
            "session_id",
            "details"
        )
quiz_schema = QuizSchema()
quiz_schemas =  QuizSchema(many=True)