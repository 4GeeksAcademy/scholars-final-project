import React from "react";

const HomePage = () => {

    return (
        <>
        
        <div id="myCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" class="active" aria-label="Slide 1" aria-current="true"></button>
                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2" class=""></button>
                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3" class=""></button>
            </div>
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src="https://fastly.picsum.photos/id/20/3670/2462.jpg?hmac=CmQ0ln-k5ZqkdtLvVO23LjVAEabZQx2wOaT4pyeG10I" class="img-fluid" alt="..."/>
                    <div class="container">
                    <div class="carousel-caption text-start">
                        <h1><strong>Welcome to Scholars.ai!</strong></h1>
                        <p>Some representative placeholder content for the first slide of the carousel.</p>
                        <p><a class="btn btn-lg btn-primary" href="#">Learn More</a></p>
                    </div>
                    </div>
                </div>

                <div class="carousel-item">
                    <img src="https://picsum.photos/2000/800" class="img-fluid" alt="..."/>
                    <div class="container">
                    <div class="carousel-caption">
                        <h1><strong>Get Started Today!</strong></h1>
                        <p>Some representative placeholder content for the second slide of the carousel.</p>
                        <p><a class="btn btn-lg btn-primary" href="#">Sign Up</a></p>
                    </div>
                    </div>
                </div>

                <div class="carousel-item">
                <img src="https://picsum.photos/2000/800" class="img-fluid" alt="..."/>
                    <div class="container">
                    <div class="carousel-caption text-end">
                        <h1>One more for good measure.</h1>
                        <p>Some representative placeholder content for the third slide of this carousel.</p>
                        <p><a class="btn btn-lg btn-primary" href="#">Browse Courses</a></p>
                    </div>
                    </div>
                </div>
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        This the home page
        
        </>
    );
};

export default HomePage;