$(function() {
  var admin= {
    init: function() {
      var self= this;
      self.binding();
    },
    binding: function() {
      $('#forceSync').on('click', function() {
        $.get('/admin/forceUpdate', function(data) {
          console.log(data);
        });
      });
      $('#addBrew').on('click', function() {
        $(this).button('loading');
        var postObj= {
          name: $('#brewName').val(),
          utvid: $('#brewVid').val(),
          address: $('#brewAddr').val(),
          phone: $('#brewTel').val(),
          url: $('#brewUrl').val(),
          lat: $('#brewLat').val(),
          lng: $('#brewLng').val()
        };
        $.post('/admin/addBrew', postObj, function(data) {
          $('#addBrew').button('reset');
          $('#addBrewForm input').val('');
        });
      });
      $('.brewEditBtn').on('click', function() {
        $(this).parent().find('span').each(function() {
          $(this).parent().append('<input type="text" placeholder="'+$(this).text()+'" />');
          $(this).remove();
        });
        $(this).parent().append('<div role="group" class="btn-group editGroup"><button type="button" class="btn btn-warning editCancel">Cancel changes</button><button type="button" class="btn btn-success editUpdate">Update</button></div>');
        $(this).hide();
      });
      $('#brewEdit').on('click', '.editCancel', function() {
        $(this).parent().parent().find('input').each(function() {
          $(this).parent().append('<span>'+$(this).attr('placeholder')+'</span>');
          $(this).remove();
        });
        $(this).parent().siblings('.brewEditBtn').show();
        $(this).parent().remove();
      });
      $('#brewEdit').on('click', '.editUpdate', function() {
        var updObj= {
          name: null,
          utvid: $(this).parent().siblings('p.utvid').data('utvid'),
          address: null,
          phone: null,
          url: null,
          lat: null,
          lng: null
        };
        $(this).parent().parent().find('input').each(function() {
          if($(this).val())
            updObj[$(this).parent().attr('class')]= $(this).val();
        });
        for(var key in updObj) {
          if(updObj[key]== null)
            delete updObj[key];
        }
        $.post('/admin/updateBrew', updObj, function(data) {
          $(this).parent().siblings('.brewEditBtn').show();
          $(this).parent().remove();
        });
      });
    }
  };
  admin.init();
});