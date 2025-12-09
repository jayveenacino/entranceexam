import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import StudentPrint from "./StudentPrint";
import "./admincss/results.css";

export default function ResultsPage() {
    const [folders, setFolders] = useState([]);
    const [students, setStudents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [openFolder, setOpenFolder] = useState(null);
    const [studentToPrint, setStudentToPrint] = useState(null);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [editedScores, setEditedScores] = useState({});

    const API_URL = "http://localhost:5000/api";

    useEffect(() => {
        fetchFolders();
        fetchStudents();
    }, []);

    const fetchFolders = async () => {
        try {
            const res = await axios.get(`${API_URL}/results/folders`);
            setFolders(res.data);
        } catch (err) { }
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_URL}/results/students`);
            setStudents(res.data);
        } catch (err) { }
    };

    const createFolder = async () => {
        if (!folderName.trim()) return;

        try {
            await axios.post(`${API_URL}/folders`, { folderName });
            Swal.fire("Success", "Folder created successfully!", "success");
            setFolderName("");
            setModalOpen(false);
            fetchFolders();
        } catch (err) {
            Swal.fire("Error", "Failed to create folder.", "error");
        }
    };

    const handlePrint = (student) => {
        setStudentToPrint(student);

        setTimeout(() => {
            window.print();
        }, 400);
    };

    const saveEditedScores = async () => {
        try {
            await axios.put(
                `${API_URL}/results/update-score/${editingStudent._id}`,
                { subjectScores: editedScores }
            );

            Swal.fire({
                icon: "success",
                title: "Scores Updated",
                text: "Student scores were successfully updated!"
            });

            fetchStudents();
            setEditModalOpen(false);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: "Error updating scores."
            });
        }
    };

    return (
        <div className="rp2-container">
            <div className="rp2-header">
                <h2>Results</h2>
                <button className="rp2-new-folder-btn" onClick={() => setModalOpen(true)}>
                    Create Folder
                </button>
            </div>

            <div className="rp2-folder-list">
                {folders.map(folder => (
                    <div key={folder._id} className="rp2-folder">
                        <div
                            className="rp2-folder-header"
                            onClick={() =>
                                setOpenFolder(openFolder === folder._id ? null : folder._id)
                            }
                        >
                            <strong>{folder.folderName}</strong>
                            <span>{openFolder === folder._id ? "▲" : "▼"}</span>
                        </div>

                        {openFolder === folder._id && (
                            <div className="rp2-folder-content">
                                {students.length === 0 ? (
                                    <p className="rp2-empty">No students found.</p>
                                ) : (
                                    students.map(user => (
                                        <div key={user._id} className="rp2-user-row">
                                            <div className="rp2-username">{user.name}</div>
                                            <div className="rp2-actions">
                                                <button
                                                    className="rp2-action-btn"
                                                    onClick={() => handlePrint(user)}
                                                >
                                                    PRINT
                                                </button>

                                                <button
                                                    className="rp2-action-btn"
                                                    onClick={() => {
                                                        setEditingStudent(user);
                                                        setEditedScores(user.subjectScores || {});
                                                        setEditModalOpen(true);
                                                    }}
                                                >
                                                    EDIT
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {editModalOpen && editingStudent && (
                <div className="rp2-modal">
                    <div className="rp2-modal-box">

                        <h3>Edit Scores</h3>

                        <div className="rp2-edit-fields">
                            {Object.keys(editedScores).map((subject) => (
                                <div key={subject} className="rp2-edit-row">
                                    <label className="rp2-edit-label">
                                        {subject.toUpperCase()}
                                    </label>

                                    <input
                                        type="number"
                                        className="rp2-edit-input"
                                        value={editedScores[subject] === null ? "" : editedScores[subject]}
                                        onChange={(e) => {
                                            const val = e.target.value;

                                            setEditedScores({
                                                ...editedScores,
                                                [subject]: val === "" ? null : Number(val)
                                            });
                                        }}
                                    />

                                </div>
                            ))}
                        </div>

                        <div className="rp2-modal-actions">
                            <button
                                className="rp2-cancel-btn"
                                onClick={() => setEditModalOpen(false)}
                            >
                                Cancel
                            </button>

                            <button className="rp2-save-btn" onClick={saveEditedScores}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalOpen && (
                <div className="rp2-modal">
                    <div className="rp2-modal-box">
                        <h3>Create Folder</h3>

                        <input
                            type="text"
                            placeholder="Enter folder name..."
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            className="rp2-modal-input"
                        />

                        <div className="rp2-modal-actions">
                            <button onClick={() => setModalOpen(false)} className="rp2-cancel-btn">
                                Cancel
                            </button>
                            <button onClick={createFolder} className="rp2-save-btn">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <StudentPrint student={studentToPrint} />
        </div>
    );
}
