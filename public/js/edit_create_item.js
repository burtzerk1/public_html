// edit_create_item.js

$(document)
	.ajaxComplete(function(event, xhr, settings)
										{
											var html = $.parseHTML(xhr.responseText)
												, login_form = $('#log-in-to-site', html)
											;
// console.log('Event is %o', event) ;
// console.log('Xhr is %o', xhr) ;
// console.log('Settings are %o', settings) ;
// console.log('Xhr.responseText is %o' + xhr.responseText) ;
										if ( login_form.length != 0 )
											{
												window.location.href = login_form.prop('action') ;
											}
										}
		)
	.ready(function(){

		function add_messages(messages, div_id, insert_before_obj)
		{
			
			$('<div />',{ id : div_id
									, html : messages
									} 
				).insertBefore(insert_before_obj)
			;
		}
		
		$('#content')
			.on( 'click'
				, 'button.item-add, td.action-box .item-edit, td.action-box .edit-levels, td.action-box .class-cover'
				, function(e)
								{
									e.preventDefault() ;
									
									var obj = $(this)
										, obj_row = obj.parents('tr:first')
										, obj_table = obj_row.parents('table:first')
										, calling_class
										, remove_edit_class_from = obj_row
										, table_data = ( obj_table.data('data_type') == undefined ? '' : '_' + obj_table.data('data_type'))
									;

									// get the edit class for the triggering object
									for ( i=0,j=e.currentTarget.classList.length ; i<j ; i++  )
									{
										if ( e.handleObj.selector.indexOf(e.currentTarget.classList[i]) != -1 )
										{
											calling_class = e.currentTarget.classList[i] ;
											break ;
										}
									}
									var calling_type = calling_class.split('-')[1]
										, name_td = obj_row.children('td.item-name')
										, item_id = (obj_row.data('row_id') == undefined ? '' : obj_row.data('row_id') )
										, validate_url = eval('url_validate' + table_data ).replace('%id%', item_id)
										, delete_url
										, edit_url = eval('url_item' + table_data + '_' + calling_type).replace('%id%', item_id)
										, button_form = obj.parents('form:first')
										, buttons = []
										, delete_button
										, div_title = eval('title' + table_data + '_' + calling_type).replace('%name%', name_td.text())
										, div_title = div_title.replace('%controller%', obj_table.parents('tr:first').children('td.item-name').text())
										// create a modal window
										, popout_div = $('<div/>'
																		, { id    : 'id_popout'
																			, title : div_title
																			}
																		)
																		.appendTo('body')
																		.hide() 
									;

									switch (calling_type)
									{
										case 'edit' :
										case 'levels' :
										case 'cover' :
											obj_row.addClass('being-edited') ;
											
											break 
										default :
											obj.addClass('being-edited') ;
											remove_edit_class_from = obj ;
									}

									if ( button_form.length == 1 && ! /.*#$/.test(button_form.prop('action')) )
									{
										edit_url = button_form.prop('action') ;
									}

									if ( typeof text_delete_button == 'undefined' )
									{

										text_for_delete_button = "Delete definition missing" ;
									} else
									{
// 										if ( text_delete_button != 'not-used' )
// 										{
// 											delete_url = eval('url_delete' + table_data ).replace('%id%', item_id) ;
// 										}
										text_for_delete_button = text_delete_button ;
										
									}
									
									delete_button  = { text  : text_for_delete_button
																	 , 'class' : 'btn'
																	 , _type   : 'delete'
																	 , click : function()
																										{
	// BOF Delete apparatus from class
																											delete_url = eval('url_delete' + table_data ).replace('%id%', item_id) ;
																											$.get( delete_url
																														, function(data)
																																		{
																																			if ( data.result === true )
																																			{
																																				window.location.reload() ;
																																			}
																																			if ( data.hasOwnProperty('messages') )
																																			{
																																				add_messages(data.messages, 'popout_messages', popout_form) ;
																																			}
																																		}
																														, 'json'
																														)
																											;
	// EOF Delete apparatus from class
																											$(this).dialog('close')
																										}
																		}
// BOF Delete individual class
// 									if ( calling_type != 'add' )
									if ( calling_type != 'add' && text_for_delete_button != 'not-used' )
// EOF Delete individual class
									{
										buttons.push(delete_button) ;
									}
									buttons.push({  text  : text_cancel_button
																, _type   : 'cancel'
																, class : 'btn'
																, click : function()
																								{
																									$(this).dialog('close')
																								}
								
																}) 
									;
									buttons.push({  text  : text_submit_button
																, class : 'btn btn-primary'
																, _type   : 'submit'
																, click : function()
																								{
																									var popout_form = $('form:first', popout_div) 
																										, send_data_to = validate_url
																									;
																									popout_div.find('#popout_messages').remove() ;
																									
																									if ( ! /.*#$/.test(popout_form.prop('action')) )
																									{
																										send_data_to = popout_form.prop('action') ;
																									}
																									if ( ! $(popout_form)[0].checkValidity() )
																									{
																										$('<input>')
																											.attr({ type : 'submit'
																														, style: 'display:none;'
																													 })
																											.appendTo(popout_form)
																											.click()
																											.remove()
																										;
																									} else
																									{
																										
																										$.post( send_data_to
																													, popout_form.serialize()
																													, function(data)
																																	{
																																		if ( data.result === true )
																																		{
																																			window.location.reload() ;
																																		}
																																		add_messages(data.messages, 'popout_messages', popout_form) ;
																																	}
																													, 'json'
																													)
																										;
																									}
																								}
																
																}) 
									;
									// populate it from the server
									$('#id_popout')
											.load( edit_url
													, function()
																	{
																		if (popout_div.find('input[name="password"].lock').length > 0 )
																		{
																			window.location.href = login_page ;
																		}
																		var form_obj = $('form:first', $(this)) 
																			, text_property
																			, buttons = popout_div.dialog("option", "buttons") // getter
																			, button_count = buttons.length
																		;
																		
																		if ( form_obj.data('no_button') !== undefined )
																		{
																			delete_buttons = form_obj.data('no_button').split(',') ;
																			for ( var i = 0 ; i < delete_buttons.length ; i++ )
																			{
																				text_property = 'text_' + delete_buttons[i] + '_button' ;
																				for ( var j = 0 ; j < buttons.length ; j++ )
																				{
																					if ( buttons[j].text == eval(text_property) )
																					{
																						buttons.splice(j, 1) ;
																						// button text is not repeated across different buttons
																						break ;
																					}
																					
																				}
																			}
																		}

																		if ( form_obj.data('delete_button_text') !== undefined )
																		{
																			delete_button.text = form_obj.data('delete_button_text') ;
																			form_obj.removeProp('data-delete_button_text') ;
																			var buttons = popout_div.dialog("option", "buttons"); // getter
																			buttons.unshift(delete_button)
																		}
																		
																		for (var i in buttons )
																		{
																			console.log('i is ' + i + ' and it is a ' + buttons[i]._type ) ;
																			text_property = 'button_text_' + buttons[i]._type ;
																			if ( form_obj.data(text_property) !== undefined )
																			{
																					buttons[i].text = form_obj.data(text_property) ;
																			}
																		}
																		if ( buttons.length != button_count )
																		{
																			popout_div.dialog("option", "buttons", buttons); // setter
																		}
																	}
									) ;

									popout_div
											.dialog({ modal      : true
															, width      : 'auto'
															, height     : 'auto'
															, close      : function() 
																										{
																											$(this).dialog('destroy') ; 
																											popout_div.remove() ;
																											remove_edit_class_from.removeClass('being-edited') ;
																										}
															, buttons    : buttons
											})
									;
								}
				)
			.on( 'click'
				, 'table.table > thead > tr > td > span.glyphicon, table.table > thead > tr > th > span.glyphicon'
				, function(e)
								{
									var obj    = $(this)
										, obj_td = obj.parents('td:first')
										, obj_parent_td = obj.parents('table:first').parents('td:first')
										, obj_action = e.currentTarget.classList[1]
										, show_data  = /up$/.test(obj_action)
									;
									
									obj_td.find('span').toggle() ;
									
									obj_parent_td
										.find('.hide-with-chevron')
											.toggle(show_data) 
											.removeClass('show-once')
									;
								}
				)
			;
	}) 
;
