#import schedule
import time
#import requests
from flask import Flask, request, jsonify, url_for, Blueprint, send_from_directory

from api.models import db, Students, Teachers, Course, Module, Topic, StudentCourse, Resource, Events, Note,Assignment, student_assignment


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

@api.route('/create_event', methods=['POST'])
@jwt_required()
def create_event():
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')
    user = None
    if role == 'student':
        user = Students.query.get(user_id)
    elif role == 'teacher':
        return jsonify({'error': 'Teachers dont have calendars around here'}, 400)
    if not user:
        return jsonify({'error': 'user not found'}), 404

    title = request.json.get('title')
    start = request.json.get('start')

    if not title:
        return jsonify({'error': 'Title is required'}, 400)
    if not start:
        return jsonify({'error': 'Start is required'}, 400)

    new_event = Events(
        student_id=user.id,
        title=title,
        start=start,
        )
    db.session.add(new_event)
    db.session.commit()
    return jsonify(new_event.serialize()), 200

@api.route('/edit_event', methods=['POST'])
@jwt_required()
def edit_event():
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')
    user = None
    if role == 'student':
        user = Students.query.get(user_id)
    elif role == 'teacher':
        return jsonify({'error': 'Teachers dont have calendars around here'}, 400)
    if not user:
        return jsonify({'error': 'user not found'}), 404

    event_id = request.json.get('id')
    title = request.json.get('title')
    start = request.json.get('start')

    if not event_id:
        return jsonify({'error': 'Event ID is required'}, 400)
    if not title:
        return jsonify({'error': 'Title is required'}, 400)
    if not start:
        return jsonify({'error': 'Start is required'}, 400)
    
    print('event_id: ' + event_id)
    print('title: ' + title)
    print('start: ' + start)

    event = Events.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404

    event.title = title
    event.start = start
    db.session.commit()
    return jsonify(event.serialize()), 200

@api.route('/delete_event', methods=['DELETE'])
@jwt_required()
def delete_event():
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')
    user = None
    if role == 'student':
        user = Students.query.get(user_id)
    elif role == 'teacher':
        return jsonify({'error': 'Teachers dont have calendars around here'}, 400)
    if not user:
        return jsonify({'error': 'user not found'}), 404

    event_id = request.json.get('id')
    if not event_id:
        return jsonify({'error': 'Event ID is required'}, 400)

    event = Events.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404

    db.session.delete(event)
    db.session.commit()
    return jsonify({'success': True}), 200

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
 
@api.route('/student/<int:student_id>/courses', methods=['GET'])
def get_student_courses(student_id):
    # Find the student by ID
    student = Students.query.get(student_id)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    # Get all courses for the student
    courses = Course.query.join(StudentCourse).filter(StudentCourse.user_id == student_id).all()

    # Serialize the courses
    serialized_courses = [course.serialize() for course in courses]

    return jsonify({
        "student_id": student_id,
        "student_name": student.username,
        "courses": serialized_courses
    }), 200

@api.route('/course/<int:course_id>', methods=['GET'])
def get_course_with_modules_and_topics(course_id):
    # Find the course by its ID
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": "Course not found"}), 404

    # Serialize course data with modules and topics
    course_data = {
        "id": course.id,
        "name": course.name,
        "modules": [
            {
                "id": module.id,
                "name": module.name,
                "topics": [
                    {"id": topic.id, "name": topic.name}
                    for topic in module.topics
                ]
            }
            for module in course.modules
        ]
    }

    return jsonify(course_data), 200

@api.route('/courses', methods=['GET'])
@jwt_required()
def get_courses():
    if request.method == 'GET':
        courses = Course.query.all()
        return jsonify([course.serialize() for course in courses]), 200
    return jsonify({'error': 'you must be logged in'}), 405

@api.route('/add_course_to_student', methods=['POST'])
@jwt_required()
def add_course_to_student():
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')
    print('user_id: ' + user_id)
    if role != 'student':
        return jsonify({'error': 'Only students can enroll in courses'}), 403
    
    course_id = request.json.get('course_id')

    # Validate input
    if not course_id:
        return jsonify({"error": "Course ID is required"}), 400
    # Check if the student exists
    student = Students.query.get(user_id)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    # Check if the course exists
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": "Course not found"}), 404

    # Check if the relationship already exists
    existing_record = StudentCourse.query.filter_by(student_id=user_id, course_id=course_id).first()
    if existing_record:
        return jsonify({"message": "Student is already enrolled in this course"}), 200

    # Add the student-course relationship
    new_student_course = StudentCourse(student_id=user_id, course_id=course_id)
    db.session.add(new_student_course)
    db.session.commit()

    return jsonify({"message": "Course added to student successfully"}), 201

@api.route('/resources/by_topic/<int:topic_id>', methods=['GET'])
def get_resources_by_topic(topic_id):
    """
    Fetch all resources associated with a specific topic_id.
    """
    resources = Resource.query.filter_by(topic_id=topic_id).all()
    if not resources:
        return jsonify({"message": "No resources found for the given topic ID."}), 404
    return jsonify([resource.serialize() for resource in resources]), 200
