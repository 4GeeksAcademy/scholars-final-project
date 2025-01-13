const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      notes:[],
      demo: {
        courseId: "MATH101",
        courseName: "Mathematics",
        selectedModule: null,
        selectedTopic: null,
        modules: [
          {
            moduleId: "MOD1",
            moduleName: "Algebra Basics",
            topics: [
              {
                topic: "Linear Equations",
                resource:
                  "https://www.youtube.com/embed/vDqOoI-4Z6M?list=PLSQl0a2vh4HDdl6PcjwZH2CkM5OoV6spg",
              },
              {
                topic: "Linear Equations",
                resource:
                  "https://www.youtube.com/watch?v=vDqOoI-4Z6M&list=PLSQl0a2vh4HDdl6PcjwZH2CkM5OoV6spg&t=7s",
              },
              {
                topic: "Linear Equations",
                resource:
                  "https://youtu.be/uhxtUt_-GyM?list=PL1328115D3D8A2566",
              },
            ],
          },
          {
            moduleId: "MOD1",
            moduleName: "Algebra Basics",
            topics: [
              {
                topic: "Linear Equations",
                resource:
                  "https://youtu.be/uhxtUt_-GyM?list=PL1328115D3D8A2566",
              },
              {
                topic: "Linear Equations",
                resource:
                  "https://youtu.be/uhxtUt_-GyM?list=PL1328115D3D8A2566",
              },
              {
                topic: "Linear Equations",
                resource:
                  "https://youtu.be/uhxtUt_-GyM?list=PL1328115D3D8A2566",
              },
            ],
          },
          {
            moduleId: "MOD1",
            moduleName: "Algebra Basics",
            topics: [
              {
                topic: "Linear Equations",
                resource:
                  "https://youtu.be/uhxtUt_-GyM?list=PL1328115D3D8A2566",
              },
              {
                topic: "Linear Equations",
                resource:
                  "https://youtu.be/uhxtUt_-GyM?list=PL1328115D3D8A2566",
              },
              {
                topic: "Linear Equations",
                resource:
                  "https://youtu.be/uhxtUt_-GyM?list=PL1328115D3D8A2566",
              },
            ],
          },
        ],
      },
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
          throw new Error(data[0].error);
        }
      },

      handleLogOut: () => {
        sessionStorage.removeItem("jwtToken");
        sessionStorage.removeItem("userInfo");
        setStore({ user: null });
        window.location.reload()
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
          console.log(response);
          const data = await response.json();
          setStore({ user: data.user });
          sessionStorage.setItem('userInfo', JSON.stringify(data.user));
        } else {
          throw new Error('Failed to fetch user info');
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
      // getCourse: async (courseId) => {
      //   try {
           
      //     }
           
      //   } catch (error) {
      //     console.log("Error sending message to backend", error);
      //   }
      // },
    }
  };
};

export default getState;

