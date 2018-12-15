/* chevron_toggle.js */
$(document).ready(function()
{
	$('body')
    .on( 'click'
       , 'div.show-with-chevron > label'
       , function(e)
                {
console.log('Click trapped on ' + $(this).find('input[name="show_chevron"]').val()) ;
// 									e.preventDefault() ;
									var obj = $(this)
										, obj_val = $(this).val()
										, parent_div = obj.parents('div:first')
									;
                  parent_div
										.find('input[name="show_chevron"]')
											.parents('label:first')
												.toggle()
										.siblings('hide-with-chevron')
                    .toggle(obj_val == 'show')
										.parents('label:first')
											.siblings
									;
									
                }
)
}) ;

// #id_popout > form > div.show-with-chevron > label:nth-child(2) > span
// #id_popout > form > div.show-with-chevron > label:nth-child(2)
