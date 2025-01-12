
# API Documentation for Course, Module, Topic, and Student Endpoints

This document describes how to use the endpoints for managing **courses**, **modules**, **topics**, and **students** in the provided API.

 

## **Student and Course Endpoints**

### 1. **Get All Courses a Student Takes**

**URL:** `/student/<int:student_id>/courses`**Method:** `GET`

**Response:**

```json
{
    "student_id": 1,
    "student_name": "john_doe",
    "courses": [
        {"id": 101, "name": "Math 101"},
        {"id": 102, "name": "English 101"}
    ]
}
```

---

### 2. **Add a Course to a Student**

**URL:** `/add-course-to-student`**Method:** `POST`

**Request Body:**

```json
{
    "user_id": 1,
    "course_id": 101
}
```

**Response:**

```json
{
    "message": "Course added to student successfully"
}
```

---

## **Course Endpoints**

### 1. **Get All Courses**

**URL:** `/courses`**Method:** `GET`

**Query Parameters:**

- `include_modules=true` (optional): Include modules for each course.
- `include_topics=true` (optional): Include topics for each module.

**Response:**

```json
[
    {
        "id": 101,
        "name": "Math 101",
        "modules": [
            {
                "id": 201,
                "name": "Algebra",
                "topics": [
                    {"id": 301, "name": "Linear Equations"},
                    {"id": 302, "name": "Quadratic Equations"}
                ]
            }
        ]
    }
]
```

---

### 2. **Add a New Course**

**URL:** `/add-course`**Method:** `POST`

**Request Body Examples:**

- **Course with Modules and Topics:**

```json
{
    "name": "Math 101",
    "modules": [
        {
            "name": "Algebra",
            "topics": ["Linear Equations", "Quadratic Equations"]
        }
    ]
}
```

- **Course with Modules Only:**

```json
{
    "name": "History 101",
    "modules": [
        {"name": "Ancient Civilizations"}
    ]
}
```

- **Course Only:**

```json
{
    "name": "Philosophy 101"
}
```

**Response:**

```json
{
    "message": "Course created successfully",
    "course_id": 1
}
```

---

### 3. **Delete a Course**

**URL:** `/delete-course/<int:course_id>`**Method:** `DELETE`

**Response:**

```json
{
    "message": "Course with ID 101 deleted successfully"
}
```

---

## **Modules and Topics Endpoints**

### 1. **Edit a Module**

**URL:** `/edit-module/<int:module_id>`**Method:** `PUT`

**Request Body:**

```json
{
    "name": "Updated Algebra Module",
    "description": "New description for Algebra"
}
```

**Response:**

```json
{
    "message": "Module updated successfully",
    "module": {"id": 201, "name": "Updated Algebra Module"}
}
```

---

### 2. **Edit a Topic**

**URL:** `/edit-topic/<int:topic_id>`**Method:** `PUT`

**Request Body:**

```json
{
    "name": "Updated Linear Equations",
    "description": "Detailed topic description"
}
```

**Response:**

```json
{
    "message": "Topic updated successfully",
    "topic": {"id": 301, "name": "Updated Linear Equations"}
}
```

---

### 3. **Edit a Course**

**URL:** `/edit-course/<int:course_id>`**Method:** `PUT`

**Request Body:**

```json
{
    "name": "Updated Math 101",
    "description": "An updated description for the course"
}
```

**Response:**

```json
{
    "message": "Course updated successfully",
    "course": {"id": 101, "name": "Updated Math 101"}
}
```

---

### Notes

- **Validation:** Ensure all required fields (e.g., `name`, `id`) are provided in the request body.
- **Authentication:** Use the access token from login/signup for protected endpoints.
- **Error Handling:** The API returns meaningful error messages (e.g., `Student not found`, `Course not found`) with appropriate HTTP status codes.

Let me know if you need further clarifications or additional features!