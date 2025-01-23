const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      notes:[],
      token: sessionStorage.getItem('jwtToken'),
      resource:null,
      // selectedCourse:{
      //   id:null,
      //   modules:[{ id: null,
      //              name:"",
      //              topics:[{id:null, name:""}]
      //             }],
      //   name:""
      // },
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
          return;
        }
        const response = await fetch(process.env.BACKEND_URL + 'api/protected', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const data = await response.json();
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
          setStore({ events: getStore().user.events.filter(event => event.id !== id) });
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
          setStore({ user: { ...getStore().user, courses: [...getStore().user.courses, { id: data.id, name: data.name }]}});
          getActions().handleFetchUserInfo();
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
        
        const response = await fetch('/notes',{
          method: 'GET',
          headers:{
            'Authorization': `Bearer ${token}`,
          }
        });
        const data = await response.json();
        if(data.error){
          console.error('Error', data.error);
        }
        setStore({notes:data})
      },

      addNote: async (content , topicId, studentID) => {
        try{
          const response = await fetch(process.env.BACKEND_URL + '/api/notes', {
            method: 'POST',
            headers:{
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({content:content, topicId:topicId, studentID:studentID})
          });

          if(response.ok) {
            const newNote = await response.json();
            const store = getStore();
            setStore({notes: [... store.notes, newNote]});
          }
          else{
            console.error("Error when adding note")
          }
        }
        catch (error) {
          console.error("Error in addNote:", error);
        }
      },

      editNote: async (noteId , updateContent) => {
        try{
          const response = await fetch(process.env.BACKEND_URL + `/api/notes/${noteId}`, {
            method: 'PUT',
            headers:{
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({content:updateContent})
          });

          if(response.ok) {
            const updateNote = await response.json();
            const store = getStore();
            setStore({
              note: store.notes.map((note) => note.id == noteId ? updateNote : note)
            })
          }
          else{
            console.error("Error when editing note")
          }
        }
          catch (error) {
            console.error("Error in editNote:", error);
          }
      },

      deleteNote: async (noteId) => {
        try{
          const response = await fetch(process.env.BACKEND_URL + `/api/notes/${noteId}`, {
            method: 'DELETE'
          });

          if(response.ok) {
            const store = getStore();
            setStore ({
              notes: store.notes.filter((note) => note.id != noteId)
            })
          }
          else{
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
          console.log(data);
          setStore({ courses: data });
        } else {
          throw new Error('Failed to fetch courses');
        }
      },
      handleAddCourseToStudent: async (courseId) => {
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
          setStore({ user: { ...getStore().user, courses: [...getStore().user.courses, { id: courseId }] }});
        } else {
          throw new Error('Failed to add course to student');
        }
      },
      handleDropCourseFromStudent: async (courseId) => {
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
          setStore({ user: { ...getStore().user, courses: getStore().user.courses.filter(course => course.id !== courseId) } });
        } else {
          throw new Error('Failed to drop course from student');
        }
      },
      getCourseByID: async (courseId) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/course/${courseId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`, // Add token if authentication is required
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `Failed to fetch course: ${response.statusText}`);
          }
      
          const courseData = await response.json();
      
          // Update the store with the fetched course data
          const store = getStore();
          setStore({
            selectedCourse: courseData, // Update the selected course in the store
          });
        } catch (error) {
          console.error('Error fetching course:', error.message);
        }
      },
      updateModule : async (moduleId, newName) => {
        try {
          const response = await fetch(process.env.BACKEND_URL + `api/module/${moduleId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: newName,
            }),
          });
      
          if (!response.ok) {
            const error = await response.json();
            console.error("Error:", error);
            return;
          }
      
          const data = await response.json();
          console.log("Module updated:", data);
        } catch (error) {
          console.error("Error updating module:", error);
        }
      },
      createModule: async (courseID, newName)=>{
        try {
          const response = await fetch(process.env.BACKEND_URL + `api/module`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              course_id: courseID,
              name:newName
            }),
          });
          if (!response.ok) {
            const error = await response.json();
            console.error("Error:", error);
            return;
          }
          setStore({
            selectedCourse: {
              ...getStore().selectedCourse, // Retain current selectedCourse data
              id: courseID, // Update the ID if necessary
              modules: [
                ...(getStore().selectedCourse.modules || []), // Retain existing modules
                { name: newName }, // Add the new module
              ],
            },
          });
          console.log("asas", getStore()) ;
          // setStore({
          //   selectedCourse: {id:courseID, modules:[{name:newName}]}, // Update the selected course in the store
          // });

        } catch (error) {
          console.error("Error creating module:", error);
        }
        
      }, 
      deleteModule : async (moduleId) => {
        try {
          const token = sessionStorage.getItem("jwtToken"); // Retrieve the token
          if (!token) {
            throw new Error("User is not authenticated. Please log in.");
          }
      
          const response = await fetch(`${process.env.BACKEND_URL}/api/module/${moduleId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`, // Include the token for authentication
              "Content-Type": "application/json",
            },
          });
      
          if (!response.ok) {
            const error = await response.json();
            console.error("Error:", error);
            alert(`Failed to delete module: ${error.error}`);
            return;
          }
          
          const store = getStore();
          const updatedModules = store.selectedCourse.modules.filter((module) => module.id !== moduleId) ;
      
          // Update the store with the new modules
          setStore({
            selectedCourse: {
              ...store.selectedCourse,
              modules: updatedModules,
            },
          });
          const result = await response.json();
          console.log("Module deleted successfully:", result);
           
        } catch (error) {
          console.error("Error deleting Module:", error);
          alert("An error occurred while deleting the module.");
        }
      },
      updateTopic : async (topicId, newName) => {
        try {
          const response = await fetch(process.env.BACKEND_URL + `api/topic/${topicId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: newName,
            }),
          });
      
          if (!response.ok) {
            const error = await response.json();
            console.error("Error:", error);
            return;
          }
      
          const data = await response.json();
          console.log("Topic updated:", data);
        } catch (error) {
          console.error("Error updating topic:", error);
        }
      },
      deleteTopic : async (moduleId, topicId) => {
        try {
          const token = sessionStorage.getItem("jwtToken"); // Retrieve the token
          if (!token) {
            throw new Error("User is not authenticated. Please log in.");
          }
      
          const response = await fetch(`${process.env.BACKEND_URL}/api/topic/${topicId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`, // Include the token for authentication
              "Content-Type": "application/json",
            },
          });
      
          if (!response.ok) {
            const error = await response.json();
            console.error("Error:", error);
            alert(`Failed to delete topic: ${error.error}`);
            return;
          }
          
          const store = getStore();
          const updatedModules = store.selectedCourse.modules.map((module) => {
            if (module.id === moduleId) {
              return {
                ...module,
                topics: module.topics.filter((topic) => topic.id !== topicId),
              };
            }
            return module;
          });
      
          // Update the store with the new modules
          setStore({
            selectedCourse: {
              ...store.selectedCourse,
              modules: updatedModules,
            },
          });
          const result = await response.json();
          console.log("Topic deleted successfully:", result);
           
        } catch (error) {
          console.error("Error deleting topic:", error);
          alert("An error occurred while deleting the topic.");
        }
      },

      
    }
  };
};

export default getState;