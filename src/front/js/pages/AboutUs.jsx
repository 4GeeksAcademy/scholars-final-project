import React from "react";

const AboutUs = () => {

    const team = [
        {name: "Kennedy Lall"},
        {name: "Mert Celikol"},
        {name: "Nathan Brito"},
        {name: "Adbeel Rodriguez"}
    ]

    return (
        <>
            <div className="about-us container mt-5">
                <h1 className="text-center mb-4">About us</h1>
                <p className="text-center lead">
                Welcome to <strong>Scholars.IA</strong>, a platform created by a team passionate about education and technology. Our mission is to provide modern tools that transform the educational experience and empower both students and teachers.
                </p>
                <div className="team-section mt-5">
                    <h2 className="text-center">Our Team</h2>
                    <p  className="text-center">
                    We are a group of multidisciplinary developers who graduated from <strong>4Geeks Academy</strong>, where we acquired the knowledge and skills to create <strong>Scholars.AI</strong>. We deeply thank the academy for guiding us in our growth as professionals
                    </p>
                    <div className="row justify-content-center mt-4">
                        {team.map((member,index)=> (
                            <div key={index} className="col-md-3 text-center">
                                <div className="team-card shadow-sm p-3 mb-5 bg-white rounded">
                                    <h4>{member.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="vision-section text-center mt-5">
                    <h2>Our Vision</h2>
                    <p className="lead mt-3">
                        We believe in the power of technology to transform learning. <strong>Scholars.AI</strong> is our commitment to a future where education is more accessible, personalized and effective
                    </p>
                </div>
            </div>
        </>
    )
}

export default AboutUs;