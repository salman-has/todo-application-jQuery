
function LoadDashboard(){
    if($.cookie('userid')){
        
        $.ajax({
        method: "get", 
        url:`../../public/pages/user_dashboard.html`,
        success: (response)=>{
             $("section").html(response);
             $("#lblUser").html($.cookie('userid'));
             $.ajax({
                 method:'get',
                 url: `http://127.0.0.1:4040/appointments/${$.cookie('userid')}`,
                 success: (appointments=>{
                     appointments.map(appointment=>{
                          $(`<div class="alert alert-success alert-dismissible">
                               <h3>Appointment Id :<span class="text-success"> ${appointment.appointment_id}</span</h3>
                               <h2 class="text-black">Meeting Title : ${appointment.title}</h2>
                               <p class="text-secondary form-control-plaintext">Description : ${appointment.description} </p>
                               <div class="bi bi-calendar"> Date :   ${appointment.date.slice(0, appointment.date.indexOf("T"))}</div>
                               <div class="mt-3">
                                  <button class="bi bi-pen-fill btn btn-warning m-x2" id="editbtn" value=${appointment.appointment_id}></button>
                                  <button class="bi bi-trash btn btn-danger m-x2" id="deletebtn" value=${appointment.appointment_id}></button>
                               </div>
                            </div>`).appendTo("#appointments");
                     })
                 })
             })
          }
        })

    } else {
        $.ajax({
        method: "get", 
        url:`../../public/pages/${page_name}`,
        success: (response)=>{
            $("section").html(response);
          }
        })
    }
}


function LoadPage(page_name){
    $.ajax({
        method: "get", 
        url:`../../public/pages/${page_name}`,
        success: (response)=>{
            $("section").html(response);
          }
        })
}

$(function(){
    LoadPage("home.html");

    //New User Button Click - on home
    $(document).on("click", "#btnNewUser",()=>{
        LoadPage("new_user.html");
    })

    // Signin Button Click - on home
    $(document).on("click", "#btnSignin",()=>{
        LoadPage("user_login.html");
    })

    $(document).on("click", "#btnExistingUser",()=>{
        LoadPage("user_login.html");
    })

    // Register Button Click - Post Data to Users

     $(document).on("click", "#btnRegister",()=>{

        var user = {
            user_id : $("#user_id").val(),
            user_name: $("#user_name").val(),
            password: $("#password").val(),
            mobile: $("#mobile").val()
        }

        $.ajax({
            method: "post",
            url: `http://127.0.0.1:4040/register-user`,
            data: user,
            success:()=>{
                alert('User Registered');
            }
        })
        LoadPage("user_login.html");
    })
    
    // Login Button - on login page

    $(document).on("click", "#btnLogin",()=>{

          var user_id = $("#user_id").val();

          $.ajax({
            method: 'get',
            url: `http://127.0.0.1:4040/users/${user_id}`,
            success: (userDetails)=>{
                 if(userDetails){
                     if($("#password").val()===userDetails.password){
                         $.cookie('userid', $("#user_id").val());
                         LoadDashboard();
                     } else {
                         alert('Invalid Password');
                     }
                 } else {
                     alert(`User Not Found`);
                 }
            }
          })

    })

    // Signout Logic

    $(document).on("click", "#btnSignout",()=>{
         $.removeCookie('userid');
         LoadPage('home.html');
    })
    // New Appointment
    $(document).on("click", "#btnNewAppointment",()=>{
         LoadPage('add_appointment.html');
    })

    //adding appointment
    $(document).on("click", "#btnAdd",()=>{
        var appointment = {
            appointment_id : $("#appointment_id").val(),
            title: $("#title").val(),
            description: $("#description").val(),
            date: $("#date").val(),
            user_id:$.cookie("userid")

        }

        $.ajax({
            method:"post",
            url:`http://127.0.0.1:4040/add-appointment`,
            data:appointment,
            success:()=>{
               
            }
           
        }) 
         alert('appointment added.');
         LoadDashboard();
        
    })

    $(document).on("click", "#btnCancel",()=>{
        //  LoadPage('user_dashboard.html');
         LoadDashboard();
    })

    //delete button process.
    $(document).on("click", "#deletebtn", (e)=>{
         var choice = confirm('Are you sure? Want to Delete?');
          if(choice===true){
              $.ajax({
                    method: "delete", 
                    url: `http://127.0.0.1:4040/delete-appointment/${e.target.value}`,
                })
                alert('Appointment Deleted..');
                LoadDashboard();
          }
    })


    //update button process...
    $(document).on("click", "#editbtn",(e)=>{
        LoadPage('edit-appointment.html');
        $.ajax({
            method: "get",
            url: `http://127.0.0.1:4040/appointment-Details/${e.target.value}`,
            
            success: (appointments=>{
                $("#appointment_id").val(appointments.appointment_id);
               
                $("#title").val(appointments.title);
               
                $("#description").val(appointments.description);
                $("#date").val(appointments.date.slice(0,appointments.date.indexOf("T")));
                sessionStorage.setItem("appointment_id",appointments.appointment_id);
            })
        })
    })

    //update button process,.....
    $(document).on("click","#btnupdate", ()=>{
         var appointment = {
            appointment_id : $("#appointment_id").val(),
            title : $("#title").val(),
            description : $("#description").val(),
            date : $("#date").val(),
            user_id : $.cookie("userid")
         }
        
         $.ajax({
            method : "put",
            url : `http://127.0.0.1:4040/edit-appointment/${sessionStorage.getItem("appointment_id")}`,
            contentType: "application/json",
            data : JSON.stringify(appointment)
                 
            
           
         })
         
         alert('Appointment Updated Successfull ..');
         LoadDashboard();
        
    })


    //cancel update button ...
    $(document).on("click","#btnupdateCancel",()=>{
        LoadDashboard();
    })

})