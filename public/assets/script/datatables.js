"use strict";

/**
 * DataTables integration for Bootstrap 4. This requires Bootstrap 4 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
 (function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;

$.extend( jQuery.fn.dataTableExt.oSort, {
	'locale-compare-asc': function ( a, b ) {
		return a.localeCompare(b, 'cs', { sensitivity: 'accent' })
	},
	'locale-compare-desc': function ( a, b ) {
		return b.localeCompare(a, 'cs', { sensitivity: 'accent' })
	}
})

$.fn.dataTable.ext.type.search['locale-compare'] = function (data) {
	return !data
		? ''
		: typeof data === 'string'
		? data
		.replace(/\n/g, ' ')
		.replace(/[éÉěĚèêëÈÊË]/g, 'e')
		.replace(/[šŠ]/g, 's')
		.replace(/[čČçÇ]/g, 'c')
		.replace(/[řŘ]/g, 'r')
		.replace(/[žŽ]/g, 'z')
		.replace(/[ýÝ]/g, 'y')
		.replace(/[áÁâàÂÀ]/g, 'a')
		.replace(/[íÍîïÎÏ]/g, 'i')
		.replace(/[ťŤ]/g, 't')
		.replace(/[ďĎ]/g, 'd')
		.replace(/[ňŇ]/g, 'n')
		.replace(/[óÓ]/g, 'o')
		.replace(/[úÚůŮ]/g, 'u')
		: data
}
 

//$.fn.dataTable.moment('DD/MM/YYYY');

$.extend( true, DataTable.defaults, {
	dom: 'PfBrt<"wp-bottom-table"i<"dataTables_pager"lp>>',
	language: {
		"info": "Mostrando _START_ - _END_ de _TOTAL_",
		"infoEmpty": "Mostrando 0 de 0 entradas",
		"emptyTable": "Ningún dato disponible en esta tabla", 
		"lengthMenu": "_MENU_",
		"processing": "Cargando...",
		"search": "",
		"searchPlaceholder":"Buscar..",
		"zeroRecords": "No se encontraron registros",
		"filter": "Filtrar",
		"infoFiltered": "(filtrado de _MAX_ registros)",
	  },
    pageLength: 10,
	processing: true,
    lengthMenu: [[ 5, 10, 20, 50, 100, -1], [ 5, 10, 20, 50, 100, "Todos"]],
	pagingType: 'simple_numbers',
} );

 

return DataTable;
}));

"use strict";
var defaults = {
	"language": {
		"paginate": {
			"first": '<i class="fa-solid fa-angles-left" aria-hidden="true" style="font-size: 0.8rem;"> </i>',
			"last": '<i class="fa-solid fa-angles-right" aria-hidden="true" style="font-size: 0.8rem;"> </i>',
			"next": '<i class="fa-solid fa-chevron-right" aria-hidden="true" style="font-size: 0.8rem;"> </i>',
			"previous": '<i class="fa-solid fa-chevron-left" aria-hidden="true" style="font-size: 0.8rem;"> </i>'
		}
	}
};


$.extend(true, $.fn.dataTable.defaults, defaults);