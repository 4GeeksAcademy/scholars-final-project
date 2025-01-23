import time
from datetime import datetime
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import re

from api.models import db, Students, Teachers, Course, Assignment
from api.utils import APIException

api = Blueprint('api', __name__)
CORS(api)

def validate_email(email):
    return re.match(r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$', email)

def validate_password(password):
    return (len(password) >= 8 and any(char.isdigit() for char in password)
            and any(char.isupper() for char in password) and
            any(char.islower() for char in password))

def validate_username(username):
    return re.match(r'^[a-zA-Z0-9]{3,}$', username)

# @api.route('/assignments', methods=['POST'])
# @jwt_required()
# def create_assignment():
#     current_user = get_jwt_identity()
#     user_id, role = current_user.split('|')
    
#     if role != 'teacher':
#         return jsonify({'error': 'Only teachers can create assignments'}), 403
    
#     data = request.get_json()
    
#     if not data or 'title' not in data or 'deadline' not in data or 'course_id' not in data:
#         return jsonify({'error': "Missing required fields: 'title', 'deadline', 'course_id'"}), 400
    
#     course = Course.query.get(data['course_id'])
#     if not course or course.teacher_id != int(user_id):
#         return jsonify({'error': 'Unauthorized to add assignments to this course'}), 403
    
#     try:
#         deadline = datetime.strptime(data['deadline'], "%Y-%m-%d %H:%M:%S")
#     except ValueError:
#         return jsonify({"error": "Invalid deadline format. Use YYYY-MM-DD HH:MM:SS"}), 400
    
#     new_assignment = Assignment(
#         title=data['title'],
#         description=data.get('description', ''),
#         deadline=deadline,
#         course_id=data['course_id']
#     )

#     db.session.add(new_assignment)
#     db.session.commit()
#     return jsonify({"message": "Assignment created successfully", "assignment": new_assignment.serialize()}), 201

# @api.route("/students/<int:student_id>/assignments", methods=["GET"])
# @jwt_required()
# def get_student_assignments(student_id):
#     current_user = get_jwt_identity()
#     user_id, role = current_user.split('|')

#     if role != 'student' or int(user_id) != student_id:
#         return jsonify({'error': 'Unauthorized access'}), 403
    
#     student = Students.query.get(student_id)
#     if not student:
#         return jsonify({"error": "Student not found"}), 404
    
#     assignments = [assignment.serialize() for course in student.courses for assignment in course.assignments]
#     return jsonify({"assignments": assignments}), 200

#@api.route("/assignments/<int:assignment_id>/submit", methods=["POST"])
#@jwt_required()
#def submit_assignment(assignment_id):
    #current_user = get_jwt_identity()
    #user_id, role = current_user.split('|')

    #if role != 'student':
        #return jsonify({'error': 'Only students can submit assignments'}), 403
    
    # assignment = Assignment.query.get(assignment_id)
    # if not assignment:
    #     return jsonify({"error": "Assignment not found"}), 404
    
    # student = Students.query.get(user_id)

    
    # new_submission = student_assignment(
    #     student_id=user_id,
    #     assignment_id=assignment_id,
    #     submitted_at=datetime.utcnow(),
    #     grade="Pending"
    # )
    
    # db.session.add(new_submission)
    # db.session.commit()
    # return jsonify({"message": "Assignment submitted successfully", "submission": new_submission.serialize()}), 201

# @api.route("/assignments/<int:assignment_id>/submissions", methods=["GET"])
# @jwt_required()
# def get_assignment_submissions(assignment_id):
#     current_user = get_jwt_identity()
#     user_id, role = current_user.split('|')

#     if role != 'teacher':
#         return jsonify({'error': 'Only teachers can view submissions'}), 403
    
#     assignment = Assignment.query.get(assignment_id)
#     if not assignment or assignment.course.teacher_id != int(user_id):
#         return jsonify({'error': 'Unauthorized access'}), 403
    
#     submissions = student_assignment.query.filter_by(assignment_id=assignment_id).all()
#     return jsonify({"submissions": [submission.serialize() for submission in submissions]}), 200

# @api.route("/submissions/<int:submission_id>/grade", methods=["POST"])
# @jwt_required()
# def grade_submission(submission_id):
#     current_user = get_jwt_identity()
#     user_id, role = current_user.split('|')

#     if role != 'teacher':
#         return jsonify({'error': 'Only teachers can grade submissions'}), 403
    
#     data = request.get_json()
#     submission = student_assignment.query.get(submission_id)
#     if not submission or submission.assignment.course.teacher_id != int(user_id):
#         return jsonify({'error': 'Unauthorized to grade this submission'}), 403
    
#     submission.grade = data.get('grade', "Pending")
#     db.session.commit()
#     return jsonify({"message": "Submission graded successfully", "submission": submission.serialize()}), 200
