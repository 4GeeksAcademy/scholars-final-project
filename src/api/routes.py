#import schedule
import time
#import requests
from flask import Flask, request, jsonify, url_for, Blueprint, send_from_directory
from api.models import db, Students, Teachers
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_jwt_extended import decode_token

from werkzeug.security import generate_password_hash, check_password_hash
import re
from api.chatbot import get_chatbot_response
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


#stuff below this line was not in the template

def validate_email(email):
    return re.match(r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$', email)

def validate_password(password):
    return (len(password) >= 8 and any(char.isdigit() for char in password)
            and any(char.isupper() for char in password) and
            any(char.islower() for char in password))

def validate_username(username):
    return re.match(r'^[a-zA-Z0-9]{3,}$', username)

@api.route('/signup', methods=['POST'])
def create_user():

    email = request.json.get('email')
    password = request.json.get('password')
    username = request.json.get('username')
    role = request.json.get('role')

    if role not in ['student', 'teacher']:
        return jsonify({'error': 'Invalid role'}, 400)
    if len(email) == 0:
        return jsonify({'error': 'Email is required'}, 400)
    if len(password) == 0:
        return jsonify({'error': 'Password is required'}, 400)
    if len(username) == 0:
        return jsonify({'error': 'Username is required'}, 400)
    
    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}, 400)
    if not validate_password(password):
        return jsonify({'error': 'Password does not meet criteria'}, 400)
    if not validate_username(username):
        return jsonify({'error': 'Invalid username format'}, 400)


    if role == 'student':
        existing_email = Students.query.filter_by(email=email).first()
        if existing_email:
            return jsonify({'error': 'Email already in use as a student'}, 400)
        existing_username_student = Students.query.filter_by(username=username).first()
        existing_username_teacher = Teachers.query.filter_by(username=username).first()
        if existing_username_student or existing_username_teacher:
            return jsonify({'error': 'Username already in use'}, 400)
        hashed_password = generate_password_hash(password)
        new_user = Students(email=email, username=username, password=hashed_password, is_active=False)
    else:
        existing_email = Teachers.query.filter_by(email=email).first()
        if existing_email:
            return jsonify({'error': 'Email already in use as a teacher'}, 400)
        existing_username_student = Students.query.filter_by(username=username).first()
        existing_username_teacher = Teachers.query.filter_by(username=username).first()
        if existing_username_student or existing_username_teacher:
            return jsonify({'error': 'Username already in use'}, 400)
        hashed_password = generate_password_hash(password)
        new_user = Teachers(email=email, username=username, password=hashed_password, is_active=False)

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=f"{new_user.id}|{role}")
    return jsonify(access_token=access_token, success=True), 200

@api.route('/login', methods=['POST'])
def authenticate_user():
    print(request.json)
    email = request.json.get('email')
    username = request.json.get('username')
    password = request.json.get('password')
    role = request.json.get('role')
    
    if email != '':
        if role == 'teacher':
            user = Teachers.query.filter_by(email=email).first()
        elif role == 'student':
            user = Students.query.filter_by(email=email).first()
        print(email)
        print('user by email')
        print(user)
    else:
        user = Teachers.query.filter_by(username=username).first()
        role = 'teacher'
        if not user:
            user = Students.query.filter_by(username=username).first()
            role = 'student'
        print(username)
        print('user by username')
        print(user)
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}, 400)
    
    access_token = create_access_token(identity=f"{user.id}|{role}")
    return jsonify(access_token=access_token, success=True), 200

@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    print('protected')
    current_user = get_jwt_identity()
    print(current_user)
    user_id, role = current_user.split('|')
    print('current_user_id:' + user_id + ', role: ' + role)


    user = None
    if role == 'student':
        user = Students.query.get(user_id)
    elif role == 'teacher':
        user = Teachers.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'user not found'}), 404
    
    print('user:' + user.username)
    return jsonify(user=user.serialize()), 200

@api.route('/chatbot', methods =['POST', 'GET'])
def handle_chatbot():
     
    if request.method == 'POST':
        data = request.get_json() 
        message = data.get('message', 'No message provided')
        chatbot_response = get_chatbot_response(message)
        return jsonify({"message": chatbot_response}), 200
    
    response_body = {
        "message": "this is chatbot api"
    }
    return jsonify(response_body), 200

