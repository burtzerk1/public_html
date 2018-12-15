/* competitions.js */

$(document).ready(function() {
		$.fn.dataTable.moment( date_format );
    $('table.table:first')
			.DataTable( {
//         dom: 'C<"clear">lfrtip',
        "aoColumns": [
												{
														"bSortable": false // actions
												},
												{
														"bSortable": true // Competition name
												},
												{
														"bSortable": true // Host club
												},
												{
														"bSortable": true // Comp type
												},
												{
														targets: 5,
														"bSortable": true // Start date
												},
												{
														"bSortable": false // Levels invited
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
