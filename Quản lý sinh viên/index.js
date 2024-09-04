class Student {
    constructor(name, id, gender, birthday, address) {
        this.name = name;
        this.id = id;
        this.gender = gender;
        this.birthday = birthday;
        this.address = address;
    }
}
class Management{
    constructor(){
        this.students = this.loadStudents();
        this.displayStudents();
    }

    loadStudents() {
        let storedStudents = localStorage.getItem('students');
        return storedStudents ? JSON.parse(storedStudents) : [];
    }

    saveStudents() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }

    displayStudents() {
        let table = document.getElementById('table').getElementsByTagName('tbody')[0];
        table.innerHTML = '';

        for(let i = 0; i < this.students.length; i++) {
            let student = this.students[i];
            let row = table.insertRow();
            row.insertCell().textContent = student.name;
            row.insertCell().textContent = student.id;
            row.insertCell().textContent = student.gender;
            row.insertCell().textContent = student.birthday;
            row.insertCell().textContent = student.address;

            let cell = row.insertCell();
            let del = document.createElement('button');
            del.textContent = 'Xoá';
            del.addEventListener('click', () => this.deleteStudent(i));
            cell.appendChild(del);
        }
    }

    addStudent(){
        let name = document.getElementById('name').value;
        let id = document.getElementById('id').value;
        let gender = document.querySelector('input[name="gender"]:checked').value;
        let birthday = document.getElementById('birthday').value;
        let address = document.getElementById('address').value;

        let student = new Student(name, id, gender, birthday, address);
        this.students.push(student);
        this.saveStudents();
        this.displayStudents();
        this.clearForm();
    }
    deleteStudent(index) {
        this.students.splice(index, 1);
        this.saveStudents();
        this.displayStudents();
    }
    clearForm() {
        document.getElementById('form').reset();
    }

}
let studentManagement = new Management();
function addStudent() {
    studentManagement.addStudent();
}