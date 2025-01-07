from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(8), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=False, nullable=False) 
    #email unique is false because same email could have account as student and teacher
    #it is fixed by __table_args__ a few lines down
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    # Relationship with courses via a junction table (many-to-many relationship)
    #courses = db.relationship('Course', secondary='user_courses', backref='users', lazy=True)
    user_courses = db.relationship('UserCourse', backref='users', lazy=True)
    
    __table_args__ = (
        db.UniqueConstraint('email', 'role', name='unique_email_role'),
    )
 
    def __repr__(self):
        return f'<User {self.email} {self.username} ({self.role})>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "role": self.role,
            # do not serialize the password, its a security breach
        }

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    # Relationship with Modules table
    modules = db.relationship('Module', backref='course', lazy=True)
    #users = db.relationship('UserCourse', backref='users', lazy=True)
    user_courses = db.relationship('UserCourse', backref='courses', lazy=True)

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
class UserCourse(db.Model):
    __tablename__ = 'user_courses'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), primary_key=True)
    # user = db.relationship(Users, backref=db.backref('user_courses', lazy=True))
    # course = db.relationship(Course, backref=db.backref('user_courses', lazy=True))