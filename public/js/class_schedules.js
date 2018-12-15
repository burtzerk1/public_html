/* class_schedules.js */

$(document).ready(function() {
    $('table.table:first')
			.DataTable( {
//         dom: 'C<"clear">lfrtip',
        "aoColumns": [
												{
														"bSortable": false // actions
												},
												{
														"sType": "weekday", // day of week
														"bSortable": true
												},
												{
														"bSortable": true // class type
												},
												{
														"bSortable": true // start time
												},
												{
														"bSortable": false // coach name
												},
												{
														"bSortable": false // apparatus schedule
												}
         
											]
        , "columnDefs": [ {
													"targets"  : 'no-sort',
													"orderable": false,
												}]
     
				}
			)
			 
	;
});
