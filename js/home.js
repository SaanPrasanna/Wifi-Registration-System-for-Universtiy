$(document).ready(function() {

    var cleave = new Cleave('.mac', {
        delimiters: ['-', '-', '-', '-', '-', '-'],
        blocks: [2, 2, 2, 2, 2, 2],
        uppercase: true
    });

    $('#add_button').click(function() {
        $('#modal_id').hide();
        $('#student_form')[0].reset();
        $('.modal-title').text("Add Student");
        $('#type').text("Student Index Number");
        $('#action').val("Add");
        $('#operation').val("Add");
        $("#cn").prop("readonly", false);
        $("#mac").prop("readonly", false);
        $('.options').prop('disabled', false);
        $('#studentModal').find('label').removeClass('active').end().find('[type="radio"]').prop('checked', false);
    });


    var dataTable = $('#memListTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "inc/getData.php",
        "dom": 'Bfrtip',
        "buttons": [{
            extend: 'excel',
            exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7]
            }
        },
        {
            extend: 'pdf',
            exportOptions: {
                columns: [0, 1, 3, 4, 5, 6, 7]
            }
        },
        {
            extend: 'print',
            title: 'Students Wi-Fi Details',
            customize: function (win)
            {
                $(win.document.body).prepend('<center><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/WiFi_Logo.svg/1200px-WiFi_Logo.svg.png" style="position:absolute; top:0; left:0;opacity:0.1;" /></center>');
            },
            exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7]
            }
        }

        ]
    });


    $('#searchbox').on('keyup', function (){
        dataTable.search(this.value).draw();
    });

    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });
    $('#homeSubmenu').toggleClass('show');

    $('#logout').click(function() {
        window.location = 'inc/logout.php?request=true';
    });

    $('#cn').typeahead({
        source: function(query, result) {
            $.ajax({
                url: "inc/search_index.php",
                method: "POST",
                data: {query:query},
                dataType: "json",
                success: function(data) {
                    result($.map(data, function(item) {
                        return item;
                    }));
                }
            });
        }
    });



    $(document).on('submit', '#student_form', function(event) {
        event.preventDefault();
        var device = $("input:radio[name ='options']:checked").val();
        var server = $("input:radio[name ='option2']:checked").val();
        var student_id = $.trim($('#cn').val());
        var mac = $.trim($('#mac').val());
        var operation = $('#operation').val();
        var msg = "";

        if (student_id.length < 6) {
            msg = "Invalid Student ID Number";
        } else if ($.trim(device).length < 1) {
            msg = "Select the Device";
        } else if (mac.length < 17) {
            msg = "Invalid MAC Address";
        } else if ($.trim(server).length < 1) {
            msg = "Select the server";
        } else {

            $.ajax({
                url: "inc/insertstudnet.php",
                method: "POST",
                data: {
                    student_id: student_id,
                    device: device,
                    server: server,
                    mac: mac,
                    operation: operation
                },
                success: function(data) {
                    if ($.trim(data) == 'add') {
                        swal("Record Added !","","success");                     
                        $('#memListTable').DataTable().ajax.reload();
                        $('.btn-group').find('label').removeClass('active').end().find('[type="radio"]').prop('checked', false);
                        $('#cn').val('');
                        $('#mac').val('');
                        $('#studentModal').modal('hide');

                    } else if ($.trim(data) == 'edit') {
                        swal("Record Updated !","","success");
                        $('#memListTable').DataTable().ajax.reload();
                        $('.btn-group').find('label').removeClass('active').end().find('[type="radio"]').prop('checked', false);
                        $('#cn').val('');
                        $('#mac').val('');
                        $('#studentModal').modal('hide');
                        
                    } else {
                        swal("Record Failed !",""+data+"","error");                          
                    }
                }
            });
        }
        
        if ($.trim(msg).length > 0) {
            swal({
                icon: 'warning',
                title: msg,
            });
        }
    });


    $(document).on('click', '.edit', function() {
        var mac = $(this).attr("id");
        $.ajax({
            url: "inc/fetch_single_data.php",
            method: "POST",
            data: { mac: mac },
            dataType: "json",
            success: function(data) {
                $('.btn-group').find('label').removeClass('active').end().find('[type="radio"]').prop('checked', false);
                $('#studentModal').modal('show');
                $('.modal-title').text("Edit Wifi Details");
                $('#type').text("Student Index Number");
                $('#cn').val(data.Common_id);
                $('#action').val("Edit");
                $('#operation').val("Edit");
                $('#mac').val(mac);
                $("#cn").prop("readonly", true);
                $("#mac").prop("readonly", true);
                var device = (data.Device).toLowerCase();
                var server = (data.ap).toLowerCase();
                $('.'+device).addClass('active');
                $('.'+server).addClass('active');
                $('#'+ data.Device).prop('checked',true);
                $('#'+data.ap).prop('checked',true);
                $('.options').prop('disabled', true);
            }
        });
    });

    $(document).on('click','.deactivate',function(){
        var mac = $(this).attr("id"); 
        
        swal({
            title: "Are you sure?",
            text: "Double-check, You will not be able to reverse this operation ! info : "+mac,
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes, deactivate it !",
            closeOnConfirm: false
        },
        function (){
            $.ajax({
                url: "inc/deactivate.php",
                method: "POST",
                data: {mac:mac},
                success: function (data){
                    if($.trim(data) == 'Deactivated !'){
                        swal(data, "", "success");
                    }else{
                        swal(data, "", "error");
                    }
                    $('#memListTable').DataTable().ajax.reload();
                }
            });
        });
    });

    $(document).on('click','.view',function(){
        var mac = $(this).attr("id");
        $.ajax({
            url: "inc/fetch_single_data.php",
            method: "POST",
            data: { mac: mac },
            dataType: "json",
            success: function(data){
                //Fetching the data to View Modal
                $('#viewmodal').modal('show');
                $('.view_in').text(data.Common_id);
                $('.view_name').text(data.Name);
                $('.view_nic').text(data.NIC_No);
                $('.view_phone').text(data.Contact_No);
                $('.view_email').text(data.Email);
                $('.view_device').text(data.Device);
                $('.view_mac').text(data.Mac_Address);
                $('.view_ap').text(data.ap);
            }
        });

    });

});