# POST a new resource
@api.route('/resources', methods=['POST'])
def create_resource():
    """
    request body below 
    {
    "url": "https://example.com/resource",
    "topic_id": 1
    }
    """
    data = request.get_json()
    if not data or 'url' not in data:
        abort(400, "Missing 'url' in request data.")
    resource = Resource(url=data['url'], topic_id=data.get('topic_id'))
    db.session.add(resource)
    db.session.commit()
    return jsonify(resource.serialize()), 201

# PUT (update) an existing resource
@api.route('/resources/<int:resource_id>', methods=['PUT'])
def update_resource(resource_id):
    """
    Request body is below
    {
        "id": resource id,
        "topic_id": topic id,
        "url": "URL that you are gonna put"
    }
    """
    resource = Resource.query.get_or_404(resource_id)
    data = request.get_json()
    if not data:
        abort(400, "Missing request data.")
    resource.url = data.get('url', resource.url)
    resource.topic_id = data.get('topic_id', resource.topic_id)
    db.session.commit()
    return jsonify(resource.serialize()), 200

# DELETE a resource
@api.route('/resources/<int:resource_id>', methods=['DELETE'])
def delete_resource(resource_id):
    resource = Resource.query.get_or_404(resource_id)
    db.session.delete(resource)
    db.session.commit()
    return jsonify({"message": "Resource deleted."}), 200

@api.route('/topic/<int:topic_id>/notes', methods=['POST'])
def add_note_from_topic(topic_id):
    data = request.json
    new_note = Note(
        content = data['content'],
        topic_id = topic_id,
        student_id = data['student_id']
    )
    db.session.add(new_note)
    db.session.commit()
    return jsonify(new_note.serialize()), 201

@api.route('/notes', methods=['GET'])
@jwt_required()
def get_notes():
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')
    if role == 'student':
        notes = Note.query.filter_by(students_id=user_id).all()
        return jsonify([note.to_dict() for note in notes])
    else:
        return jsonify({'Error':'You can`t be a Teacher'}), 404
        

@api.route('/notes', methods=['POST'])
def add_note():
    data = request.json
    new_note = Note(
        content = data['content'],
        topic_id = data['topic_id'],
        student_id = data['student_id']
    )
    db.session.add(new_note)
    db.session.commit()
    return jsonify(new_note.serialize()), 201

@api.route('/notes/<int:note_id>', methods=['PUT'])
def edit_note(note_id):
    data = request.json
    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found"}), 404
    note.content = data['content']
    db.session.commit()
    return jsonify(note.serialize()), 200

