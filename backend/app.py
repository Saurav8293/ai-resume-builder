from flask import Flask
from flask_cors import CORS
from routes.resume_routes import resume_bp
from routes.ats_routes import ats_bp
app.register_blueprint(ats_bp)

from routes.optimize_routes import optimize_bp
app.register_blueprint(optimize_bp)

app = Flask(__name__)
CORS(app)
app.register_blueprint(resume_bp)


@app.route("/")
def home():
    return "Backend is running!"


if __name__ == "__main__":
    app.run(debug=True)