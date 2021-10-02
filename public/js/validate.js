$(document).ready(function() {
  
  var nameFlag = 0;
  var emailFlag = 0;
  var passFlag = 0;
  $('#name').on('input', function() {
    if($('#name').val() == null || !/\S/.test($('#name').val()))
    {
      nameFlag = 0;
      $('#username').attr('disabled', 'disabled');
      if(nameFlag == 0 || emailFlag == 0 || passFlag == 0)
        $('#registerBtn').attr('disabled', 'disabled');
      return false;
    }
    else
    {
      nameFlag = 1;
      $('#msgs').html('');
      $('#username').removeAttr('disabled');
      if(nameFlag == 1 && emailFlag == 1 && passFlag == 1)
        $('#registerBtn').removeAttr('disabled');
      else
        $('#registerBtn').attr('disabled', 'disabled');
      return true;
    }
  });

  $('#username').on('input', function() {
    if($('#name').val() == null)
    {
      emailFlag = 0;
      $('#password').attr('disabled', 'disabled');
      if(nameFlag == 0 || emailFlag == 0 || passFlag == 0)
        $('#registerBtn').attr('disabled', 'disabled');
      return false;
    }
    else
    {
      emailFlag = 1;
      $('#msgs').html('');
      $('#password').removeAttr('disabled');
      if(nameFlag == 1 && emailFlag == 1 && passFlag == 1)
        $('#registerBtn').removeAttr('disabled');
      else
        $('#registerBtn').attr('disabled', 'disabled');
      return true;
    }
  });

  $('#password').on('input', function() {
    if($('#name').val() == null || !/\S/.test($('#name').val()))
    {
      passFlag = 0;
      if(nameFlag == 0 || emailFlag == 0 || passFlag == 0)
        $('#registerBtn').attr('disabled', 'disabled');
      return false;
    }
    else
    {
      passFlag = 1;
      $('#msgs').html('');
      if(nameFlag == 1 && emailFlag == 1 && passFlag == 1)
        $('#registerBtn').removeAttr('disabled');
      else
        $('#registerBtn').attr('disabled', 'disabled');
      return true;
    }
  });

});