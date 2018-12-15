// general.js

$(document).ready(function(){
	$('div.signin-rit label')
			.click(function(e)
									{
										var obj = $(this)
											, start_link = obj.data('link_type')
											, open_tab = start_link + '-tab'
											, popout_div = $('<div/>'
																			, { id    : 'id_popout' }
																			)
																			.appendTo('body')
																			.hide() 
											, buttons = []
										;
										$('#id_popout')
											.load('auth/login_register_box'
													 , function()
																	{
																		$('#id_popout #' + open_tab).attr('checked', true)
																	}
											) 
										;
										buttons.push({  text  : 'Cancel'
																	, click : function()
																									{
																										$(this).dialog('close')
																									}
									
																	}) ;
										buttons.push({  text  : 'Continue'
																	, click : function()
																									{
																										var popout_form = popout_div.find('form:visible:first') 
																											, send_data_to = popout_form.prop('action')
																											, forgot_password = popout_form.find('input[name="forgot_password"]:checked:first')
																										;
																										popout_div.find('#popout_messages').remove() ;
console.log('Going to ' + send_data_to ) ;
																										if ( forgot_password.length > 0 )
																										{
																											send_data_to = forgot_password.data('submit_to') ;
																											forgot_password.prop('checked', false) ;
																											popout_form.find('input[type="password"]').val('') ;
																										}
console.log('Now going to ' + send_data_to ) ;
																										$.post( send_data_to
																													, popout_form.serialize()
																													, function(data)
																																	{
																																		if ( data.result === true )
																																		{
																																			window.location.reload() ;
																																		} else if ( data.hasOwnProperty('redirect_to'))
																																		{
																																			window.location.href = data.redirect_to ;
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
											popout_div
												.dialog({ modal      : true
																, width      : 450
																, height     : 500
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
			;
	$('header > div.login')
			.click(function(e)
										{
											
										}
			 )
		
}) ;
