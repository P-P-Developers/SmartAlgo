import React from 'react'
import './App.css';

const Error = () => {
  return (
    <div>
      <section class="page_404">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 ">
              <div class="col-sm-12 col-sm-offset-1  text-center">
                <div class="four_zero_four_bg">
                  <h1 class="text-center ">404</h1>
                </div>

                <div class="contant_box_404">
                  <h3 class="h2 text-center">
                    Look like you're lost
                  </h3>
                  <h5>The page you are looking for not avaible!</h5>
                  {/* <a href="" class="link_404">Go to Home</a> */}
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Error;