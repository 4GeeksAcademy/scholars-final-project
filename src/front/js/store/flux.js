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
            topics: ["Linear Equations", "Quadratic Equations", "Polynomials"],
            resources: [
              {
                type: "video",
                title: "Understanding Linear Equations",
                url: "https://example.com/math/algebra/linear-equations",
              },
              {
                type: "document",
                title: "Algebra Basics Notes",
                url: "https://example.com/resources/algebra-basics.pdf",
              },
            ],
          },
        ],
        instructor: {
          name: "Dr. John Smith",
          email: "john.smith@example.com",
          profileUrl: "https://example.com/instructors/john-smith",
        },
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
    },
  };
};

export default getState;
