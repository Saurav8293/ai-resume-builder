from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Backend is running!"

@app.route("/test-api", methods=["GET"])
def test_api():
    return {
        "status": "success",
        "message": "Frontend successfully connected to backend"
    }




if __name__ == "__main__":
    app.run(debug=True)