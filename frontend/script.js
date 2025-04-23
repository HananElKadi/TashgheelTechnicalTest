const universityList = document.getElementById('university-list');
const universitySelect = document.getElementById('university-select');
const studentList = document.getElementById('student-list');

async function loadUniversities() {
  try {
    // send request to backend(flask) to get universities data 
    const res = await fetch('http://127.0.0.1:5000/universities');
    if (!res.ok) {
      throw new Error('Failed to load universities');
    }
    // get data(universities) from backend in json format 
    const universities = await res.json();
    universityList.innerHTML = '';
    universitySelect.innerHTML = '<option value="">Select University</option>';

    universities.forEach(u => {
      const li = document.createElement('li');
      li.textContent = u.name;
      universityList.appendChild(li);

      const option = document.createElement('option');
      option.value = u.id;
      option.textContent = u.name;
      universitySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading universities:', error);
    alert('Failed to load universities. Please try again later.');
  }
}

async function loadStudents() {
  try {
    const res = await fetch('http://127.0.0.1:5000/students');
    if (!res.ok) {
      throw new Error('Failed to load students');
    }
    const students = await res.json();
    studentList.innerHTML = '';

    students.forEach(s => {
      const li = document.createElement('li');
      li.textContent = `${s.name} (University ID: ${s.university_id})`;
      studentList.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading students:', error);
    alert('Failed to load students. Please try again later.');
  }
}

document.getElementById('university-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('university-name').value.trim();
  
  if (!name) {
    alert('Please enter a university name');
    return;
  }

  try {
    const res = await fetch('http://127.0.0.1:5000/universities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    if (!res.ok) {
      throw new Error('Failed to add university');
    }

    document.getElementById('university-name').value = '';
    await loadUniversities();
  } catch (error) {
    console.error('Error adding university:', error);
    alert('Failed to add university. Please try again.');
  }
});

document.getElementById('student-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('student-name').value.trim();
  const university_id = document.getElementById('university-select').value;

  if (!name) {
    alert('Please enter a student name');
    return;
  }

  if (!university_id) {
    alert('Please select a university');
    return;
  }

  try {
    const res = await fetch('http://127.0.0.1:5000/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, university_id: parseInt(university_id) })
    });

    if (!res.ok) {
      throw new Error('Failed to add student');
    }

    document.getElementById('student-name').value = '';
    await loadStudents();
  } catch (error) {
    console.error('Error adding student:', error);
    alert('Failed to add student. Please try again.');
  }
});

// Load universities and students on page load
loadUniversities();
loadStudents();