@api.route('/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found"}), 404
    db.session.delete(note)
    db.session.commit()
    return jsonify({"message":"Note deleted"}), 200

@api.route("/assignments", methods=["GET"])
@jwt_required()
def get_all_assignments():

    current_user = get_jwt_identity()
    user_id, role = current_user.split ('|')

    if role == 'student':
        assignments = Assignment.query.filter_by(student_id=user_id).all()
    else: 
        return jsonify({'Error: Need Teacher Access'}), 404    


@api.route("/assignments", methods=["POST"])
@jwt_required()
def create_assignment():
        
        current_user = get_jwt_identity()
        user_id, role = current_user.split('|')
        # Parse the incoming JSON data from the request
        #data = request.get_json()
        if role != 'teacher':
            return jsonify({'Error': 'Only teachers can upload assignments.'}, 403)
        
        assignment_title = request.json.get('assignment_name')
        assignment_deadline = request.json.get('assignment_deadline')

        if not assignment_title:
            return jsonify({'Error': "Assignment Title is required"}, 400)
        new_assignment = Assignment(title=assignment_title, deadline=assignment_deadline, teacher_id=user_id)
        
        db.session.add(new_assignment)
        db.session.commit()

        return jsonify(new_assignment.serialize()), 201

    # except APIException as e:
    #     return jsonify({"message": str(e)}), e.status_code

    # except Exception as e:
    #     return jsonify({"message": "An unexpected error occurred.", "error": str(e)}), 500

@api.route('add_assignment_to_student', methods=['POST'])
@jwt_required()
def add_assignment_to_student():
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')

    if role != 'teacher':
        return jsonify({"error": "Only teachers can add assignments to a student."}), 403

    assignment_id = request.json.get('assignment_id')

    if not assignment_id:
        return jsonify({'error': 'Assignment ID required'}), 400

    teacher = Teachers.query.get(user_id)  
    if not teacher:
        return jsonify({'error': 'Teacher not found'}), 404
    
    assignment = Assignment.query.get(assignment_id)
    if not assignment:
        return jsonify({'error': 'Assignment not found'}), 404
    
    existing_assignment = student_assignment.query.filter_by(student_id=user_id, assignment_id=assignment_id).first()
    if existing_assignment:
        return jsonify({'message': 'Assignment is already assigned to student'}), 200
    
    new_assignment = student_assignment(student_id=user_id, assignment_id=assignment_id)
    db.session.add(new_assignment)
    db.session.commit()

@api.route('/create_course', methods=['POST'])
@jwt_required()
def create_course():
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')
    if role != 'teacher':
        return jsonify({'error': 'Only teachers can create courses'}, 403)
    course_name = request.json.get('course_name')
    course_description = request.json.get('course_description')
    if not course_name:
        return jsonify({'error': 'Course name is required'}, 400)
    new_course = Course(name=course_name, description=course_description, teacher_id=user_id)

    db.session.add(new_course)
    db.session.commit()
    return jsonify(new_course.serialize()), 201


@api.route('/drop_course_from_student', methods=['POST'])
@jwt_required()
def drop_course():
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')
    if role != 'student':
        return jsonify({'error': 'Only students can drop courses'}, 403)
    course_id = request.json.get('course_id')
    if not course_id:
        return jsonify({'error': 'Course ID is required'}, 400)
    student_course = StudentCourse.query.filter_by(student_id=user_id, course_id=course_id).first()
    if not student_course:
        return jsonify({'error': 'Student is not enrolled in that course'}, 404)
    db.session.delete(student_course)
    db.session.commit()
    return jsonify({'message': 'Course dropped successfully'}), 200

@api.route('/module/<int:module_id>', methods=['PUT'])
@jwt_required()
def update_module(module_id):
    """
    Update the name of a module by its ID.
    """
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')
    if role != 'teacher':
        return jsonify({'error': 'Only teacher can edit courses'}, 403)
    data = request.json  # Get the JSON payload
    new_name = data.get('name')

    if not new_name:
        return jsonify({"error": "Name is required"}), 400

    # Find the module by ID
    module = Module.query.get(module_id)
    if not module:
        return jsonify({"error": "Module not found"}), 404

    # Update the module name
    module.name = new_name
    db.session.commit()

    return jsonify({"message": "Module updated successfully", "module": module.serialize()}), 200

@api.route('/module', methods=['POST'])
@jwt_required()
def create_module():
    """
    Create a new module and associate it with a course.
    """
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')
    if role != 'teacher':
        return jsonify({'error': 'Only teacher can edit courses'}, 403)
    data = request.json  # Get JSON payload
    course_id = data.get('course_id')
    module_name = data.get('name')

    if not course_id or not module_name:
        return jsonify({"error": "course_id and name are required"}), 400

    # Check if the course exists
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": "Course not found"}), 404

    # Create a new module
    new_module = Module(name=module_name, course_id=course_id)
    db.session.add(new_module)
    db.session.commit()

    return jsonify({
        "message": "Module created successfully",
        "module": new_module.serialize()
    }), 201

@api.route('/module/<int:module_id>', methods=['DELETE'])
@jwt_required()
def delete_module(module_id):
    """
    Delete a module by its ID.
    """
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')
    if role != 'teacher':
        return jsonify({'error': 'Only teacher can edit courses'}, 403)
    # Check if the module exists
    module = Module.query.get(module_id)
    if not module:
        return jsonify({"error": "Module not found"}), 404

    # Delete the module
    db.session.delete(module)
    db.session.commit()

    return jsonify({"message": "Module deleted successfully"}), 200

@api.route('/topic/<int:topic_id>', methods=['PUT'])
@jwt_required()
def update_topic(topic_id):
    """
    Update the name of a topic by its ID.
    """
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')
    if role != 'teacher':
        return jsonify({'error': 'Only teacher can edit courses'}, 403)
    data = request.json  # Get the JSON payload
    new_name = data.get('name')

    if not new_name:
        return jsonify({"error": "Name is required"}), 400

    # Find the topic by ID
    topic = Topic.query.get(topic_id)
    if not topic:
        return jsonify({"error": "Topic not found"}), 404

    # Update the topic name
    topic.name = new_name
    db.session.commit()

    return jsonify({"message": "Topic updated successfully", "topic": topic.serialize()}), 200

@api.route('/topic/<int:topic_id>', methods=['DELETE'])
@jwt_required()
def delete_topic(topic_id):
    """
    Delete a topic by its ID.
    """
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')
    if role != 'teacher':
        return jsonify({'error': 'Only teacher can edit courses'}, 403)
    # Query the topic by ID
    topic = Topic.query.get(topic_id)
    if not topic:
        return jsonify({"error": "Topic not found"}), 404

    # Delete the topic
    db.session.delete(topic)
    db.session.commit()

    return jsonify({"message": "Topic deleted successfully"}), 200

# @api.route('/module/<int:module_id>', methods=['DELETE'])
# @jwt_required()
# def delete_module(module_id):
    """
    Delete a topic by its ID.
    """
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')
    if role != 'teacher':
        return jsonify({'error': 'Only teacher can edit courses'}, 403)
    # Query the topic by ID
    module = Module.query.get(module_id)
    if not module:
        return jsonify({"error": "Module not found"}), 404

    # Delete the topic
    db.session.delete(module)
    db.session.commit()

    return jsonify({"message": "Module deleted successfully"}), 200