# GET 
# /courses
# /courses?include_modules=true
# /courses?include_modules=true&include_topics=true
@api.route('/courses', methods=['GET'])
def get_courses():
    if request.method == 'GET':
        include_modules = request.args.get('include_modules', 'false').lower() == 'true'
        include_topics = request.args.get('include_topics', 'false').lower() == 'true'

        courses = Course.query.all()
        result = []

        for course in courses:
            course_data = {
                "id": course.id,
                "name": course.name
            }

            if include_modules:
                course_data["modules"] = []
                for module in course.modules:
                    module_data = {
                        "id": module.id,
                        "name": module.name
                    }

                    if include_topics:
                        module_data["topics"] = [
                            {"id": topic.id, "name": topic.name}
                            for topic in module.topics
                        ]

                    course_data["modules"].append(module_data)

            result.append(course_data)

        return jsonify(result), 200

# POST this format
# {
#     "name": "Introduction to Python",
#     "modules": [
#         {
#             "name": "Basics of Python",
#             "topics": [
#                 {"name": "Variables and Data Types"},
#                 {"name": "Control Flow"}
#             ]
#         },
#         {
#             "name": "Advanced Topics",
#             "topics": [
#                 {"name": "Object-Oriented Programming"},
#                 {"name": "Modules and Packages"}
#             ]
#         }
#     ],
#     "user_ids": [3]
# }
@api.route('/courses', methods=['POST'])
def create_course():
    try:
        data = request.get_json()

        # Validate course data
        if not data or 'name' not in data or not data['name'].strip():
            return jsonify({"error": "Course name is required"}), 400

        if 'modules' not in data or not isinstance(data['modules'], list):
            return jsonify({"error": "Modules must be a list"}), 400

        if 'user_ids' not in data or not isinstance(data['user_ids'], list):
            return jsonify({"error": "User IDs must be a list"}), 400

        # Create a new course
        new_course = Course(name=data['name'])
        db.session.add(new_course)
        db.session.flush()  # Ensure new_course.id is generated

        # Add modules and topics
        for module_data in data['modules']:
            if 'name' not in module_data or not module_data['name'].strip():
                return jsonify({"error": "Module name is required"}), 400

            new_module = Module(name=module_data['name'], course_id=new_course.id)

            if 'topics' in module_data:
                for topic_data in module_data['topics']:
                    if 'name' not in topic_data or not topic_data['name'].strip():
                        return jsonify({"error": "Topic name is required"}), 400

                    new_topic = Topic(name=topic_data['name'], module=new_module)
                    db.session.add(new_topic)

            db.session.add(new_module)

        # Temporarily disable autoflush
        with db.session.no_autoflush:
            # Associate users with the course
            for user_id in data['user_ids']:
                user = Users.query.get(user_id)
                if not user:
                    print(f"User with ID {user_id} not found, skipping.")
                    continue

                # Check for existing user-course association
                existing_association = UserCourse.query.filter_by(
                    user_id=user.id, course_id=new_course.id
                ).first()

                if existing_association:
                    print(f"UserCourse for user_id={user.id} and course_id={new_course.id} already exists.")
                    continue

                user_course = UserCourse(user_id=user.id, course_id=new_course.id)
                db.session.add(user_course)

        # Commit all changes to the database
        db.session.commit()

        return jsonify({
            "message": "Course created successfully",
            "course": new_course.serialize()
        }), 201

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
@api.route('/modules', methods=['GET', 'POST'])
def handle_modules():
    if request.method == 'GET':
        modules = Module.query.all()
        return jsonify([module.serialize() for module in modules]), 200

    if request.method == 'POST':
        data = request.json 
        new_module = Module(name=data['name'], course_id=data['course_id'])
        db.session.add(new_module)
        db.session.commit()
        return jsonify(new_module.serialize()), 201

@api.route('/topics', methods=['GET', 'POST'])
def handle_topics():
    if request.method == 'GET':
        topics = Topic.query.all()
        return jsonify([topic.serialize() for topic in topics]), 200

    if request.method == 'POST':
        data = request.json
        new_topic = Topic(name=data['name'], module_id=data['module_id'])
        db.session.add(new_topic)
        db.session.commit()
        return jsonify(new_topic.serialize()), 201

