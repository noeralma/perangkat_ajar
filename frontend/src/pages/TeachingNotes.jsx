import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  FloatingLabel,
} from "react-bootstrap";
import axios from "axios";
import moment from "moment";

const routeTeachingNotes = "teaching_notes";
const API_URL_TEACHING_NOTES = `http://localhost:3000/api/${routeTeachingNotes}`;
const ROUTE_STUDENTS = "students";
const API_URL_STUDENTS = `http://localhost:3000/api/${ROUTE_STUDENTS}`;
const ROUTE_CLASSES = "classes";
const API_URL_CLASSES = `http://localhost:3000/api/${ROUTE_CLASSES}`;
const ROUTE_SUBJECTS = "subjects";
const API_URL_SUBJECTS = `http://localhost:3000/api/${ROUTE_SUBJECTS}`;
const ROUTE_TEACHERS = "teachers";
const API_URL_TEACHERS = `http://localhost:3000/api/${ROUTE_TEACHERS}`;

const TeachingNotes = () => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentsDB, setStudentsDB] = useState([]);
  const [classesDB, setClassesDB] = useState([]);
  const [subjectsDB, setSubjectsDB] = useState([]);
  const [teachingNotesDB, setTeachingNotesDB] = useState([]);
  const [teachingNotesStudents, setTeachingNotesStudents] = useState();
  const [teachersDB, setTeachersDB] = useState([]);
  const [isSearch, setSearch] = useState(false);
  const [foundData, setFoundData] = useState(true);
  const [studentsStatus, setStudentsStatus] = useState([]);

  const onChangeStudent = (event) => {
    //  students name
  };

  const onChangeValue = (event) => {
    const studentsArr = teachingNotesDB.slice(1);
    const teachingNotesArr = teachingNotesDB.slice(0, 1);
    let updatedTeachingNotes;
    let updatedStudent;

    updatedTeachingNotes = teachingNotesArr.map((item) => {
      if (event.type === "teaching_notes") {
        if (item.hasOwnProperty("content")) {
          if (event.hasOwnProperty("content")) {
            return { ...item, content: event.content };
          }
        } else if (item.hasOwnProperty("time")) {
          if (event.hasOwnProperty("time")) {
            return { ...item, time: event.time };
          }
        } else if (item.hasOwnProperty("total_content_time")) {
          if (event.hasOwnProperty("total_content_time")) {
            return { ...item, total_content_time: event.total_content_time };
          }
        } else if (item.hasOwnProperty("school_year")) {
          if (event.hasOwnProperty("school_year")) {
            return { ...item, school_year: event.school_year };
          }
        } else if (item.hasOwnProperty("semester")) {
          if (event.hasOwnProperty("semester")) {
            return { ...item, semester: event.semester };
          }
        } else if (item.hasOwnProperty("date")) {
          if (event.hasOwnProperty("date")) {
            return { ...item, date: event.date };
          }
        }
      } else {
        return { ...item };
      }
    });

    updatedStudent = studentsArr.map((student) => {
      if (event.hasOwnProperty("notes")) {
      }
    });
    for (let index = 0; index < studentsArr.length; index++) {
      updatedTeachingNotes.push(studentsArr[index]);
    }
    console.log(event);
    console.log(updatedTeachingNotes);
    console.log(updatedStudent);
    // setTeachingNotesDB(updatedTeachingNotes);
  };

  const searchTeachingNotes = async (event) => {
    event.preventDefault();
    try {
      const date = event.target.date.value;
      const classId = classesDB.filter((classes) => {
        if (classes.id === parseInt(event.target.class.value))
          return classes.id;
      });
      const subjectId = subjectsDB.filter((subject) => {
        if (subject.id === parseInt(event.target.subject.value))
          return subject.id;
      });
      const teacherId = teachersDB.filter((teacher) => {
        if (teacher.id === parseInt(event.target.teacher.value))
          return teacher.id;
      });

      if (
        !classId.includes("Choose") &&
        !subjectId.includes("Choose") &&
        !teacherId.includes("Choose")
      ) {
        setSearch(true);
        const class_name = classId[0].class;
        const subject = subjectId[0].subject;
        const teacher = teacherId[0].teacher;

        const resTeachingNotesDB = await axios.get(
          `${API_URL_TEACHING_NOTES}?date=${date}&subject_id=${subjectId[0].id}&class_id=${classId[0].id}&teacher_id=${teacherId[0].id}`
        );
        setTeachingNotesDB(resTeachingNotesDB.data);

        const resStudents = await axios.get(
          `${API_URL_STUDENTS}?class_id=${classId[0].id}`
        );
        setStudentsDB(resStudents.data);

        const tempStudents = resStudents.data;
        const addStatusStudents = tempStudents.map((item) => {
          return { ...item, presence: "HADIR", notes: "", grade: "" };
        });
        setTeachingNotesStudents(addStatusStudents);

        if (resTeachingNotesDB.data.length === 0) {
          setFoundData(false);
          setTeachingNotesDB([
            {
              date: moment(date).format("YYYY-MM-DD"),
              class: class_name,
              subject: subject,
              teacher: teacher,
              content: "",
              time: "",
              total_content_time: "",
              school_year: "",
              semester: "",
            },
            ...addStatusStudents,
          ]);
        }

        setLoading(false);
      }
    } catch (error) {
      setError("something went wrong");
      setLoading(false);
    }
  };

  const saveChanges = async (event) => {
    event.preventDefault();
  };

  const save = async (event) => {
    event.preventDefault();
    console.log(event.target.elements);
    console.log(teachingNotesDB);
  };

  async function deleteItem() {}

  function refreshPage() {
    window.location.reload();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resClasses = await axios.get(`${API_URL_CLASSES}`);
        const resSubjects = await axios.get(`${API_URL_SUBJECTS}`);
        const resTeachers = await axios.get(`${API_URL_TEACHERS}`);
        setClassesDB(resClasses.data);
        setSubjectsDB(resSubjects.data);
        setTeachersDB(resTeachers.data);

        setLoading(false);
      } catch (err) {
        setError("something went wrong");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Container className="mt-4">Loading...</Container>;
  }
  if (error) {
    return (
      <Container className="mt-4">
        <h2>{error}! Please try again.</h2>
        <Button onClick={refreshPage}>REFRESH PAGE</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* SEARCH */}
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card border="primary">
            <Card.Header className="text-center">
              <strong>Search Teaching Note</strong>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={searchTeachingNotes}>
                <Form.Group className="mb-3">
                  <FloatingLabel label="Date" className="mb-3">
                    <Form.Control type="date" name="date" required />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Select name="class">
                    <option>Choose Class</option>
                    {classesDB &&
                      classesDB.map((class_name) => {
                        return (
                          <option key={class_name.id} value={class_name.id}>
                            {class_name.class}
                          </option>
                        );
                      })}
                    ;
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Select name="subject">
                    <option>Choose Subject</option>
                    {subjectsDB &&
                      subjectsDB.map((subject) => {
                        return (
                          <option key={subject.id} value={subject.id}>
                            {subject.subject}
                          </option>
                        );
                      })}
                    ;
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Select name="teacher">
                    <option>Choose Teacher</option>
                    {teachersDB &&
                      teachersDB.map((teacher) => {
                        return (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.teacher}
                          </option>
                        );
                      })}
                    ;
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Search
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* READ VALUE */}
      <Row className=" justify-content-center mt-5">
        <Col>
          {/* IF SEARCH */}
          {isSearch ? (
            <Card>
              <Card.Body className="text-center">Teaching Notes</Card.Body>
              <Form onSubmit={foundData ? saveChanges : save}>
                <Form.Group className="m-auto mb-3 w-50">
                  <FloatingLabel label="Class" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Class"
                      disabled
                      value={
                        teachingNotesDB.length !== 0 && teachingNotesDB[0].class
                      }
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="m-auto mb-3 w-50">
                  <Form.Select name="teacher">
                    {teachersDB &&
                      teachingNotesDB.length !== 0 &&
                      teachersDB.map((teacher) => {
                        if (teachingNotesDB[0].teacher === teacher.teacher) {
                          return (
                            <option
                              key={teacher.id}
                              value={teacher.id}
                              selected
                            >
                              {teacher.teacher}
                            </option>
                          );
                        } else if (
                          teachingNotesDB[0].teacher !== teacher.teacher
                        ) {
                          return (
                            <option key={subject.id} value={subject.id}>
                              {subject.subject}
                            </option>
                          );
                        }
                      })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="m-auto mb-3 w-50">
                  <Form.Select name="subject">
                    {subjectsDB &&
                      teachingNotesDB.length !== 0 &&
                      subjectsDB.map((subject) => {
                        if (teachingNotesDB[0].subject === subject.subject) {
                          return (
                            <option
                              key={subject.id}
                              value={subject.id}
                              selected
                            >
                              {subject.subject}
                            </option>
                          );
                        } else if (
                          teachingNotesDB[0].subject !== subject.subject
                        ) {
                          return (
                            <option key={subject.id} value={subject.id}>
                              {subject.subject}
                            </option>
                          );
                        }
                      })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="m-auto mb-3 w-50">
                  <FloatingLabel label="Content" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Content"
                      onChange={(e) => {
                        onChangeValue({
                          type: "teaching_notes",
                          content: e.target.value,
                        });
                      }}
                      value={
                        teachingNotesDB.length !== 0 &&
                        teachingNotesDB[0].content
                      }
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="m-auto mb-3 w-50">
                  <FloatingLabel label="Date" className="mb-3">
                    <Form.Control
                      type="date"
                      placeholder="Date"
                      onChange={(e) => {
                        onChangeValue({
                          type: "teaching_notes",
                          date: e.target.value,
                        });
                      }}
                      value={
                        teachingNotesDB.length !== 0 && teachingNotesDB[0].date
                      }
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="m-auto mb-3 w-50">
                  <FloatingLabel label="Time" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Time"
                      onChange={(e) => {
                        onChangeValue({
                          type: "teaching_notes",
                          time: e.target.value,
                        });
                      }}
                      value={
                        teachingNotesDB.length !== 0 && teachingNotesDB[0].time
                      }
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="m-auto mb-3 w-50">
                  <FloatingLabel label="Total Content Time (hours)">
                    <Form.Control
                      className="mb-3"
                      onChange={(e) => {
                        onChangeValue({
                          type: "teaching_notes",
                          total_content_time: e.target.value,
                        });
                      }}
                      value={
                        teachingNotesDB.length !== 0 &&
                        teachingNotesDB[0].total_content_time
                      }
                      type="text"
                      placeholder="Total Content Time"
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="m-auto mb-3 w-50">
                  <FloatingLabel label="School Year" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="School Year"
                      onChange={(e) => {
                        onChangeValue({
                          type: "teaching_notes",
                          school_year: e.target.value,
                        });
                      }}
                      value={
                        teachingNotesDB.length !== 0 &&
                        teachingNotesDB[0].school_year
                      }
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="m-auto mb-3 w-50">
                  <FloatingLabel label="Semester" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Semester"
                      onChange={(e) => {
                        onChangeValue({
                          type: "teaching_notes",
                          semester: e.target.value,
                        });
                      }}
                      value={
                        teachingNotesDB.length !== 0 &&
                        teachingNotesDB[0].semester
                      }
                    />
                  </FloatingLabel>
                </Form.Group>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th className="text-center">Name</th>
                      <th className="text-center">Presence</th>
                      <th className="text-center">Notes</th>
                      <th className="text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachingNotesDB.length !== 0 &&
                      teachingNotesStudents.map((teachingNotes, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td key={index}>
                              <Form.Group className="m-auto mb-2 w-50">
                                <Form.Control
                                  type="text"
                                  value={teachingNotes.student}
                                  disabled
                                />
                              </Form.Group>
                            </td>
                            <td key={index + 2}>
                              <Form.Group className="m-auto mb-2 w-60">
                                <Form.Select
                                  onChange={(e) => {
                                    onChangeValue({
                                      id: teachingNotes.id,
                                      presence: e.target.value,
                                    });
                                  }}
                                  value={teachingNotes.presence}
                                >
                                  <option value="HADIR">HADIR</option>
                                  <option value="ALPA">ALPA</option>
                                  <option value="SAKIT">SAKIT</option>
                                  <option value="NO DATA">NO DATA</option>
                                </Form.Select>
                              </Form.Group>
                            </td>
                            <td key={index + 3}>
                              <Form.Group className="m-auto mb-2 w-50">
                                <Form.Control
                                  type="text"
                                  onChange={(e) => {
                                    onChangeValue({
                                      id: teachingNotes.id,
                                      notes: e.target.value,
                                    });
                                  }}
                                  value={teachingNotes.notes}
                                />
                              </Form.Group>
                            </td>
                            <td key={index + 4}>
                              <Form.Group className="m-auto mb-2 w-50">
                                <Form.Control
                                  type="text"
                                  onChange={(e) => {
                                    onChangeValue({
                                      id: teachingNotes.id,
                                      grade: e.target.value,
                                    });
                                  }}
                                  value={teachingNotes.grade}
                                />
                              </Form.Group>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                {/* button */}
                {foundData ? (
                  <>
                    <Button className="btn btn-warning" type="submit">
                      Save Changes
                    </Button>
                    <Button
                      className="mx-3 btn btn-danger"
                      onClick={deleteItem}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <Button className="btn btn-primary mx-auto" type="submit">
                    Save
                  </Button>
                )}
              </Form>
            </Card>
          ) : (
            ""
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TeachingNotes;
