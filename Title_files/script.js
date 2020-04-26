let mobile = window.innerWidth < 700;

if(document.querySelector('#myVideo')){
  var ringer = {
    countdown_to: date_stage,
    rings: {
      'ДНЕЙ'  : { s: 86400000, max: 365 },// mseconds in a day,
      'ЧАСОВ' : { s: 3600000, max: 24 },// mseconds per hour,
      'МИНУТ' : { s: 60000, max: 60 },// mseconds per minute
      'СЕКУНД': { s: 1000, max: 60 }
    },
    r_count: 4,
    r_spacing: mobile ? 8 : 15, // px
    r_size: mobile ? 80 : 130, // px
    r_thickness: mobile ? 4 : 8, // px
    c_max: mobile ? 400 : 600,
    update_interval: 22, // ms

    init: function(){
      $r = ringer;
      $r.cvs = document.querySelector('#countdown');
      if(!$r.cvs) return false;

      $r.size = {
        w: ($r.r_size + $r.r_thickness) * $r.r_count + ($r.r_spacing*($r.r_count-1)),
        h: ($r.r_size + $r.r_thickness)
      };

      $r.cvs.setAttribute('width',$r.size.w+'px');
      $r.cvs.setAttribute('height',$r.size.h+'px');
      $r.ctx = $r.cvs.getContext('2d');
      // $(document.body).append($r.cvs);
      $r.cvs = $($r.cvs);
      $r.ctx.textAlign = 'center';
      $r.actual_size = $r.r_size + $r.r_thickness;
      $r.countdown_to_time = new Date($r.countdown_to).getTime();
      // $r.cvs.css({ width: $r.size.w+"px", height: $r.size.h+"px" });
      $r.cvs.css({ 'width': 'auto', 'height': $r.size.h+'px', 'max-width': $r.c_max+'px', 'min-width': '360px' });
      $r.go();
    },
    ctx: null,
    go: function(){
      var idx=0;
      $r.time = (new Date().getTime()) - $r.countdown_to_time;
      for(var r_key in $r.rings) $r.unit(idx++,$r.rings[r_key],r_key);
      setTimeout($r.go,$r.update_interval);
    },
    unit: function(idx,ring,label) {
      var x,y, value, ring_secs = ring.s;
      value = parseFloat($r.time/ring_secs);
      $r.time-=Math.round(parseInt(value)) * ring_secs;
      value = Math.abs(value);

      x = ($r.r_size*.5 + $r.r_thickness*.5);
      x +=+(idx*($r.r_size+$r.r_spacing+$r.r_thickness));
      y = $r.r_size*.5;
      y += $r.r_thickness*.5;

      // calculate arc end angle
      var degrees = 360-(value / ring.max) * 360.0;
      var endAngle = degrees * (Math.PI / 180);
      $r.ctx.save();
      $r.ctx.translate(x,y);
      $r.ctx.clearRect($r.actual_size*-0.5, $r.actual_size*-0.5, $r.actual_size, $r.actual_size);

      // first circle
      $r.ctx.strokeStyle = "rgba(225,225,225,0.5)";
      $r.ctx.beginPath();
      $r.ctx.arc(0,0, $r.r_size/2, 0 , 2 * Math.PI, true);
      $r.ctx.lineWidth =$r.r_thickness;
      $r.ctx.stroke();

      // second circle
      $r.ctx.strokeStyle = '#063d63';
      $r.ctx.beginPath();
      $r.ctx.arc(0,0, $r.r_size/2, 4.71, endAngle+4.71, true);
      $r.ctx.lineWidth =$r.r_thickness;
      $r.ctx.stroke();

      // label
      $r.ctx.fillStyle = "#ffffff";

      // numbers
      $r.ctx.font = (mobile ? '30' : '60') + 'px Russo One';
      $r.ctx.fillText(Math.floor(value), 0, mobile ? 4 : 8);

      // text
      $r.ctx.font = (mobile ? '12' : '16') + 'px Russo One';;
      $r.ctx.fillText(label, 0, mobile ? 20 : 44);
      // $r.ctx.fillText(label, 0, 44);

      $r.ctx.restore();
    }
  };
  window.onload = function(){
    ringer.init();
  }
  window.onresize = function(){
    ringer.init();
  }
}

