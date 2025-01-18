#import schedule
import time
#import requests
from flask import Flask, request, jsonify, url_for, Blueprint, send_from_directory

from api.models import db, Students, Teachers, Course, Module, Topic, StudentCourse, Resource, Events, Note,Assignment


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
 
############
@api.route('/student/courses', methods=['GET']) 
@jwt_required()
def get_student_courses():
    # Get the current user from the JWT
    current_user = get_jwt_identity()
    student_id, role = current_user.split('|')
    # Find the student by ID
    student = Students.query.get(student_id)
    # Check if the user is a student
    if role != 'student':
        return jsonify({"error": "Only students can access their courses"}), 403


    # Get all courses for the student
    courses = Course.query.join(StudentCourse).filter(StudentCourse.student_id == student_id).all()

    result = []
    for course in courses:
        course_data = {
            "id": course.id,
            "name": course.name
        }
        course_data["modules"] = []
        for module in course.modules:
            module_data = {
                "id": module.id,
                "name": module.name
                }
            module_data["topics"] = [
                {"id": topic.id, "name": topic.name}
                for topic in module.topics
            ]
            course_data["modules"].append(module_data)
            result.append(course_data)

    return jsonify({
        "AllCourses": result
    }), 200

@api.route('/course/<int:course_id>', methods=['GET'])
@jwt_required()
def get_course(course_id):
    # Get the current user from the JWT
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')

    # Check if the user is a student
    if role != 'student':
        return jsonify({"error": "Only students can access course details"}), 403

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
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')

    if role != 'student':
        return jsonify({"error": "Only students can access courses"}), 403

    courses = Course.query.all()
    result = []

    for course in courses:
        course_data = {
            "id": course.id,
            "name": course.name
        }

        course_data["modules"] = []
        for module in course.modules:
            module_data = {
                "id": module.id,
                "name": module.name
            }

            module_data["topics"] = [
                {"id": topic.id, "name": topic.name}
                for topic in module.topics
            ]
            course_data["modules"].append(module_data)
        result.append(course_data)
    return jsonify(result), 200

@api.route('/add-course', methods=['POST'])
@jwt_required()
def add_course():
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')

    if role != 'student':
        return jsonify({"error": "Only students can add courses"}), 403

    data = request.get_json()

    # Validate required fields
    if not data or 'name' not in data:
        return jsonify({"error": "Missing required field: 'name'"}), 400

    # Create the course
    new_course = Course(name=data['name'])
    db.session.add(new_course)
    db.session.flush()  # Retrieve the course ID before committing

    # Add modules and topics if provided
    if 'modules' in data:
        for module_data in data['modules']:
            if 'name' not in module_data:
                return jsonify({"error": "Each module must have a 'name'"}), 400

            # Create a module
            new_module = Module(name=module_data['name'], course_id=new_course.id)
            db.session.add(new_module)
            db.session.flush()  # Retrieve the module ID before committing

            # Add topics if provided
            if 'topics' in module_data:
                for topic_name in module_data['topics']:
                    new_topic = Topic(name=topic_name, module_id=new_module.id)
                    db.session.add(new_topic)

    # Commit all changes to the database
    db.session.commit()

    return jsonify({"message": "Course created successfully", "course_id": new_course.id}), 201

@api.route('/add_course_to_student', methods=['POST'])
@jwt_required()
def add_course_to_student():
    current_user = get_jwt_identity()
    student_id, role = current_user.split('|')

    if role != 'student':
        return jsonify({"error": "Only students can enroll in courses"}), 403

    data = request.get_json()

    # Validate input
    if not data or 'course_id' not in data:
        return jsonify({"error": "Missing required field: 'course_id'"}), 400
 
    # Check if the course exists
    course = Course.query.get(data['course_id'])
    if not course:
        return jsonify({"error": "Course not found"}), 404

    # Check if the relationship already exists
    existing_record = StudentCourse.query.filter_by(student_id=student_id, course_id=data['course_id']).first()
    if existing_record:
        return jsonify({"message": "Student is already enrolled in this course"}), 200

    # Add the student-course relationship
    new_student_course = StudentCourse(student_id=student_id, course_id=data['course_id'])
    db.session.add(new_student_course)
    db.session.commit()

    return jsonify({"message": "Course added to student successfully"}), 201

