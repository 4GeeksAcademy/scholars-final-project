from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Students(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=False, nullable=False) 
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    assignments = db.relationship("student_assignment", backref="student")
 
    def __repr__(self):
        return f'<Student {self.email} {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "role": "student",
            # do not serialize the password, its a security breach
            "assignments": [assignment.serialize() for assignment in self.assignments]
        }
    

class Teachers(db.Model):
    __tablename__ = 'teachers'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=False, nullable=False) 
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
 
    def __repr__(self):
        return f'<Teacher {self.email} {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "role": "teacher"
            # do not serialize the password, its a security breach
        }


#class course(db.Model):
  #  pass

class Assignment(db.Model):
    __tablename__='assignment'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=False)
    deadline = db.Column(db.DateTime, unique=False, nullable=False)
    isCompleted = db.Column(db.Boolean, unique=False, nullable=False)

    student_assignments = db.relationship("student_assignment", backref="assignment", lazy=True)
    #course = db.relationship("course", backref="assignment", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "deadline": self.deadline,
            "isCompleted": self.isCompleted
        }

class student_assignment(db.Model):
    __tablename__='student_assignment'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignment.id"), unique=False, nullable=False)
    submitted_at = db.Column(db.DateTime, unique=False, nullable=False)
    grade = db.Column(db.String(10), unique=False, nullable=False)
    
    #assignment = db.relationship("Assignment", backref="student_assignments")


    def serialize(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "assignment_id": self.assignment_id,
            "submitted_at": self.submitted_at,
            "grade": self.grade
        }