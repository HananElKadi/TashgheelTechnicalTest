from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Get the directory where app.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Update file paths
STUDENTS_FILE = os.path.join(BASE_DIR, 'students.json')
UNIVERSITIES_FILE = os.path.join(BASE_DIR, 'universities.json')

# Utility functions
def load_data(file):
    try:
        if not os.path.exists(file):
            with open(file, 'w') as f:
                json.dump([], f)
            return []
        
        with open(file, 'r') as f:
            data = json.load(f)
            # Ensure data is always a list
            if not isinstance(data, list):
                data = []
            return data
    except json.JSONDecodeError:
        # If file is corrupted, reset it
        with open(file, 'w') as f:
            json.dump([], f)
        return []
    except Exception as e:
        print(f"Error loading {file}: {str(e)}")
        return []

def save_data(file, data):
    try:
        # Ensure data is a list
        if not isinstance(data, list):
            data = []
            
        with open(file, 'w') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Error saving {file}: {str(e)}")

@app.route('/students', methods=['GET'])
def get_students():
    students = load_data(STUDENTS_FILE)
    return jsonify(students)

@app.route('/students', methods=['POST'])
def add_student():
    students = load_data(STUDENTS_FILE)
    data = request.get_json()
    
    # Validate required fields
    if not data or 'name' not in data or 'university_id' not in data:
        return jsonify({"error": "Missing required fields"}), 400
        
    new_id = len(students) + 1
    new_student = {
        "id": new_id,
        "name": data['name'],
        "university_id": data['university_id']
    }
    students.append(new_student)
    save_data(STUDENTS_FILE, students)
    return jsonify(new_student), 201

@app.route('/universities', methods=['GET'])
def get_universities():
    universities = load_data(UNIVERSITIES_FILE)
    return jsonify(universities)

@app.route('/universities', methods=['POST'])
def add_university():
    universities = load_data(UNIVERSITIES_FILE)
    data = request.get_json()
    
    # Validate required fields
    if not data or 'name' not in data:
        return jsonify({"error": "Missing required fields"}), 400
        
    new_id = len(universities) + 1
    new_university = {
        "id": new_id,
        "name": data['name']
    }
    universities.append(new_university)
    save_data(UNIVERSITIES_FILE, universities)
    return jsonify(new_university), 201

if __name__ == '__main__':
    app.run(debug=True)
    

