import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import Swal from "sweetalert2";
import "./admincss/questions.css";

export default function Question() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const [questions, setQuestions] = useState({});
    const [newSubject, setNewSubject] = useState("");

    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [showEditSubjectModal, setShowEditSubjectModal] = useState(false);
    const [editingSubject, setEditingSubject] = useState({ id: null, name: "" });

    const [modalOpen, setModalOpen] = useState(false);

    const [form, setForm] = useState({
        text: "",
        A: "",
        B: "",
        C: "",
        D: "",
        correct: "A",
        editId: null,
    });

    const API_URL = "http://localhost:5000/api";

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        const res = await axios.get(`${API_URL}/subjects`);
        setSubjects(res.data);
        if (res.data[0]) setSelectedSubject(res.data[0]._id);
    };

    useEffect(() => {
        if (selectedSubject) fetchQuestions(selectedSubject);
    }, [selectedSubject]);

    const fetchQuestions = async (id) => {
        const res = await axios.get(`${API_URL}/questions/${id}`);
        setQuestions((p) => ({ ...p, [id]: res.data }));
    };

    const openEditSubject = (sub) => {
        setEditingSubject({ id: sub._id, name: sub.name });
        setShowEditSubjectModal(true);
    };

    const updateSubject = async () => {
        if (!editingSubject.name.trim()) {
            Swal.fire({
                icon: "error",
                title: "Empty Name",
                text: "Subject name cannot be empty.",
            });
            return;
        }

        const confirm = await Swal.fire({
            title: `Save changes to "${editingSubject.name}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, save",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axios.put(`${API_URL}/subjects/${editingSubject.id}`, {
                name: editingSubject.name,
            });

            setSubjects(
                subjects.map((s) =>
                    s._id === editingSubject.id ? res.data : s
                )
            );

            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Subject name has been updated.",
            });

            setShowEditSubjectModal(false);

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: "Server error occurred.",
            });
        }
    };

    const deleteSubject = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This subject and all its questions will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axios.delete(`${API_URL}/subjects/${id}`);

            setSubjects(subjects.filter((s) => s._id !== id));

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Subject has been removed.",
            });

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text: "Server error occurred.",
            });
        }
    };

    const openModal = (q = null) => {
        if (q) {
            setForm({
                text: q.text,
                A: q.options.A,
                B: q.options.B,
                C: q.options.C,
                D: q.options.D,
                correct: q.correct,
                editId: q._id,
            });
        } else {
            setForm({
                text: "",
                A: "",
                B: "",
                C: "",
                D: "",
                correct: "A",
                editId: null,
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async () => {
        const payload = {
            subjectId: selectedSubject,
            text: form.text,
            options: { A: form.A, B: form.B, C: form.C, D: form.D },
            correct: form.correct,
        };

        let res;

        if (form.editId) {
            res = await axios.put(`${API_URL}/questions/${form.editId}`, payload);
        } else {
            res = await axios.post(`${API_URL}/questions`, payload);
        }

        setQuestions((p) => ({
            ...p,
            [selectedSubject]: form.editId
                ? p[selectedSubject].map((q) =>
                    q._id === res.data._id ? res.data : q
                )
                : [...(p[selectedSubject] || []), res.data],
        }));

        setModalOpen(false);
    };

    const deleteQuestion = async (id) => {
        const c = await Swal.fire({
            title: "Delete question?",
            icon: "warning",
            showCancelButton: true,
        });
        if (!c.isConfirmed) return;

        await axios.delete(`${API_URL}/questions/${id}`);

        setQuestions((p) => ({
            ...p,
            [selectedSubject]: p[selectedSubject].filter((q) => q._id !== id),
        }));
    };

    const onDragEnd = async (r) => {
        if (!r.destination) return;

        const arr = [...questions[selectedSubject]];
        const [m] = arr.splice(r.source.index, 1);
        arr.splice(r.destination.index, 0, m);

        setQuestions((p) => ({ ...p, [selectedSubject]: arr }));

        await axios.put(`${API_URL}/questions/reorder`, {
            orderedIds: arr.map((q) => q._id),
        });
    };

    const handleAddSubject = async () => {
        if (!newSubject.trim()) {
            Swal.fire({
                icon: "error",
                title: "Empty Subject",
                text: "Please enter a subject name.",
            });
            return;
        }

        const isDuplicate = subjects.some(
            (s) => ((s.name || s.title || "") + "").toLowerCase() === newSubject.trim().toLowerCase()
        );

        if (isDuplicate) {
            Swal.fire({
                icon: "warning",
                title: "Duplicate Subject",
                text: `"${newSubject}" already exists.`,
            });
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/subjects`, { name: newSubject });

            setSubjects([...subjects, res.data]);

            Swal.fire({
                icon: "success",
                title: "Subject Added",
                text: `"${newSubject}" has been added successfully.`,
            });

            setNewSubject("");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Could not add subject. Please try again.",
            });
        }
    };

    return (
        <div className="q-container">

            <div className="sub-bar">

                <div className="subject-scroll">
                    {subjects.map((s) => (
                        <div
                            key={s._id}
                            className={`sub-item ${selectedSubject === s._id ? "active" : ""}`}
                            onClick={() => setSelectedSubject(s._id)}
                        >
                            {s.name}
                        </div>
                    ))}
                </div>

                <div className="right-fixed">
                    <div className="add-subject">
                        <input
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="New subject"
                        />
                        <button onClick={handleAddSubject}>Add</button>
                    </div>

                    <button className="all-btn" onClick={() => setShowSubjectModal(true)}>
                        All Subject
                    </button>
                </div>

            </div>
            <hr />
            <div className="header">
                <h2>Questions</h2>
                <button onClick={() => openModal()}>Add Question</button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="q-list">
                    {(p) => (
                        <ul className="q-list" ref={p.innerRef} {...p.droppableProps}>
                            {questions[selectedSubject]?.map((q, i) => (
                                <Draggable key={q._id} draggableId={q._id} index={i}>
                                    {(p) => (
                                        <li
                                            className="q-item"
                                            ref={p.innerRef}
                                            {...p.draggableProps}
                                            {...p.dragHandleProps}
                                        >
                                            <b>{i + 1}. {q.text}</b>
                                            <div className="opts">
                                                <span>A: {q.options.A}</span>
                                                <span>B: {q.options.B}</span>
                                                <span>C: {q.options.C}</span>
                                                <span>D: {q.options.D}</span>
                                            </div>

                                            <div className="q-actions" style={{ justifyContent: "space-between", alignItems: "center" }}>

                                                <strong style={{
                                                    background: "#e2f7e8",
                                                    border: "1.5px solid #0a6a25",
                                                    padding: "8px 14px",
                                                    borderRadius: "8px",
                                                    color: "#0a6a25",
                                                    fontSize: "0.95rem",
                                                    fontWeight: "700"
                                                }}>
                                                    Correct Answer: {q.correct}
                                                </strong>

                                                <div style={{ display: "flex", gap: "10px" }}>
                                                    <button onClick={() => openModal(q)}>Edit</button>
                                                    <button className="del" onClick={() => deleteQuestion(q._id)}>Delete</button>
                                                </div>
                                            </div>

                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {p.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>

            {modalOpen && (
                <div className="modal">
                    <div className="m-box">
                        <button className="close" onClick={() => setModalOpen(false)}>×</button>
                        <h3>{form.editId ? "Edit Question" : "Add Question"}</h3>

                        <input placeholder="Question" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
                        <input placeholder="Option A" value={form.A} onChange={(e) => setForm({ ...form, A: e.target.value })} />
                        <input placeholder="Option B" value={form.B} onChange={(e) => setForm({ ...form, B: e.target.value })} />
                        <input placeholder="Option C" value={form.C} onChange={(e) => setForm({ ...form, C: e.target.value })} />
                        <input placeholder="Option D" value={form.D} onChange={(e) => setForm({ ...form, D: e.target.value })} />

                        <select value={form.correct} onChange={(e) => setForm({ ...form, correct: e.target.value })}>
                            <option>A</option><option>B</option><option>C</option><option>D</option>
                        </select>

                        <div className="m-actions">
                            <button onClick={handleSubmit}>Save</button>
                            <button className="cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showSubjectModal && (
                <div className="modal">
                    <div className="m-box big">

                        <button className="close" onClick={() => setShowSubjectModal(false)}>×</button>
                        <h3>All Subjects</h3>

                        {subjects.map((s) => (
                            <div key={s._id} className="sub-list-item">
                                <span>{s.name}</span>

                                <div>
                                    <button onClick={() => openEditSubject(s)}>Edit</button>
                                    <button className="del" onClick={() => deleteSubject(s._id)}>Delete</button>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            )}

            {showEditSubjectModal && (
                <div className="modal">
                    <div className="m-box">
                        <h3>Edit Subject</h3>

                        <input
                            value={editingSubject.name}
                            onChange={(e) =>
                                setEditingSubject({ ...editingSubject, name: e.target.value })
                            }
                        />

                        <div className="m-actions">
                            <button onClick={updateSubject}>Save</button>
                            <button className="cancel" onClick={() => setShowEditSubjectModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
