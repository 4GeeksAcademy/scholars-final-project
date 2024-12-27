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