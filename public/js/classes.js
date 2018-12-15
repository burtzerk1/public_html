/* classes.js */

$(document)
	.ajaxComplete(function(event, xhr, settings)
										{
											console.log('Event is %o', event) ;
											console.log('Xhr is %o', xhr) ;
											console.log('Settings are %o', settings) ;
											console.log('Xhr.responseText is %o', xhr.responseText) ;
											var html = $.parseHTML(xhr.responseText)
												, login_form = $('#log-in-to-site', html)
											;
											if ( login_form.length != 0 )
											{
												window.location.href = login_form.prop('action') ;
											}
										}
		)
	.ready(function() 
		{
				var cancel_button = {  text  : text_cancel_button
																		, click : function()
																										{
																											$(this).dialog('close')
																										}
										
														}
				;

// 	$('table.table:first').DataTable( {
// 		"order": [[3, "desc"]]
// 	});
	
  $('table table.table')
		.on( 'click' 
			 , 'i.lesson-plans'
			 , function(e)
							{
								var obj = $(this)
									, obj_td = obj.parents('td:first')
									, obj_tr = obj.parents('tr:first')
									, obj_id = obj_tr.data('row_id')
									, parent_tr = obj_tr.parents('tr:first')
									, div_title = obj_tr.children('td:not(.action-box):first').text() + ' ' + obj_tr.find('td > span.start-time:first').text() + ' ' + parent_tr.find('td > span.class-type').text()
									, buttons = []
                  , popout_div = $('<div/>'
                                  , { id    : 'id_popout'
                                    , title : div_title
                                    }
                                  )
                                  .appendTo('body')
                                  .hide() 
								;
								buttons.push(cancel_button) ;
								buttons.push({  text  : text_print_button
															, click : function()
																							{

																								var get_url = url_get_lesson_plan
																																		.replace('%id%', obj_id)
																																		.replace('%day%', popout_div.find('select[name="plan_date"]').val())
																																		 + '/yes'
																								;
																								printPage (get_url) ;
/*
																								$('#print-container')
																									.load( get_url
																											 , function()
																															{
																																window.afterprint = function()
																																					{
																																						console.log('Resetting the body CSS') ;
																																						$('#print-container')
																																							.css('width', 'auto')
																																							.css('height', 'auto')
																																						;
																																					}
																																	;
																																	window.print() ;
																															}
																									) ;
*/
																								$(this).dialog('close') ;
																							}
															
															}) ;
								
								// create a popout div, populate it with a dropdown from the server
								// have print and cancel buttons
								// the print button will populate the print div with the lesson plan from the server and execute window.print
                $('#id_popout')
									.load( url_lesson_plans.replace('%id%', obj_id) 
											 , function()
															{
																if (popout_div.find('input[name="password"].lock').length > 0 )
																{
																	window.location.href = login_page ;
																}
															}
										
											 ) 
								;
                popout_div
                    .dialog({ modal      : true
                            , width      : 'auto'
                            , height     : 'auto'
                            , close      : function() 
                                                  {
                                                    $(this).dialog('destroy') ; 
                                                    popout_div.remove() ;
								
                                                  }
                            , buttons    : buttons
                    })
                ;
							}
			 )
		.on( 'click'
			 , 'div.edit-levels'
			 , function(e)
							{
								var obj = $(this)
									, obj_td = obj.parents('td:first')
									, obj_tr = obj.parents('tr:first')
									, obj_id = obj_tr.data('row_id')
									, parent_tr = obj_tr.parents('tr:first')
									, div_title = parent_tr.children('td:not(.action-box):first').children('span:first').text() + ' ' + obj_tr.children('td:eq(2)').text() + ' ' + obj_tr.children('td:eq(3)').text()
									, buttons = []
                  , popout_div = $('<div/>'
                                  , { id    : 'id_popout'
                                    , title : div_title
                                    }
                                  )
                                  .appendTo('body')
                                  .hide() 
								;
								buttons.push(cancel_button) ;
								buttons.push({  text  : text_submit_button
															, click : function()
																							{
																								popout_div.find('form:first').submit()

																								$(this).dialog('close') ;
																							}
															
															}) ;
								obj_tr.addClass('being-edited') ;
								$('#id_popout').load( url_edit_class_levels.replace('%id%', obj_id) ) ;
                popout_div
                    .dialog({ modal      : true
                            , width      : 'auto'
                            , height     : 'auto'
                            , close      : function() 
                                                  {
																										obj_tr.removeClass('being-edited') ;
                                                    $(this).dialog('destroy') ; 
                                                    popout_div.remove() ;
								
                                                  }
                            , buttons    : buttons
                    })
                ;
							}
			 )
	;
	
	$('body')
		.on( 'change init'
			 , 'select[name="create_new_class"]'
			 , function(e)
							{
								var obj = $(this)
									, obj_val = obj.val()
									, hide_inputs = obj_val == 'no'
								;
								$('fieldset.new-class-inputs')
									.attr('disabled', hide_inputs)
									.children('div')
										.toggle( ! hide_inputs)
								;
							}
			 )
		.on( 'click'
			 , ' table.table:first td.action-box i.roll-class-over'
			 , function(e)
							{
								var obj = $(this)
									, obj_tr = obj.parents('tr:first')
									, obj_id = obj_tr.data('row_id')
									, buttons = []
									, class_type = obj_tr.find('span.class-type:first').text()
									, class_date = obj_tr.children('td:nth-child(3)').text()
                  , popout_div = $('<div/>'
                                  , { id    : 'id_popout'
                                    , title : title_rollover.replace('%date%', class_date).replace('%class_name%', class_type)
                                    }
                                  )
                                  .appendTo('body')
                                  .hide() 
								;
								obj_tr.addClass('being-edited') ;
								buttons.push(cancel_button) ;
								buttons.push({  text  : text_submit_button
															, click : function()
																							{
																								var popout_form = popout_div.find('form:first') 
// 																									, send_data_to = validate_url
																								;
																								popout_div.find('#popout_messages').remove() ;
																								
																								if ( ! /.*#$/.test(popout_form.prop('action')) )
																								{
																									send_data_to = popout_form.prop('action') ;
																								}
																								$.post( send_data_to
																											, popout_form.serialize()
																											, function(data)
																															{
																																if ( data.result === true )
																																{
																																	window.location.reload() ;
																																	
																																}
																																$('<div />',{ id : 'popout_messages' 
																																						, html : data.messages
																																						} 
																																	).insertBefore(popout_form)
																																;
																															}
																											, 'json'
																											)
																							}
															
															}) ;
								$('#id_popout').load( url_roll_class_over.replace('%id%', obj_id) ) ;
                popout_div
                    .dialog({ modal      : true
                            , width      : 'auto'
                            , height     : 'auto'
                            , close      : function() 
                                                  {
																										obj_tr.removeClass('being-edited') ;
                                                    $(this).dialog('destroy') ; 
                                                    popout_div.remove() ;
								
                                                  }
                            , buttons    : buttons
                    })
                ;
							}
			 ) // end roll over class click
		.on( 'change'
			 , 'input[name="start_week"],input[name="end_week"]'
			 , function(e)
							{
								var obj = $(this)
									, data = {}
									, obj_form = obj.parents('form:first')
									, day_count = obj_form.data('days_in_class')
									, end_date = $('input[name="end_week"]:first', obj_form)
									, start_date = $('input[name="start_week"]:first', obj_form)
								;

								data.start_date = start_date.val() ;
								data.days = day_count ;
								if ( end_date.val() != '' )
								{
									data.end_date = end_date.val() ;
								}
								// when the start date changes, we need to get the end date and also repopulate the start date with the relevant Monday
								$.get( url_get_new_end_date
										 , data
										 , function(result)
															{
																var week_no
																	, container
																	, week_obj
																	, first_week_obj = $('div[data-week_no="1"]')
																	, new_week_obj
																	, new_week_input = $('input[name="week_allocation[1]"]')
																	, new_name
																;
console.log('The returned item is %o', result ) ;

                                start_date.val(result.start_date) ;
                                end_date
																	.val(result.end_date) 
																	.attr('min', result.start_date)
																;
console.log('The start date is ' + result.start_date + ' and the input value is now ' + start_date.val() ) ;
																$('div[data-week_no]')
																	.each(function()
																							{
																								week_no = $(this).data('week_no') ;
																								if ( week_no > result.weeks )
																								{
																									week_inputs = $('input[type="radio"][name="week_allocation[' + week_no + ']"]') ;
																									container = week_inputs.parents('div:first') ;

																									if ( week_no > 1 )
																									{
																										$(this).remove() ;
																										week_inputs
																											.each(function()
																																	{
																																		$(this).parents('div:first').remove() ;
																																	}
																													 )
																										;
																									} else
																									{
																										$(this).hide() ;
																										container.hide() ;
																									}
																								}
																							}
																	)
																; // end each divs with a week number data element
																
																for ( i=1 ; i <= result.weeks ; i++ )
																{
																	week_obj = $('div[data-week_no="' + i + '"]') ;
																	// if there is no heading
																	if ( week_obj.length == 0 )
																	{
																		new_week_obj = first_week_obj
																													.clone(true)
																													.text(i)
																													.attr('data-week_no', i)
																													.data('week_no', i)
																													.appendTo(first_week_obj.parents('div.row:first'))
																													.show()
																		;
																		new_week_input
																				.each(function()
																										{
																											obj = $(this) ;
																											new_week_obj = obj.parents('div:first').clone(true, true) ;
																											new_name = obj.attr('name').replace(/(.*)\[(.*)\]/, '$1[' + i + ']')
																											new_week_obj
																												.find('input[name="' + obj.prop('name') + '"]:first')
																													.attr('name', new_name)
																													.prop('disabled', false)
																												.end()
																												.show()
																												.appendTo(obj.parents('div.row:first'))
																											;
																										}
																						 )
																		;
																		
																	} else
																	{
																		week_obj.show() ;
																		new_week_input
																				.each(function()
																										{
																											$(this)
																												.prop('disabled', false)
																												.parents('div:first').show()
																										}
																						 )
																		;
																		
																	}
																	
																}
															}
									
										 )
								;
							}
			 ) // end change start week value
	;
	
	
} ) ;
