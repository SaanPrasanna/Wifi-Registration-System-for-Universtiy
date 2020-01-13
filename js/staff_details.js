/*
    @ Student Details form Js
    @ Retriving the all table data and Exporting buttons, Modal works
*/
$(document).ready(function(){

    $('#add_button').click(function() {
        $('#staffModal').modal('show');        
        $('#modal_id').hide();
        $('#student_form')[0].reset();
        $('.modal-title').text("Add Staff Member");
        $('#action').val("Add");
        $('#operation').val("Add");
        $('#cn').prop("readonly", false);

    });

    $('#homeSubmenu').toggleClass('hide');
    $('#pageSubmenu').toggleClass('show');

    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    var dataTable = $('#memListTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "inc/getData_staff.php",
        "dom": 'Bfrtip',
        "buttons": [{
            extend: 'excel',
            exportOptions: {
                columns: [0, 1, 2, 3, 4, 5]
            }
        },
        {
            extend: 'pdf',
            exportOptions: {
                columns: [0, 1, 3, 4, 5]
            }
        },
        {
            extend: 'print',
            title: 'Staff Details',
            customize: function (win)
            {
                $(win.document.body).prepend('<center><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/WiFi_Logo.svg/1200px-WiFi_Logo.svg.png" style="position:absolute; top:0; left:0;opacity:0.1;" /></center>');
            },
            exportOptions: {
                columns: [0, 1, 2, 3, 4, 5]
            }
        }

        ]
    });

    $('#searchbox').on('keyup', function ()
    {
        dataTable.search(this.value).draw();
    });

    $(document).on('click','.edit',function(){
        var Common_id = $(this).attr('id');
        $.ajax({
            url: "inc/fetch_data_by_index.php",
            method: "POST",
            data: {Common_id:Common_id},
            dataType:"json",
            success: function(data){
                $('#staffModal').modal('show');
                $('.modal-title').text("Edit Staff Details");
                $('#cn').val(data.Common_id);
                $('#name').val(data.Name);
                $('#nic').val(data.NIC_No);
                $('#phone').val(data.Contact_No);
                $('#email').val(data.Email);
                $('#designation').val(data.Designation);
                $('#department').val(data.Department);
                $('#action').val("Edit");
                $('#operation').val("Edit");
                $("#cn").prop("readonly", true);
            }
        });
    });

    $(document).on('submit', '#student_form', function(event) {
        event.preventDefault();

        var Common_id = $('#cn').val();
        var name = $.trim($('#name').val());
        var phone = $.trim($('#phone').val());
        var email = $.trim($('#email').val());
        var operation = $('#operation').val();
        var designation = $('#designation').val();
        var department =  $('#department').val();
        var msg = "";

        // @ Validate the Email Address
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var result = regex.test(email);

        if($.trim(name.length) < 1){
            msg = "Please Enter the Name";
        }else if($.trim(designation.length)<1){
            msg = "Please Enter the Designation";
        }else if ($.trim(department.length) < 1 ) {
            msg = "Please Enter the Department";
        }else if($.trim(Common_id.length) < 1){
            msg = "Please Enter the NIC Number";
        }else if (phone.length != 10) {
            msg = "Invalid Phone Number";
        } else if (result == false) {
            msg = "Invalid E-mail Address";
        } else {

            $.ajax({
                url: "inc/insertStaffData.php",
                method: "POST",
                data: {Common_id:Common_id,name:name,phone:phone,email:email,designation:designation,department:department,operation:operation},
                success: function(data) {
                    if ($.trim(data) == 'add') {
                        swal("Record Added !","","success");                     
                        $('#memListTable').DataTable().ajax.reload();
                        $('#staffModal').modal('hide');

                    } else if ($.trim(data) == 'edit') {
                        swal("Record Updated !","","success");
                        $('#memListTable').DataTable().ajax.reload();
                        $('#staffModal').modal('hide');
                        
                    } else {
                        swal("Record Failed !",""+data+"","error");                          
                    }
                }
            });
        }
        
        if ($.trim(msg).length > 0) {
            swal("Warning!", msg, "warning")
        }
    });



});

