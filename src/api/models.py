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
class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    # Relationship with Modules table
    modules = db.relationship('Module', backref='course', lazy=True)
    #users = db.relationship('UserCourse', backref='users', lazy=True)
    student_courses = db.relationship('StudentCourse', backref='courses', lazy=True)
    

    def __repr__(self):
        return f"<Course {self.name}>"

    def serialize(self, include_modules=False, include_topics=False):
        course_data = {
            "id": self.id,
            "name": self.name,
        }

        if include_modules:
            course_data["modules"] = [
                module.serialize(include_topics=include_topics) for module in self.modules
            ]

        return course_data

class Module(db.Model):
    __tablename__ = 'modules'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False)

    # Relationship with Topics table
    topics = db.relationship('Topic', backref='module', lazy=True)

    def __repr__(self):
        return f"<Module {self.name} (Course ID: {self.course_id})>"

class Topic(db.Model):
    __tablename__ = 'topics'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    
    def __repr__(self):
        return f"<Topic {self.name} (Module ID: {self.module_id})>"

# # Junction Table for Many-to-Many relationship between Users and Courses
class StudentCourse(db.Model):
    __tablename__ = 'student_courses'
    user_id = db.Column(db.Integer, db.ForeignKey('students.id'), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), primary_key=True)
    # user = db.relationship(Users, backref=db.backref('user_courses', lazy=True))
    # course = db.relationship(Course, backref=db.backref('user_courses', lazy=True))