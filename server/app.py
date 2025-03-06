from flask import Flask, jsonify, session, request
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.user_routes import user_routes
from routes.upload_routes import upload_routes  # Import missing routes
import os
from datetime import timedelta

app = Flask(__name__)

# Configure session
app.secret_key = "your_secret_key_here"  # Change this to a secure random key in production
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)  # Session lasts for 7 days

# Enable CORS with session support
# When using credentials, we can't use wildcard origins
CORS(app, 
     origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"], 
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Handle OPTIONS requests for CORS preflight
@app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
@app.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    return '', 200

# Register authentication routes
app.register_blueprint(auth_bp, url_prefix="/api/auth")  # 🔹 Added "/api/auth"

# Register user routes
app.register_blueprint(user_routes, url_prefix="/api/user")

# Register file upload routes
app.register_blueprint(upload_routes, url_prefix="/api")  # 🔹 Added "/api"

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"message": "API is working!"}), 200

if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(host="0.0.0.0", debug=True, port=3000)