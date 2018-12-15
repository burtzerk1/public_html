/* datatables_sort_by_dow.js */
$.extend( $.fn.dataTableExt.oSort, 
					{
						"weekday-pre": function ( a ) {
							return $.inArray( a, sort_dow );
						},
						"weekday-asc": function ( a, b ) {
							return ((a < b) ? -1 : ((a > b) ? 1 : 0));
						},
						"weekday-desc": function ( a, b ) {
							return ((a < b) ? 1 : ((a > b) ? -1 : 0));
						}
					}
);
