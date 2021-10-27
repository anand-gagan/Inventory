$(document).ready(function() {

    $('#addVendorForm').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: '/vendor',
            type: 'POST',
            data:$('#addVendorForm').serialize(),
            success:function(data){
            }
        });
    });

    $('#addClientForm').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: '/client',
            type: 'POST',
            data:$('#addClientForm').serialize(),
            success:function(data){
            }
        });
    });
    
    $('#addItemForm').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: '/item-ref',
            type: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            data:$('#addItemForm').serialize(),
            success:function(data){
            }
        });
    });

    $('#vendorList').click(function(event) {
        $.ajax({
            url: '/vendor',
            type: 'GET',
            success:function(data){
                console.log("Success callback", data)
                if(data) {
                    $('#vendorList').html('<option id="blank" disabled selected> --- Select Vendor --- </option>');
                    $.each(data, function(k, v) {
                        $('#vendorList').append("<option id="+v._id+" value="+v._id+">" + v.name + "</option>");
                    });
                }
            },
            error:function(err) {
                console.error("EROOOOOOO!!", err);
            } 
        });
    });

    $(document).on('click', '.itemList',function(event) {
  //  $('#itemList1').click(function(event) {
        var id = $(this).attr('id');
        console.log(id + 'we are here');
        $.ajax({
            url: '/item-ref',
            type: 'GET',
            async: false,
            success:function(data){
                console.log("Success callback", data)
                if(data) {
                    $('#'+id).html('<option id="blank" disabled selected> -- Select Item -- </option>');
                    $.each(data, function(k, v) {
                        $('#'+id).append("<option id="+v._id+" value="+v._id+">" + v.name + "</option>");
                    });
                }
            },
            error:function(err) {
                console.error("EROOOOOOO!!", err);
            } 
        });
    });

    $(document).on('click', '.location',function(event) {
              var id = $(this).attr('id');
              console.log(id + 'we are here');
              $.ajax({
                  url: '/user-ref',
                  type: 'GET',
                  async: false,
                  success:function(data){
                      console.log("Success callback", data)
                      if(data) {
                          $('#'+id).html('<option id="blank" disabled selected> -- Select User -- </option>');
                          $.each(data, function(k, v) {
                              $('#'+id).append("<option id="+v._id+" value="+v.username+">" + v.username + "</option>");
                          });
                      }
                  },
                  error:function(err) {
                      console.error("EROOOOOOO!!", err);
                  } 
              });
          });

});