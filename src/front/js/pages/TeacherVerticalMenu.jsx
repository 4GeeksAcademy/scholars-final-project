import React from 'react';
import { Link } from 'react-router-dom';

const TeacherVerticalMenu = () => {
      return(
        <>
           <div className='d-flex flex-column' style={styles.menuContainer}>
                <button type="button" className="btn btn-primary mt-1">
          
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill me-1" viewBox="0 0 16 16">
                      <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
                  </svg>
                      <Link to="/teacherdashboard" className='text-decoration-none text-reset '>Home</Link>
                  </button>
          
                  <button type="button" className="btn btn-primary mt-1">
          
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                        <Link to="/teacherdashboard/addnewcourse" className='text-decoration-none text-reset'>Add New Courses</Link>
                  </button>     

                  <button type="button" className="btn btn-primary mt-1">
          
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                    <Link to="/teacherdashboard/addassignments" className='text-decoration-none text-reset'>Add Assignment</Link>
                  </button>  

                  <button type="button" className="btn btn-primary mt-1">
          
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-files" viewBox="0 0 16 16">
                      <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
                    </svg>
                    <Link to="/teacherdashboard/yourscourses" className='text-decoration-none text-reset'>Yours Courses</Link>
                  </button>
            </div>
        </>
      )
};

export const styles = {
  menuContainer: {
    width: '200px',
    height: '100vh',
    backgroundColor: '#F4F4F4',
    padding: '10px',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  }
}
export default TeacherVerticalMenu;