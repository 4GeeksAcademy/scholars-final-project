"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
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