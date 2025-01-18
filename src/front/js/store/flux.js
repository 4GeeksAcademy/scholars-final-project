const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      notes: [],
      //Courses that are assigned to student
      AllCourses: [{
        id: null, // placeholder for course ID
        modules: [
          {
            id: null, // placeholder for module ID
            name: "module", // Default string value
            topics: [
              {
                id: null, // placeholder for topic ID
                name: "topic", // Default string value
              }
            ]

          }
        ],
        name: "course" // Default string value for course name
      }],
      token: sessionStorage.getItem('jwtToken'),
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "api/hello")
          const data = await resp.json()
          setStore({ message: data.message })
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error)
        }
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },

      // stuff below this line was not in the template

      handleLogin: async (username, email, password, role) => {
        let response = await fetch(process.env.BACKEND_URL + 'api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password,
            username: username,
            role: role
          }),
        })
        let data = await response.json()
        if (data && data.success === true) {
          sessionStorage.setItem('jwtToken', data.access_token);
          window.location.reload()
          return true;
        }
        else {
          alert(data[0].error);
        }
      },

      handleLogOut: () => {
        sessionStorage.removeItem("jwtToken");
        sessionStorage.removeItem("userInfo");
        setStore({ user: null });
        window.location.href = '/';
      },

      handleSignUp: async (username, email, password, role) => {
        fetch(process.env.BACKEND_URL + '/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password,
            username: username,
            role: role
          }),
        })
          .then(response => {
            if (response.ok && response.status === 200) { // Check if response is successful and has status 200
              return response.json(); // Parse response body as JSON
            } else {
              throw new Error('Failed to sign up'); // Throw error if response is not successful
            }
          })
          .then(data => {
            // Check if a specific response is returned from the server
            if (data && data.success === true) {
              sessionStorage.setItem('jwtToken', data.access_token);
              window.location.reload();
            } else {
              alert(data[0].error);
              console.log(data[0].error);
              throw new Error(data[0].error);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      },

      handleFetchUserInfo: async () => {
        const token = sessionStorage.getItem('jwtToken');
        if (!token) {
          console.log('No token found');
          return;
        }
        console.log('Token found:', token);
        const response = await fetch(process.env.BACKEND_URL + 'api/protected', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setStore({ user: data.user });
          sessionStorage.setItem('userInfo', JSON.stringify(data.user));
        } else {
          throw new Error('Failed to fetch user info');
        }
      },

      handleCreateEvent: async (title, start) => {
        const response = await fetch(process.env.BACKEND_URL + 'api/create_event', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title,
            start: start,
          }),
        });
        if (response.ok) {
          console.log('Event created');
          const data = await response.json();
          // This is to get the evevnt id from the response
          setStore({ user: { ...getStore().user, events: [...getStore().user.events, { id: data.id, title: data.title, start: data.start }] } });
        } else {
          throw new Error('Failed to create event');
        }
      },

      handleEditEvent: async (id, title, start) => {
        const response = await fetch(process.env.BACKEND_URL + 'api/edit_event', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: id,
            title: title,
            start: start,
          }),
        });
        if (response.ok) {
          console.log('Event edited');
        } else {
          throw new Error('Failed to edit event');
        }
      },
      
      handleDeleteEvent: async (id) => {
        const response = await fetch(process.env.BACKEND_URL + 'api/delete_event', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: id,
          }),
        });
        if (response.ok) {
          console.log('Event deleted');
          console.log(getStore());
          setStore({ events: getStore().user.events.filter(event => event.id !== id) });
          console.log(getStore());
        } else {
          throw new Error('Failed to delete event');
        }
      },

      handleCreateCourse: async (courseName, courseDescription) => {
        const response = await fetch(process.env.BACKEND_URL + 'api/create_course', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            course_name: courseName,
            course_description: courseDescription,
          }),
        });
        if (response.ok) {
          console.log('Course created');
          const data = await response.json();
          setStore({ user: { ...getStore().user, courses: [...getStore().user.courses, { id: data.id, courseName: data.courseName }] } });
        } else {
          throw new Error('Failed to create course');
        }
      },

      chatBot: async (message) => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}/api/chatbot`, {
            method: "POST", // Set method to POST
            headers: {
              "Content-Type": "application/json", // Specify JSON content type
            },
            body: JSON.stringify({ message }), // Send the message in the request body
          });
          if (!resp.ok) {
            throw new Error(
              `HTTP error for Chatbot API! Status: ${resp.status}`
            );
          }
          const data = await resp.json(); // Parse JSON response
          console.log("ben calisiyorum", data);
          return data;
        } catch (error) {
          console.log("Error sending message to backend", error);
        }
      },

      getNotes: async () => {
        const token = localStorage.getItem('jwtToken');

        const response = await fetch('/notes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const data = await response.json();
        if (data.error) {
          console.error('Error', data.error);
        }
        setStore({ notes: data })
      },
      addNote: async (content, topicId, studentID) => {
        try {
          const response = await fetch(process.env.BACKEND_URL + '/api/notes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: content, topicId: topicId, studentID: studentID })
          });

          if (response.ok) {
            const newNote = await response.json();
            const store = getStore();
            setStore({ notes: [...store.notes, newNote] });
          }
          else {
            console.error("Error when adding note")
          }
        }
        catch (error) {
          console.error("Error in addNote:", error);
        }
      },
      editNote: async (noteId, updateContent) => {
        try {
          const response = await fetch(process.env.BACKEND_URL + `/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: updateContent })
          });

          if (response.ok) {
            const updateNote = await response.json();
            const store = getStore();
            setStore({
              note: store.notes.map((note) => note.id == noteId ? updateNote : note)
            })
          }
          else {
            console.error("Error when editing note")
          }
        }
        catch (error) {
          console.error("Error in editNote:", error);
        }
      },
      deleteNote: async (noteId) => {
        try {
          const response = await fetch(process.env.BACKEND_URL + `/api/notes/${noteId}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            const store = getStore();
            setStore({
              notes: store.notes.filter((note) => note.id != noteId)
            })
          }
          else {
            console.error("Error when deleting note")
          }
        }
        catch (error) {
          console.error("Error in deleteNote:", error);
        }
      },
      handleFetchAllCourses: async () => {
        const response = await fetch(process.env.BACKEND_URL + 'api/courses', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log("handleFetchAllCourses: ", data);
          
          setStore({ courses: data });
        } else {
          throw new Error('Failed to fetch courses');
        }
      },
      handleAddCourseToStudent: async (courseId) => {
        console.log('Adding course to student');
        console.log(courseId);
        const response = await fetch(process.env.BACKEND_URL + 'api/add_course_to_student', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            course_id: courseId,
          }),
        });
        if (response.ok) {
          console.log('Course added to student');
          getActions().handleFetchUserInfo();
          setStore({ user: { courses:{ id: courseId } } });
          console.log(getStore());
        } else {
          throw new Error('Failed to add course to student');
        }
      },
      handleDropCourseFromStudent: async (courseId) => {
        console.log('Dropping course from student');
        console.log(courseId);
        const response = await fetch(process.env.BACKEND_URL + 'api/drop_course_from_student', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            course_id: courseId,
          }),
        });
        if (response.ok) {
          console.log('Course dropped from student');
          setStore({ user: { courses: getStore().user?.courses?.filter(course => course.id !== courseId) } });
          console.log("Whole store",getStore())
        } else {
          throw new Error('Failed to drop course from student');
        }
      },
      // Fetches all courses assigned to a student
      getAllCourses: async () => {
        try {
          // Retrieve the token from sessionStorage
          const token = sessionStorage.getItem('jwtToken');

          const response = await fetch(`${process.env.BACKEND_URL}/api/student/courses`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.error || `Failed to fetch courses: ${response.statusText}`);
          }

          const courseData = await response.json();
          setStore({
            AllCourses: courseData.AllCourses, // Update state with fetched courses
          });

          console.log("Courses fetched successfully:", courseData);
        } catch (error) {
          console.error("Error fetching courses:", error.message);
        }
      },
      // Add a course to database
      addCourse: async (POSTBody) => {

        // Example POST body
        // {
        //   name: "",
        //   modules: [
        //       {
        //           name: "",
        //           topics: [""]
        //       }
        //   ]
        // }
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}/api/add-course`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(POSTBody)
          });

          if (!resp.ok) {
            throw new Error(`Failed to fetch course: ${resp.statusText}`);
          }
          console.log(await resp.json());
          setStore({ AllCourses: POSTBody });

        }
        catch (error) {
          console.log("Error sending message to backend", error);

        }
      },
      // Update course
      updateCourse: async (courseId, updatedName) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/courses/${courseId}`, {
            method: "PUT",
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: updatedName
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to update the course.");
          }

          const data = await response.json();
          console.log("Course updated successfully:", data);
          return data;
        } catch (error) {
          console.error("Error updating the course:", error.message);
        }
      },
      // Delete a course from database
      deleteCourse: async (courseID) => {
        try {
          const token = sessionStorage.getItem('jwtToken');
          if (!token) {
            throw new Error("User is not authenticated. Please log in.");
          } 
          const response = await fetch(`${process.env.BACKEND_URL}/api/delete-course/${courseID}`,{
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(`Failed to delete course: ${errorMsg}`);
          }
          const result = await response.json();
          console.log(result.message); // Log the success message

          return true; // Indicate successful deletion
        } catch (error) {
          console.error('Error deleting course:', error);
          return false; // Indicate failure
        }
      },
      // Assign course to student
      enrollStudent: async (courseID) => {
        try {
          // Retrieve the token from sessionStorage
          const token = sessionStorage.getItem('jwtToken');

          // Check if token is present
          if (!token) {
            throw new Error("User is not authenticated. Please log in.");
          }

          const POSTBody = {
            course_id: courseID
          };

          const resp = await fetch(`${process.env.BACKEND_URL}/api/assign-course`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json' // Add Content-Type header
            },
            body: JSON.stringify(POSTBody)
          });

          if (!resp.ok) {
            // Try to extract error details from response
            const errorDetails = await resp.json();
            throw new Error(errorDetails.error || `Failed to enroll in course: ${resp.statusText}`);
          }

          const courseData = await resp.json();
          setStore(courseData);

          console.log("Enrolled in course successfully:", courseData);
        } catch (error) {
          console.error("Error enrolling in course:", error.message);
        }
      },
      // Remove course from student
      unEnrollStudent: async (courseID) => {
        try {
          // Retrieve the JWT token
          // Retrieve the token from sessionStorage
          const token = sessionStorage.getItem('jwtToken');

          if (!token) {
            throw new Error("User is not authenticated. Please log in.");
          }

          const response = await fetch(`${process.env.BACKEND_URL}/api/unenroll-course`, {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              course_id: courseID
            })
          });

          // Parse response
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to remove course.");
          }
          setStore({
            Allcourses: store.AllCourses.filter(course => course.id !== courseID)
          });
          console.log("Course removed successfully:", data);
          return data;
        } catch (error) {
          console.error("Error removing course:", error.message);
        }
      },
      // Fetches resources by topic ID
      getResource: async (topicID) => {
        try {
          const token = sessionStorage.getItem('jwtToken');
          if (!token) {
            throw new Error("User is not authenticated. Please log in.");
          } 
          const resp = await fetch(`${process.env.BACKEND_URL}api/resources/by_topic/${topicID}`, {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
              "Content-Type": "application/json"
            }             
          });
          if (!resp.ok) {
            throw new Error(`Failed to fetch resource: ${resp.statusText}`);
          }
          const resourceData = await resp.json(); // Parse JSON response

          // Extract URLs if resourceData is an array
          const urls = resourceData.map(resource => resource.url); // Convert to comma-separated string
          console.error("urls: ", urls);
          return urls;
        } catch (error) {
          console.log("Error fetching resource from backend:", error);
          return null; // Handle errors gracefully
        }
      },
      createResource: async (url, topicId) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/resources`, {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: url,
              topic_id: topicId
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to create resource.");
          }

          const data = await response.json();
          console.log("Resource created successfully:", data);
          return data;
        } catch (error) {
          console.error("Error creating resource:", error.message);
        }
      },
      updateResource: async (resourceId, url, topicId) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/resources/${resourceId}`, {
            method: "PUT",
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: url,
              topic_id: topicId
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to update resource.");
          }

          const data = await response.json();
          console.log("Resource updated successfully:", data);
          return data;
        } catch (error) {
          console.error("Error updating resource:", error.message);
        }
      },
      deleteResource: async (resourceId) => {
        try {
          const token = sessionStorage.getItem('jwtToken');
          if (!token) {
            throw new Error("User is not authenticated. Please log in.");
          } 
          const response = await fetch(`${process.env.BACKEND_URL}/api/resources/${resourceId}`,{
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${token}`,
              "Content-Type": "application/json"
            } 
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to delete resource.");
          }

          const data = await response.json();
          console.log("Resource deleted successfully:", data);
          return data;
        } catch (error) {
          console.error("Error deleting resource:", error.message);
        }
      },
    }
  };
};

export default getState;