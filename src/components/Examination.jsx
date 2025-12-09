import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../css/student_css/examination.css';

export default function Examination() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isExamFinished, setIsExamFinished] = useState(false);

    const user = JSON.parse(localStorage.getItem("exam_user"));

    useEffect(() => {
        const saved = localStorage.getItem("saved_answers");
        if (saved) {
            setAnswers(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("saved_answers", JSON.stringify(answers));
    }, [answers]);

    useEffect(() => {
        fetch("http://localhost:5000/api/questions")
            .then(res => res.json())
            .then(data => setQuestions(data))
            .catch(() => Swal.fire("Error", "Failed to load questions", "error"));
    }, []);

    async function finishExam() {
        const confirm = await Swal.fire({
            title: "Submit Exam?",
            text: "Are you sure you want to finish and submit?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, submit",
            cancelButtonText: "Cancel"
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await fetch("http://localhost:5000/api/exam/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user?._id,
                    answers: answers
                })
            });

            const data = await res.json();

            if (!data.success) {
                Swal.fire("Error", "Failed to save exam result!", "error");
                return;
            }

            localStorage.removeItem("saved_answers");

            await Swal.fire({
                title: "Exam Completed!",
                text: "Redirecting to Registration...",
                icon: "success",
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
            });

            setIsExamFinished(true);

            setTimeout(() => {
                window.location.href = "/";
            }, 500);


        } catch (err) {
            Swal.fire("Error", "Network error while submitting exam.", "error");
        }
    }

    function handleAnswerChange(questionId, value) {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    }

    if (isExamFinished) {
        return (
            <div className="exam-only-wrapper exam-finished">
                <header className="exam-only-header">
                    <h1 className="exam-only-title">KOLEHIYO NG SUBIC</h1>
                </header>
                <div className="finish-message">
                    <h2>Exam Completed! 🎉</h2>
                    <p>Redirecting to registration...</p>
                </div>
            </div>
        );
    }

    const questionsBySubject = {};
    questions.forEach(q => {
        const subject = q.subjectId?.name || "Unknown Subject";
        if (!questionsBySubject[subject]) {
            questionsBySubject[subject] = [];
        }
        questionsBySubject[subject].push(q);
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("exam_user"));
        if (!user) {
            window.location.href = "/register";
        }
    }, []);

    return (
        <div className="exam-only-wrapper">
            <header className="exam-only-header">
                <h1 className="exam-only-title">KOLEHIYO NG SUBIC</h1>
            </header>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    finishExam();
                }}
                className="exam-only-form"
            >
                <div className="questions-column">

                    {Object.keys(questionsBySubject).map(subject => (
                        <div key={subject}>
                            <h1 className="subject-title" style={{ fontSize: "17px", color: "#0a6a25" }}>
                                {subject.toUpperCase()}
                            </h1>

                            {questionsBySubject[subject].map((question, index) => (
                                <div key={question._id} className="question-item-card">
                                    <h2 className="question-text">
                                        {index + 1}. {question.text}
                                    </h2>

                                    <div className="options-list">
                                        {["A", "B", "C", "D"].map(letter => {
                                            const option = question.options?.[letter];
                                            if (!option) return null;

                                            const optionId = `q${question._id}-${letter}`;

                                            return (
                                                <div key={optionId} className="option-item">
                                                    <input
                                                        type="radio"
                                                        id={optionId}
                                                        name={`question-${question._id}`}
                                                        value={letter}
                                                        checked={answers[question._id] === letter}
                                                        onChange={() => handleAnswerChange(question._id, letter)}
                                                        className="custom-radio"
                                                        required
                                                    />
                                                    <label htmlFor={optionId}>
                                                        <span className="option-letter">{letter}.</span>
                                                        {option}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    <footer className="exam-only-footer">
                        <button type="submit" className="nav-btn finish-btn final-submit">
                            Finish Exam & Submit Answers
                        </button>
                    </footer>

                </div>
            </form>
        </div>
    );
}
