import React, { useState } from "react";
import Swal from "sweetalert2";
import schoolLogo from "../assets/images/kns_logo.png";
import "../css/student_css/register.css";



export default function Register() {
    const [form, setForm] = useState({
        name: "",
        firstCourse: "",
        secondCourse: "",
        sex: "",
        address: "",
        dob: "",
        pob: "",
        contact: "",
        guardian: "",
        lastSchool: "",
        lastSchoolAddress: "",
        transferee: false,
        transfereeCourse: ""
    });

    const availableCourses = [
        "BS Education",
        "BS Computer Science",
        "BS Hospitality Management",
        "BS Accountancy",
        "BS Business Administration (Financial Management)",
        "BS Business Administration (Human Resource Management)",
        "BS Business Administration (Operations Management)"
    ];

    function handleChange(e) {
        const { name, type, value, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const res = await fetch(`${API_URL}/api/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });


            const text = await res.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch {
                Swal.fire("Error", "Server returned invalid response", "error");
                return;
            }

            if (!res.ok) {
                Swal.fire("Already Registered", data.error, "warning");
                return;
            }

            localStorage.setItem("exam_user", JSON.stringify(data.user));

            Swal.fire({
                title: "Registration Successful!",
                text: "Redirecting to Examination...",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "/examination";
            });

        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    }

    return (
        <div className="exam-wrapper">
            <header className="exam-header">
                <img src={schoolLogo} className="exam-logo" alt="School Logo" />
                <div className="exam-title-block">
                    <h1 className="exam-title">KOLEHIYO NG SUBIC</h1>
                    <h2 className="exam-subtitle">ENTRANCE EXAMINATION FORM</h2>
                </div>
            </header>

            <form className="exam-form" onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Applicant's Personal Information</legend>

                    <div className="form-group">
                        <label htmlFor="fullName">Full Name *</label>
                        <input type="text" id="fullName" name="name" value={form.name} onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="dob">Date of Birth *</label>
                            <input type="date" id="dob" name="dob" value={form.dob} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="pob">Place of Birth</label>
                            <input type="text" id="pob" name="pob" value={form.pob} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="sex">Sex *</label>
                            <select id="sex" name="sex" value={form.sex} onChange={handleChange} required>
                                <option value="" disabled hidden>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact">Contact No. *</label>
                            <input type="tel" id="contact" name="contact" value={form.contact} onChange={handleChange} pattern="[0-9]{10,12}" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Home Address *</label>
                        <input type="text" id="address" name="address" value={form.address} onChange={handleChange} required />
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Course Preference</legend>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstCourse">1st Course Choice *</label>
                            <select id="firstCourse" name="firstCourse" value={form.firstCourse} onChange={handleChange} required>
                                <option value="" disabled hidden>Select 1st Course</option>
                                {availableCourses.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="secondCourse">2nd Course Choice</label>
                            <select id="secondCourse" name="secondCourse" value={form.secondCourse} onChange={handleChange}>
                                <option value="" disabled hidden>Select 2nd Course</option>
                                {availableCourses.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Educational Background</legend>

                    <div className="form-group">
                        <label htmlFor="lastSchool">Last School Attended *</label>
                        <input type="text" id="lastSchool" name="lastSchool" value={form.lastSchool} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastSchoolAddress">Address of Last School</label>
                        <input type="text" id="lastSchoolAddress" name="lastSchoolAddress" value={form.lastSchoolAddress} onChange={handleChange} />
                    </div>

                    <div className="check-group">
                        <input type="checkbox" id="transferee" name="transferee" checked={form.transferee} onChange={handleChange} />
                        <label htmlFor="transferee">Check if you are a Transferee</label>
                    </div>

                    {form.transferee && (
                        <div className="form-group">
                            <label htmlFor="transfereeCourse">Previous Course Taken *</label>
                            <input type="text" id="transfereeCourse" name="transfereeCourse" value={form.transfereeCourse} onChange={handleChange} required />
                        </div>
                    )}
                </fieldset>

                <fieldset>
                    <legend>Guardian / Parent Information</legend>

                    <div className="form-group">
                        <label htmlFor="guardian">Guardian / Parent Full Name *</label>
                        <input type="text" id="guardian" name="guardian" value={form.guardian} onChange={handleChange} required />
                    </div>
                </fieldset>

                <button type="submit" className="submit-btn">Start Examination</button>
            </form>
        </div>
    );
}