let plats_aos = function(){
  document.querySelectorAll('.plats-item').forEach(function(el){
    el.dataset.aos = mobile ? 'fade-up' : el.dataset.aosTemp;
    el.dataset.aosDelay = mobile ? '400' : el.dataset.delay;
  })
};

$(window).resize(function() {
  plats_aos()
});

$(document).ready(function() {
  plats_aos();
  $( ".custom_select" ).cSelect();

  $('input.form-control').each(function(){
    $(this).val() == '' ? $(this).removeClass('fill') : $(this).addClass('fill').removeClass('wrong');
    $(this).on('blur focusout', function(){
      $(this).val() == '' ? $(this).removeClass('fill') : $(this).addClass('fill').removeClass('wrong');
    })
  })

  // AOS
    AOS.init({
      offset: mobile ? 0 : 100,
      once: true
    });
    var delay = 0;
    $('.group-of-aos [data-aos]').each(function(){
      delay = delay + 200;
      $(this).attr('data-aos-delay', delay);
    })

  // carousel SLICK
    $('.carousel-nav').slick({
      autoplay: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      dots: false,
      arrows: true,
      responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 576,
            settings: {
              slidesToShow: 1
            }
          }
        ]
    })

  // def elements EVENTS
    $('.navbar-toggler').click(function(){
      $('#navbarResponsive').toggleClass('show')
    })
    $("#join_button, #about_button").click(function() {
      $([document.documentElement, document.body]).animate({
          scrollTop: $("#join").offset().top
      }, 2000);
    })
    $('.hover-card-init').hover(function(){
      $(this).closest('.hover-card').toggleClass('hover')
    })


});

(function ( $ ) {
	var elActive = '';
    $.fn.cSelect = function( options ) {

        // option
        var settings = $.extend({
            color: "#FFF", // color
            backgroundColor: "#063d63", // background
			change: function( ){ }, // event change
        }, options );

        return this.each(function(){

			var selectParent = $(this);
				list = [],
				html = '';

			//parameter CSS
			var width = $(selectParent).width() <= 220 ? 220-44 : $(selectParent).width();

			$(selectParent).hide();
			if( $(selectParent).children('option').length == 0 ){ return; }
			$(selectParent).children('option').each(function(){
				if( $(this).is(':selected') ){ s = 1; title = $(this).text(); }else{ s = 0; }
				list.push({
					value: $(this).attr('value'),
					text: $(this).text(),
					selected: s,
				})
			})

			// style
			var style = " background: "+settings.backgroundColor+"; color: "+settings.color+" ";

			html += "<ul class='cSelect'>";
			html += 	"<li>";
			// html += 		"<span class='arrowCF ion-chevron-right' style='"+style+"'></span>";
			html += 		"<span class='titleCF' style='width:"+width+"px'>"+title+"</span>";
			html += 		"<span class='searchCF' style='width:"+width+"px'><input style='color:"+settings.color+"' /></span>";
      html += 		"<span class='arrowCF ion-chevron-right'></span>";
			html += 		"<ul>";
			$.each(list, function(k, v){ s = (v.selected == 1)? "selected":"";
			html += 			"<li value="+v.value+" class='"+s+"'>"+v.text+"</li>";})
			html += 		"</ul>";
			html += 	"</li>";
			html += "</ul>";
			$(selectParent).after(html);
			var customSelect = $(this).next('ul.cSelect'); // add Html
			var seachEl = $(this).next('ul.cSelect').children('li').children('.searchCF');
			var seachElOption = $(this).next('ul.cSelect').children('li').children('ul').children('li');
			var seachElInput = $(this).next('ul.cSelect').children('li').children('.searchCF').children('input');

			// handle active select
			$(customSelect).unbind('click').bind('click',function(e){
				e.stopPropagation();
				if($(this).hasClass('onCF')){
					elActive = '';
					$(this).removeClass('onCF');
					$(this).removeClass('searchActive'); $(seachElInput).val('');
					$(seachElOption).show();
				}else{
					if(elActive != ''){
						$(elActive).removeClass('onCF');
						$(elActive).removeClass('searchActive'); $(seachElInput).val('');
						$(seachElOption).show();
					}
					elActive = $(this);
					$(this).addClass('onCF');
					$(seachEl).children('input').focus();
				}
			})

			// handle choose option
			var optionSelect = $(customSelect).children('li').children('ul').children('li');
			$(optionSelect).bind('click', function(e){
				var value = $(this).attr('value');
				if( $(this).hasClass('selected') ){
					//
				}else{
					$(optionSelect).removeClass('selected');
					$(this).addClass('selected');
					$(customSelect).children('li').children('.titleCF').html($(this).html());
					$(selectParent).val(value);
					settings.change.call(selectParent); // call event change
				}
			})

			// handle search
			$(seachEl).children('input').bind('keyup', function(e){
				var value = $(this).val();
				if( value ){
					$(customSelect).addClass('searchActive');
					$(seachElOption).each(function(){
						if( $(this).text().search(new RegExp(value, "i")) < 0 ) {
							// not item
							$(this).fadeOut();
						}else{
							// have item
							$(this).fadeIn();
						}
					})
				}else{
					$(customSelect).removeClass('searchActive');
					$(seachElOption).fadeIn();
				}
			})

		});
    };
	$(document).click(function(){
		if(elActive != ''){
			$(elActive).removeClass('onCF');
			$(elActive).removeClass('searchActive');
		}
	})
}( jQuery ));



