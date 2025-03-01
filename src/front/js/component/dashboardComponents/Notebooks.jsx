import React, { useState } from "react";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useContext } from "react";
import { Context } from "../../store/appContext"
import "../../../styles/Sidebar.css"

const Notebook = () => {
    const [quillContent, setQuillContent] = useState("");
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [editingNoteIndex, setEditingNoteIndex] = useState(null);
    const { store, actions } = useContext(Context);
    const [newNote, setNewNote] = useState('');
    const [editIndex, setEditIndex] = useState(null);


    const handleLessonSelect = (topic) => {
        setSelectedLesson(topic);
        setQuillContent("");

    }

    const handleEditNote = (index) => {
        setEditingNoteIndex(index);
        setQuillContent(selectedLesson.note[index])
    }

    const handleRemoveNote = (index) => {
        if (selectedLesson) {
            selectedLesson.note.splice(index, 1);
            setSelectedLesson({ ...selectedLesson });
        }
    }

    const handleSavedEditNote = () => {
        if (editingNoteIndex != null && quillContent.trim()) {
            selectedLesson.note[editingNoteIndex] = quillContent;
            setQuillContent("");
            setEditingNoteIndex(null);
        }
    }

    const handleAddNote = () => {
        if (selectedLesson && quillContent.trim()) {
            selectedLesson.note.push(quillContent);
            setQuillContent("");
        }
    }

    return (

        <>
            <div className="d-flex">
                <div className="flex-shrink-0 p-3 bg-light mt-2" style={{ width: "280px;" }}>
                    <a href="/" className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
                        <span className="fs-5 fw-semibold ms-4">Notebook</span>
                    </a>
                    <ul className="list-unstyled ps-0">
                        {console.log(store.user)}
                        {store.user.courses.map((course) => (
                            course.modules.map((module) => (
                                <li className="mb-1" key={module.id}>
                                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target={`#${module.name}-collapse`} aria-expanded="true">
                                        {module.name}

                                    </button>
                                    <ul className="btn-toggle-nav fw-normal pb-1 small">
                                        {console.log(module.topics)}
                                        {module.topics.map((topic) => (
                                            <div className="collapse" id={`${module.name}-collapse`}>
                                                <ul className="btn-toggle-nav list-group fw-normal pb-1 small ms-3" style={{ listStyleType: "disc" }}>
                                                    <li className="list-group-item mt-1" key={topic.id} onClick={() => handleLessonSelect(topic)} onMouseEnter={(e) => (e.target.style.cursor = "pointer")} onMouseLeave={(e) => (e.target.style.cursor = "default")}>
                                                        {topic.name}
                                                    </li>
                                                </ul>
                                            </div>
                                        ))}
                                    </ul>
                                </li>
                            ))
                        ))}
                    </ul>
                </div>
                <div className="d-flex flex-column flex-fill justify-content-center align-items-center ms-5">
                    <div>
                        {selectedLesson ? (
                            <>
                                <div className="card-header bg-transparent mt-5">
                                    <h2>{selectedLesson.name}</h2>
                                </div>
                                <div className="notes mt-4">
                                    <ul className="list-group">
                                        {selectedLesson.note.map((note, index) => (
                                            <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                                                <span dangerouslySetInnerHTML={{ __html: note }}></span>
                                                <button type="button" className="btn btn-warning ms-3" onClick={() => handleEditNote(index)}>Edit</button>
                                                <button type="button" className="btn btn-danger ms-3" onClick={() => handleRemoveNote(index)}>Remove</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) :
                            (
                                <h2 className="card-header bg-transparent mt-5">Select a lesson to see its notes</h2>
                            )
                        }
                    </div>
                    <div className="card-footer mt-5 bg-transparent">
                        <ReactQuill
                            theme="snow"
                            value={quillContent}
                            onChange={setQuillContent}
                            style={{ height: "150px" }}
                        />
                        <div className="mt-5">
                            {editingNoteIndex != null ? (
                                <button type="button" className="btn btn-primary" onClick={handleSavedEditNote}>Save Changes</button>
                            ) : (
                                <button type="button" className="btn btn-primary" onClick={handleAddNote}>Save Note</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Notebook;