@api.route('/unenroll-course', methods=['DELETE'])
@jwt_required()
def unenroll_course():
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')

    if role != 'student':
        return jsonify({"error": "Only students can unenroll from courses"}), 403

    data = request.get_json()

    # Validate input
    if not data or 'course_id' not in data:
        return jsonify({"error": "Missing required field: 'course_id'"}), 400

    # Ensure the authenticated user is the one unenrolling
    if int(user_id) != data.get('user_id', int(user_id)):
        return jsonify({"error": "You are not authorized to unenroll another student"}), 403

    # Check if the course exists
    course = Course.query.get(data['course_id'])
    if not course:
        return jsonify({"error": "Course not found"}), 404

    # Check if the relationship exists
    existing_record = StudentCourse.query.filter_by(user_id=user_id, course_id=data['course_id']).first()
    if not existing_record:
        return jsonify({"error": "Student is not enrolled in this course"}), 404

    # Remove the student-course relationship
    db.session.delete(existing_record)
    db.session.commit()

    return jsonify({"message": "Course removed from student successfully"}), 200

@api.route('/courses/<int:course_id>', methods=['PUT'])
@jwt_required()
def update_course(course_id):
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')

    if role != 'student':
        return jsonify({"error": "Only students can update courses"}), 403

    data = request.get_json()
    course = Course.query.get_or_404(course_id)

    if not data or 'name' not in data:
        return jsonify({"error": "Missing 'name' in request data"}), 400

    course.name = data['name']
    db.session.commit()
    return jsonify(course.serialize()), 200

@api.route('/delete-course/<int:course_id>', methods=['DELETE'])
@jwt_required()
def delete_course(course_id):
    
    try:
        current_user = get_jwt_identity()
        user_id, role = current_user.split('|')

        if role != 'student':
            return jsonify({"error": "Only students can delete courses"}), 403

        course = Course.query.get(course_id)
        if not course:
            return jsonify({"error": "Course not found"}), 404
        
        db.session.delete(course)
        db.session.commit()
        return jsonify({"message": f"Course with ID {course_id} deleted successfully"}), 200
        # Find the course by its ID
    
    except Exception as e:
        db.session.rollback()  # Rollback in case of an error
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@api.route('/resources', methods=['POST'])
@jwt_required()
def create_resource():
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')

    if role != 'student':
        return jsonify({"error": "Only students can create resources"}), 403

    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "Missing 'url' in request data"}), 400

    resource = Resource(url=data['url'], topic_id=data.get('topic_id'))
    db.session.add(resource)
    db.session.commit()
    return jsonify(resource.serialize()), 201

@api.route('/resources/<int:resource_id>', methods=['PUT'])
@jwt_required()
def update_resource(resource_id):
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')

    if role != 'student':
        return jsonify({"error": "Only students can update resources"}), 403

    data = request.get_json()
    resource = Resource.query.get_or_404(resource_id)

    if not data:
        return jsonify({"error": "Missing request data"}), 400

    resource.url = data.get('url', resource.url)
    resource.topic_id = data.get('topic_id', resource.topic_id)
    db.session.commit()
    return jsonify(resource.serialize()), 200

@api.route('/resources/<int:resource_id>', methods=['DELETE'])
@jwt_required()
def delete_resource(resource_id):
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')

    if role != 'student':
        return jsonify({"error": "Only students can delete resources"}), 403

    resource = Resource.query.get_or_404(resource_id)
    db.session.delete(resource)
    db.session.commit()
    return jsonify({"message": "Resource deleted."}), 200

@api.route('/resources/by_topic/<int:topic_id>', methods=['GET'])
@jwt_required()
def get_resources_by_topic(topic_id):
    current_user = get_jwt_identity()
    user_id, role = current_user.split('|')

    if role != 'student':
        return jsonify({"error": "Only students can access resources by topic"}), 403

    resources = Resource.query.filter_by(topic_id=topic_id).all()
    if not resources:
        return jsonify({"message": "No resources found for the given topic ID."}), 404
    return jsonify([resource.serialize() for resource in resources]), 200

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
def get_all_assignments():

    all_assignments = Assignment.query.all()

    if not all_assignments:
        return jsonify([]) 
    
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

        return jsonify(serialized_assignment)

    except APIException as e:
        return jsonify({"message": str(e)}), e.status_code

    except Exception as e:
        return jsonify({"message": "An unexpected error occurred.", "error": str(e)}), 500

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
