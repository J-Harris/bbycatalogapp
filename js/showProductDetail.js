//delete localStorage['products'];

var ProductDetail = {

	appConfig:	null,
	promise:	null,
	
	initView: function (appConfig, templateId, targetUL, sku) {

		this.appConfig = appConfig;
		this.getProductDetail (this.appConfig, sku);
		
		this.promise.then(function (productDetail) {
			ProductDetail.showProductDetail (productDetail, templateId, targetUL);
		});
	},
	
	getProductDetail: function (appConfig, sku) {
		
		var productDetail = null;
		
		// read from cache if enabled and present
		if (appConfig.useLocalStorageCache) {
			var productDetailText = localStorage.getItem ('productid_' + sku);
			if (productDetailText != null && productDetailText != 'undefined') {
				productDetail = JSON.parse (productDetailText);
				this.promise = Promise.resolve(productDetail);
			}
		}
		
		if (productDetail == null) {
				
			// read from live URL
			this.promise = $.ajax ({
				url: appConfig.hostURI + appConfig.productdetailFetchURL + sku,
				dataType: 'jsonp'
			})
			.done (function (productDetail) {
				console.log ('retrieved productDetail from live URL: sku=' + sku)
			    
				// save result to cache
			    if (appConfig.useLocalStorageCache) {
			    	var productDetailText = JSON.stringify (productDetailText);
			    	localStorage.setItem ('productid_' + sku, productDetailText);
			    }
				this.promise = Promise.resolve(productDetail);
			    
			})
			.fail (function (jqXHR, textStatus, errorThrown) {
				console.log ("failed to fetch from: " + this.url);
				throw { name: 'Fetch Error', message: 'failed to fetch from: ' + this.url }
			});
		}

	},
	
	showProductDetail: function (productDetail, templateId, targetUL) {
		$(targetUL).empty();
		var specsText = '';
		var templateInfo = {
				sku:				productDetail.sku,
				name:				productDetail.name,
				shortDescription:	productDetail.shortDescription,
				thumbnailImage:		this.appConfig.hostURI + productDetail.thumbnailImage.replace('55x55', '400x400'),
				specsText:			specsText
			};
		var template = $(templateId).html();
		Mustache.parse(template);
		var renderedHTML = Mustache.render (template, templateInfo);
		$(targetUL).append (renderedHTML);
		$(targetUL).show();
		
		$(targetUL).on('click', function (event) {
			$(this).hide();
		});
	}
}
		
