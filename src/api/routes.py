"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from sqlalchemy import select

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# Crea una ruta para autenticar a los usuarios y devolver el token JWT
# La función create_access_token() se utiliza para generar el JWT
@api.route("/login", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Consulta la base de datos por el nombre de usuario y la contraseña
    user = db.session.execute(select(User).where(User.email == email, User.password == password)).scalar_one_or_none()
    if user is None:
        return jsonify({"msg": "Bad username or password"}), 401
    
    # Crea un nuevo token con el id de usuario dentro
    access_token = create_access_token(identity=str(user.id))
    return jsonify({ "token": access_token, "user_id": user.id})


# Protege una ruta con jwt_required, bloquea las peticiones sin un JWT válido
@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Accede a la identidad del usuario actual
    current_user_id = get_jwt_identity()
    user = db.session.get(User, int(current_user_id))
    
    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    return jsonify({"id": user.id, "email": user.email }), 200