function formReset(form){
  var formEls = form.querySelectorAll('input, texarea');
  for (var i = 0; i < formEls.length; i++) {
	  formEls[i].value = '';
	  formEls[i].classList.remove('fill', 'wrong');
	}
}
function formValid(form){
  var formEls = form.querySelectorAll('[required]');
  console.log(formEls)
  var isValid = 1;
  for (var i = 0; i < formEls.length; i++) {
	  if(formEls[i].value == ''){
      console.log('value: ',formEls[i].value)
      formEls[i].classList.add('wrong')
      isValid = 0
    }
	}
  return isValid
}
$('.btn-submit').click(function (event) {
  event.preventDefault();

  var btn = $(this)
  var form = btn.closest('form')[0];
  if(!formValid(form)) return false;

  var data = new FormData(form);
  form.classList.add('preload_form');

  $.ajax({
    type: "POST",
    // url: "http://msk"+form.dataset.action,
    url: form.dataset.action,
    enctype: 'multipart/form-data',
    data: data,
    processData: false,
    contentType: false,
    cache: false,
    success: function (response) {
      console.log($(form).attr('id')+': response:\n', response);
      setTimeout(function() {
        form.classList.add('preload_form-success')
        setTimeout(function() {
          if(form.dataset.reset) formReset(form);
          form.classList.remove('preload_form', 'preload_form-success');
          if(form.dataset.redir) window.location.href = form.dataset.redir;
        }, 2000);
      }, 2000);
    },
    error: function (xmlhttprequest, textstatus, message) {
      console.log("ERROR : ", xmlhttprequest, textstatus, message);
      setTimeout(function() {
        form.classList.add('preload_form-error');
        setTimeout(function() {
          form.classList.remove('preload_form', 'preload_form-error');
        }, 2000);
      }, 2000);
    }
  });
});

$('.btn-query-get').click(function (event) {
  event.preventDefault();

  var btn = $(this);
  btn.prop('disabled', true);

  $.ajax({
    // url: "http://msk"+btn[0].dataset.action,
    url: btn[0].dataset.action,
    type: 'GET',
    // dataType: 'json',
    success: function(response) {
        console.log(response);
        setTimeout(function() {
          btn.before('<p id="msg-sccss">'+btn[0].dataset.success+'</p>');
          setTimeout(function() {
            $('#msg-sccss').remove();
            btn[0].dataset.redir ? (window.location.href = btn[0].dataset.redir) : window.location.reload();
          }, 5000);
        }, 2000);
    },
    error: function (xmlhttprequest, textstatus, message) {
      console.log("ERROR : ", xmlhttprequest, textstatus, message);
      setTimeout(function() {
        btn.after('<p id="msg-err">'+btn[0].dataset.error+'</p>');
        setTimeout(function() {
          $('#msg-err').remove();
          btn.prop('disabled', false);
        }, 5000);
      }, 2000);
    }
  });
});
