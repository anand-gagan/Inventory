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
            url: 'http://localhost:3001/vendor',
            type: 'GET',
            success:function(data){
                console.log("Success callback", data)
                if(data) {
                    $('#itemList').html('<option id="blank"> --- Select Vendor --- </option>');
                    $.each(data, function(k, v) {
                        $('#vendorList').append("<option id="+v._id+">" + v.name + "</option>");
                    });
                }
            },
            error:function(err) {
                console.error("EROOOOOOO!!", err);
            } 
        });
    });

    $('#itemList').click(function(event) {
        $.ajax({
            url: 'http://localhost:3001/item-ref',
            type: 'GET',
            success:function(data){
                console.log("Success callback", data)
                if(data) {
                    $('#itemList').html('<option id="blank"> -- Select Item -- </option>');
                    $.each(data, function(k, v) {
                        $('#itemList').append("<option id="+v._id+">" + v.name + "</option>");
                    });
                }
            },
            error:function(err) {
                console.error("EROOOOOOO!!", err);
            } 
        });
    });

    $('#itemForm').submit(function(event) {
        // TODO validations
    })
});