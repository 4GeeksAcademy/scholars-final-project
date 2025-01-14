#import schedule
import time
#import requests
from flask import Flask, request, jsonify, url_for, Blueprint, send_from_directory
from api.models import db, Students, Teachers, Assignment
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

@api.route('chatbot', methods =['POST', 'GET'])
def handle_chatbot():
     
    if request.method == 'POST':
        data = request.get_json() 
        message = data.get('message', 'No message provided')
        chatbot_response = get_chatbot_response(message)
        return jsonify({"message": chatbot_response}), 200
    
    response_body = {
        "message": "asd"
    }
    return jsonify(response_body), 200


@api.route("/assignments", methods=["GET"])
def get_all_assignments():

    all_assignments = Assignment.query.all()

    if not all_assignments:
        return jsonify([]), 
    
    # Serialize assignments and return them in the response
    all_assignments = list(map(lambda x: x.serialize(), all_assignments))
    return jsonify(all_assignments), 200


@api.route("/assignments/<int:assignment_id>", methods=["GET"])
def get_assignment(assignment_id):
    single_assignment = Assignment.query.get(assignment_id)

    if single_assignment is None:
        raise APIException(f'Assignment ID {assignment_id} is not found!', status_code=404)
    
    single_assignment = single_assignment.serialize()
    return jsonify(single_assignment), 200


@api.route("/assignments", methods=["POST"])
def create_assignment():
    try:
        # Parse the incoming JSON data from the request
        data = request.get_json()

        if not data or 'title' not in data or 'deadline' not in data:
            raise APIException("Missing required fields: 'title' and 'deadline'", status_code=400)

        # Create a new Assignment object from the data
        new_assignment = Assignment(
            title=data['title'],
            deadline=data['deadline']  # Make sure 'due_date' is in the correct format (datetime)
        )

        # Add the new assignment to the session and commit to the database
        db.session.add(new_assignment)
        db.session.commit()

        # Serialize the newly created assignment and return it in the response
        serialized_assignment = new_assignment.serialize()

        return jsonify(serialized_assignment),

    except APIException as e:
        return jsonify({"message": str(e)}), e.status_code

    except Exception as e:
        return jsonify({"message": "An unexpected error occurred.", "error": str(e)}), 500