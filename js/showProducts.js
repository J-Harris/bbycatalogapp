//delete localStorage['products'];

var Products = {

	appConfig:	null,
	promise:	null,
	
	initView: function (appConfig, templateId, targetUL, catid) {

		this.appConfig = appConfig;
		this.getProducts (this.appConfig, catid);
		
		this.promise.then(function (products) {
			Products.showProducts (products, templateId, targetUL);
		});
	},
	
	getProducts: function (appConfig, catid) {
		
		var products = null;
		
		// read from cache if enabled and present
		if (appConfig.useLocalStorageCache) {
			var productsText = localStorage.getItem ('products_in_' + catid);
			if (productsText != null) {
				products = JSON.parse (productsText);
				console.log ('retrieved products from localStorage: ', products.products.length)
				this.promise = Promise.resolve(products);
			}
		}
		
		if (products == null) {
				
			// read from live URL
			this.promise = $.ajax ({
				url: appConfig.hostURI + appConfig.productlistFetchURL + catid,
				dataType: 'jsonp'
			})
			.done (function (productData) {
			    if ( console && console.log ) {
			    //    console.log( "Fetch of Live productData:", productData );
			    }
				console.log ('retrieved productData from live URL: catid=' + catid, productData.products.length + ' items')
			    
				// save result to cache
			    if (appConfig.useLocalStorageCache) {
			    	var productsText = JSON.stringify (productData);
			    	localStorage.setItem ('products_in_' + catid, productsText);
			    }
				this.promise = Promise.resolve(productData);
			    
			})
			.fail (function (jqXHR, textStatus, errorThrown) {
				console.log ("failed to fetch from: " + this.url);
				throw { name: 'Fetch Error', message: 'failed to fetch from: ' + this.url }
			});
		}

	},
	
	showProducts: function (products, templateId, targetUL) {
		$(targetUL).empty();
		var template = $(templateId).html();
		
		Mustache.parse(template);
		products.products.forEach (function (element, index) {
			var templateInfo = {
					sku:			element.sku,
					name:			element.name,
					thumbnailImage:	this.appConfig.hostURI + element.thumbnailImage
			};
			var renderedHTML = Mustache.render (template, templateInfo);
			$(targetUL).append (renderedHTML);
			}
		);
		$('div#product_detail').hide();
		
		// wire up click events
		$('li.productLink').on('click', null, function(event) {
			console.log (this);
			var sku = $(this).data('sku');
			$(document).trigger ('productClick', [ sku ]);
		});
	}
}
		
