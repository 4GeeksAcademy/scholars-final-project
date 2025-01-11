from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Students(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=False, nullable=False) 
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
 
    def __repr__(self):
        return f'<Student {self.email} {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "role": "student"
            # do not serialize the password, its a security breach
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

class student_assignment(db.Model):
    pass

class course(db.Model):
    pass

class Assignment(db.Model):
    __tablename__='assignment'
    id = db.Column(db.Integer, Primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=False)
    deadline = db.Column(db.Datetime, unique=False, nullable=False)
    isCompleted = db.Column(db.Boolean, unique=False, nullable=False)

    student_assignment = db.relationship(student_assignment)
    course = db.relationship(course)


    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "deadline": self.deadline,
            "isCompleted": self.isCompleted
        }

class student_assignment(db.Model):
    __tablename__='student_assignment'
    id = db.Column(db.Integer, Primary_key=True)
    student_id = db.Column(db.Integer, foreign_key=True)
    assignment_id = db.Column(db.Integer, foreign_key=True, unique=False, nullable=False)
    submitted_at = db.Column(db.Datetime, unique=False, nullable=False)
    grade = db.Column(db.String(10), unique=False, nullable=False)
    
    assignment = db.relationship(Assignment)


    def serialize(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "assignment_id": self.assignment_id,
            "submitted_at": self.submitted_at,
            "grade": self.grade
        }