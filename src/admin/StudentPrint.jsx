import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admincss/results.css";
import logo from "../assets/images/kns_logo.png"

export default function StudentPrint({ student }) {
    const [subjects, setSubjects] = useState([]);
    const [examResult, setExamResult] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/api/subjects")
            .then(res => setSubjects(res.data))
            .catch(() => setSubjects([]));
    }, []);

    useEffect(() => {
        if (!student?._id) return;

        axios
            .get(`http://localhost:5000/api/exam/result/${student._id}`)
            .then(res => setExamResult(res.data))
            .catch(() => setExamResult(null));
    }, [student]);

    if (!student) return null;

    return (
        <div id="print-area">


            <img
                src={logo}
                alt="Kolehiyo ng Subic Logo"
                style={{ width: "80px", height: "auto", marginBottom: "100px", position: "absolute", marginLeft: "150px" }}
            />
            <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>
                KOLEHIYO NG SUBIC
            </div>

            <div style={{ textAlign: "center" }}>
                Subic, Zambales
            </div>

            <h3 style={{ textAlign: "center", marginTop: "10px" }}>
                REGISTRATION FORM
            </h3>

            <hr />

            <div style={{ marginTop: "4px", marginBottom: "15px", padding: "15px", fontSize: "13px" }}>

                <div className="info-row">
                    <span className="label">
                        DATE:{" "}
                        <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                            {new Date(student.createdAt).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }).toUpperCase()}
                        </span>
                    </span>
                </div>

                <div className="info-row" style={{ marginTop: "12px", marginBottom: "8px" }}>
                    <span className="label">
                        Name: <span style={{ fontWeight: "bold" }}>{student.name}</span>
                    </span>

                    <span className="label" style={{ marginLeft: "220px" }}>
                        SEX: <span style={{ fontWeight: "bold" }}>{student.sex}</span>
                    </span>
                </div>

                <div className="info-row" style={{ marginBottom: "8px" }}>
                    <span className="label">
                        Address of School Last Attended:
                        <span style={{ fontWeight: "bold" }}> {student.lastSchoolAddress}</span>
                    </span>
                </div>

                <div className="info-row" style={{ marginBottom: "8px" }}>
                    <span className="label">
                        Course Taken (for transferees only):
                        <span style={{ fontWeight: "bold" }}> {student.transfereeCourse}</span>
                    </span>
                </div>

                <div style={{ marginTop: "20px", marginBottom: "15px" }}>
                    <span style={{
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "10px"
                    }}>
                        COURSE TO BE TAKEN IN THIS INSTITUTION:
                    </span>

                    <div style={{ display: "flex", marginBottom: "8px" }}>
                        <span style={{ fontWeight: "bold", width: "200px", textTransform: "uppercase" }}>
                            FIRST CHOICE:
                        </span>
                        <span style={{ minWidth: "400px" }}>
                            {student.firstCourse}
                        </span>
                    </div>

                    <div style={{ display: "flex" }}>
                        <span style={{ fontWeight: "bold", width: "200px", textTransform: "uppercase" }}>
                            SECOND CHOICE:
                        </span>
                        <span style={{ minWidth: "400px" }}>
                            {student.secondCourse}
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        marginTop: "20px",
                        fontWeight: "bold",
                        borderTop: "2px solid black",
                        borderLeft: "2px solid black",
                        fontSize: "11px",
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            borderBottom: "2px solid black",
                            borderRight: "2px solid black",
                            padding: "8px",
                        }}
                    >
                        INCOMING FIRST YEAR
                    </div>
                    <div
                        style={{
                            textAlign: "center",
                            borderBottom: "2px solid black",
                            borderRight: "2px solid black",
                            padding: "8px",
                        }}
                    >
                        FOR TRANSFEREE
                    </div>

                    {[
                        "( ) High School Card/Form 138",
                        "( ) Certificate of Good Moral Character",
                        "( ) Barangay Certificate of Residency",
                        "( ) Two (2) 2X2 Colored Pictures",
                        "( ) PSA Certified Birth Certificate (1 Original and 1 Photocopy)",
                        "( ) Two (2) 2X2 Long Brown Envelopes",
                    ].map((item, index) => (
                        <div
                            key={index}
                            style={{
                                borderBottom: "2px solid black",
                                borderRight: "2px solid black",
                                padding: "8px",
                            }}
                        >
                            {item}
                        </div>
                    ))}

                    {[
                        "( ) Transcript of record/certificate of Grades",
                        "( ) Honorable Dismissal",
                        "( ) Barangay Certificate of Residency",
                        "( ) Two (2) 2X2 Colored Pictures",
                        "( ) PSA Certified Birth Certificate (1 Original and 1 Photocopy)",
                        "( ) Two (2) 2X2 Long Brown Envelopes",
                    ].map((item, index) => (
                        <div
                            key={index}
                            style={{
                                borderBottom: "2px solid black",
                                borderRight: "2px solid black",
                                padding: "8px",
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        textAlign: "center",
                        marginLeft: "400px",
                        marginTop: "30px",
                        fontWeight: "bold",
                        fontSize: "12px",
                    }}
                >
                    <span style={{ textDecoration: "underline" }}>Ms. Thelma Laxamana</span>
                    <br />
                    Registrar
                </div>

                <hr />
                <div className="info-row" style={{ paddingTop: "50px" }}>
                    <span className="label" style={{ marginLeft: "390px" }}>
                        DATE:{" "}
                        <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                            {new Date(student.createdAt).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }).toUpperCase()}
                        </span>
                    </span>
                </div>

                <div className="location" style={{ paddingTop: "20px" }}>
                    Mr./Ms: <span style={{ fontWeight: "bold" }}>{student.name} </span> is granted to take Entrance Examination{" "}
                    <span style={{ fontWeight: "bold" }}>
                        {new Date(student.createdAt).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }).toUpperCase()}
                    </span>
                </div>

                <div
                    style={{
                        textAlign: "center",
                        marginLeft: "400px",
                        marginTop: "30px",
                        fontWeight: "bold",
                        fontSize: "12px",
                    }}
                >
                    <span style={{ textDecoration: "underline" }}>Ms. Thelma Laxamana</span>
                    <br />
                    Registrar
                </div>

                <br />

                <h3 style={{ marginTop: "25px" }}>Entrance Examination Results</h3>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        rowGap: "6px",
                        columnGap: "120px",
                        width: "60%",
                        marginTop: "15px",
                        marginBottom: "15px",
                        textAlign: "left"
                    }}
                >
                    {subjects.map((s) => {
                        const key = s.name.toLowerCase().replace(/\s+/g, "");
                        const score = examResult?.subjectScores?.[key] || 0;

                        return (
                            <div key={s._id} style={{ display: "flex", gap: "8px" }}>
                                <span style={{ width: "20px", fontWeight: "bold" }}>
                                    {score}
                                </span>

                                <span>{s.name}</span>
                            </div>
                        );
                    })}
                </div>

                <div
                    style={{
                        fontWeight: "bold",
                        marginTop: "10px",
                        textAlign: "right",
                        width: "60%"
                    }}
                >
                    TOTAL SCORE: {examResult?.totalScore || 0}
                </div>


                <div style={{ textAlign: "center", marginLeft: "400px", marginTop: "30px" }}>
                    _______________________<br />
                    Signature
                </div>

                <div style={{ marginTop: "20px" }}>
                    Noted by:
                    <br />
                    <br />
                    <br />
                    <strong>PABLO MENDIOGARIN , MAED-GC</strong><br />
                    <span style={{ textAlign: "center", marginLeft: "45px" }}>Guidance Counselor</span>
                </div>
            </div>

        </div>
    );
}
