import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Student from "./components/Student";

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    axios
      .get("https://www.hatchways.io/api/assessment/students")
      .then((res) => {
        const students = res.data.students;
        this.studentData(students);
      })
      .catch((err) => console.log(err));
  }

  studentData = (students) => {
    let studentArray = [];
    const add = (a, b) => {
      return Number(a) + Number(b);
    };

    students.forEach((student) => {
      const grades = student.grades;
      const sum = grades.reduce(add);
      const average = `${sum / grades.length}%`;
      const obj = {
        pic: student.pic,
        firstName: student.firstName.toLowerCase(),
        lastName: student.lastName.toLowerCase(),
        name: `${student.firstName} ${student.lastName}`,
        company: student.company,
        email: student.email,
        skill: student.skill,
        gradeArray: student.grades,
        average: average,
        key: student.id,
        tags: [],
      };
      studentArray.push(obj);
    });

    this.setState({
      students: studentArray,
      filteredArray: studentArray,
    });
  };

  addTag = (id, tags) => {
    const students = Array.from(this.state.students);
    students[id - 1].tags = tags;
    this.setState({
      students,
    });
  };

  handleNameChange = (e) => {
    const searchQuery = e.target.value.toLowerCase();

    const match = (students) => {
      return (
        students.firstName.includes(searchQuery) ||
        students.lastName.includes(searchQuery)
      );
    };

    const filteredArray = this.state.students.filter(match);

    this.setState({
      filteredArray: filteredArray,
    });
  };

  handleTagChange = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    let tagMatchArray = this.state.students;
    let filteredArray = this.state.students;

    const match = (student) => {
      return student.tagMatch === true;
    };

    tagMatchArray.forEach((student) => {
      student.tags.forEach((tag) => {
        student.tagMatch = false;
        if (tag.includes(searchQuery)) {
          student.tagMatch = true;
        }
      });
    });

    filteredArray = tagMatchArray.filter(match);

    if (searchQuery.length === 0) {
      filteredArray = this.state.students;
    }

    this.setState({
      filteredArray: filteredArray,
    });
  };

  render() {
    return (
      <div className="App">
        <section className="studentContainer">
          <form action="" className="searchForm">
            <input
              id="name-input"
              type="text"
              placeholder="Search by name"
              onChange={this.handleNameChange}
            />
            <input
              id="tag-input"
              type="text"
              placeholder="Search by tag"
              onChange={this.handleTagChange}
            />
          </form>

          {this.state.students ? (
            <div>
              {this.state.filteredArray.map((student) => {
                return (
                  <Student
                    key={student.key}
                    student={student}
                    addTag={this.addTag}
                  />
                );
              })}
            </div>
          ) : null}
        </section>
      </div>
    );
  }
}

export default App;
