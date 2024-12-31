const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: {
        courseId: "MATH101",
        courseName: "Mathematics",
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
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
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
    },
  };
};

export default getState;
