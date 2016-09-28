

L.TileLayer.MBTiles = L.TileLayer.extend({

	

	mbTilesDB: null,

	initialize: function(url, options, db) {
		console.log(db);		

		this.mbTilesDB = db;
		L.Util.setOptions(this, options);

		console.log("Usli smo");
	},

	_loadTile: function (tile, tilePoint) {

		console.log("Loaduje tile");

		tile._layer  = this;
		tile.onload  = this._tileOnLoad;
		tile.onerror = this._tileOnError;

		this._adjustTilePoint(tilePoint);

		var z = this._getZoomForUrl();
		var x = tilePoint.x;
		var y = Math.pow(2, z) - tilePoint.y - 1;

		var base64Prefix = "data:image/png;base64,";


		var layer = this;
		
		//Pukne i ne izvrsava se vise transakcije, samo se povecava broj u redu
		this.mbTilesDB._txnQueue.length = 0;
		//ispraviti, mozda Session promenjiva, pa kada je reazlicito od nula velicina 
		//queue-a da se ponovo otvori baza (inicijalizuje layer) ?

		this.mbTilesDB.transaction(function(txn) {
			txn.executeSql("select quote(tile_data) as tile_data from tiles where zoom_level = ? and tile_column = ? and tile_row = ?;", 
				[z, x, y], 
				function (tx, res) {
	
			tile.src = base64Prefix + hexToBase64((res.rows.item(0).tile_data).substring(2));
			},
			function(error){
				console.log(error);
			});
		}); 



		
	},
}); 


function hexToBase64(str) {
   var hexString = str.replace(/([\da-fA-F]{2}) ?/g, "0x$1 ");
   var hexArray = hexString.split(" ");
   var len = hexArray.length;
   var binary ='';
   for (var i = 0; i < len; i++) {
       binary += String.fromCharCode( hexArray[ i ] )
   }
   //getting a stack error on large images
   //var binary = String.fromCharCode.apply(null, hexArray);
   return window.btoa(binary);
}






// source: https://github.com/stdavis/OfflineMbTiles/blob/master/www/js/TileLayer.MBTiles.js
/*L.TileLayer.MBTiles = L.TileLayer.extend({
	//db: SQLitePlugin
	mbTilesDB: null,

	initialize: function(url, options, db) {
		this.mbTilesDB = db;

		L.Util.setOptions(this, options);
	},
	getTileUrl: function (tilePoint, zoom, tile) {
		var z = this._getZoomForUrl();
		var x = tilePoint.x; //x
		var y = tilePoint.y; //y
		var base64Prefix = 'data:image/gif;base64,';



		this.mbTilesDB.transaction(function(tx) {
			tx.executeSql("SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?;", [z, x, y], function (tx, res) {
			
				tile.src = base64Prefix + res.rows.item(0).tile_data;
			

			}, function (er) {
				console.log('error with executeSql', er);
			});
		});
	},
	_loadTile: function (tile, tilePoint, zoom) {
		tile._layer = this;
		tile.onload = this._tileOnLoad;
		tile.onerror = this._tileOnError;
		this.getTileUrl(tilePoint, zoom, tile);
	}
});



/*db.executeSql("SELECT LENGTH('tenletters') AS stringlength", [], function (resultSet) {
  console.log('got stringlength: ' + resultSet.rows.item(0).stringlength);
}, function(error) {
  console.log('SELECT error: ' + error.message);
}); */


/*
L.TileLayer.MBTiles = L.TileLayer.extend({
	//db: SQLitePlugin
	mbTilesDB: null,

	initialize: function(url, options, db) {
		this.mbTilesDB = db;

		L.Util.setOptions(this, options);
	},
	getTileUrl: function (tilePoint, zoom, tile) {
		var z = this._getZoomForUrl();
		var x = tilePoint.x;
		var y = Math.pow(2, z) - tilePoint.y - 1;
		var base64Prefix = "data:image/png;,";


		this.mbTilesDB.readTransaction(function(tdx) {
		  tdx.executeSql("SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?;", [z, x, y], function(tx, res) {
		  //  console.log("tile-data: " +  base64Prefix + res.rows.item(0).tile_data);
		  // tile.src = base64Prefix + res.rows.item(0).tile_data;
		  tile.src = base64Prefix +  atob(res.rows.item(0).tile_data);

		   console.log("tile-src" + JSON.stringify(tile.src));
		  }, function(tx, error) {
		    console.log('SELECT error: ' + error.message);
		  });
		}, function(error) {
		  console.log('transaction error: ' + error.message);
		}, function() {
		  console.log('transaction ok');

		}); 
	},
	_loadTile: function (tile, tilePoint, zoom) {
		tile._layer = this;
		tile.onload = this._tileOnLoad;
		tile.onerror = this._tileOnError;
		this.getTileUrl(tilePoint, zoom, tile);
	}
}); 


function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

*/






