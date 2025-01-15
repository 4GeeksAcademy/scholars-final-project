from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Students(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=False, nullable=False) 
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    student_courses = db.relationship('StudentCourse', backref='students', lazy=True)
    events = db.relationship('Events', back_populates='student', cascade='all, delete-orphan')
    note = db.relationship('Note', back_populates='student')
    assignments = db.relationship("student_assignment", backref="student")

 
    def __repr__(self):
        return f'<Student {self.email} {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "role": "student",
            "events": [event.serialize() for event in self.events],
            "note": [student_notes.serialize() for student_notes in self.note],
            "student_courses": [student_course.serialize() for student_course in self.student_courses],
            # do not serialize the password, its a security breach
            "assignments": [assignment.serialize() for assignment in self.assignments]
        }

class Events(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    start = db.Column(db.String(10), nullable=False)
    
    student = db.relationship('Students', back_populates='events')

    def __repr__(self):
        return f'<Event {self.title} for Student ID {self.student_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "title": self.title,
            "start": self.start,
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

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    # Relationship with Modules
    modules = db.relationship('Module', backref='course', lazy=True, cascade="all, delete")

    # Relationship with StudentCourse
    student_courses = db.relationship('StudentCourse', backref='course', lazy=True, cascade="all, delete")
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }
    def __repr__(self):
        return f"<Course {self.name}>"


class Module(db.Model):
    __tablename__ = 'modules'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    # Foreign key to Course
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False)

    # Relationship with Topics
    topics = db.relationship('Topic', backref='module', lazy=True, cascade="all, delete")

class Assignment(db.Model):
    __tablename__='assignment'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=False)
    deadline = db.Column(db.DateTime, unique=False, nullable=False)
    isCompleted = db.Column(db.Boolean, unique=False, nullable=False)

    student_assignment = db.relationship("student_assignment", backref="assignment", lazy=True)
    #course = db.relationship("course", backref="assignment", lazy=True)


    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "deadline": self.deadline,
            "isCompleted": self.isCompleted
        }

    def __repr__(self):
        return f"<Course {self.name}>"

class Topic(db.Model):
    __tablename__ = 'topics'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    # Foreign key to Module
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id', ondelete='CASCADE'), nullable=False)
    
    # Relationship to Resource
    resources = db.relationship('Resource', backref='topic', cascade="all, delete-orphan", lazy=True)

            "name": self.name
        }
    def __repr__(self):
        return f"<Topic {self.name} (Module ID: {self.module_id})>"

class student_assignment(db.Model):
    __tablename__='student_assignment'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignment.id"), unique=False, nullable=False)
    submitted_at = db.Column(db.DateTime, unique=False, nullable=False)
    grade = db.Column(db.String(10), unique=False, nullable=False)
    
    #assignment = db.relationship("Assignment", backref="student_assignment")


    def serialize(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "assignment_id": self.assignment_id,
            "submitted_at": self.submitted_at,
            "grade": self.grade
        }



class Resource(db.Model):
    __tablename__ = 'resources'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(300), nullable=False)
    # Foreign key to Topic
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id', ondelete='CASCADE'), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "url": self.url,
            "topic_id": self.topic_id
        }

    def __repr__(self):
        return f"<Resource {self.url} (Topic ID: {self.topic_id})>"
    
class StudentCourse(db.Model):
    __tablename__ = 'student_courses'
    user_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete='CASCADE'), primary_key=True)

class Note(db.Model):
    __tablename__ = 'notes'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'),nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'),nullable=False)
    student = db.relationship('Students', back_populates='note')

    def serialize(self):
        return{
            'id': self.id,
            'content': self.content,
            'student_id': self.student_id,
            'topic_id': self.topic_id
        }


