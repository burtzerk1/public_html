// apparatus_skill_mapping.js

$(document).ready(function(){
	$('#skill-content a[data-toggle="tab"]')
		.on('shown.bs.tab init'
// 			, 'li:visible'
			, function(e)
							{
								var obj = $(this)
									, active_lis = $('#skill-content li.active:visible')
									, active_items = new Object()
									, tmp
									, a_item
									,key
								;

								$(active_lis).each(function(index){

									a_item = $(this).children('a:first') ;
									tmp = a_item.prop('href').split('#') ;
									key = 'item_' + index
									active_items[key] = tmp[1] ;
									
								}) ;

								// the first property is not needed
								var property_names = Object.getOwnPropertyNames(active_items)
									, first_property = property_names[0]
								;
								delete active_items[first_property] ;

								tmp = $.map(active_items, function(n, i) { return i; }).length;

								if ( tmp == 3 )
								{
									$('#output-skill-apparatus')
											.load(url_get_skill_map, active_items)
									;
								}
							}
			)
		.parent('li.active:visible:first').children('a:visible').trigger('init')
	;
	

	$('#content')
		.on( 'click'
			 , 'button.item-add, a.item-edit'
			 , function(e)
              {
                e.preventDefault() ;
                
                var obj = $(this)
                  , read_url = obj.data('where_to')
                  , tabs = $('#skill-content')
									, active_tabs = tabs.find('li.active:visible a')
									, level_name_data = active_tabs.first().data('level_name')
									, level_name = ( level_name_data === undefined ? ' -- Need level name --' : level_name_data )
									, send_id = new Array()
									, parts = new Array()
									, name_td = null
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
                  , div_title = eval('title_skill_map_' + calling_type)
								;
								active_tabs.each(function(){
									parts = $(this).prop('href').split(/-/) ;
									send_id.push(parts[parts.length - 1]) ;
									parts = parts[0].split(/#/) ;
									if ( $(this).attr('data-title_name') )
									{
										title_text = $(this).data('title_name') ;
									} else
									{
										title_text = $(this).text() ;
									}
									if ( $(this).attr('data-replace_item') )
									{

										replace_item = $(this).data('replace_item') ;
									} else
									{
										replace_item = parts[parts.length-1] ;
									}
									div_title = div_title.replace('%' + replace_item + '%', title_text) ;
								}) ;
								send_id.pop() ;
								
								div_title = div_title.replace('%level_word%', level_name)
								url_ids = send_id.shift() ;
								if ( calling_type == 'add' )
								{
									a=1 ;
								} else
								{
									var tr = obj.parents('tr:first')
									send_id = [tr.data('row_id')] ;
								}
								
                var edit_url = eval('url_item_' + replace_item + '_' + calling_type) + send_id.join('/')
                  , validate_url = url_validate_map.replace('%id%', send_id.join('/'))
                  , button_form = obj.parents('form:first')
                  // create a modal window
                  , popout_div = $('<div/>'
                                  , { id    : 'id_popout'
                                    , title : div_title
                                    }
                                  )
                                  .appendTo('#content')
																	.hide() 
									, popout_buttons = [ { text  : text_cancel_button
																			 , click : function()
																												{
																													popout_div.dialog('close')
																												}
																			 }
																		 , { text  : text_submit_button
																			 , click : function()
																														{
																															var popout_form = popout_div.find('form:first') 
																																, send_data_to = validate_url
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
                                              
																					}
																		 ]
                ;

								if ( obj.parent('form:first').length == 1 && ! /.*#$/.test(obj.parent('form:first').prop('action')) )
								{
									edit_url = obj.parent('form:first').attr('action') + '/' + send_id.join('/') ;
								}

                // populate it from the server
                $('#id_popout').load( edit_url ) ;
                popout_div
                    .dialog({ modal      : true
                            , width      : 'auto'
                            , height     : 'auto'
                            , close      : function() 
                                                  {
                                                    popout_div.dialog('destroy') ; 
                                                    popout_div.remove() ;
                                                  }
                            , buttons    : popout_buttons
                    })
                ;
              }
			)
    .on( 'click'
        , '.item-delete'
        , function(e)
        {
            var obj = $(this)
              , obj_tr = obj.parents('tr:first')
              , obj_id = obj_tr.data('row_id')
              , del_url = url_apparatus_mapping_delete + '/' + obj_id
            ;
          
            console.log('Click on ' + $(e.target).attr("class") + ' detected. URL is ' + del_url ) ;
            window.location.replace(del_url);
        }
    
    )
    ;
	$('body')
		.on( 'input'
			 , 'input[name="name"]'
			 , function(e)
								{
									var obj = $(this)
										, obj_id = obj.attr('list')
										, obj_val = obj.val()
										, datalist = obj.prop('list')
										, sel_data = $(datalist).find('option').filter(function(){return($(this).text()==obj_val);}).first()
										, new_id = sel_data.data('id')
										, id_input = $('input[name="apparatus_skill_id"]')
									;
									// if the skill name can be found and the ID is the same as the ID being edited
										// do nothing
									// if the skill name cannot be found and the item is being edited
										// do nothing
									id_input.val(( new_id == undefined ? 0 : new_id ) ) ;
									$(':input[name="notes"]').val(( new_id == undefined ? '' : sel_data.data('description')) ) ; 

								}
			)
	;
	
	$('div.tabbable:first ul.nav:first li')
		// go through the first row of items ... the gym codes
		.each(function()
					{
						var code_obj = $(this)
							, obj_parent = code_obj.parent()
							, first_active = obj_parent.children('li.active')
							, active_is_set = first_active.length > 0
							, code_a = code_obj.children('a:first') 
							, next_div_name = code_a.prop('href').split('#')[1]
							, level_div = $('#' + next_div_name)
							, clicked = false ;
						;

						if ( active_is_set )
						{
							$('#skill-content li.active')
								.each(function()
									{ 
										$(this)
											.removeClass('active')
											.children('a:first')
												.trigger('click')
										; 
									}
								)
							;
// 								.trigger('click') ;
// 							var level_obj=$(this)	
// 								, app_a = level_obj.children('a:first')
							return(false) ;
						}
if ( false )
{
	
						// go through the next set of tabs ... the levels
						level_div.find('ul.nav li')
							.each(function()
							{
								var level_obj=$(this)	
									, app_a = level_obj.children('a:first')
									, app_div_name = app_a.prop('href').split('#')[1]
									, app_div = $('#' + next_div_name)
								;
								// if there is a div for the tab
									// if there is a tab ... apparatus
									apparatus_li = app_div.find('div.tabbable ul.nav li') ;
									if ( apparatus_li.length > 0 )
									{
										
										// click on the first tab
										code_a.trigger('click') ;
										
										// click on the second tab
										app_a.trigger('click') ;
										
										// click on the third tab
										apparatus_li.first().trigger('click') ;
										
										// exit the loop
										clicked = true ;
										return(false) ;

									// fi there is an apparatus tab
									}
								// wend going through the levels
								}
							) ;
						if ( clicked )
						{
							return(false) ;
						}
}
					// wend going through the gym code tabs
					})
		;
	
	
}) ;
