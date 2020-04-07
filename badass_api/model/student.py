from app import ma,db

class Student(db.Model):
    __tablename__ = "student"
    id = db.Column(db.String, primary_key=True)
    details = db.Column(db.JSON)
    

class StudentSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = (
            "id",
            "details"
        )
student_schema = StudentSchema()
student_schemas =  StudentSchema(many=True)