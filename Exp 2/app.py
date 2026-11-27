from flask import Flask, request, jsonify, send_from_directory
import json
import os
from datetime import datetime

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_FILE = os.path.join(BASE_DIR, "user.json")


# =========================================================
# HOME PAGE
# =========================================================

@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


# =========================================================
# CSS
# =========================================================

@app.route("/style.css")
def style():
    return send_from_directory(BASE_DIR, "style.css")


# =========================================================
# JAVASCRIPT
# =========================================================

@app.route("/script.js")
def script():
    return send_from_directory(BASE_DIR, "script.js")


# =========================================================
# SAVE DATA TO JSON
# =========================================================

@app.route("/api/save", methods=["POST"])
def save_data():

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "message": "No data received."
            }), 400


        # -------------------------------------------------
        # Create JSON file if it doesn't exist
        # -------------------------------------------------

        if not os.path.exists(JSON_FILE):

            database = {
                "users": []
            }

        else:

            try:

                with open(
                    JSON_FILE,
                    "r",
                    encoding="utf-8"
                ) as file:

                    database = json.load(file)

            except (json.JSONDecodeError, FileNotFoundError):

                database = {
                    "users": []
                }


        # -------------------------------------------------
        # Make sure users exists
        # -------------------------------------------------

        if "users" not in database:

            database["users"] = []


        # -------------------------------------------------
        # Add approval information
        # -------------------------------------------------

        data["approved"] = True

        data["approved_at"] = datetime.now().isoformat()


        # -------------------------------------------------
        # Add user record
        # -------------------------------------------------

        database["users"].append(data)


        # -------------------------------------------------
        # Save JSON
        # -------------------------------------------------

        with open(
            JSON_FILE,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                database,
                file,
                indent=4
            )


        return jsonify({
            "success": True,
            "message": "Configuration saved successfully."
        })


    except Exception as error:

        print("ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Server error: " + str(error)
        }), 500


# =========================================================
# START FLASK
# =========================================================

if __name__ == "__main__":

    print()
    print("==========================================")
    print("     LIBRARY MANAGEMENT SYSTEM - EXP2")
    print("==========================================")
    print("Flask server is running...")
    print("Open: http://127.0.0.1:5000")
    print("==========================================")
    print()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )